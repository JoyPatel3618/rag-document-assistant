from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os

from intake.loader import load_pdf, load_text
from rag.pipeline import MainPipeline
from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = MainPipeline()


@app.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    suffix = ".pdf" if file.filename.endswith(".pdf") else ".txt"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        path = tmp.name

    if path.endswith(".pdf"):
        text = load_pdf(path)
    else:
        text = load_text(path)

    os.remove(path)
    pipeline.doc_intake(text)

    return {
        "status": "ok",
        "message": "Document ingested successfully"
    }


@app.post("/query")
async def query_rag(payload: QueryRequest):
    question = payload.question
    answer, chunks = pipeline.answer(question, k=3)
    return {
        "answer": answer,
        "sources": chunks
    }

        