import os
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

def chat(podcast_id, episode_id, prompt):
    try:
        print("------------ Starting chat ------------")

        BASE_DIR = './ServerFiles/Podcasts'

        # Load environment variables
        load_dotenv()

        # Load OpenAI API key
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        print(f"Loaded OPENAI_API_KEY...")
        
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        # Create the language model and embeddings
        embeddings = OpenAIEmbeddings()

        persist_directory = f"{BASE_DIR}/{podcast_id}/{episode_id}_vectorstore"
        collection_name = f"vector_{episode_id}_store"

        # Access the vectorstore
        vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory, collection_name=collection_name)

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

        qa_prompt = ChatPromptTemplate.from_messages(messages)
        
        llm = ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100)
        
        qa = RetrievalQA.from_chain_type(llm=llm, 
                                         chain_type="stuff",
                                         retriever=retriever,
                                         callbacks=[StreamingStdOutCallbackHandler()],
                                         verbose=True,
                                         )

        prompt = f"{prompt} (answer with a maximum of 100 tokens)"

        print(f"Prompt: {prompt}")

        response  = qa.run(prompt, callbacks=[StreamingStdOutCallbackHandler()])

        # while True:
        #     user_question = input("\nAsk a question or type 'exit' to quit: ")
        #     if user_question.lower() == 'exit':
        #         break
        #     response = qa.run(user_question, callbacks=[StreamingStdOutCallbackHandler()])
        #     print(response)
        
        print("------------ Chat ended ------------")
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        raise e
