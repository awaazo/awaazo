import os
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_groq import ChatGroq

def chat(podcast_id, episode_id, prompt):
    """
    Starts a chat with the given prompt and returns the response.

    Args:
        podcast_id (str): The id of the podcast.
        episode_id (str): The id of the episode.
        prompt (str): The prompt to start the chat with.

    Raises:
        Exception: If an error occurs during the chat process.

    Returns:
        str: The response from the chat.
    """
    try:
        print("------------ Starting chat ------------")

        podcast_id = str(podcast_id)
        episode_id = str(episode_id)
        prompt = str(prompt)

        BASE_DIR = './ServerFiles/Podcasts'

        # Load environment variables
        load_dotenv()

        # Load OpenAI API key
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        print(f"Loaded OPENAI_API_KEY...")
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        print(f"Loaded GROQ_API_KEY")
        
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        persist_directory = f"{BASE_DIR}/{podcast_id}/{episode_id}_vectorstore"

        if not os.path.exists(persist_directory):
            raise FileNotFoundError(f"Vectorstore not found at {persist_directory}")

        collection_name = f"vector_{episode_id}_store"

        # Create the language model and embeddings

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cuda"}
        )

        #embeddings = OpenAIEmbeddings()

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
        
        #llm = ChatOpenAI(temperature=0.1, streaming=True, max_tokens=100)
        llm = ChatGroq(temperature=0.2, groq_api_key=GROQ_API_KEY, max_tokens=200, model_name="mixtral-8x7b-32768")
        
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, callbacks=[StreamingStdOutCallbackHandler()], verbose=True,)

        prompt = f"{prompt} (answer with a maximum of 200 tokens)"

        print(f"Prompt: {prompt}")

        response  = qa.run(prompt, callbacks=[StreamingStdOutCallbackHandler()])
        
        print("------------ Chat ended ------------")
        return response
    except Exception as e:
        print(f"episode_id: {episode_id} \n podcast_id: {podcast_id} \n prompt: {prompt} \n")
        print(f"An error occurred: {e}")
        raise e
