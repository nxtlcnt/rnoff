import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
from groq import Groq
from embed_store import load_vectorstore

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3-8b-instruct")

client = Groq(api_key=GROQ_API_KEY)
vectorstore = load_vectorstore()

class UserInput(BaseModel):
    message: str
    conversation_id: str

class Conversation:
    def __init__(self):
        self.messages = [
            {"role": "system", "content": "You are a helpful assistant. Use only the provided context."}
        ]
        self.active = True

conversations: Dict[str, Conversation] = {}

def get_or_create_conversation(cid: str) -> Conversation:
    if cid not in conversations:
        conversations[cid] = Conversation()
    return conversations[cid]

def query_groq(convo: Conversation) -> str:
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=convo.messages,
            temperature=0.3,
            max_tokens=1024,
            top_p=1,
            stream=False,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/")
async def chat(input: UserInput):
    convo = get_or_create_conversation(input.conversation_id)
    docs = vectorstore.similarity_search(input.message, k=3)
    context = "\n\n".join([doc.page_content for doc in docs])
    convo.messages.append({
        "role": "user",
        "content": f"[CONTEXT]:\n{context}\n\n[QUESTION]: {input.message}"
    })
    reply = query_groq(convo)
    convo.messages.append({"role": "assistant", "content": reply})
    return {"response": reply, "conversation_id": input.conversation_id}

@app.get("/")
def health():
    return {"status": "RAG chatbot is running"}
