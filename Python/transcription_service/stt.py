import json
import whisper
import os
import whisperx
import torch
import datetime

def create_transcript(audio_path):
    """
    Transcribe an audio file using Whisper and save the transcript to a JSON file.

    Parameters:
        audio_path (str): The path to the audio file to transcribe.

    Returns:
        None    
    """
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

def create_transcript_whisperx(audio_path,  model_name="base", batch_size=4, compute_type="int8", device="cpu"):
    """
    Transcribe an audio file using WhisperX and save the transcript to a JSON file.
    Rapidly transcribes audio files using WhisperX with word alignments and eventually adds speaker labels.
    
    Parameters:
        audio_path (str): The path to the audio file to transcribe. Required.
        model_name (str): The name of the WhisperX model to use. Default is "base".
        batch_size (int): The batch size to use for transcription. Default is 4.
        compute_type (str): The compute type to use for transcription. Default is "int8".
        device (str): The device to use for transcription. Default is "cpu".
        
    Returns:
        None    
    
    """
    try:
        time0 = datetime.datetime.now()

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

        print(f'Creating transcript using WhisperX for {audio_path}')

        # Check for CUDA, otherwise use CPU
        if torch.cuda.is_available():
            device = "cuda"
            batch_size = 16
            compute_type = "float16"

        print(f"Device: {device}\n Batch Size: {batch_size}\n Compute Type: {compute_type}\n")

        # Load the model
        model = whisperx.load_model(model_name, device, compute_type=compute_type)
        
        # Transcribe the audio file
        audio = whisperx.load_audio(audio_path)
        result = model.transcribe(audio, batch_size=batch_size)
        
        # Once the transcript is created, align the words
        model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
        result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

        # Save the transcript to a json file
        json.dump(result["segments"], open(transcript_file_path, 'w'))

        # Once the transcript is created, delete the status file
        os.remove(status_file_path)

        time1 = datetime.datetime.now()

        # Assign the Speaker labels
        diarize_model = whisperx.DiarizationPipeline(use_auth_token="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",device=device)
        diarize_segments = diarize_model(audio)
        result = whisperx.assign_word_speakers(diarize_segments,result)

        # Save the transcript to a json file
        json.dump(result["segments"], open(transcript_file_path, 'w'))

        time2 = datetime.datetime.now()

        print(f"Transcription time: {time1-time0}")
        print(f"Diarization time: {time2-time1}")
        print(f"Total time: {time2-time0}")
        print(f"Transcript saved to {transcript_file_path}")

    except Exception as e:
        # If an error occurs, update the status file with the error message
        with open(status_file_path, 'w') as f:
            f.write('Error\n')
            f.write(str(e))
            f.close()