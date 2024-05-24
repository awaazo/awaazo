from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi import FastAPI
from tts_service.tts import Text_To_Speech, generate_audio as tts_generate_audio
import time
import asyncio


# Tags used to group the endpoints in the Swagger UI
tags_metadata = [
    {
        "name": "Text to Speech",
        "description": "Text to Speech endpoints",
    },
    {
        "name": "Transcription",
        "description": "Transcription endpoints",
    },
    {
        "name": "Ingestion",
        "description": "Ingestion endpoints, used to ingest data into the system",
    }
]

#tts = Text_To_Speech()

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    except Exception as e:
        print(f"Exception: {e}")

# Create an instance of FastAPI
app = FastAPI(
    swagger_ui_parameters={"syntaxHighlight.theme": "monokai"}, 
    openapi_tags=tags_metadata,
    lifespan=lifespan)


# region Models

class GenerateAudioRequest(BaseModel):
    audio_name: str
    text: str
    speaker: str
    pitch_change: int = 0
    index_rate: float = 0.75
    language: str = 'en'

class Speaker(BaseModel):
    name: str
    description: str = None
    language: str

# endregion

# region Text to Speech endpoints

@app.get("/tts/speakers", 
        summary="Get available speakers",
        description="Get available speakers for Text to Speech. The speakers are the voices that can be used to generate the audio from the text.",
        response_model=list[Speaker],
        tags=["Text to Speech"])
async def get_speakers():
    return [{"name": "speaker1", "description": "Speaker 1", "language": "en"},
            {"name": "speaker2", "description": "Speaker 2", "language": "en"}]




@app.post("/tts/generate",
            summary="Generate audio from text",
            description="Generate audio from text using the specified speaker.",
            tags=["Text to Speech"])
async def generate_audio(generate_audio_request: GenerateAudioRequest):
    
    #tts = Text_To_Speech()
    # #tts.run_tts(
    #     rvc=generate_audio_request.speaker, 
    #     voice=generate_audio_request.speaker, 
    #     text=generate_audio_request.text,
    #     pitch_change=generate_audio_request.pitch_change,
    #     index_rate=generate_audio_request.index_rate,
    #     language=generate_audio_request.language)
    return await tts_generate_audio(generate_audio_request)




@app.get("/tts/{text}", tags=["Text to Speech"])
async def read_item(text: str):
    return {"text": text}


# endregion