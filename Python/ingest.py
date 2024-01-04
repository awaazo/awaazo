from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
import json
import os
os.environ["OPENAI_API_KEY"] = ""
from langchain.chat_models import ChatOpenAI
llm = ChatOpenAI(model_name="gpt-3.5")

# Data Ingestion
from langchain.document_loaders import DirectoryLoader

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

embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents, 
    embeddings,
    persist_directory="./vectorstore",
    collection_name=episode_id
    )
vectorstore.persist()
print("Vectorstore persisted")
print("Vectostore collections: " + str(vectorstore._collection))

print("Answering questions")

general_system_template = r""" 
Given a specific context, please give a short answer to the question. Kanye West is a rapper, producer, and fashion designer. You have context of him speaking with Joe Rogan in a transcript. 
Pretend you are Joe Rogan answering the question as if you just finished interviewing Kanye West and someone asked you the question. Make sure to act like Joe Rogan in your answer by using his tone and style of speaking.
 ----
{context}
----
"""
general_user_template = "Question:```{question}```"
messages = [
            SystemMessagePromptTemplate.from_template(general_system_template),
            HumanMessagePromptTemplate.from_template(general_user_template)
]
qa_prompt = ChatPromptTemplate.from_messages( messages )

# Initialise Langchain - Conversation Retrieval Chain
qa = ConversationalRetrievalChain.from_llm(ChatOpenAI(temperature=0.1), vectorstore.as_retriever(), combine_docs_chain_kwargs={"prompt": qa_prompt})

response = qa({"question": "What is this podcast transcript about?", "chat_history": []})
print("\nQuestion: " + response.get("question") + "\nAnswer: " + response.get("answer"))

response = qa({"question": "Where in the podcast does he talk about his presidential run?", "chat_history": []})
print("\nQuestion: " + response.get("question") + "\nAnswer: " + response.get("answer"))

response = qa({"question": "What are Kanye's thoughts on religion?", "chat_history": []})
print("\nQuestion: " + response.get("question") + "\nAnswer: " + response.get("answer"))

response = qa({"question": "What did kanye mean when he mentioned Oprah Winfrey?", "chat_history": []})
print("\nQuestion: " + response.get("question") + "\nAnswer: " + response.get("answer"))
