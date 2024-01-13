import os
from glob import glob

import librosa
import soundfile as sf
import torch
import torchaudio

from text_to_speech_service.tortoise.utils.stft import STFT

def get_voice_dir():
    target = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../voices')
    if not os.path.exists(target):
        target = os.path.dirname('./voices/')

    os.makedirs(target, exist_ok=True)

    return target

def load_audio(audiopath, sampling_rate):

    if audiopath[-4:] == '.wav':
        audio, lsr = torchaudio.load(audiopath)
    elif audiopath[-4:] == '.mp3':
        audio, lsr = librosa.load(audiopath, sr=sampling_rate)
        audio = torch.FloatTensor(audio)
    elif audiopath[-5:] == '.flac':
        audio, lsr = sf.read(audiopath)
        audio = torch.FloatTensor(audio)
    else:
        assert False, f"Unsupported audio format provided: {audiopath[-4:]}"

    # Remove any channel data.
    if len(audio.shape) > 1:
        if audio.shape[0] < 5:
            audio = audio[0]
        else:
            assert audio.shape[1] < 5
            audio = audio[:, 0]

    if lsr != sampling_rate:
        audio = torchaudio.functional.resample(audio, lsr, sampling_rate)

    # Check some assumptions about audio range. This should be automatically fixed in load_wav_to_torch, but might not be in some edge cases, where we should squawk.
    # '2' is arbitrarily chosen since it seems like audio will often "overdrive" the [-1,1] bounds.
    if torch.any(audio > 2) or not torch.any(audio < 0):
        print(f"Error with {audiopath}. Max={audio.max()} min={audio.min()}")
    audio.clip_(-1, 1)

    return audio.unsqueeze(0)


TACOTRON_MEL_MAX = 2.3143386840820312
TACOTRON_MEL_MIN = -11.512925148010254


def denormalize_tacotron_mel(norm_mel):
    return ((norm_mel+1)/2)*(TACOTRON_MEL_MAX-TACOTRON_MEL_MIN)+TACOTRON_MEL_MIN


def normalize_tacotron_mel(mel):
    return 2 * ((mel - TACOTRON_MEL_MIN) / (TACOTRON_MEL_MAX - TACOTRON_MEL_MIN)) - 1


def dynamic_range_compression(x, C=1, clip_val=1e-5):
    """
    PARAMS
    ------
    C: compression factor
    """
    return torch.log(torch.clamp(x, min=clip_val) * C)


def dynamic_range_decompression(x, C=1):
    """
    PARAMS
    ------
    C: compression factor used to compress
    """
    return torch.exp(x) / C


def get_voices(extra_voice_dirs=[], load_latents=True):
    dirs = [get_voice_dir()] + extra_voice_dirs
    voices = {}
    for d in dirs:
        subs = os.listdir(d)
        for sub in subs:
            subj = os.path.join(d, sub)
            if os.path.isdir(subj):
                voices[sub] = list(glob(f'{subj}/*.wav')) + list(glob(f'{subj}/*.mp3')) + list(glob(f'{subj}/*.flac'))
                if load_latents:
                    voices[sub] = voices[sub] + list(glob(f'{subj}/*.pth'))
    return voices

def get_voice( name, dir=get_voice_dir(), load_latents=True, extensions=["wav", "mp3", "flac"] ):
    subj = f'{dir}/{name}/'
    if not os.path.isdir(subj):
        return
    files = os.listdir(subj)
    
    if load_latents:
        extensions.append("pth")

    voice = []
    for file in files:
        ext = os.path.splitext(file)[-1][1:]
        if ext not in extensions:
            continue

        voice.append(f'{subj}/{file}')

    return sorted( voice )

def get_voice_list(dir=get_voice_dir(), append_defaults=False, load_latents=True, extensions=["wav", "mp3", "flac"]):
    defaults = [ "random", "microphone" ]
    os.makedirs(dir, exist_ok=True)
    #res = sorted([d for d in os.listdir(dir) if d not in defaults and os.path.isdir(os.path.join(dir, d)) and len(os.listdir(os.path.join(dir, d))) > 0 ])

    res = []
    for name in os.listdir(dir):
        if name in defaults:
            continue
        if not os.path.isdir(f'{dir}/{name}'):
            continue
        if len(os.listdir(os.path.join(dir, name))) == 0:
            continue
        files = get_voice( name, dir=dir, extensions=extensions, load_latents=load_latents )

        if len(files) > 0:
            res.append(name)
        else:
            for subdir in os.listdir(f'{dir}/{name}'):
                if not os.path.isdir(f'{dir}/{name}/{subdir}'):
                    continue
                files = get_voice( f'{name}/{subdir}', dir=dir, extensions=extensions, load_latents=load_latents )
                if len(files) == 0:
                    continue
                res.append(f'{name}/{subdir}')

    res = sorted(res)
    
    if append_defaults:
        res = res + defaults
    
    return res


def _get_voices( dirs=[get_voice_dir()], load_latents=True ):
    voices = {}
    for dir in dirs:
        voice_list = get_voice_list(dir=dir)
        voices |= { name: get_voice(name=name, dir=dir, load_latents=load_latents) for name in voice_list }

    return voices

def load_voice(voice, extra_voice_dirs=[], load_latents=True, sample_rate=22050, device='cpu', model_hash=None):
    if voice == 'random':
        return None, None
    
    print(f"voice dirs: {[get_voice_dir()] + extra_voice_dirs}")

    voices = _get_voices(dirs=[get_voice_dir()] + extra_voice_dirs, load_latents=load_latents)

    print(f"voices: {voices}")

    paths = voices[voice]
    mtime = 0
    
    latent = None
    voices = []

    for path in paths:
        filename = os.path.basename(path)
        if filename[-4:] == ".pth" and filename[:12] == "cond_latents":
            if not model_hash and filename == "cond_latents.pth":
                latent = path
            elif model_hash and filename == f"cond_latents_{model_hash[:8]}.pth":
                latent = path
        elif filename[-4:] != ".pth":
            voices.append(path)
            mtime = max(mtime, os.path.getmtime(path))

    # if load_latents and latent is not None:
    #     if os.path.getmtime(latent) > mtime:
    #         print(f"Reading from latent: {latent}")
    #         return None, torch.load(latent, map_location=device)
    #     print(f"Latent file out of date: {latent}")
    
    samples = []
    for path in voices:
        c = load_audio(path, sample_rate)
        samples.append(c)
    return samples, None


def load_voices(voices, extra_voice_dirs=[]):
    latents = []
    clips = []
    for voice in voices:
        if voice == 'random':
            if len(voices) > 1:
                print("Cannot combine a random voice with a non-random voice. Just using a random voice.")
            return None, None
        clip, latent = load_voice(voice, extra_voice_dirs)
        if latent is None:
            assert len(latents) == 0, "Can only combine raw audio voices or latent voices, not both. Do it yourself if you want this."
            clips.extend(clip)
        elif clip is None:
            assert len(clips) == 0, "Can only combine raw audio voices or latent voices, not both. Do it yourself if you want this."
            latents.append(latent)
    if len(latents) == 0:
        return clips, None
    else:
        latents_0 = torch.stack([l[0] for l in latents], dim=0).mean(dim=0)
        latents_1 = torch.stack([l[1] for l in latents], dim=0).mean(dim=0)
        latents = (latents_0,latents_1)
        return None, latents


class TacotronSTFT(torch.nn.Module):
    def __init__(self, filter_length=1024, hop_length=256, win_length=1024,
                 n_mel_channels=80, sampling_rate=22050, mel_fmin=0.0,
                 mel_fmax=8000.0):
        super(TacotronSTFT, self).__init__()
        self.n_mel_channels = n_mel_channels
        self.sampling_rate = sampling_rate
        self.stft_fn = STFT(filter_length, hop_length, win_length)
        from librosa.filters import mel as librosa_mel_fn
        mel_basis = librosa_mel_fn(
            sr=sampling_rate, n_fft=filter_length, n_mels=n_mel_channels, fmin=mel_fmin, fmax=mel_fmax)
        mel_basis = torch.from_numpy(mel_basis).float()
        self.register_buffer('mel_basis', mel_basis)

    def spectral_normalize(self, magnitudes):
        output = dynamic_range_compression(magnitudes)
        return output

    def spectral_de_normalize(self, magnitudes):
        output = dynamic_range_decompression(magnitudes)
        return output

    def mel_spectrogram(self, y):
        """Computes mel-spectrograms from a batch of waves
        PARAMS
        ------
        y: Variable(torch.FloatTensor) with shape (B, T) in range [-1, 1]

        RETURNS
        -------
        mel_output: torch.FloatTensor of shape (B, n_mel_channels, T)
        """
        assert(torch.min(y.data) >= -10)
        assert(torch.max(y.data) <= 10)
        y = torch.clip(y, min=-1, max=1)

        magnitudes, phases = self.stft_fn.transform(y)
        magnitudes = magnitudes.data
        mel_output = torch.matmul(self.mel_basis, magnitudes)
        mel_output = self.spectral_normalize(mel_output)
        return mel_output


def wav_to_univnet_mel(wav, do_normalization=False, device='cpu', sample_rate=24000):
    stft = TacotronSTFT(1024, 256, 1024, 100, sample_rate, 0, 12000)
    stft = stft.to(device)
    mel = stft.mel_spectrogram(wav)
    if do_normalization:
        mel = normalize_tacotron_mel(mel)
    return mel
