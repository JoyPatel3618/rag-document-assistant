from intake.loader import load_pdf,load_text
from intake.cleaner import clean_txt
from intake.chunker import chunking
from embeddings.embedder import Embedder
from embeddings.vector_store import VectorStore
from rag.retriever import Retriever

def main():
    path="D:/6th_Sem/Compiler_Design/Compiler Design.pdf"
    if path.endswith(".pdf"):
        txt = load_pdf(path)
    else:
        txt = load_text(path)

    cleaned_txt = clean_txt(txt)
    chunks = chunking(cleaned_txt)

    embedder = Embedder()
    embeddings = embedder.embedd(chunks)

    vectore_store = VectorStore(dim=embeddings.shape[1])
    vectore_store.add(embeddings)

    retriever = Retriever(vectore_store, embedder, chunks)

    query = "Enter a meaningful question from the document"
    results = retriever.retrive(query,k=3)

    print("Top Retrieved Chunks :")
    for i,chunk in enumerate(results,1):
        print(f"--- Chunk {i} ---")
        print(chunk[:300])
        print()

if __name__=="__main__":
    main()
    