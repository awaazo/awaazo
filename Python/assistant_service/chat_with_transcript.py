import os
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
<<<<<<<< HEAD:Python/assistant_service/chat.py
========
import os
import json
>>>>>>>> c5ff93bc271770a70ef2c24154f043094246cf9a:Python/assistant_service/chat_with_transcript.py
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

<<<<<<<< HEAD:Python/assistant_service/chat.py
def chat(podcast_id, episode_id, prompt):
========
def chat_with_transcript(episode_id, persist_directory, verbose=True):
    """
    A chat function that uses a language model and vector store to answer questions based on a specific transcript.

    :param episode_id: The identifier for the episode transcript.
    :param persist_directory: Directory where the vector store is persisted.
    :param verbose: If True, enables verbose output for debugging.
    """

    load_dotenv()
   
    if 'OPENAI_API_KEY' not in os.environ:
        raise ValueError("OPENAI_API_KEY not found in environment variables")

>>>>>>>> c5ff93bc271770a70ef2c24154f043094246cf9a:Python/assistant_service/chat_with_transcript.py
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
<<<<<<<< HEAD:Python/assistant_service/chat.py

        persist_directory = f"{BASE_DIR}/{podcast_id}/{episode_id}_vectorstore"
        collection_name = f"vector_{episode_id}_store"

        # Access the vectorstore
        vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory, collection_name=collection_name)
========
        vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory, collection_name=episode_id)
>>>>>>>> c5ff93bc271770a70ef2c24154f043094246cf9a:Python/assistant_service/chat_with_transcript.py
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
<<<<<<<< HEAD:Python/assistant_service/chat.py

        qa_prompt = ChatPromptTemplate.from_messages(messages)
        
========
>>>>>>>> c5ff93bc271770a70ef2c24154f043094246cf9a:Python/assistant_service/chat_with_transcript.py
        llm = ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100)
        
        qa = RetrievalQA.from_chain_type(llm=llm, 
                                         chain_type="stuff",
                                         retriever=retriever,
                                         callbacks=[StreamingStdOutCallbackHandler()],
                                         verbose=verbose,
                                         )

<<<<<<<< HEAD:Python/assistant_service/chat.py

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
========
        print("Type 'exit' to end the chat session.")
        while True:
            user_question = input("\nAsk a question: ")
            if user_question.lower() == 'exit':
                break
            response = qa.run(user_question)
            print(response)
    except FileNotFoundError as e:
        print(f"File not found error: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# chat_with_transcript("kanye_west_joe_rogan", "vectorstore", verbose=True)

# if __name__ == "__main__":
#     episode_id = "example_episode"  
#     persist_directory = "vectorstore"  
#     chat_with_transcript(episode_id, persist_directory)




>>>>>>>> c5ff93bc271770a70ef2c24154f043094246cf9a:Python/assistant_service/chat_with_transcript.py
