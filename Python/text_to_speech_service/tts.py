import os
import torch
from TTS.api import TTS


def create_audio(text, language, speaker_file_path, result_file_path):
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
        file_name = result_file_path.split('.')[0]

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

