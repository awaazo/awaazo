from pathlib import Path


class TextToSpeech:
    def __init__(self):
        [Path(_dir).mkdir(parents=True, exist_ok=True) for _dir in ['./models/xtts', './voices', './rvcs']]