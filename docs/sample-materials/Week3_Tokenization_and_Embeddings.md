# Week 3: Tokenization and Embeddings

Tokenizers split text into subword units, for example with byte-pair encoding (BPE). In English one token is roughly three quarters of a word. Thai and other languages often need more tokens per word, which affects cost and context length.

## Embeddings
Embeddings map text to dense vectors so that passages with similar meaning end up close together. Cosine similarity measures the angle between two vectors and is the usual way to compare embeddings.

## Choosing an embedding model
Match the language of your documents (use a multilingual model for mixed Thai and English). Weigh vector dimension against storage cost. Check the maximum input length against your chunk size. Compare scores on the MTEB benchmark, and always test retrieval quality on a sample of your own questions.
