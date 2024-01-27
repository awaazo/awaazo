from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
import os
import json
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

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

    try:
        embeddings = OpenAIEmbeddings()
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
        llm = ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100)
        qa = RetrievalQA.from_chain_type(llm=llm, 
                                         chain_type="stuff",
                                         retriever=retriever,
                                         callbacks=[StreamingStdOutCallbackHandler()],
                                         verbose=verbose,
                                         )

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




