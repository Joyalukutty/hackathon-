import os
import glob
from typing import List, Dict

def load_documents(docs_dir: str) -> List[Dict]:
    docs = []
    for filepath in glob.glob(os.path.join(docs_dir, "**/*.*"), recursive=True):
        ext = os.path.splitext(filepath)[1].lower()
        if ext in [".md", ".txt"]:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                docs.append({
                    "source": os.path.basename(filepath),
                    "content": content
                })
        elif ext == ".pdf":
            try:
                import pypdf
                with open(filepath, 'rb') as f:
                    reader = pypdf.PdfReader(f)
                    content = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
                    docs.append({
                        "source": os.path.basename(filepath),
                        "content": content
                    })
            except ImportError:
                print("pypdf not installed. Skipping PDF.")
    return docs
