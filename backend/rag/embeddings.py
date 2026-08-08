import os
import httpx
import chromadb.utils.embedding_functions as embedding_functions

def get_embedding_function():
    model_name = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
    ollama_base = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate").replace("/api/generate", "")
    
    try:
        r = httpx.get(f"{ollama_base}/api/tags", timeout=2.0)
        if r.status_code == 200 and model_name in r.text:
            print(f"Using Ollama embedding model: {model_name}")
            return embedding_functions.OllamaEmbeddingFunction(
                url=f"{ollama_base}/api/embeddings",
                model_name=model_name
            )
    except Exception:
        pass
        
    print("Falling back to Chroma DefaultEmbeddingFunction (all-MiniLM-L6-v2) for offline RAG")
    return embedding_functions.DefaultEmbeddingFunction()
