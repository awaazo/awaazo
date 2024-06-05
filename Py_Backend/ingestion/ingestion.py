import os
from dotenv import load_dotenv
from langchain.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings




def ingest_document(document):
    try:
        print("------------ Ingesting document ------------")

        # Check the document file extension
        file_extension = document.filename.split(".")[-1]

        # Load HuggingFace API key
        HF_API_KEY = os.getenv("HF_API_KEY")

        if not HF_API_KEY:
            raise ValueError("HF_API_KEY not found in environment variables")
        
        



    except Exception as e:
        print(f"Exception: {e}")
        raise e
    

def ingest_documents(documents):
    try:
        print("------------ Ingesting documents ------------")

        # Load environment variables
        load_dotenv("../.env")


        for document in documents:
            ingest_document(document)



    except Exception as e:
        print(f"Exception: {e}")
        raise e