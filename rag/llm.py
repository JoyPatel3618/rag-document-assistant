import requests
import json 

OLLAMA_URL="http://localhost:11434/api/generate"
MODEL="mistral"

def generate_answer(prompt):
    payload = {
        "model" : MODEL,
        "prompt" : prompt,
        "stream" : False,
        "options" : {
            "temperature" : 0.2,
            "num_predict" : 200
        }
    }

    try : 
        response = requests.post(OLLAMA_URL, json=payload, timeout=300)
        response.raise_for_status()

        data = response.json()
        return data.get("response","").strip()
    except Exception as e:
        return f"[LLM Error] {str(e)}"