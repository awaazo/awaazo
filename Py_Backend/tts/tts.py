import torch
from TTS.api import TTS
from pathlib import Path
from .rvc import Config, load_hubert, get_vc, rvc_infer
import gc , os, sys, argparse, requests
from scipy.io import wavfile
from scipy import stats
import numpy as np
from pydub import AudioSegment
import time
import ffmpeg





class RVC_Data:
	def __init__(self):
		self.current_model = {}
		self.cpt = {}
		self.version = {}
		self.net_g = {} 
		self.tgt_sr = {}
		self.vc = {} 
		self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
		self.config = Config(self.device, self.device!='cpu')

	def load_cpt(self, modelname, rvc_model_path):
		if self.current_model != modelname:
				print("Loading new model")
				del self.cpt, self.version, self.net_g, self.tgt_sr, self.vc
				self.cpt, self.version, self.net_g, self.tgt_sr, self.vc = get_vc(self.device, self.config.is_half, self.config, rvc_model_path)
				self.current_model = modelname



class Text_To_Speech():
	def __init__(self,speaker="xtts"):

		# Check if the device is GPU or CPU
		device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

		# Load the TTS model. If a fine-tuned model for the speaker is available, load it. Otherwise, load the default model.
		if os.path.isdir(f"./tts_service/models/{speaker}"):
			self.tts = TTS(model_path=f"./tts_service/models/{speaker}", config_path=f"./tts_service/models/{speaker}/config.json").to(device)
		else:
			self.tts = TTS(model_path="./tts_service/models/xtts", config_path="./tts_service/models/xtts/config.json").to(device)

		self.rvc_data = RVC_Data()
		self.hubert_model = load_hubert(device, self.rvc_data.config.is_half, "./tts_service/models/hubert_base.pt")

		self.download_models()

	def run_tts(self, rvc, voice, text, pitch_change = 0, index_rate = 0.75, language = 'en', audio_name = "output"):
		
		
		
		audio = self.tts.tts_to_file(
			text=text, 
			speaker_wav=f"./tts_service/voices/{voice}.wav", 
			language=language, 
			file_path=f"./tts_service/{audio_name}.wav")
		
		self.voice_change(rvc, pitch_change, index_rate, audio_name)

		#self.combine_audio(audio_name)



	def voice_change(self, rvc, pitch_change, index_rate, audio_name):
		model_name = os.path.splitext(rvc)[0]
		rvc_model_path = f"./tts_service/rvcs/{model_name}.pth"
		rvc_index_path = f"./tts_service/rvcs/{model_name}.index" if os.path.isfile("./tts_service/rvcs/{modelname}.index") and index_rate != 0 else ""

		self.rvc_data.load_cpt(model_name, rvc_model_path)

		rvc_infer(
			index_path=rvc_index_path, 
			index_rate=index_rate, 
			input_path=f"./tts_service/{audio_name}.wav", 
			output_path=f"./tts_service/{audio_name}.wav", 
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

	def generate_noise(self, audio_name, chunk_number):

		audio = AudioSegment.from_file(f"./tts_service/{audio_name}_{chunk_number}.wav")

		sample_rate = 44100
		length_in_seconds = int(len(audio) / 1000)
		amplitude = 11
		noise = stats.truncnorm(-1, 1, scale=min(2**16, 2**amplitude)).rvs(sample_rate * length_in_seconds)
		wavfile.write('./tts_service/noise.wav', sample_rate, noise.astype(np.int16))

		noise = AudioSegment.from_file('./tts_service/noise.wav')
		quiet_noise = noise - 40

		audio = audio.overlay(quiet_noise)
		audio.export(f"./tts_service/{audio_name}_{chunk_number}.wav", format="wav")

	def combine_audio(self, audio_name, chunk_number):
		

		# Combine the audio files
		combined_audio = AudioSegment.empty()
		for i in range(chunk_number):
			audio = AudioSegment.from_file(f"./tts_service/{audio_name}_{i}.wav")
			combined_audio += audio

		# Export the combined audio
		combined_audio.export(f"./tts_service/{audio_name}_{chunk_number}.wav", format="wav")




	def touchup_audio(self, audio_name, chunk_number):
		input_audio = f"./tts_service/{audio_name}_{chunk_number}.wav"
		output_audio = f"./tts_service/{audio_name}.wav"

		speed = 1.05


		# Change the speed of the audio
		stream = ffmpeg.input(input_audio)
		stream = ffmpeg.filter_(stream, 'atempo', speed)
		stream = ffmpeg.filter_(stream, 'equalizer', frequency=1000, width_type='h', width=200, gain=10)
		stream = ffmpeg.filter_(stream, 'dynaudnorm')
		stream = ffmpeg.output(stream, output_audio)

		ffmpeg.run(stream, overwrite_output=True)



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
		
		
	
async def generate_audio(request):
	
	t0 = time.time()
	print(t0)

	tts = Text_To_Speech(request.speaker)

	t1 = time.time()
	print(t1)
	print(f"Initalization time: {t1 - t0}")

	# Break the text into chunks of sentences
	chunks = request.text.split(".")

	# Remove empty chunks
	chunks = [chunk for chunk in chunks if chunk.strip() != ""]

	# Add a period to the end of each chunk
	chunks = [chunk + "." for chunk in chunks]

	print("\n")
	print(chunks)
	print("\n")

	# Generate audio for each chunk and append the audio to one another
	for i, chunk in enumerate(chunks):

		chunk = str(chunk.strip())

		print(f"Generating audio for chunk {i+1}/{len(chunks)}")
		print(chunk)
		

		tts.run_tts(
			rvc=request.speaker, 
			voice=request.speaker, 
			text=chunk,
			pitch_change=request.pitch_change,
			index_rate=request.index_rate,
			language=request.language,
			audio_name=f"{request.audio_name}_{i}")
		

	tts.combine_audio(audio_name=request.audio_name, chunk_number=len(chunks) - 1)
	tts.generate_noise(audio_name=f"{request.audio_name}", chunk_number=len(chunks) - 1)	
	tts.touchup_audio(audio_name=request.audio_name, chunk_number=len(chunks) - 1)
	


	t2 = time.time()

	# Return the chunks
	return {"time": time.time() - t0, "time_init": t1 - t0, "time_tts": t2 - t1}


	#return {"message": "Audio generated successfully"}