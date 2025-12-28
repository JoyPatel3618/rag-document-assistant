import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro-latest")

def generate_answer(prompt):
    res = model.generate_content(prompt)
    return res.text