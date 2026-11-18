# Week 4: Transformers and Attention

Self-attention lets every token weigh every other token in the sequence. Each token produces a query, a key and a value. Attention weights come from softmax(QK^T / sqrt(d)) and are used to mix the values.

Multi-head attention runs several attention operations in parallel so the model can track different relationships. Positional encodings add word-order information. Most modern chat models use a decoder-only transformer.
