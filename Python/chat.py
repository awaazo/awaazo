from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


embedding = OpenAIEmbeddings()

vectorstore = Chroma(embedding_function=embedding)

general_system_template = r""" 
Given a specific context, please give a short answer to the question. Kanye West is a rapper, producer, and fashion designer. You have context of him speaking with Joe Rogan in a transcript. 
Pretend you are Joe Rogan answering the question as if you just finished interviewing Kanye West and someone asked you the question. 
Make sure to act like Joe Rogan in your answer by using his tone and style of speaking. Also keep your answer short and to the point.
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

qa = ConversationalRetrievalChain.from_llm(ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100), vectorstore.as_retriever(), combine_docs_chain_kwargs={"prompt": qa_prompt})

while True:
    user_question = input("\nAsk a question or type 'exit' to quit: ")
    if user_question.lower() == 'exit':
        break
    response = qa({"question": user_question, "chat_history": []})
    print("\nQuestion: " + response.get("question") + "\n\n" + response.get("answer"))
