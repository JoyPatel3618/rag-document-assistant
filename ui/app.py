import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


import streamlit as st
from intake.loader import load_pdf
from rag.pipeline import MainPipeline

st.set_page_config(page_title="RAG Document Assistant",layout="wide")

st.title("RAG Doc Assistant ")
st.write("Upload document and ask questions using RAG")

pipeline = MainPipeline()

file_uploader = st.file_uploader("PDF Doc Reqquied",type=["pdf"])

if file_uploader:
    with open("temp.pdf", "wb") as f:
        f.write(file_uploader.read())

    text = load_pdf("temp.pdf")
    pipeline.doc_intake(text)

    st.success("Document processed successfully!")

    question = st.text_input("Ask a question from the document:")

    if question:
        with st.spinner("Retrieving relevant information..."):
            answer, chunks = pipeline.answer(question)

        st.subheader("Answer : ")
        st.write(answer)
