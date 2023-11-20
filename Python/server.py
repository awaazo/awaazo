# Import Python Libraries
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from aiohttp import web
import os
import threading

# Import Custom Libraries
import transcription_service.stt

# Server Settings
HOST = "0.0.0.0"
PORT = 8000

# CONSTANTS
CREATE_TRANSCRIPT = "/create_transcript"
PODCASTS_FOLDER_PATH = "/ServerFiles/Podcasts"

# Handles the transcription request
async def handle_transcription_request(request):
    
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

# Create the server instance
app = web.Application()


# Add the routes to the server
app.add_routes([web.get('/{podcast_id}/{episode_file_name}/create_transcript', handle_transcription_request)])

# Start the server
web.run_app(app, port=PORT)
