# Week 2: Large Language Models

A large language model (LLM) is a transformer trained to predict the next token on a very large text corpus. After pre-training, instruction tuning and RLHF (reinforcement learning from human feedback) teach the model to follow instructions and respond helpfully.

## Decoding settings
Temperature scales the probability distribution over next tokens. Low temperature makes output more focused and repeatable; high temperature makes it more varied. Temperature 0 means greedy decoding, which is close to deterministic, but small differences can still appear because of hardware and batching. Top-p sampling keeps only the smallest set of tokens whose probabilities add up to p.

## Context window and hallucination
The context window is the maximum number of tokens a model can read at once. Hallucination is when a model produces fluent text that is not supported by facts or by the provided sources. Grounding the model in retrieved documents reduces hallucination.
