import os
import random
from time import time
from urllib import request
from progressbar import progressbar

import torch
import torch.nn.functional as F
import torchaudio
from text_to_speech_service.tortoise.models.classifier import AudioMiniEncoderWithClassifierHead
from text_to_speech_service.tortoise.models.autoregressive import UnifiedVoice
from tqdm import tqdm
from text_to_speech_service.tortoise.models.arch_util import TorchMelSpectrogram
from text_to_speech_service.tortoise.models.hifigan_decoder import HifiganGenerator
from text_to_speech_service.tortoise.models.random_latent_generator import RandomLatentConverter
from text_to_speech_service.tortoise.utils.audio import denormalize_tacotron_mel
from text_to_speech_service.tortoise.utils.diffusion import SpacedDiffusion, space_timesteps, get_named_beta_schedule
from text_to_speech_service.tortoise.utils.tokenizer import VoiceBpeTokenizer
from text_to_speech_service.tortoise.utils.wav2vec_alignment import Wav2VecAlignment
# from tortoise.models.stream_generator import init_stream_support

from text_to_speech_service.tortoise.utils.device import get_device_name, do_gc

pbar = None
# init_stream_support()
STOP_SIGNAL = False
DEFAULT_MODELS_DIR = os.path.join(os.path.expanduser('~'), '.cache', 'tortoise', 'models')
MODELS_DIR = os.environ.get('TORTOISE_MODELS_DIR', DEFAULT_MODELS_DIR)

MODELS = {
    'autoregressive.pth': 'https://huggingface.co/Manmay/tortoise-tts/resolve/main/autoregressive.pth',
    'classifier.pth': 'https://huggingface.co/Manmay/tortoise-tts/resolve/main/classifier.pth',
    'rlg_auto.pth': 'https://huggingface.co/Manmay/tortoise-tts/resolve/main/rlg_auto.pth',
    'hifidecoder.pth': 'https://huggingface.co/Manmay/tortoise-tts/resolve/main/hifidecoder.pth',
}

def download_models(specific_models=None):
    """
    Call to download all the models that Tortoise uses.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)

    def show_progress(block_num, block_size, total_size):
        global pbar
        if pbar is None:
            pbar = progressbar.ProgressBar(maxval=total_size)
            pbar.start()

        downloaded = block_num * block_size
        if downloaded < total_size:
            pbar.update(downloaded)
        else:
            pbar.finish()
            pbar = None

    for model_name, url in MODELS.items():
        if specific_models is not None and model_name not in specific_models:
            continue
        model_path = os.path.join(MODELS_DIR, model_name)
        if os.path.exists(model_path):
            continue
        print(f'Downloading {model_name} from {url}...')
        request.urlretrieve(url, model_path, show_progress)
        print('Done.')

def get_model_path(model_name, models_dir=MODELS_DIR):
    """
    Get path to given model, download it if it doesn't exist.
    """
    if model_name not in MODELS:
        raise ValueError(f'Model {model_name} not found in available models.')
    model_path = os.path.join(models_dir, model_name)
    if not os.path.exists(model_path) and models_dir == MODELS_DIR:
        download_models([model_name])
    # Add the logic to download models if not available
    # model_path = hf_hub_download(repo_id="Manmay/tortoise-tts", filename=model_name, cache_dir=models_dir)
    return model_path

def check_for_kill_signal():
    global STOP_SIGNAL
    if STOP_SIGNAL:
        STOP_SIGNAL = False
        raise Exception("Kill signal detected")

def pad_or_truncate(t, length):
    """
    Utility function for forcing <t> to have the specified sequence length, whether by clipping it or padding it with 0s.
    """
    if t.shape[-1] == length:
        return t
    elif t.shape[-1] < length:
        return F.pad(t, (0, length-t.shape[-1]))
    else:
        return t[..., :length]


def load_discrete_vocoder_diffuser(trained_diffusion_steps=4000, desired_diffusion_steps=200, cond_free=True, cond_free_k=1):
    """
    Helper function to load a GaussianDiffusion instance configured for use as a vocoder.
    """
    return SpacedDiffusion(use_timesteps=space_timesteps(trained_diffusion_steps, [desired_diffusion_steps]), model_mean_type='epsilon',
                           model_var_type='learned_range', loss_type='mse', betas=get_named_beta_schedule('linear', trained_diffusion_steps),
                           conditioning_free=cond_free, conditioning_free_k=cond_free_k)


def format_conditioning(clip, cond_length=132300, device="cuda" if not torch.backends.mps.is_available() else 'mps'):
    """
    Converts the given conditioning signal to a MEL spectrogram and clips it as expected by the models.
    """
    gap = clip.shape[-1] - cond_length
    if gap < 0:
        clip = F.pad(clip, pad=(0, abs(gap)))
    elif gap > 0:
        rand_start = random.randint(0, gap)
        clip = clip[:, rand_start:rand_start + cond_length]
    mel_clip = TorchMelSpectrogram()(clip.unsqueeze(0)).squeeze(0)
    return mel_clip.unsqueeze(0).to(device)


def fix_autoregressive_output(codes, stop_token, complain=True):
    """
    This function performs some padding on coded audio that fixes a mismatch issue between what the diffusion model was
    trained on and what the autoregressive code generator creates (which has no padding or end).
    This is highly specific to the DVAE being used, so this particular coding will not necessarily work if used with
    a different DVAE. This can be inferred by feeding a audio clip padded with lots of zeros on the end through the DVAE
    and copying out the last few codes.

    Failing to do this padding will produce speech with a harsh end that sounds like "BLAH" or similar.
    """
    # Strip off the autoregressive stop token and add padding.
    stop_token_indices = (codes == stop_token).nonzero()
    if len(stop_token_indices) == 0:
        if complain:
            print("No stop tokens found in one of the generated voice clips. This typically means the spoken audio is "
                  "too long. In some cases, the output will still be good, though. Listen to it and if it is missing words, "
                  "try breaking up your input text.")
        return codes
    else:
        codes[stop_token_indices] = 83
    stm = stop_token_indices.min().item()
    codes[stm:] = 83
    if stm - 3 < codes.shape[0]:
        codes[-3] = 45
        codes[-2] = 45
        codes[-1] = 248

    return codes


def do_spectrogram_diffusion(diffusion_model, diffuser, latents, conditioning_latents, temperature=1, verbose=True):
    """
    Uses the specified diffusion model to convert discrete codes into a spectrogram.
    """
    with torch.no_grad():
        output_seq_len = latents.shape[1] * 4 * 24000 // 22050  # This diffusion model converts from 22kHz spectrogram codes to a 24kHz spectrogram signal.
        output_shape = (latents.shape[0], 100, output_seq_len)
        precomputed_embeddings = diffusion_model.timestep_independent(latents, conditioning_latents, output_seq_len, False)

        noise = torch.randn(output_shape, device=latents.device) * temperature
        mel = diffuser.p_sample_loop(diffusion_model, output_shape, noise=noise,
                                      model_kwargs={'precomputed_aligned_embeddings': precomputed_embeddings},
                                     progress=verbose)
        return denormalize_tacotron_mel(mel)[:,:,:output_seq_len]


def classify_audio_clip(clip):
    """
    Returns whether or not Tortoises' classifier thinks the given clip came from Tortoise.
    :param clip: torch tensor containing audio waveform data (get it from load_audio)
    :return: True if the clip was classified as coming from Tortoise and false if it was classified as real.
    """
    classifier = AudioMiniEncoderWithClassifierHead(2, spec_dim=1, embedding_dim=512, depth=5, downsample_factor=4,
                                                    resnet_blocks=2, attn_blocks=4, num_attn_heads=4, base_channels=32,
                                                    dropout=0, kernel_size=5, distribute_zero_label=False)
    classifier.load_state_dict(torch.load(get_model_path('classifier.pth'), map_location=torch.device('cpu')))
    clip = clip.cpu().unsqueeze(0)
    results = F.softmax(classifier(clip), dim=-1)
    return results[0][0]


def pick_best_batch_size_for_gpu():
    """
    Tries to pick a batch size that will fit in your GPU. These sizes aren't guaranteed to work, but they should give
    you a good shot.
    """
    if torch.cuda.is_available():
        _, available = torch.cuda.mem_get_info()
        availableGb = available / (1024 ** 3)
        if availableGb > 14:
            return 16
        elif availableGb > 10:
            return 8
        elif availableGb > 7:
            return 4
    if torch.backends.mps.is_available():
        import psutil
        available = psutil.virtual_memory().total
        availableGb = available / (1024 ** 3)
        if availableGb > 14:
            return 16
        elif availableGb > 10:
            return 8
        elif availableGb > 7:
            return 4
    return 1

# Taken from MRQ's api
@torch.inference_mode()
def format_conditioning(clip, cond_length=132300, device='cuda', sampling_rate=22050):
    """
    Converts the given conditioning signal to a MEL spectrogram and clips it as expected by the models.
    """
    gap = clip.shape[-1] - cond_length
    if gap < 0:
        clip = F.pad(clip, pad=(0, abs(gap)))
    elif gap > 0:
        rand_start = random.randint(0, gap)
        clip = clip[:, rand_start:rand_start + cond_length]
    mel_clip = TorchMelSpectrogram(sampling_rate=sampling_rate)(clip.unsqueeze(0)).squeeze(0)
    mel_clip = mel_clip.unsqueeze(0)
    return migrate_to_device(mel_clip, device)

# Taken from MRQ's api
def hash_file(path, algo="md5", buffer_size=0):
    import hashlib

    hash = None
    if algo == "md5":
        hash = hashlib.md5()
    elif algo == "sha1":
        hash = hashlib.sha1()
    else:
        raise Exception(f'Unknown hash algorithm specified: {algo}')

    if not os.path.exists(path):
        raise Exception(f'Path not found: {path}')

    with open(path, 'rb') as f:
        if buffer_size > 0:
            while True:
                data = f.read(buffer_size)
                if not data:
                    break
                hash.update(data)
        else:
            hash.update(f.read())

    return "{0}".format(hash.hexdigest())

# Taken from MRQ's api
def migrate_to_device( t, device ):
    if t is None:
        return t

    if not hasattr(t, 'device'):
        t.device = device
        t.manually_track_device = True
    elif t.device == device:
        return t

    if hasattr(t, 'manually_track_device') and t.manually_track_device:
        t.device = device

    t = t.to(device)
    
    do_gc()

    return t

class TextToSpeech:
    """
    Main entry point into Tortoise.
    """

    def __init__(self, autoregressive_batch_size=None, models_dir=MODELS_DIR, 
                 enable_redaction=True, kv_cache=False, use_deepspeed=False, half=False, device=None,
                 tokenizer_vocab_file=None, tokenizer_basic=False,
                 autoregressive_model_path=None, tokenizer_json=None,
                 minor_optimizations=True,
                 input_sample_rate=22050, output_sample_rate=24000,
                 ):

        """
        Constructor
        :param autoregressive_batch_size: Specifies how many samples to generate per batch. Lower this if you are seeing
                                          GPU OOM errors. Larger numbers generates slightly faster.
        :param models_dir: Where model weights are stored. This should only be specified if you are providing your own
                           models, otherwise use the defaults.
        :param enable_redaction: When true, text enclosed in brackets are automatically redacted from the spoken output
                                 (but are still rendered by the model). This can be used for prompt engineering.
                                 Default is true.
        :param device: Device to use when running the model. If omitted, the device will be automatically chosen.
        """
        self.use_deepspeed = use_deepspeed # Store deepspeed
        self.use_kv_cache = kv_cache # Store KV cache
        self.preloaded_tensors = minor_optimizations
        self.input_sample_rate = input_sample_rate
        self.output_sample_rate = output_sample_rate

        self.models_dir = models_dir
        self.autoregressive_batch_size = pick_best_batch_size_for_gpu() if autoregressive_batch_size is None else autoregressive_batch_size
        self.enable_redaction = enable_redaction
        self.device = torch.device('cuda' if torch.cuda.is_available() else'cpu')
        if torch.backends.mps.is_available():
            self.device = torch.device('mps')
        if self.enable_redaction:
            self.aligner = Wav2VecAlignment()

        self.load_tokenizer_json(tokenizer_json)

        self.half = half
        if os.path.exists(f'{models_dir}/autoregressive.ptt'):
            # Assume this is a traced directory.
            self.autoregressive = torch.jit.load(f'{models_dir}/autoregressive.ptt')
        else:
            if not autoregressive_model_path or not os.path.exists(autoregressive_model_path):
                autoregressive_model_path = get_model_path('autoregressive.pth', models_dir)


            self.load_autoregressive_model(autoregressive_model_path)

            # self.autoregressive = UnifiedVoice(max_mel_tokens=604, max_text_tokens=402, max_conditioning_inputs=2, layers=30,
            #                               model_dim=1024,
            #                               heads=16, number_text_tokens=255, start_text_token=255, checkpointing=False,
            #                               train_solo_embeddings=False).to(self.device).eval()
            # self.autoregressive.load_state_dict(torch.load(autoregressive_model_path, weights_only=True), strict=False)
            # self.autoregressive.post_init_gpt2_config(use_deepspeed=use_deepspeed, kv_cache=kv_cache, half=self.half)
            # self.autoregressive = migrate_to_device(self.autoregressive, self.device)
            # print(f"Loaded autoregressive model")


        self.hifi_decoder = HifiganGenerator(in_channels=1024, out_channels = 1, resblock_type = "1",
        resblock_dilation_sizes = [[1, 3, 5], [1, 3, 5], [1, 3, 5]], resblock_kernel_sizes = [3, 7, 11],
        upsample_kernel_sizes = [16, 16, 4, 4], upsample_initial_channel = 512, upsample_factors = [8, 8, 2, 2],
        cond_channels=1024).to(self.device).eval()

        path = self.autoregressive_model_path.split("/autoregressive.pth")[0]
        path = str(path) + "/hifidecoder.pth"

        mode = path
        print(f"Loading hifi model: {mode}")
        hifi_model = torch.load(mode)

        #hifi_model = torch.load(get_model_path('hifidecoder.pth'))
        self.hifi_decoder.load_state_dict(hifi_model, strict=False)
        self.hifi_decoder.to(self.device)
        # Random latent generators (RLGs) are loaded lazily.
        self.rlg_auto = None

    # Taken from MRQ's api.py
    def load_autoregressive_model(self, autoregressive_model_path, is_xtts=False):
        if hasattr(self,"autoregressive_model_path") and os.path.samefile(self.autoregressive_model_path, autoregressive_model_path):
            return

        self.autoregressive_model_path = autoregressive_model_path if autoregressive_model_path and os.path.exists(autoregressive_model_path) else get_model_path('autoregressive.pth', self.models_dir)
        new_hash = hash_file(self.autoregressive_model_path)

        if hasattr(self,"autoregressive_model_hash") and self.autoregressive_model_hash == new_hash:
            return

        self.autoregressive_model_hash = new_hash

        self.loading = True
        print(f"Loading autoregressive model: {self.autoregressive_model_path}")

        if hasattr(self, 'autoregressive'):
            del self.autoregressive

        # XTTS requires a different "dimensionality" for its autoregressive model
        if new_hash == "e4ce21eae0043f7691d6a6c8540b74b8" or is_xtts:
            dimensionality = {
                "max_mel_tokens": 605,
                "max_text_tokens": 402,
                "max_prompt_tokens": 70,
                "max_conditioning_inputs": 1,
                "layers": 30,
                "model_dim": 1024,
                "heads": 16,
                "number_text_tokens": 5023, # -1
                "start_text_token": 261,
                "stop_text_token": 0,
                "number_mel_codes": 8194,
                "start_mel_token": 8192,
                "stop_mel_token": 8193,
            }
        else:
            dimensionality = {
                "max_mel_tokens": 604,
                "max_text_tokens": 402,
                "max_conditioning_inputs": 2,
                "layers": 30,
                "model_dim": 1024,
                "heads": 16,
                "number_text_tokens": 255,
                "start_text_token": 255,
                "checkpointing": False,
                "train_solo_embeddings": False
            }

        self.autoregressive = UnifiedVoice(**dimensionality).cpu().eval()

        print(self.autoregressive_model_path)

        self.autoregressive.load_state_dict(torch.load(self.autoregressive_model_path))
        self.autoregressive.post_init_gpt2_config(use_deepspeed=self.use_deepspeed, kv_cache=self.use_kv_cache)
        if self.preloaded_tensors:
            self.autoregressive = migrate_to_device( self.autoregressive, self.device )

        self.loading = False
        print(f"Loaded autoregressive model")

    # Taken from MRQ's modified api.py
    def load_tokenizer_json(self, tokenizer_json):
        if hasattr(self,"tokenizer_json") and os.path.samefile(self.tokenizer_json, tokenizer_json):
            return
        
        self.loading = True
        self.tokenizer_json = tokenizer_json if tokenizer_json else os.path.join(os.path.dirname(os.path.realpath(__file__)), '../tortoise/data/tokenizer.json')
        print("Loading tokenizer JSON:", self.tokenizer_json)

        if hasattr(self, 'tokenizer'):
            del self.tokenizer

        self.tokenizer = VoiceBpeTokenizer(vocab_file=self.tokenizer_json)
        self.loading = False
        print(f"Loaded tokenizer")

    def get_conditioning_latents(self, voice_samples, return_mels=False, verbose=False, slices=1, max_chunk_size=None, force_cpu=False, original_ar=False, original_diffusion=False):
        """
        Transforms one or more voice_samples into a tuple (autoregressive_conditioning_latent, diffusion_conditioning_latent).
        These are expressive learned latents that encode aspects of the provided clips like voice, intonation, and acoustic
        properties.
        :param voice_samples: List of 2 or more ~10 second reference clips, which should be torch tensors containing 22.05kHz waveform data.
        """

        with torch.no_grad():
            # computing conditional latents requires being done on the CPU if using DML because M$ still hasn't implemented some core functions
            if get_device_name() == "dml":
                force_cpu = True
            device = torch.device('cpu') if force_cpu else self.device

            if not isinstance(voice_samples, list):
                voice_samples = [voice_samples]
            
            resampler_22K = torchaudio.transforms.Resample(
                self.input_sample_rate,
                22050,
                lowpass_filter_width=16,
                rolloff=0.85,
                resampling_method="kaiser_window",
                beta=8.555504641634386,
            ).to(device)

            resampler_24K = torchaudio.transforms.Resample(
                self.input_sample_rate,
                24000,
                lowpass_filter_width=16,
                rolloff=0.85,
                resampling_method="kaiser_window",
                beta=8.555504641634386,
            ).to(device)

            voice_samples = [migrate_to_device(v, device)  for v in voice_samples]

            auto_conds = []
            diffusion_conds = []

            if original_ar:
                samples = [resampler_22K(sample) for sample in voice_samples]
                for sample in tqdm(samples, desc="Computing AR conditioning latents..."):
                    auto_conds.append(format_conditioning(sample, device=device, sampling_rate=self.input_sample_rate, cond_length=132300))
            else:
                samples = [resampler_22K(sample) for sample in voice_samples]
                concat = torch.cat(samples, dim=-1)
                chunk_size = concat.shape[-1]

                if slices == 0:
                    slices = 1
                elif max_chunk_size is not None and chunk_size > max_chunk_size:
                    slices = 1
                    while int(chunk_size / slices) > max_chunk_size:
                        slices = slices + 1

                chunks = torch.chunk(concat, slices, dim=1)
                chunk_size = chunks[0].shape[-1]

                for chunk in tqdm(chunks, desc="Computing AR conditioning latents..."):
                    auto_conds.append(format_conditioning(chunk, device=device, sampling_rate=self.input_sample_rate, cond_length=chunk_size))

            auto_conds = torch.stack(auto_conds, dim=1)
            self.autoregressive = migrate_to_device( self.autoregressive, device )
            auto_latent = self.autoregressive.get_conditioning(auto_conds)
            self.autoregressive = migrate_to_device( self.autoregressive, self.device if self.preloaded_tensors else 'cpu' )

        if return_mels:
            return auto_latent, auto_conds, diffusion_conds
        else:
            return auto_latent

    def get_random_conditioning_latents(self):
        # Lazy-load the RLG models.
        if self.rlg_auto is None:
            self.rlg_auto = RandomLatentConverter(1024).eval()
            self.rlg_auto.load_state_dict(torch.load(get_model_path('rlg_auto.pth', self.models_dir), map_location=torch.device('cpu')))
        with torch.no_grad():
            return self.rlg_auto(torch.tensor([0.0]))


    # taken from here https://github.com/coqui-ai/TTS/blob/d21f15cc850788f9cdf93dac0321395138665287/TTS/tts/models/xtts.py#L666
    def handle_chunks(self, wav_gen, wav_gen_prev, wav_overlap, overlap_len):
        """Handle chunk formatting in streaming mode"""
        wav_chunk = wav_gen[:-overlap_len]
        if wav_gen_prev is not None:
            wav_chunk = wav_gen[(wav_gen_prev.shape[0] - overlap_len) : -overlap_len]
        if wav_overlap is not None:
            crossfade_wav = wav_chunk[:overlap_len]
            crossfade_wav = crossfade_wav * torch.linspace(0.0, 1.0, overlap_len).to(crossfade_wav.device)
            wav_chunk[:overlap_len] = wav_overlap * torch.linspace(1.0, 0.0, overlap_len).to(wav_overlap.device)
            wav_chunk[:overlap_len] += crossfade_wav
        wav_overlap = wav_gen[-overlap_len:]
        wav_gen_prev = wav_gen
        return wav_chunk, wav_gen_prev, wav_overlap


    def tts_stream(self, text, voice_samples=None, conditioning_latents=None, k=1, verbose=True, use_deterministic_seed=None,
            return_deterministic_state=False, overlap_wav_len=1024, stream_chunk_size=40,
            # autoregressive generation parameters follow
            num_autoregressive_samples=512, temperature=.8, length_penalty=1, repetition_penalty=2.0, top_p=.8, max_mel_tokens=500,
            # CVVP parameters follow
            cvvp_amount=.0,
            # diffusion generation parameters follow
            diffusion_iterations=100, cond_free=True, cond_free_k=2, diffusion_temperature=1.0,
            **hf_generate_kwargs):
        """
        Produces an audio clip of the given text being spoken with the given reference voice.
        :param text: Text to be spoken.
        :param voice_samples: List of 2 or more ~10 second reference clips which should be torch tensors containing 22.05kHz waveform data.
        :param conditioning_latents: A tuple of (autoregressive_conditioning_latent, diffusion_conditioning_latent), which
                                     can be provided in lieu of voice_samples. This is ignored unless voice_samples=None.
                                     Conditioning latents can be retrieved via get_conditioning_latents().
        :param k: The number of returned clips. The most likely (as determined by Tortoises' CLVP model) clips are returned.
        :param verbose: Whether or not to print log messages indicating the progress of creating a clip. Default=true.
        ~~AUTOREGRESSIVE KNOBS~~
        :param num_autoregressive_samples: Number of samples taken from the autoregressive model, all of which are filtered using CLVP.
               As Tortoise is a probabilistic model, more samples means a higher probability of creating something "great".
        :param temperature: The softmax temperature of the autoregressive model.
        :param length_penalty: A length penalty applied to the autoregressive decoder. Higher settings causes the model to produce more terse outputs.
        :param repetition_penalty: A penalty that prevents the autoregressive decoder from repeating itself during decoding. Can be used to reduce the incidence
                                   of long silences or "uhhhhhhs", etc.
        :param top_p: P value used in nucleus sampling. (0,1]. Lower values mean the decoder produces more "likely" (aka boring) outputs.
        :param max_mel_tokens: Restricts the output length. (0,600] integer. Each unit is 1/20 of a second.
        ~~DIFFUSION KNOBS~~
        :param diffusion_iterations: Number of diffusion steps to perform. [0,4000]. More steps means the network has more chances to iteratively refine
                                     the output, which should theoretically mean a higher quality output. Generally a value above 250 is not noticeably better,
                                     however.
        :param cond_free: Whether or not to perform conditioning-free diffusion. Conditioning-free diffusion performs two forward passes for
                          each diffusion step: one with the outputs of the autoregressive model and one with no conditioning priors. The output
                          of the two is blended according to the cond_free_k value below. Conditioning-free diffusion is the real deal, and
                          dramatically improves realism.
        :param cond_free_k: Knob that determines how to balance the conditioning free signal with the conditioning-present signal. [0,inf].
                            As cond_free_k increases, the output becomes dominated by the conditioning-free signal.
                            Formula is: output=cond_present_output*(cond_free_k+1)-cond_absenct_output*cond_free_k
        :param diffusion_temperature: Controls the variance of the noise fed into the diffusion model. [0,1]. Values at 0
                                      are the "mean" prediction of the diffusion network and will sound bland and smeared.
        ~~OTHER STUFF~~
        :param hf_generate_kwargs: The huggingface Transformers generate API is used for the autoregressive transformer.
                                   Extra keyword args fed to this function get forwarded directly to that API. Documentation
                                   here: https://huggingface.co/docs/transformers/internal/generation_utils
        :return: Generated audio clip(s) as a torch tensor. Shape 1,S if k=1 else, (k,1,S) where S is the sample length.
                 Sample rate is 24kHz.
        """
        deterministic_seed = self.deterministic_state(seed=use_deterministic_seed)

        text_tokens = torch.IntTensor(self.tokenizer.encode(text)).unsqueeze(0).to(self.device)
        text_tokens = F.pad(text_tokens, (0, 1))  # This may not be necessary.
        assert text_tokens.shape[-1] < 400, 'Too much text provided. Break the text up into separate segments and re-try inference.'
        if voice_samples is not None:
            auto_conditioning = self.get_conditioning_latents(voice_samples, return_mels=False)
        elif conditioning_latents is not None:
            latent_tuple = conditioning_latents
            if len(latent_tuple) == 2:
                auto_conditioning = conditioning_latents
            else:
                auto_conditioning, auto_conds, _ = conditioning_latents
        else:
            auto_conditioning  = self.get_random_conditioning_latents()
        
        auto_conditioning = migrate_to_device( auto_conditioning, self.device )


        with torch.no_grad():
            calm_token = 83  # This is the token for coding silence, which is fixed in place with "fix_autoregressive_output"
            if verbose:
                print("Generating autoregressive samples..")
            with torch.autocast(
                    device_type="cuda" , dtype=torch.float16, enabled=self.half
                ):
                fake_inputs = self.autoregressive.compute_embeddings(
                    auto_conditioning,
                    text_tokens,
                )
                gpt_generator = self.autoregressive.get_generator(
                    fake_inputs=fake_inputs,
                    top_k=50,
                    top_p=top_p,
                    temperature=temperature,
                    do_sample=True,
                    num_beams=1,
                    num_return_sequences=1,
                    length_penalty=float(length_penalty),
                    repetition_penalty=float(repetition_penalty),
                    output_attentions=False,
                    output_hidden_states=True,
                    **hf_generate_kwargs,
                )
            all_latents = []
            codes_ = []
            wav_gen_prev = None
            wav_overlap = None
            is_end = False
            first_buffer = 60
            while not is_end:
                try:
                    with torch.autocast(
                        device_type="cuda", dtype=torch.float16, enabled=self.half
                    ):
                        codes, latent = next(gpt_generator)
                        all_latents += [latent]
                        codes_ += [codes]
                except StopIteration:
                    is_end = True

                if is_end or (stream_chunk_size > 0 and len(codes_) >= max(stream_chunk_size, first_buffer)):
                    first_buffer = 0
                    gpt_latents = torch.cat(all_latents, dim=0)[None, :]
                    wav_gen = self.hifi_decoder.inference(gpt_latents.to(self.device), auto_conditioning)
                    wav_gen = wav_gen.squeeze()
                    wav_chunk, wav_gen_prev, wav_overlap = self.handle_chunks(
                        wav_gen.squeeze(), wav_gen_prev, wav_overlap, overlap_wav_len
                    )
                    codes_ = []
                    yield wav_chunk

    def tts(self, text, voice_samples=None, conditioning_latents=None, k=1, verbose=True, use_deterministic_seed=None,
            # autoregressive generation parameters follow
            num_autoregressive_samples=512, temperature=.8, length_penalty=6, repetition_penalty=8.0, 
            top_p=.8, max_mel_tokens=500,
            # CVVP parameters follow
            cvvp_amount=.0,
            **hf_generate_kwargs):
        """
        Produces an audio clip of the given text being spoken with the given reference voice.
        :param text: Text to be spoken.
        :param voice_samples: List of 2 or more ~10 second reference clips which should be torch tensors containing 22.05kHz waveform data.
        :param conditioning_latents: A tuple of (autoregressive_conditioning_latent, diffusion_conditioning_latent), which
                                     can be provided in lieu of voice_samples. This is ignored unless voice_samples=None.
                                     Conditioning latents can be retrieved via get_conditioning_latents().
        :param k: The number of returned clips. The most likely (as determined by Tortoises' CLVP model) clips are returned.
        :param verbose: Whether or not to print log messages indicating the progress of creating a clip. Default=true.
        ~~AUTOREGRESSIVE KNOBS~~
        :param num_autoregressive_samples: Number of samples taken from the autoregressive model, all of which are filtered using CLVP.
               As Tortoise is a probabilistic model, more samples means a higher probability of creating something "great".
        :param temperature: The softmax temperature of the autoregressive model.
        :param length_penalty: A length penalty applied to the autoregressive decoder. Higher settings causes the model to produce more terse outputs.
        :param repetition_penalty: A penalty that prevents the autoregressive decoder from repeating itself during decoding. Can be used to reduce the incidence
                                   of long silences or "uhhhhhhs", etc.
        :param top_p: P value used in nucleus sampling. (0,1]. Lower values mean the decoder produces more "likely" (aka boring) outputs.
        :param max_mel_tokens: Restricts the output length. (0,600] integer. Each unit is 1/20 of a second.
        ~~DIFFUSION KNOBS~~
        :param diffusion_iterations: Number of diffusion steps to perform. [0,4000]. More steps means the network has more chances to iteratively refine
                                     the output, which should theoretically mean a higher quality output. Generally a value above 250 is not noticeably better,
                                     however.
        :param cond_free: Whether or not to perform conditioning-free diffusion. Conditioning-free diffusion performs two forward passes for
                          each diffusion step: one with the outputs of the autoregressive model and one with no conditioning priors. The output
                          of the two is blended according to the cond_free_k value below. Conditioning-free diffusion is the real deal, and
                          dramatically improves realism.
        :param cond_free_k: Knob that determines how to balance the conditioning free signal with the conditioning-present signal. [0,inf].
                            As cond_free_k increases, the output becomes dominated by the conditioning-free signal.
                            Formula is: output=cond_present_output*(cond_free_k+1)-cond_absenct_output*cond_free_k
        :param diffusion_temperature: Controls the variance of the noise fed into the diffusion model. [0,1]. Values at 0
                                      are the "mean" prediction of the diffusion network and will sound bland and smeared.
        ~~OTHER STUFF~~
        :param hf_generate_kwargs: The huggingface Transformers generate API is used for the autoregressive transformer.
                                   Extra keyword args fed to this function get forwarded directly to that API. Documentation
                                   here: https://huggingface.co/docs/transformers/internal/generation_utils
        :return: Generated audio clip(s) as a torch tensor. Shape 1,S if k=1 else, (k,1,S) where S is the sample length.
                 Sample rate is 24kHz.
        """
        deterministic_seed = self.deterministic_state(seed=use_deterministic_seed)

        text_tokens = torch.IntTensor(self.tokenizer.encode(text)).unsqueeze(0).to(self.device)
        text_tokens = F.pad(text_tokens, (0, 1))  # This may not be necessary.

        assert text_tokens.shape[-1] < 400, 'Too much text provided. Break the text up into separate segments and re-try inference.'
        if voice_samples is not None:
            auto_conditioning = self.get_conditioning_latents(voice_samples, return_mels=False)
        elif conditioning_latents is not None:
            auto_conditioning = conditioning_latents
        else:
            auto_conditioning  = self.get_random_conditioning_latents()
        
        auto_conditioning = migrate_to_device(auto_conditioning, self.device)

        with torch.no_grad():
            calm_token = 83  # This is the token for coding silence, which is fixed in place with "fix_autoregressive_output"
            if verbose:
                print("Generating autoregressive samples..")
            with torch.autocast(
                    device_type="cuda" , dtype=torch.float16, enabled=self.half
                ):
                # print("Autoregressive model device:", next(self.autoregressive.parameters()).device)
                # print("Hifi Decoder model device:", next(self.hifi_decoder.parameters()).device)

                codes = self.autoregressive.inference_speech(auto_conditioning, text_tokens,
                                                            top_k=50,
                                                            top_p=top_p,
                                                            temperature=temperature,
                                                            do_sample=True,
                                                            num_beams=1,
                                                            num_return_sequences=1,
                                                            length_penalty=float(length_penalty),
                                                            repetition_penalty=float(repetition_penalty),
                                                            output_attentions=False,
                                                            output_hidden_states=True,
                                                            **hf_generate_kwargs)
                gpt_latents = self.autoregressive(auto_conditioning.repeat(k, 1), text_tokens.repeat(k, 1),
                                torch.tensor([text_tokens.shape[-1]], device=text_tokens.device), codes,
                                torch.tensor([codes.shape[-1]*self.autoregressive.mel_length_compression], device=text_tokens.device),
                                return_latent=True, clip_inputs=False)
            if verbose:
                print("generating audio..")
            wav_gen = self.hifi_decoder.inference(gpt_latents.to(self.device), auto_conditioning)
            return wav_gen
    def deterministic_state(self, seed=None):
        """
        Sets the random seeds that tortoise uses to the current time() and returns that seed so results can be
        reproduced.
        """
        seed = int(time()) if seed is None else seed
        torch.manual_seed(seed)
        random.seed(seed)
        # Can't currently set this because of CUBLAS. TODO: potentially enable it if necessary.
        # torch.use_deterministic_algorithms(True)

        return seed
