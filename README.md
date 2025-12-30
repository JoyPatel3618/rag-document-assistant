📄 RAG Document Assistant

A Retrieval-Augmented Generation (RAG) system that allows users to upload documents and ask questions, with answers generated strictly from the document content using semantic search and a local Large Language Model (LLM).

This project demonstrates a complete, modular RAG pipeline — from document ingestion and vector-based retrieval to grounded answer generation — with a simple and interactive Streamlit frontend.

✨ Features

📄 PDF document ingestion

🧹 Text cleaning and normalization

✂️ Overlapping text chunking

🔢 Semantic embeddings using Sentence Transformers

⚡ FAISS-based vector similarity search

🔍 Context-aware retrieval (R in RAG)

🤖 Local LLM-based answer generation using Ollama

🖥️ Streamlit-based interactive UI

🧱 Clean, modular, extensible codebase

🧠 How It Works (High-Level)

User uploads a PDF document

Text is extracted, cleaned, and split into overlapping chunks

Each chunk is converted into a dense embedding vector

Embeddings are indexed using FAISS for fast similarity search

User query is embedded and matched against document chunks

Relevant chunks are injected into a controlled prompt

A local LLM (Mistral via Ollama) generates a grounded answer

This ensures accurate, document-based answers with minimal hallucination.

🧱 Tech Stack

Python

Sentence-Transformers (semantic embeddings)

FAISS (vector similarity search)

Ollama (local LLM inference)

Mistral (LLM model)

Streamlit (frontend UI)

📂 Project Structure
rag_document_assistant/  
├── intake/  
│   ├── loader.py  
│   ├── cleaner.py  
│   └── chunker.py  
├── embeddings/  
│   ├── embedder.py  
│   └── vector_store.py  
├── rag/  
│   ├── retriever.py  
│   ├── prompt.py  
│   ├── llm.py  
│   └── pipeline.py  
├── ui/  
│   └── app.py  
├── requirements.txt  
└── README.md  

▶️ How to Run Locally
1️⃣ Install dependencies
pip install -r requirements.txt

2️⃣ Ensure Ollama is running
ollama serve


Make sure the required model is available:

ollama pull mistral

3️⃣ Run the application
streamlit run ui/app.py

📝 Notes

The LLM runs fully locally using Ollama — no external APIs or internet required

The system is designed for learning, experimentation, and academic demonstration

The modular architecture allows easy extension (multi-doc support, citations, speech input, etc.)

🚀 Future Enhancements (Optional)

Source citations for answers

Multi-document support

Speech-to-text query input

Persistent FAISS index

REST API backend

📌 Author

Built as a learning-focused project to understand Retrieval-Augmented Generation systems end-to-end, including vector search, prompt grounding, and local LLM integration.