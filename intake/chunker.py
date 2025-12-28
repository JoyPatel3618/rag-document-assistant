def chunking(text,chunk_size=500,overlap=100):
    chunks=[]
    initial=0
    length = len(text)

    while initial<length:
        end = initial + chunk_size
        chunk = text[initial:end]
        chunks.append(chunk)
        initial = end - overlap
    return chunks

    
