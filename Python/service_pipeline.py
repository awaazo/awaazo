import text_to_speech_service.tts as tts
import rvc_service.rvc as rvc
import transcription_service.stt as stt
import assistant_service.ingest as ingest

import torch
import os
import time
import threading

def tts_rvc_pipeline(podcast_id, episode_id, text, delimiter='', speaker='Default', language='en', use_tortoise=True, 
                     index_rate=0.5, filter_radius=3, resample_sr=0, rms_mix_rate=0.25, protect=0.33):
    """
    Runs the TTS and RVC pipelines to create a new episode for the given podcast_id and episode_id.
    
    Args:
        podcast_id (str): The id of the podcast.
        episode_id (str): The id of the episode.
        text (str): The text to be spoken.
        delimiter (str): The delimiter to use for splitting the text into sentences.
        speaker (str): The name of the speaker to use for TTS.
        language (str): The language to use for TTS.
        use_tortoise (bool): Whether to use Tortoise TTS or Coqui TTS.
        index_rate (float): The index rate to use for RVC.
        filter_radius (float): The filter radius to use for RVC.
        resample_sr (int): The resample sample rate to use for RVC.
        rms_mix_rate (float): The rms mix rate to use for RVC.
        protect (float): The protect value to use for RVC.

    Raises:
        Exception: If an error occurs during the TTS or RVC process.

    Returns:
        None
    """
    try:
        print("------------- TTS RVC Pipeline Starting -------------")

        BASE_DIR = "./ServerFiles"
        SPEAKER_BASE_DIR = f"{BASE_DIR}/Speakers"
        SPEAKER_DIR = f"{SPEAKER_BASE_DIR}/{speaker}"
        PODCAST_DIR = f"{BASE_DIR}/Podcasts/{podcast_id}"

        # DO PRE PROCESSING CHECKS
        # ====================================================

        # Check that the podcast exists
        if not os.path.exists(PODCAST_DIR):
            raise (f"Podcast does not exist for given podcast_id {podcast_id} at {PODCAST_DIR}")

        # Check that the episode does not already exist
        if os.path.exists(f"{PODCAST_DIR}/{episode_id}"):
            raise (f"Episode already exists for given episode_id {episode_id} at {PODCAST_DIR}/{episode_id}")

        # Check that the speaker exists
        if not os.path.exists(SPEAKER_DIR):
            raise (f"Speaker does not exist for given speaker {speaker} at {SPEAKER_DIR}")
        
        # Check that the text is not empty
        if text == "":
            raise (f"Text is empty")

        # ====================================================
        
        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"

        if device == "cpu":
            print("WARNING: Using CPU instead of GPU. This will be slow.")
            use_tortoise = False

        print("Starting TTS step...")

        if use_tortoise:
            print(f"Using Tortoise TTS with {device} device")
            tts.create_audio_tortoise(text=text, speaker=speaker, result_file_path=f"{PODCAST_DIR}/{episode_id}.wav", delimiter=delimiter)
        else:
            print(f"Using Coqui TTS with {device} device")
            tts.create_audio_coqui(text=text,language=language, speaker_file_path=f"{SPEAKER_DIR}/{speaker}.wav",result_file_path=f"{PODCAST_DIR}/{episode_id}.wav") 

        print("TTS step done...")
        time.sleep(2)
        print("Starting RVC step...")
  
        rvc.clone_voice(audio_file_path=f"{PODCAST_DIR}/{episode_id}.wav",speaker_name=speaker,base_path=SPEAKER_BASE_DIR,
                        index_rate=index_rate,filter_radius=filter_radius,resample_sr=resample_sr,rms_mix_rate=rms_mix_rate,protect=protect)

        print("RVC step done...")

        # DO POST PROCESSING CHECKS
        # ====================================================
        
        # Check that the episode was created
        if not os.path.exists(f"{PODCAST_DIR}/{episode_id}.wav"):
            raise (f"Episode was not created for given episode_id {episode_id} at {PODCAST_DIR}/{episode_id}.wav")

        # ====================================================

        print("------------- TTS RVC Pipeline Done -------------")

    except Exception as e:
        print("------------- TTS RVC Pipeline Failed -------------")
        print(e)

def transcription_ingestion_pipeline(podcast_id, episode_id, model_name="base", batch_size=4, compute_type="float16", device="cuda"):
    """
    Runs the transcription and ingestion pipelines to create an episode transcript and vectorstore for the given podcast_id and episode_id.

    Args:
        podcast_id (str): The id of the podcast.
        episode_id (str): The id of the episode.
        model_name (str): The name of the WhisperX model to use. Default is "base".
        batch_size (int): The batch size to use for transcription. Default is 4.
        compute_type (str): The compute type to use for transcription. Default is "float16".
        device (str): The device to use for transcription. Default is "cuda".

    Raises:
        Exception: If an error occurs during the transcription or ingestion process.

    Returns:
        None
    """
    try:
        print("------------- Transcription Ingestion Pipeline Starting -------------")

        AUDIO_FILE_EXTENSIONS = [".wav", ".mp3", ".mp4", ".mpeg"]

        BASE_DIR = "./ServerFiles"
        PODCAST_DIR = f"{BASE_DIR}/Podcasts/{podcast_id}"
        EPISODE = f"{PODCAST_DIR}/{episode_id}"

        # DO PRE PROCESSING CHECKS
        # ==================================================== 

        # Check that the podcast exists
        if not os.path.exists(PODCAST_DIR):
            raise (f"Podcast does not exist for given podcast_id {podcast_id} at {PODCAST_DIR}")

        # Find the episode file
        for file in os.listdir(PODCAST_DIR):
            if file.endswith(tuple(AUDIO_FILE_EXTENSIONS)):
                episode_filename = file
                break

        # Check that the episode exists
        if not os.path.exists(episode_filename):
            raise (f"Episode does not exist for given episode_id {episode_id} at {episode_filename}")
        
        # Check that the episode has not already been transcribed
        if os.path.exists(f"{EPISODE}.json"):
            raise (f"Episode has already been transcribed for given episode_id {episode_id} at {EPISODE}.json")

        # ====================================================

        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"

        if device == "cpu":
            print("WARNING: Using CPU instead of GPU. This will be slow.")
            compute_type = "int8"
            device = "cpu"

        print("Starting transcription step...")

        stt.create_transcript_whisperx(episode_file_path=f"{episode_filename}", model_name=model_name, batch_size=batch_size, compute_type=compute_type, device=device)

        print("Transcription step done...")
        print("Starting ingestion step...")

        ingest.process_transcript(podcast_id=podcast_id, episode_id=episode_id)

        print("Ingestion step done...")

        # DO POST PROCESSING CHECKS
        # ====================================================

        # Check that the episode was transcribed
        if not os.path.exists(f"{EPISODE}.json"):
            raise (f"Episode was not transcribed for given episode_id {episode_id} at {EPISODE}.json")
        
        # Check that the episode was ingested
        if not os.path.isdir(f"{EPISODE}_vectorstore"):
            raise (f"Episode was not ingested for given episode_id {episode_id} at {EPISODE}_vectorstore")
        
        # ====================================================

        print("------------- Transcription Ingestion Pipeline Done -------------")
    except Exception as e:
        print("------------- Transcription Ingestion Pipeline Failed -------------")
        print(e)

