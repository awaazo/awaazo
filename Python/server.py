# Import Python Libraries
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from aiohttp import web
from huggingface_hub import snapshot_download
import os
import torch
import threading

# Import Custom Libraries
import transcription_service.stt
import text_to_speech_service.tts
import rvc_service.rvc

# Server Settings
HOST = "0.0.0.0"
PORT = 8000

# CONSTANTS
CREATE_TRANSCRIPT = "/create_transcript"
PODCASTS_FOLDER_PATH = "/ServerFiles/Podcasts"
SPEAKERS_FOLDER_PATH = "/ServerFiles/Speakers"
REPO_ID = "Awaazo/Speakers"

async def handle_transcription_request(request):
    '''
    Handles the transcription request

    Args:
        request: The HTTP request object.
        It should contain the following data:
            podcast_id (str): The ID of the podcast to transcribe. Required. 
            episode_file_name (str): The name of the episode file to transcribe. Required.
    
    Returns:
        A web response with the status of the transcription process.
        It should contain the following data:
            status (str): The status of the transcription process.

    Raises:
        Exception: If an error occurs during the transcription process.
    '''
    try:
        status = ""

        # Get the podcast and episode IDs from the request
        podcast_id = request.match_info['podcast_id']
        episode_file_name = request.match_info['episode_file_name']

        # Get the path to the audio file
        episode_audio_path = f'{os.getcwd()}{PODCASTS_FOLDER_PATH}/{podcast_id}/{episode_file_name}'

        # Check if the audio file exists
        if not os.path.isfile(episode_audio_path):
            raise Exception(f'No Audio exists for the given podcastID and episode file name.')
        
        transcript_file_path = episode_audio_path.split('.')[0]+'.json'
        status_file_path = episode_audio_path.split('.')[0]+'_status.txt'

        # Check if the transcript already exists
        if os.path.isfile(transcript_file_path):
            raise Exception(f'Transcript already exists for the given episode.')

        # Check if the transcription is already in progress
        if os.path.isfile(status_file_path):
            with open(status_file_path, 'r') as f:
                status = f.read()
                f.close()
            if status == 'In progress':
                raise Exception(f'Transcription is already in progress for the given episode.')
    
        # Launch the thread to create the transcript (DO NOT AWAIT as it could take a long time depending on the audio size)
        threading.Thread(target=transcription_service.stt.create_transcript_whisperx, args=(episode_audio_path,)).start()

        status = "Transcription process has been initiated."

        return web.Response(text=status, status=200)
    
    except Exception as e:
        return web.Response(status=400, text=str(e))

async def handle_text_to_speech_request(request):
    """
    Handle a text-to-speech request.

    Args:
        request: The HTTP request object.
        It should contain the following data:
            text (str): The text to convert to speech. Required.
            language (str): The language of the text to convert to speech. Default is 'en'.
            speaker_name (str): The name of the speaker to convert the text to speech. Default is 'Default'.
            podcast_id (str): The ID of the podcast to convert the text to speech. Required. 
            episode_id (str): The ID of the episode to convert the text to speech. Required.
            delimiter (str): The delimiter to use for the text to speech process. Default is ''.
    Returns:
        A web response with the status of the text-to-speech process.
        It should contain the following data:
            status (str): The status of the text-to-speech process.

    Raises:
        Exception: If an error occurs during the text-to-speech process.
    """
    try:
        print("Handling text-to-speech request...")
        
        status = ""

        # Get all the data from the request
        data = await request.json()

        # Get the text to convert to speech
        text = data.get('text')
        # Get the language of the text to convert to speech
        language = data.get('language','en')
        # Get the speaker's name to convert to speech
        speaker_name = data.get('speaker_name', 'Default')

        # Get the delimiter to use for the text to speech process
        delimiter = data.get('delimiter','')

        # Get the podcast and episode IDs to convert to speech
        podcast_id = data.get('podcast_id')
        episode_id = data.get('episode_id')

        print(f"Text: {text}, Language: {language}, Speaker Name: {speaker_name}, Podcast ID: {podcast_id}, Episode ID: {episode_id}")

        # Make sure the text is not empty
        if not text:
            raise Exception(f'No text was provided.')
        
        # Make sure the podcast ID is not empty
        if not podcast_id:
            raise Exception(f'No podcast ID was provided.')
        
        # Make sure the episode ID is not empty
        if not episode_id:
            raise Exception(f'No episode ID was provided.')

        # Get the path to the speaker's audio file
        speaker_file_path = text_to_speech_service.tts.get_speaker_file_path(speaker_name, f'{os.getcwd()}{SPEAKERS_FOLDER_PATH}')

        # Set the path to the resulting audio file
        episode_audio_path = f'{os.getcwd()}{PODCASTS_FOLDER_PATH}/{podcast_id}/{episode_id}.wav'
        
        # Set the path to the status file for the text to speech process
        status_file_path = episode_audio_path.split('.')[0]+'_tts_status.txt'

        # Check if the audio file already exists
        if os.path.isfile(episode_audio_path):
            raise Exception(f'Audio already exists for the given episode.')
        
        if not os.path.isdir(f'{os.getcwd()}{PODCASTS_FOLDER_PATH}/{podcast_id}'):
            raise Exception(f'Podcast folder does not exist for the given podcast ID.')

        # Check if the text to speech is already in progress
        if os.path.isfile(status_file_path):
            with open(status_file_path, 'r') as f:
                status = f.read()
                f.close()
            if status == 'In progress':
                raise Exception(f'Text to speech is already in progress for the given episode.')

        # If GPU is available, launch the text to speech process using Tortoise TTS
        if torch.cuda.is_available():
            threading.Thread(target=text_to_speech_service.tts.create_audio_tortoise, args=(text,speaker_name,episode_audio_path,delimiter)).start()
        else:
            # Launch the thread to create the audio file (DO NOT AWAIT as it could take a long time depending on the text size)
            threading.Thread(target=text_to_speech_service.tts.create_audio_coqui, args=(text,language,speaker_file_path,episode_audio_path)).start()

        status = "Text to speech process has been initiated."

        # Return a 200 response with the status
        return web.Response(text=status, status=200)

    except Exception as e:
        # If an error occurs, send a 400 response with the error message
        print(f"Error in handle_text_to_speech_request: {e}")
        return web.Response(status=400, text=str(e))

async def handle_realistic_voice_cloning_request(request):
    """
    Handle a realistic voice cloning request.

    Args:
        request: The HTTP request object.
        It should contain the following data:
            podcast_id (str): The ID of the podcast to use realistic voice cloning. Required. 
            episode_id (str): The ID of the episode to use realistic voice cloning. Required.
            speaker_name (str): The name of the speaker to use realistic voice cloning. Default is 'Default'.
            index_rate (int): The rate at which the index is generated. Default is 0.5.
            filter_radius (int): The radius of the filter used for voice conversion. Default is 3.
            resample_sr (int): The target sampling rate for the converted voice. Default is 0.
            rms_mix_rate (float): The rate at which the RMS of the converted voice is mixed with the original voice. Default is 0.25.
            protect (bool): Flag indicating whether to protect the converted voice. Default is False.
    Returns:
        A web response with the status of the realistic voice cloning process.

    Raises:
        Exception: If an error occurs during the realistic voice cloning process.
    """
    try: 
        print("Handling rvc request...")
        
        status = ""

        # Get all the data from the request
        data = await request.json()

        # Get the podcast and episode IDs to use realistic voice cloning
        podcast_id = data.get('podcast_id')
        episode_id = data.get('episode_id')

        # Get the speaker's name to use realistic voice cloning
        speaker_name = data.get('speaker_name', 'Default')

        # Get the audio index rate
        index_rate = data.get('index_rate', 0.5)

        # Get the filter radius
        filter_radius = data.get('filter_radius', 3)

        # Get the resample sample rate
        resample_sr = data.get('resample_sr', 0)

        # Get the rms mix rate
        rms_mix_rate = data.get('rms_mix_rate', 0.25)

        # Get the protect value
        protect = data.get('protect',0.33)
        
        print(f"Podcast ID: {podcast_id}, Episode ID: {episode_id}, Speaker Name: {speaker_name}, Index Rate: {index_rate}, Filter Radius: {filter_radius}, Resample Sample Rate: {resample_sr}, RMS Mix Rate:{rms_mix_rate}, Protect: {protect}\n")
        
        # Make sure the podcast ID is not empty
        if not podcast_id:
            raise Exception(f'No podcast ID was provided.')
        
        # Make sure the episode ID is not empty
        if not episode_id:
            raise Exception(f'No episode ID was provided.')

        # Set the path to the resulting audio file
        episode_audio_path = f'{os.getcwd()}{PODCASTS_FOLDER_PATH}/{podcast_id}/{episode_id}.wav'
        
        # Set the path to the status file for the rvc process
        status_file_path = episode_audio_path.split('.')[0]+'_rvc_status.txt'

        # Get the base path
        base_path = f'{os.getcwd()}{SPEAKERS_FOLDER_PATH}'

        # Check if the audio file does not exists
        if os.path.isfile(episode_audio_path) == False:
            raise Exception(f'Audio does not exists for the given episode.')

        # Check if the rvc is already in progress
        if os.path.isfile(status_file_path):
            with open(status_file_path, 'r') as f:
                status = f.read()
                f.close()
            if status == 'In progress':
                raise Exception(f'RVC is already in progress for the given episode.')

        # Launch the thread to create the audio file (DO NOT AWAIT as it could take a long time depending on the audio duration)
        threading.Thread(target=rvc_service.rvc.clone_voice, args=(episode_audio_path,speaker_name,base_path,index_rate,filter_radius,resample_sr,rms_mix_rate,protect)).start()

        status = "RVC process has been initiated."

        # Return a 200 response with the status
        return web.Response(text=status, status=200)
    except Exception as e:
        # If an error occurs, send a 400 response with the error message
        print(f"Error in handle_realistic_voice_cloning_request: {e}")
        return web.Response(status=400, text=str(e))

# Create the server instance
app = web.Application()

# Add the routes to the server
app.add_routes([web.get('/{podcast_id}/{episode_file_name}/create_transcript', handle_transcription_request)])
app.add_routes([web.post('/tts', handle_text_to_speech_request)])
app.add_routes([web.post('/rvc', handle_realistic_voice_cloning_request)])

# Download the Speakers
print("Downloading Speaker Models...")
snapshot_download(repo_id=REPO_ID,  local_dir=f'{os.getcwd()}{SPEAKERS_FOLDER_PATH}',local_dir_use_symlinks=False)

# Start the server
web.run_app(app, port=PORT)
