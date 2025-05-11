import os
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings  
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

EMBEDDING_MODEL = "microsoft/codebert-base"

def load_documents(path: str = "./documents") -> List[Document]:
    docs = []
    for fname in os.listdir(path):
        if fname.endswith((".txt", ".py", ".js", ".ts")):  
            fpath = os.path.join(path, fname)
            if os.path.isfile(fpath):  
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                    docs.append(Document(page_content=content, metadata={"source": fname}))
    return docs

def create_vectorstore(index_path: str = "faiss_index"):
    print("📥 Loading documents...")
    docs = load_documents()
    print(f"✅ Loaded {len(docs)} files")

    print("🔪 Splitting documents into chunks...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    print("📐 Embedding and indexing...")
    embedding = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    db = FAISS.from_documents(chunks, embedding)
    db.save_local(index_path)
    print(f"✅ Vectorstore saved to {index_path}/")

def load_vectorstore(index_path: str = "faiss_index") -> FAISS:
    embedding = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    if not os.path.exists(os.path.join(index_path, "index.faiss")):
        print("⚠️  Index not found. Creating it now...")
        create_vectorstore(index_path)
    return FAISS.load_local(index_path, embedding, allow_dangerous_deserialization=True)

