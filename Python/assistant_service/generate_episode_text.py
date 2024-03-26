import os
from dotenv import load_dotenv
from groq import Groq

def generate_episode_text(podcast_name, podcast_description, prompt):
   

    try:
        print("------------ Starting episode text generation ------------")

        prompt = str(prompt)

        # Load environment variables
        load_dotenv()

        # Load Groq API key
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        print(f"Loaded GROQ_API_KEY")
        
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        # Create the Groq client
        client = Groq(api_key=GROQ_API_KEY)


        prompt = "Prompt: " + prompt + "\n\n" + "Given the prompt above, please generate the text for a podcast monologue. The text must use at most 1000 tokens. The podcast is named " + podcast_name + " and its description is: " + podcast_description+ "\n\n. The text must be in one paragraph."

        # Generate the episode text
        response = client.chat.completions.create(model="mixtral-8x7b-32768",messages=[{"role":"user","content":prompt}], temperature=0.5, max_tokens=1000)

        
        print("------------ Text Generation ended ------------")
        return response.choices[0].message.content.replace("\n", " ").replace("\"", "'")
    except Exception as e:
        print(f"prompt: {prompt} \n")
        print(f"An error occurred: {e}")
        raise e
    

