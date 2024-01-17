from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
embeddings = OpenAIEmbeddings()

episode_id = "kanye_west_joe_rogan"
persist_directory = "vectorstore"

vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory, collection_name=episode_id)
retriever = vectorstore.as_retriever()

general_system_template = r""" 
You have access to a podcast transcript. Assume you are the host answering the question the user asks you.
 ----
{context}
---
{question}
----
"""
general_user_template = "Question:```{question}```"
messages = [
            SystemMessagePromptTemplate.from_template(general_system_template),
            HumanMessagePromptTemplate.from_template(general_user_template)
]
qa_prompt = ChatPromptTemplate.from_messages( messages )
llm = ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100)
qa = RetrievalQA.from_chain_type(llm=llm, 
                                 chain_type="stuff",
                                 retriever=retriever)

while True:
    user_question = input("\nAsk a question or type 'exit' to quit: ")
    if user_question.lower() == 'exit':
        break
    response = qa.run(user_question)
    print(response)
