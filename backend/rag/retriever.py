import os
import time
import chromadb
from rag.embeddings import get_embedding_function

_client = None
_collection = None

def get_collection():
    global _client, _collection
    if _collection is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        chroma_dir = os.getenv("CHROMA_PERSIST_DIRECTORY", os.path.join(os.path.dirname(base_dir), "chroma_db"))
        _client = chromadb.PersistentClient(path=chroma_dir)
        ef = get_embedding_function()
        _collection = _client.get_or_create_collection(name="clinical_knowledge", embedding_function=ef)
    return _collection

def retrieve_clinical_context(query: str, top_k: int = 5):
    start_time = time.time()
    col = get_collection()
    
    if not query or len(query.strip()) < 3:
        return []
        
    query = query[:500] 
    
    results = col.query(
        query_texts=[query],
        n_results=top_k
    )
    
    latency = time.time() - start_time
    print(f"[RAG] Retrieved {len(results.get('documents', [[]])[0])} chunks for query in {latency:.2f}s")
    
    formatted_results = []
    if results.get("documents") and len(results["documents"]) > 0:
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0] if "distances" in results and results["distances"] else [0]*len(docs)
        
        for i in range(len(docs)):
            score = 1.0 / (1.0 + distances[i])
            score = min(0.99, score)
            
            formatted_results.append({
                "content": docs[i],
                "source": metas[i].get("source", "Unknown"),
                "title": metas[i].get("title", "Clinical Document"),
                "section": metas[i].get("category", "General"),
                "score": float(score)
            })
            
    return formatted_results
