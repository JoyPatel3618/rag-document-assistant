from intake.cleaner import clean_txt
from intake.chunker import chunking
from embeddings.embedder import Embedder
from embeddings.vector_store import VectorStore
from rag.retriever import Retriever
from rag.prompt import build_prompt
from rag.llm import generate_answer

class MainPipeline:
    def __init__(self):
        self.embedder = Embedder()
        self.vector_store = None
        self.chunks = None
        self.retriever = None

    def doc_intake(self,text):
        cleaned = clean_txt(text)
        self.chunks = chunking(cleaned)
        
        embeddings = self.embedder.embedd(self.chunks)
        self.vector_store = VectorStore(dim=embeddings.shape[1])
        self.vector_store.add(embeddings)

        self.retriever = Retriever(self.vector_store,self.embedder,self.chunks)
    
    def query(self,question,k=3):
        return self.retriever.retrive(question,k)
    
    def answer(self,question,k=3):
        if not self.retriever:
            raise ValueError("Doc not given yet.")
        
        chunks = self.retriever.retrive(question,k)
        """context = "\n\n".join(chunks)

        prompt = build_prompt(context,question)
        answer = generate_answer(prompt)

        return answer,chunks"""
        return "LLM Integration in progress",chunks