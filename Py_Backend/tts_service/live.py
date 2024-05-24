


import os
import time
import torch
import torchaudio
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

print("Loading model...")
config = XttsConfig()
config.load_json("./tts_service/models/Drinker/config.json")
model = Xtts.init_from_config(config)
model.load_checkpoint(config, checkpoint_dir="./tts_service/models/Drinker", use_deepspeed=False)
model.cuda()

print("Computing speaker latents...")
gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(audio_path=["./tts_service/voices/Drinker.wav"])

print("Inference...")
t0 = time.time()
chunks = model.inference_stream(
    text="Alright, buckle up, folks, because 'Godzilla Minus One' is here, and it's a monster of a movie in the best way possible. Now, this isn't your usual brain-dead blockbuster. No, this film is set in post-war Japan, adding a rich historical backdrop that makes the stakes feel real and personal. The story kicks off with a disgraced kamikaze pilot trying to find his place in a world that's fallen apart. His journey is not just a personal redemption arc, but it’s intertwined with the chaos and destruction that only Godzilla can bring. This movie doesn’t just throw giant lizards at you and call it a day. It digs deeper, delivering a narrative that’s actually worth your time. The filmmakers managed to pull off some impressive visuals on a modest budget. The special effects are top-notch, bringing the King of Monsters to life in a way that feels fresh and terrifying. But the real kicker? The human element. The characters aren’t just cannon fodder—they’re well-developed, their struggles and emotions adding a layer of depth that makes you care about what’s happening on the screen. 'Godzilla Minus One' is a breath of fresh air in a genre that’s often more about spectacle than substance. It’s got heart, it’s got brains, and yes, it’s got plenty of Godzilla-induced mayhem. So, if you're looking for a movie that balances character-driven storytelling with epic monster action, this is the one to watch. Cheers!",
    language="en",
    gpt_cond_latent=gpt_cond_latent,
    speaker_embedding=speaker_embedding,
    speed=1.1,
    enable_text_splitting=True
)

wav_chuncks = []
for i, chunk in enumerate(chunks):
    if i == 0:
        print(f"Time to first chunck: {time.time() - t0}")
    print(f"Received chunk {i} of audio length {chunk.shape[-1]}")
    wav_chuncks.append(chunk)
wav = torch.cat(wav_chuncks, dim=0)
torchaudio.save("test.wav", wav.squeeze().unsqueeze(0).cpu(), 24000)