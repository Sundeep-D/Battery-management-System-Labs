import os
import sys
from flask import Flask, request, jsonify
from langchain.document_loaders import TextLoader
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from dotenv import load_dotenv
print('OpenAiServer initializing...')
load_dotenv()

app = Flask(__name__)

PERSIST = False

query = None

OPENAI_API_KEY = os.getenv("OPENAI_KEY")

if not OPENAI_API_KEY:
    print("OpenAI API key not found in environment variables.")
    sys.exit(1)

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

if PERSIST and os.path.exists("persist"):
    print("Reusing index...\n")
    vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
    index = VectorStoreIndexWrapper(vectorstore=vectorstore)
else:
    loader = TextLoader("data.txt")
    if PERSIST:
        index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory": "persist"}).from_loaders([loader])
    else:
        index = VectorstoreIndexCreator().from_loaders([loader])

chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-3.5-turbo"),
    retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
)

chat_history = []

@app.route('/query', methods=['POST'])
def process_query():
    global query
    query = request.json['query']
    result = chain({"question": query, "chat_history": chat_history})
    chat_history.append((query, result['answer']))
    return jsonify(result)

@app.route('/status', methods=['GET'])
def server_status():
    return "OPENAI SERVER is running"
    
if __name__ == '__main__':
    app.run(host='::1', port=os.getenv("OPENAI_SERVER_PORT"))
