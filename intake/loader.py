from PyPDF2 import PdfReader

def load_pdf(path):
    reader = PdfReader(path)
    text=[]
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)
    return "\n".join(text)

def load_text(path):
    with open(path,"r",encoding="utf-8") as f:
        return f.read() 