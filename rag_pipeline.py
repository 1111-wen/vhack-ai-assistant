from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# Load document
loader = TextLoader("data/healthcare_policy.txt")
documents = loader.load()
print("Loaded documents:", documents)

# Split document into smaller chunks
text_splitter = CharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)

# Create embeddings model
embeddings = HuggingFaceEmbeddings()

# Create vector database
db = FAISS.from_documents(docs, embeddings)

# Search function
def search_docs(query):
    results = db.similarity_search(query)
    return results[0].page_content