---
title: Mixture of Experts (MOE)
draft: false
tags:
date: 2026-06-22
---
 
Related to [[foundation models 4|Efficient FoMos]]. Source: [huggingface](https://huggingface.co/blog/moe) and OLMoE paper.

>[!summary] TL;DR
>
>MoEs replace the dense FFN in a transformer layer with multiple smaller FFNs ("experts") + a router that picks which experts process each token.:
>
>* Are **pretrained much faster** vs. dense models
>* Have **faster inference** compared to a model with the same number of parameters
>* Require **high VRAM** as all experts are loaded in memory
>* Face many **challenges in fine-tuning**, but [recent work](https://arxiv.org/pdf/2305.14705.pdf) with MoE **instruction-tuning is promising**

Mixture of Experts enable models to be pretrained with far less compute, which means you can dramatically scale up the model or dataset size with the same compute budget as a dense model. In particular, a MoE model should achieve the same quality as its dense counterpart much faster during pretraining.

>[!NOTE] Sparse vs Dense
>
>Sparsity uses the idea of conditional computation. While in **dense models all the parameters** are used for all the inputs, **sparsity allows us to only run some parts of the whole system**.

In the context of [[transformers]] models, a MoE consists of two main elements:

1. **Spares MoE layers** are used instead of dense feed-forward network (FFN) layers. MoE layers have a certain number of “experts” (e.g. 8). $MoE(x) = \sum_{i \in \text{Top-k}(r(x))} softmax\left( r(x) \right)_i E_i(x)$ 
2. A **gate network $(G)$ or router**, that determines which tokens are sent to which expert $(E)$ $y = \sum_{i=1}^n G(x)_i E_i(x)$ -- just restricted to the top-k experts instead of summing over all of them. For example, in the image below, the token “More” is sent to the second expert, and the token "Parameters” is sent to the first network.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/moe_1.png" style="max-width: 100%; height: auto;">
</div>

