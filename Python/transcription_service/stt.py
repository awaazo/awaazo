import json
import whisper
import os

# Function to create a transcript from an audio file
def create_transcript(audio_path):
    try:        
        # Get the file name
        file_name = audio_path.split('.')[0]

        # Define the transcript file path
        transcript_file_path = f'{file_name}.json'
        
        # Check if the transcript file already exists
        if os.path.isfile(transcript_file_path):
            return

        # Define the status file path
        status_file_path = f'{file_name}_status.txt'

        # Create a status file to indicate that the transcription is in progress
        with open(status_file_path, 'w') as f:
            f.write('In progress')
            f.close()
        
        # Load the model
        model = whisper.load_model("base")

        # Transcribe the audio file
        result = model.transcribe(audio_path,verbose=True)
        
        # Extract the desired keys from the result
        desired_keys = ['id','seek','start','end','text']
        result = [{key: v for key, v in line.items() if key in desired_keys} for line in result['segments']]

        # Save the transcript to a json file
        json.dump(result, open(transcript_file_path, 'w'))

        # Once the transcript is created, delete the status file
        os.remove(status_file_path)

    except Exception as e:
        # If an error occurs, update the status file with the error message
        with open(status_file_path, 'w') as f:
            f.write('Error\n')
            f.write(str(e))
            f.close()


