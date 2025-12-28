import re

def clean_txt(text):
    text = re.sub(r'\s+',' ',text)
    text = text.replace('\x00','')
    return text.strip()