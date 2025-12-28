# 📄 RAG Document Assistant

A Retrieval-Augmented Generation (RAG) system built to query documents using semantic search.

This project demonstrates how documents can be ingested, embedded, and searched using vector similarity, with a simple Streamlit frontend for interaction.

> 🚧 Note: LLM-based answer generation is under development.
> The retrieval pipeline and UI are fully functional.

---

## ✨ Features
- PDF document ingestion
- Text cleaning and chunking
- Embedding generation using Sentence Transformers
- FAISS-based semantic retrieval
- Modular RAG pipeline
- Streamlit frontend

---

## 🧱 Tech Stack
- Python
- Sentence-Transformers
- FAISS
- Streamlit
- Gemini API / Local LLM (planned)

---

## 📂 Project Structure
rag_document_assistant/  
├── ingest/  
├── embeddings/  
├── rag/  
├── ui/  
└── main.py  
└── requirements.txt


---

## ▶️ How to Run Locally

```bash
pip install -r requirements.txt
streamlit run ui/app.py
