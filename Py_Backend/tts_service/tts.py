from pathlib import Path
import gc , os, sys, argparse, requests

def download_models():
	rvc_files = ['hubert_base.pt', 'rmvpe.pt']

	for file in rvc_files: 
		if(not os.path.isfile(f'./tts_service/models/{file}')):
			print(f'Downloading{file}')
			r = requests.get(f'https://huggingface.co/lj1995/VoiceConversionWebUI/resolve/main/{file}')
			with open(f'./tts_service/models/{file}', 'wb') as f:
					f.write(r.content)

	xtts_files = ['vocab.json', 'config.json', 'dvae.path', 'mel_stats.pth', 'model.pth']

	for file in xtts_files:
		if(not os.path.isfile(f'./tts_service/models/xtts/{file}')):
			print(f'Downloading {file}')
			r = requests.get(f'https://huggingface.co/coqui/XTTS-v2/resolve/v2.0.2/{file}')
			with open(f'./tts_service/models/xtts/{file}', 'wb') as f:
				f.write(r.content)

class TextToSpeech:
    def __init__(self):
        self.current_model={}
		self.cpt = {}
		self.version = {}

		
        [Path(_dir).mkdir(parents=True, exist_ok=True) for _dir in ['./tts_service/models/xtts', './tts_service/voices', './tts_service/rvcs']]
        download_models()