---
title: Training Foundation Models
draft: false
tags:
date: 2026-06-02
---

Floris Weers is an ex-Apple alumni from Twente. He is also the co-founder of Biscuit.

Regarding **Pre-training**, the main goal is to make it scalable + learn data distribution. Used to train directly for the goal.

**When to train what?**

* **Pre-training**: new knowledge/capabilities
* **Post-training**: new product features/alignment
* **RL**: improve reliability on the tail

I feel like this lecture was a refreshment on scaling laws.

In his opinion, it's not worth starting from scratch. You could pick up a pre-trained model from HuggingFace and start from there.

**Token-based Distillation**: Top-1 distillation without logit matching. Hard-label ... finish this sentence.

**Logit-based Distillation**: Need the logits. More efficient per flop. Apparently very efficient per pass, but very heavy on the infra.

Look into why Gemini prefers logit-distillation on top of token-distillation?

>[!example] It Reveals Token Relationships ("Dark Knowledge")
>
>When a massive teacher model reads the prompt _"The flight was delayed because of the..."_, it won't just output a single token. It outputs a full spectrum of probabilities across its entire vocabulary.
>
>* **Token Distillation** only tells the student model: Train on the word `"weather"`.
>* **Logit Distillation** tells the student model: `"weather"` is the most likely (70\%), but `"strike"` is also plausible (20\%), `"pilot"` is a minor possibility (5\%), and `"banana"` is completely impossible (0\%)
>
>By forcing the smaller student model to mimic this entire distribution, it implicitly learns **which concepts are related** and which words are contextually absurd

If you have a strong teacher, distillation is often worth it. Also if you have many students.