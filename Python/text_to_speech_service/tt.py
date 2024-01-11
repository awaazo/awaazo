import os
import torch
import torchaudio

from tortoise.api_fast import TextToSpeech as Tortoise_TTS_Hifi
from tortoise.utils.text import split_and_recombine_text
from tortoise.utils.audio import load_audio, load_voice, get_voice_dir


def tts(text,speaker,delimiter=''):
    try:
        print("TTS")
        print(text)
        print(speaker)

        output_volume = 1
        autoregressive_model_path = "./models/tortoise/autoregressive.pth"
        tokenizer_json_path = "./modules/tortoise-tts/tortoise/data/tokenizer.json"
        use_deepspeed = False
        
        # Load the TTS model (Tortoise TTS with HiFi-GAN vocoder)
        tts = Tortoise_TTS_Hifi(autoregressive_model_path=autoregressive_model_path,
                                tokenizer_json=tokenizer_json_path,
                                use_deepspeed=use_deepspeed)
    
        print("Loaded TTS, ready for generation.")

        # Split the text into sections of 200-300 characters
        if delimiter == '':
            texts = split_and_recombine_text(text)
        else:
            texts = text.split(delimiter)
        
        print(texts)

        volume_adjust = torchaudio.transforms.Vol(gain=output_volume, gain_type="amplitude") if output_volume != 1 else None

        settings = {
            'tempeture': 0.2,
            'top_p': 0.8,
            'diffusion_temperature': 1,
            'length penalty': 1,
            'repetition_penalty': 2,
            'cond_free_k': 2,
            'num_autoregressive_samples': 16,
            'sample_batch_size': 1,
            'diffusion_iterations': 30,
            'voice_samples': None,
            'conditioning_latents': None,
            'use_deterministic_seed': None,
            'returns_deterministic_state': True,
            'k': 1,
            'diffusion_sampler': 'DDIM',
            'breathing_room': 8,
            'half_p': False,
            'cond_free': True,
            'cvvp_amount': 0,
            'autoregressive_model': './models/tortoise/autoregressive.pth',
            'diffusion_model': './models/tortoise/diffusion_decoder.pth',
            'tokenizer_json': './modules/tortoise-tts/tortoise/data/tokenizer.json',
        }

        # Gotta load voice samples and conditioning latents
        cache_key = f'{speaker}:{tts.autoregressive_model_hash[:8]}'
        print(f"Loading voice: {speaker} with model {tts.autoregressive_model_hash[:8]}")
        voice_samples, conditioning_latents = load_voice(voice=speaker,extra_voice_dirs=["./voices"], model_hash=tts.autoregressive_model_hash)

        settings['voice_samples'] = voice_samples
        settings['conditioning_latents'] = conditioning_latents

        # Generate audio

        for i, cut_text in enumerate(texts):
            print(f"Generating audio for text {i+1}/{len(texts)}: {cut_text}")
            gen = tts.tts(cut_text, **settings)    

            if not isinstance(gen, list):
                gen = [gen]
            
            for j, g in enumerate(gen):
                audio = g.squeeze(0).cpu()
                name = "test"+'_'+str(i)

                torchaudio.save(f'{name}.wav',audio,tts.output_sample_rate)

        # Combine audio
        print("Combining audio...")
        combined = None
        for i, cut_text in enumerate(texts):
            name = "test"+'_'+str(i)
            audio = load_audio(f'{name}.wav',tts.output_sample_rate)
            if volume_adjust is not None:
                audio = volume_adjust(audio)
            if combined is None:
                combined = audio
            else:
                combined = torch.cat([combined, audio], dim=1)

        torchaudio.save(f'test.wav',combined,tts.output_sample_rate)

        # Cleanup
        print("Cleaning up...")
        for i, cut_text in enumerate(texts):
            name = "test"+'_'+str(i)
            os.remove(f'{name}.wav')

    except Exception as e:
        print("Error: " + str(e))
        raise e



tts("Hello World. This is cool!\\n No worries! I am not angry!.\\n This is a test!","Drinker",delimiter='\\n')