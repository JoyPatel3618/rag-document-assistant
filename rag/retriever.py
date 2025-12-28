class Retriever : 
    def __init__(self, vector_store, embedder, chunks):
        self.vector_store = vector_store
        self.embedder = embedder
        self.chunks = chunks

    def retrive(self,query,k=3):
        query_embedding = self.embedder.embedd([query])
        _, indices = self.vector_store.search(query_embedding,k)

        return [self.chunks[i] for i  in indices[0]]