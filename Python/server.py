# Import Python Libraries
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import os

# Import Custom Libraries
import transcription_service.stt

# Server Settings
HOST = "0.0.0.0"
PORT = 8000


class AIServiceHTTP(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urlparse(self.path)
        audioFilePath = parsed_path.path
        full_file_path = os.getcwd()+"/ServerFiles/Podcasts"+audioFilePath

        try:
            print("Path at terminal when executing this file")
            print(os.getcwd() + "\n")

            result = ""

            # Check if the file exists
            if os.path.isfile(full_file_path):
                result = transcription_service.stt.create_transcript(full_file_path)
            else:    
                raise Exception(f'File not found! -> {full_file_path}')
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(f'{result}'.encode())

        except Exception as e:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(f'{e}'.encode())


server = HTTPServer((HOST, PORT), AIServiceHTTP)

print("Server started on port " + str(PORT))

server.serve_forever()
