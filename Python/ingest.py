import uuid
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
import json
import os
from dotenv import load_dotenv
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
from langchain.chains import RetrievalQA

# Data Ingestion
from langchain.chat_models import ChatOpenAI
llm = ChatOpenAI()

embeddings = OpenAIEmbeddings()

episode_id = "kanye_west_joe_rogan"

# Load the JSON data from the file
with open(f'./transcripts/{episode_id}.json', 'r') as file:
    data = json.load(file)

# Extract the 'text' values from each dictionary in the list
text_values = [entry['text'] for entry in data]

# Combine the text values into a single string
combined_text = '\n'.join(text_values)

# Write the combined text to a .txt file
with open(f'./transcripts/{episode_id}.txt', 'w') as output_file:
    output_file.write(combined_text)
print("Transcript parsed as text")

transcript_loader = DirectoryLoader('./transcripts', glob="**/*.txt")

loaders = [transcript_loader]
documents = []
for loader in loaders:
    documents.extend(loader.load())
    print(f"Loaded {len(documents)} documents")

# Chunk and Embeddings
text_splitter = CharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
documents = text_splitter.split_documents(documents)
print("Documents split into chunks")

# Create a list of unique ids for each document based on the content
ids = [str(uuid.uuid5(uuid.NAMESPACE_DNS, doc.page_content)) for doc in documents]
unique_ids = list(set(ids))

# Ensure that only docs that correspond to unique ids are kept
seen_ids = set()
unique_docs = [doc for doc, id in zip(documents, ids) if id not in seen_ids and (seen_ids.add(id) or True)]

# Add the unique documents to your database
vectorstoreDB = Chroma.from_documents(
    unique_docs, 
    embeddings, 
    ids=unique_ids, 
    persist_directory='vectorstore',
    collection_name=episode_id,
    )
vectorstoreDB.persist()
retriever = vectorstoreDB.as_retriever()
qa = RetrievalQA.from_chain_type(llm=llm, 
                                 chain_type="stuff",
                                 retriever=retriever)

print("Vectorstore persisted")
print("Vectostore collections: " + str(vectorstoreDB._collection.count()))

print("Run chat.py to use the vector db to answer questions")
 