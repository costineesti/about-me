---
title: Introduction to Foundation Models
draft: false
tags:
---
 
**A foundation model is anything that gives you meaningful re-usable features.** Foundation Models are trained on massive datasets and perform well in zero-shot (no fine-tuning) scenarios (so like BERT, DALL-E, GPT-3).

**Generalization** is the "Holy Grail" of AI i.e. training a sufficiently large model on a large dataset and expecting it to have strong performance on different **independent** test sets.

Increasing model complexity (no. parameters) enters a training regime where generalization is first hurt and subsequently improved.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod_1.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] Don't start big. Start small, then scale.
>
>1. Experimenting with architecture on large datasets is extremely expensive. So instead, find the right architecture/hyperparameters on small datasets first — the structure of what works transfers.
>2. Once you've validated your model design, scale it up to larger data and expect predictable, proportional accuracy improvements (thanks to scaling laws).
>
>Model architecture exploration should be feasible with small training data sets. In short, **scaling laws make development predictable**, so you can prototype cheap and scale confidently.
>
>resources: Kaplan et al. from OpenAI (Scaling Laws for Neural Language Models), and the Baidu Research (Deep Learning Scaling Is Predictable, Empirically)

**Neural Scaling Laws**

Three quantities dominate model performance improvements: 

1. C = compute (FLOPs)
2. D = data (tokens)
3. N = parameters

Performance improves as long as we increase both N and D. Larger models require fewer samples to reach the same performance, and convergence is not critical for good performance. Additionally, model shape doesn't matter too much.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fmod_2.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fmod_3.png" alt="flow 2" width="350" height="300"> </div> </div>

> Scaling more data has diminishing returns -- so be smarter about your data instead.

According to "Beyond neural scaling laws: beating power law scaling via data pruning", a 1\% drop in error might require $10 \times$ more data/compute. That's the wall you hit following standard power-law scaling. They suggest that *pruning the least informative samples from your dataset* can beat the full dataset, and do so more efficiently than simply scaling up. This "beats the power law" because the improvement curve is steeper than what raw scaling predicts.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod_4.png" style="max-width: 100%; height: auto;">
</div>

* The **Pareto frontier** (purple curve) shows that a carefully pruned smaller dataset can actually **outperform** training on the full dataset at the same compute budget.

According to "No zero-shot without exponential data", **Zero-shot performance isn't "free"** -- it's bought with data. Specifically, to get a _linear_ improvement in zero-shot accuracy, you need _exponentially_ more pretraining data covering that concept.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod_5.png" style="max-width: 100%; height: auto;">
</div>

* The x-axis is logarithmic -- meaning each step right is $10 \times$ more data — yet accuracy only grows linearly.
* Rare concepts (e.g. "wet dog", "ripe tomato") are severely penalized because they appear infrequently in pretraining data

>[!question] A potential escape hatch: **Compositionality** 
>If models could _compose_ known concepts rather than needing to have seen every combination explicitly, the data requirements could be broken. For example: if a model knows "wet" and "dog" separately, can it generalize to "wet dog" zero-shot? 
>
>Still an open research question whether current models truly achieve it.

>[!danger] Copying (with updated weights) a FoMo for every task is inefficient (storage-wise, loading or switching among them)
>
>Deploying them on specific tasks and achieving high performance requires **tuning their parameters**.

In terms of **efficiency** -- Self-attention has quadratic complexity — a core bottleneck. Techniques like FlashAttention and mixed precision training address this. Covered in [[foundation models 4|Efficient FoMos]].

