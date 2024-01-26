import uuid
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
import json
import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

def process_transcript(episode_id):
    # Load environment variables
    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY not found in environment variables")

    try:
        llm = ChatOpenAI()
        embeddings = OpenAIEmbeddings()

        # Load and process the JSON transcript
        with open(f'./transcripts/{episode_id}.json', 'r') as file:
            data = json.load(file)

        text_values = [entry['text'] for entry in data]
        combined_text = '\n'.join(text_values)

        with open(f'./transcripts/{episode_id}.txt', 'w') as output_file:
            output_file.write(combined_text)
        print("Transcript parsed as text")

        # Load documents from the directory
        transcript_loader = DirectoryLoader('./transcripts', glob="**/*.txt")
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

        seen_ids = set()
        unique_docs = [doc for doc, id in zip(documents, ids) if id not in seen_ids and (seen_ids.add(id) or True)]

        # Create and persist the vectorstore
        vectorstoreDB = Chroma.from_documents(
            unique_docs, 
            embeddings, 
            ids=unique_ids, 
            persist_directory='vectorstore',
            collection_name=episode_id,
        )
        vectorstoreDB.persist()
        retriever = vectorstoreDB.as_retriever()
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

        print("Vectorstore persisted")
        print("Vectorstore collections: " + str(vectorstoreDB._collection.count()))
    except Exception as e:
        print(f"An error occurred: {e}")