import uuid
import json
import os
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

def process_transcript(podcast_id,episode_id):
    try:
        print("------------ Ingesting transcript ------------")

        BASE_DIR = './ServerFiles/Podcasts'

        # Load environment variables
        load_dotenv()
        
        # Load OpenAI API key
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        print(f"Loaded OPENAI_API_KEY...")
        
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        # Create the language model and embeddings
        llm = ChatOpenAI()
        embeddings = OpenAIEmbeddings()

        # Check if the transcript exists
        if not os.path.exists(f'{BASE_DIR}/{podcast_id}/{episode_id}.json'):
            print(f"Transcript not found at {BASE_DIR}/{podcast_id}/{episode_id}.json")
            raise FileNotFoundError(f"Transcript not found at {BASE_DIR}/{podcast_id}/{episode_id}.json")

        # Load and process the JSON transcript
        with open(f'{BASE_DIR}/{podcast_id}/{episode_id}.json', 'r') as file:
            data = json.load(file)

        # Extract the speaker and text values from the JSON transcript
        #speaker_values = [entry['speaker'] for entry in data]
        text_values = [entry['text'] for entry in data]

        # Combine the speaker and text values into a single string
        combined_text = ''
        for i in range(len(text_values)):
            # if(len(speaker_values)>0):
            #     combined_text += f"{speaker_values[i]}: {text_values[i]}\n"
            combined_text += f"{text_values[i]}\n"

        with open(f'{BASE_DIR}/{podcast_id}/{episode_id}_data.txt', 'w') as output_file:
            output_file.write(combined_text)

        print("Transcript parsed to text")

        # Load documents from the directory
        transcript_loader = DirectoryLoader(f'{BASE_DIR}/{podcast_id}', glob=f"**/{episode_id}_data.txt")
        loaders = [transcript_loader]
        documents = []
        for loader in loaders:
            documents.extend(loader.load())
            print(f"Loaded {len(documents)} documents")

        # Split and process documents
        text_splitter = CharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
        documents = text_splitter.split_documents(documents)

        print("Documents split into chunks")

        ids = [str(uuid.uuid5(uuid.NAMESPACE_DNS, doc.page_content)) for doc in documents]
        unique_ids = list(set(ids))

        print(f"Unique ids loaded: {len(unique_ids)}")

        seen_ids = set()

        print("Removing duplicate documents")

        unique_docs = [doc for doc, id in zip(documents, ids) if id not in seen_ids and (seen_ids.add(id) or True)]
        
        print(f"Unique docs loaded: {len(unique_docs)}")

        # Create and persist the vectorstore
        vectorstoreDB = Chroma.from_documents(
            unique_docs, 
            embeddings, 
            ids=unique_ids, 
            persist_directory=f"{BASE_DIR}/{podcast_id}/{episode_id}_vectorstore",
            collection_name="vector_"+str(episode_id)+"_store",
        )

        vectorstoreDB.persist()

        # Delete the transcript text file to save space
        os.remove(f'{BASE_DIR}/{podcast_id}/{episode_id}_data.txt')

        print("Vectorstore persisted")
        print("Vectorstore collections: " + str(vectorstoreDB._collection.count()))
        print("------------ Ingestion complete ------------")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise e