import os
import chromadb
from rag.loader import load_documents
from rag.chunker import chunk_text
from rag.embeddings import get_embedding_function

def ingest():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, "documents")
    chroma_dir = os.getenv("CHROMA_PERSIST_DIRECTORY", os.path.join(os.path.dirname(base_dir), "chroma_db"))
    
    print("Loading documents from:", docs_dir)
    docs = load_documents(docs_dir)
    if not docs:
        print("No documents found.")
        return
        
    print("Initializing ChromaDB at:", chroma_dir)
    client = chromadb.PersistentClient(path=chroma_dir)
    
    ef = get_embedding_function()
    collection = client.get_or_create_collection(name="clinical_knowledge", embedding_function=ef)
    
    print("Chunking and ingesting documents...")
    
    all_ids = []
    all_texts = []
    all_metadatas = []
    
    for doc in docs:
        chunks = chunk_text(doc["content"])
        for i, chunk in enumerate(chunks):
            doc_id = f"{doc['source']}_chunk_{i}"
            all_ids.append(doc_id)
            all_texts.append(chunk)
            all_metadatas.append({
                "source": doc["source"],
                "category": "clinical_guideline",
                "title": doc["source"].replace(".md", "").replace("_", " ").title()
            })
            
    # Upsert in batches
    batch_size = 100
    for i in range(0, len(all_ids), batch_size):
        collection.upsert(
            documents=all_texts[i:i+batch_size],
            metadatas=all_metadatas[i:i+batch_size],
            ids=all_ids[i:i+batch_size]
        )
        
    print(f"Successfully ingested {len(all_ids)} chunks from {len(docs)} documents.")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    ingest()
