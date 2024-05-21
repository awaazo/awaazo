from pydantic import BaseModel
from fastapi import FastAPI


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


# Create an instance of FastAPI
app = FastAPI(
    swagger_ui_parameters={"syntaxHighlight.theme": "monokai"},
    openapi_tags=tags_metadata)



class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None


# region Text to Speech endpoints

@app.get("/tts", 
        summary="Root endpoint for Text to Speech",
        description="Root endpoint for Text to Speech",
        response_model= Item,
        tags=["Text to Speech"])
async def read_root():
    return {"message": "Hello World"}



@app.get("/tts/{text}", tags=["Text to Speech"])
async def read_item(text: str):
    return {"text": text}


# endregion