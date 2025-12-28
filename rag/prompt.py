def build_prompt(context,question):
    return f"""
You are an academic expert. 
Answer the question strictly using the context below.
Try to give the exact words, if answer is not present in the context, say : "Not available in document."
Context: {context}
Question: {question}
Answer :
"""
