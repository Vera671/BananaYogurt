# Week 7: RAG and Vector Databases

RAG (retrieval-augmented generation) retrieves relevant documents at question time and adds them to the prompt, so the model answers from those sources instead of only from what it memorised. The pipeline: load documents, split them into chunks, embed each chunk, store the vectors in a vector database, retrieve the top-k chunks for a question, then generate an answer that cites them.

## RAG vs fine-tuning
RAG adds knowledge at query time, is easy to update when documents change, and can show its sources. Fine-tuning changes the model weights to adapt its behaviour, style or task format. It needs training data, and knowledge baked into the weights is harder to update. Example: a course chatbot answering from the syllabus and slides should use RAG; making a model always grade in a fixed rubric format is a job for fine-tuning.

## Chunking and vector databases
Chunks of roughly 300 to 800 tokens with 10 to 20 percent overlap work well for lecture notes. Vector databases such as Chroma, FAISS and pgvector use approximate nearest-neighbour search. Hybrid search combines keyword search (BM25) with vector search and often retrieves better than either alone.

## A local RAG stack
Ollama runs open models such as Gemma, Llama or Mistral on your own laptop. nomic-embed-text creates the embeddings. LangChain or LlamaIndex can connect the pipeline, or you can write it yourself with Flask and SQLite as GenieAi does. For the RAG Practice assignment you may use Ollama or any hosted API.
