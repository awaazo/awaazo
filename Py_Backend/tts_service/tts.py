import torch
from TTS.api import TTS
from pathlib import Path
from .rvc import Config, load_hubert, get_vc, rvc_infer
import gc , os, sys, argparse, requests

class RVC_Data:
	def __init__(self):
		self.current_model = {}
		self.cpt = {}
		self.version = {}
		self.net_g = {} 
		self.tgt_sr = {}
		self.vc = {} 
		self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
		self.config = Config(self.device, self.device!='cpu')

	def load_cpt(self, modelname, rvc_model_path):
		if self.current_model != modelname:
				print("Loading new model")
				del self.cpt, self.version, self.net_g, self.tgt_sr, self.vc
				self.cpt, self.version, self.net_g, self.tgt_sr, self.vc = get_vc(self.device, self.config.is_half, self.config, rvc_model_path)
				self.current_model = modelname



class Text_To_Speech():
	def __init__(self):

		# Check if the device is GPU or CPU
		device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

		self.tts = TTS(model_path="./tts_service/models/xtts", config_path="./tts_service/models/xtts/config.json").to(device)

		self.rvc_data = RVC_Data()
		self.hubert_model = load_hubert(device, self.rvc_data.config.is_half, "./tts_service/models/hubert_base.pt")

		self.download_models()

	def run_tts(self, rvc, voice, text, pitch_change = 0, index_rate = 0.75, language = 'en'):
		audio = self.tts.tts_to_file(text=text, speaker_wav=f"./tts_service/voices/{voice}", language=language, file_path="./tts_service/output.wav")
		self.voice_change(rvc, pitch_change, index_rate)



	def voice_change(self, rvc, pitch_change, index_rate):
		model_name -= os.path.splitext(rvc)[0]
		rvc_model_path = f"./tts_service/rvcs/{model_name}"
		rvc_index_path = f"./tts_service/rvcs/{model_name}.index" if os.path.isfile("./tts_service/rvcs/{modelname}.index") and index_rate != 0 else ""

		self.rvc_data.load_cpt(model_name, rvc_model_path)

		rvc_infer(
			index_path=rvc_index_path, 
			index_rate=index_rate, 
			input_path="./tts_service/output.wav", 
			output_path="./tts_service/outputrvc.wav", 
			pitch_change=pitch_change, 
			f0_method="rmvpe", 
			cpt=self.rvc_data.cpt, 
			version=self.rvc_data.version, 
			net_g=self.rvc_data.net_g, 
			filter_radius=3, 
			tgt_sr=self.rvc_data.tgt_sr, 
			rms_mix_rate=0.25, 
			protect=0, 
			crepe_hop_length=0, 
			vc=self.rvc_data.vc, 
			hubert_model=self.hubert_model
		)
		gc.collect()


	def download_models(self):
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
		
		
	
