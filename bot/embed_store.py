import os
import pickle
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dataclasses import dataclass

@dataclass
class Document:
    content: str
    source: str

class SimpleVectorStore:
    def __init__(self):
        self.documents: List[Document] = []
        self.vectorizer = TfidfVectorizer()
        self.doc_vectors = None

    def index_documents(self, docs: List[Document]):
        self.documents = docs
        texts = [doc.content for doc in docs]
        self.doc_vectors = self.vectorizer.fit_transform(texts)

    def similarity_search(self, query: str, k: int = 3) -> List[Document]:
        if self.doc_vectors is None:
            raise ValueError("Vectorstore not initialized.")
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.doc_vectors).flatten()
        top_indices = scores.argsort()[::-1][:k]
        return [self.documents[i] for i in top_indices]

def load_documents(path: str = "./documents") -> List[Document]:
    docs = []
    for fname in os.listdir(path):
        if fname.endswith((".txt", ".py", ".js", ".ts")):
            with open(os.path.join(path, fname), "r", encoding="utf-8") as f:
                docs.append(Document(content=f.read(), source=fname))
    return docs

def load_vectorstore() -> SimpleVectorStore:
    docs = load_documents()
    vs = SimpleVectorStore()
    vs.index_documents(docs)
    return vs
