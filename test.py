import google.generativeai as genai

for m in genai.list_models():
    print(m.name)
