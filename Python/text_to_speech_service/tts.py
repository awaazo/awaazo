import torch
from TTS.api import TTS


def create_audio(text,language,speaker_file_path,result_file_path):
    try:
        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using {device} device")

        # Init TTS
        tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

        tts.tts_to_file(speed=2,text=text,language=language, speaker_wav=speaker_file_path, file_path=result_file_path)
    except Exception as e:
        # If an error occurs, update the status file with the error message
        print(e)