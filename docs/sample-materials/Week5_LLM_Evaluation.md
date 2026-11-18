# Week 5: Evaluating LLMs

Automatic metrics such as BLEU and ROUGE measure word overlap with a reference answer, and perplexity measures how well a model predicts text. Overlap metrics miss answers that are correct but worded differently.

LLM-as-a-judge uses a strong model with a clear rubric to grade outputs; human evaluation remains the reference point. For RAG systems, evaluate retrieval (does recall@k find the right chunks?) separately from generation (is the answer faithful to the sources and relevant to the question?).
