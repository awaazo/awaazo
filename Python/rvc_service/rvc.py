import os
from dotenv import load_dotenv
from scipy.io import wavfile
from rvc_service.configs.config import Config
from rvc_service.infer.modules.vc.modules import VC

def get_speaker_model_path(speaker_name,base_path):
    """
    Returns the file path of the given speaker's model.

    Args:
        speaker_name (str): The name of the speaker.
        base_path (str): The base path where the models are stored.

    Returns:
        str: The file path of the speaker's model.

    Raises:
        Exception: If no model exists for the given speaker name.
    """
    try:
        
        # Define the speaker's model path
        speaker_model_path = f'{base_path}/{speaker_name}/{speaker_name}.pth'

        # Check if the speaker's model exists
        if not os.path.isfile(speaker_model_path):
            print(f"speaker_model_path: {speaker_model_path} \n")
            raise Exception(f'No model exists for the given speaker name.')

        return speaker_model_path

    except Exception as e:
        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in rvc.get_speaker_model_path: {e} \n Speaker name: {speaker_name} \n Base path: {base_path} \n")
        raise e
    
def get_speaker_index_path(speaker_name,base_path):
    """
    Returns the file path of the given speaker's index.

    Args:
        speaker_name (str): The name of the speaker.
        base_path (str): The base path where the indexes are stored.

    Returns:
        str: The file path of the speaker's index.

    Raises:
        Exception: If no index exists for the given speaker name.
    """
    try:
        # Define the speaker's index path
        speaker_index_path = f'{base_path}/{speaker_name}/{speaker_name}.index'

        # Check if the speaker's index exists
        if not os.path.isfile(speaker_index_path):
            print(f"speaker_index_path: {speaker_index_path} \n")
            raise Exception(f'No index exists for the given speaker name.')

        return speaker_index_path

    except Exception as e:
        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in rvc.get_speaker_index_path: {e} \n Speaker name: {speaker_name} \n Base path: {base_path} \n")
        raise e
    
def clone_voice(audio_file_path,speaker_name,base_path,index_rate,filter_radius,resample_sr,rms_mix_rate,protect):
    """
    Clone the voice from the given audio file using the specified parameters.

    Parameters:
        audio_file_path (str): The path of the input audio file.
        speaker_name (str): The name of the speaker.
        base_path (str): The base path for the speaker model and index.
        index_rate (int): The rate at which the index is generated.
        filter_radius (int): The radius of the filter used for voice conversion.
        resample_sr (int): The target sampling rate for the converted voice.
        rms_mix_rate (float): The rate at which the RMS of the converted voice is mixed with the original voice.
        protect (bool): Flag indicating whether to protect the converted voice.

    Raises:
        Exception: If an error occurs during the voice cloning process.

    Returns:
        None
    """
    try:
        print("-------------------- Starting RVC --------------------")

        # Get the file name
        file_name = audio_file_path.split('.wav')[0]

        # Define the new audio file path
        new_audio_file_path = f'{file_name}_rvc.wav'

        # Get the model path
        model_path = get_speaker_model_path(speaker_name,base_path)

        # Get the index path
        index_path = get_speaker_index_path(speaker_name,base_path)

        # Define the status file path
        status_file_path = f'{file_name}_rvc_status.txt'

        # Create a status file to indicate that the rvc is in progress
        with open(status_file_path, 'w') as f:
            f.write('In progress')
            f.close()

        # Load .env file
        load_dotenv()

        # Load config
        config = Config()
        
        # Init VC
        vc = VC(config)

        # Get VC
        vc.get_vc(model_path,protect,protect)
        
        # Do RVC
        _, wav_opt = vc.vc_single(
            sid=0,
            input_audio_path=audio_file_path,
            f0_up_key=0,
            f0_file=None,
            f0_method="rmvpe",
            file_index=index_path,
            file_index2=None,
            index_rate=index_rate,
            filter_radius=filter_radius,
            resample_sr=resample_sr,
            rms_mix_rate=rms_mix_rate,
            protect=protect,
        )

        print(f"_: {_}\n")

        # Write the new audio file to the new audio file path with the same sampling rate and number of channels as the original audio file
        wavfile.write(new_audio_file_path, wav_opt[0], wav_opt[1])

        # Rename the new audio file to the original file name
        os.remove(audio_file_path)
        os.rename(new_audio_file_path, audio_file_path)
        
        # Once the rvc is complete, delete the status file
        os.remove(status_file_path)

        print("RVC request complete")
        print("-------------------- RVC Complete --------------------")

    except Exception as e:
        # If an error occurs, update the status file with the error message
        with open(status_file_path, 'w') as f:
            f.write('Error\n')
            f.write(str(e))
            f.close()

        # If an error occurs, print the error message to the console and raise it again
        print(f"Error in rvc.clone_voice: {e} \n Audio file path: {audio_file_path} \n Speaker name: {speaker_name} \n Base path: {base_path} \n")
        print(f"file_name: {file_name} \n new_audio_file_path: {new_audio_file_path} \n model_path: {model_path} \n index_path: {index_path} \n status_file_path: {status_file_path} \n")
        raise e