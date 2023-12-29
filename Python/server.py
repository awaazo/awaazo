# Import Python Libraries
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from aiohttp import web
import os
import threading

# Import Custom Libraries
import transcription_service.stt
import text_to_speech_service.tts

# Server Settings
HOST = "0.0.0.0"
PORT = 8000

# CONSTANTS
CREATE_TRANSCRIPT = "/create_transcript"
PODCASTS_FOLDER_PATH = "/ServerFiles/Podcasts"
SPEAKERS_FOLDER_PATH = "/ServerFiles/Speakers"

# Handles the transcription request
async def handle_transcription_request(request):
    '''
    Handles the transcription request
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
        threading.Thread(target=transcription_service.stt.create_transcript, args=(episode_audio_path,)).start()

        status = "Transcription process has been initiated."

        return web.Response(text=status, status=200)
    
    except Exception as e:
        return web.Response(status=400, text=str(e))

async def handle_text_to_speech_request(request):
    """
    Handle a text-to-speech request.

    Args:
        request: The HTTP request object.

    Returns:
        A web response with the status of the text-to-speech process.

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

        # Check if the text to speech is already in progress
        if os.path.isfile(status_file_path):
            with open(status_file_path, 'r') as f:
                status = f.read()
                f.close()
            if status == 'In progress':
                raise Exception(f'Text to speech is already in progress for the given episode.')

        # Launch the thread to create the audio file (DO NOT AWAIT as it could take a long time depending on the text size)
        threading.Thread(target=text_to_speech_service.tts.create_audio, args=(text,language,speaker_file_path,episode_audio_path)).start()

        status = "Text to speech process has been initiated."

        # Return a 200 response with the status
        return web.Response(text=status, status=200)

    except Exception as e:
        # If an error occurs, send a 400 response with the error message
        print(f"Error in handle_text_to_speech_request: {e}")
        return web.Response(status=400, text=str(e))

# Create the server instance
app = web.Application()

# Add the routes to the server
app.add_routes([web.get('/{podcast_id}/{episode_file_name}/create_transcript', handle_transcription_request)])
app.add_routes([web.post('/tts', handle_text_to_speech_request)])

# Start the server
web.run_app(app, port=PORT)
