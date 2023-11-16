import json
import whisper

def create_transcript(audio_path):
    try:
        # Get the file name
        file_name = audio_path.split('.')[0]

        # Load the model
        model = whisper.load_model("base")

        # Transcribe the audio file
        result = model.transcribe(audio_path,verbose=True)

        # Save the transcript to a json file
        json.dump(result['segments'], open(f'{file_name}.json', 'w'))
    
        return "Success"
    except Exception as e:
        return e



