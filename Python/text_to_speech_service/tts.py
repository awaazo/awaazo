import os
from TTS.api import TTS
import torch
import torchaudio

from text_to_speech_service.tortoise.api_fast import TextToSpeech as Tortoise_TTS_Hifi
from text_to_speech_service.tortoise.utils.text import split_and_recombine_text
from text_to_speech_service.tortoise.utils.audio import load_audio, load_voice

def create_audio_coqui(text, language, speaker_file_path, result_file_path):
    """
    Creates an audio file from the given text and saves it to the given file path.

    Args:
        text (str): The text to convert to audio.
        language (str): The language of the text.
        speaker_file_path (str): The file path of the speaker's audio file.
        result_file_path (str): The file path to save the generated audio file.

    Raises:
        Exception: If an error occurs during the audio generation process.
    """
    try:

        # Get the file name
        file_name = result_file_path.split('.wav')[0]

        # Define the status file path
        status_file_path = f'{file_name}_tts_status.txt'

        # Create a status file to indicate that the text to speech is in progress
        with open(status_file_path, 'w') as f:
            f.write('In progress')
            f.close()

        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using {device} device")

        # Init TTS
        tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

        # Generate audio from text and save it to a file
        tts.tts_to_file(text=text, language=language, speaker_wav=speaker_file_path, file_path=result_file_path)

        # Once the audio is generated, delete the status file
        os.remove(status_file_path)

    except Exception as e:
        # If an error occurs, update the status file with the error message
        with open(status_file_path, 'w') as f:
            f.write('Error\n')
            f.write(str(e))
            f.close()

        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in tts.create_audio: {e} \n Text: {text} \n Language: {language} \n Speaker file path: {speaker_file_path} \n Result file path: {result_file_path} \n device: {device} \n")
        raise e

def create_audio_tortoise(text,speaker,result_file_path,delimiter=''):
    """
    Converts text to audio using Tortoise TTS with HiFi-GAN vocoder.

    Args:
        text (str): The text to convert to audio.
        speaker (str): The name of the speaker to use.
        result_file_path (str): The file path to save the generated audio file.
        delimiter (str, optional): The delimiter to use for splitting the text into sections. Defaults to ''.

    Raises:
        Exception: If an error occurs during the audio generation process.
    """
    try:
        print("-------------------- Starting Tortoise TTS --------------------")
        print(result_file_path)

        # Get the file name
        file_name = result_file_path.split('.wav')[0]

        # Define the status file path
        status_file_path = f'{file_name}_tts_status.txt'

        # Create a status file to indicate that the text to speech is in progress
        with open(status_file_path, 'w') as f:
            f.write('In progress')
            f.close()

        print("Tortoise TTS started...")

        output_volume = 1
        autoregressive_model_path = "./ServerFiles/Speakers/autoregressive.pth"
        tokenizer_json_path = "./text_to_speech_service/tortoise/tokenizer.json"
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
            'temperature': 0.2,
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
            'autoregressive_model': f'./ServerFiles/Speakers/{speaker}/{speaker}.pth',
            'diffusion_model': './text_to_speech_service/models/tortoise/diffusion_decoder.pth',
            'tokenizer_json': './text_to_speech_service/tortoise/tokenizer.json',
        }

        # Gotta load voice samples and conditioning latents
        print(f"Loading voice: {speaker} with model {tts.autoregressive_model_hash[:8]}")
        voice_samples, conditioning_latents = load_voice(voice=speaker,extra_voice_dirs=["./ServerFiles/Speakers"], model_hash=tts.autoregressive_model_hash)

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
                name = str(file_name)+'_'+str(i)

                torchaudio.save(f'{name}.wav',audio,tts.output_sample_rate)

        # Combine audio
        print("Combining audio...")
        combined = None
        for i, cut_text in enumerate(texts):
            name = str(file_name)+'_'+str(i)
            audio = load_audio(f'{name}.wav',tts.output_sample_rate)
            if volume_adjust is not None:
                audio = volume_adjust(audio)
            if combined is None:
                combined = audio
            else:
                combined = torch.cat([combined, audio], dim=1)

        torchaudio.save(result_file_path,combined,tts.output_sample_rate)

        # Cleanup
        print("Cleaning up...")
        for i, cut_text in enumerate(texts):
            name = str(file_name)+'_'+str(i)
            os.remove(f'{name}.wav')

        # Once the audio is generated, delete the status file
        os.remove(status_file_path)
        print("-------------------- Tortoise TTS Complete --------------------")

    except Exception as e:
        # If an error occurs, update the status file with the error message
        with open(status_file_path, 'w') as f:
            f.write(str(e))
            f.close()
        
        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in tts.create_audio: {e} \n Text: {text} \n Speaker: {speaker} \n Result file path: {result_file_path} \n")
        raise e    

def get_speaker_file_path(speaker_name, base_path):
    """
    Returns the file path of the given speaker's audio file.

    Args:
        speaker_name (str): The name of the speaker.
        base_path (str): The base path where the audio files are stored.

    Returns:
        str: The file path of the speaker's audio file.

    Raises:
        Exception: If no audio file exists for the given speaker name.
    """
    try:
        # Define the speaker's audio file path
        speaker_file_path = f'{base_path}/{speaker_name}/{speaker_name}.wav'

        # Check if the speaker's audio file exists
        if not os.path.isfile(speaker_file_path):
            raise Exception(f'No audio file exists for the given speaker name.')

        return speaker_file_path

    except Exception as e:
        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in tts.get_speaker_file_path: {e} \n File path: {speaker_file_path} \n Speaker name: {speaker_name} \n Base path: {base_path} \n")
        raise e