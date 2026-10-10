---
title: "Co-Me: Confidence Guided Token Merging for Visual Geometric Transformers"
draft: false
tags:
date: 2026-10-10
---

>[!question] How can we identify and reduce redundant tokens in VGTs without compromising geometric fidelity?

It is an acceleration mechanism for VGTs (e.g. [[VGGT]]) without retraining or finetuning the base model. It makes them capable of real-time 3D perception by mitigating the quadratic computational cost of [[ViT|Vision Transformers]]. 

* It ranks tokens by uncertainty
* Selectively merge low-confidence ones

This method is similar to what I want to do since they used a distilled confidence module that predicts per-token confidence to guide processing, and a confidence-guided merging strategy that preserves precision.

> To be more precise, I am mostly interested in how they use the predicted per-patch confidence score to generate a merge mask during inference (Sec 3.2)

# Confidence-Guided Token Merging

**Mask Generation & Token Merging** 

Let $p$ be the predicted per-tken confidence scores ratio. They partition tokens along the spatial order into fixed-size groups of $n$ image tokens. For each group, if the average confidence falls below the $p$-th percentile across all groups in the image sequence; it is marked for merging. That way the sky gets aggregated into one big region -- it makes total sense.

>[!quote] Formally, for a group of $n$ tokens $G_i$, if the merge flag $m_i$ is true, we replace the group with their average; otherwise, $G_i$ remains unchanged
>
>The results are concatenated into a contiguous tensor:
>
>$$
>\begin{aligned}
>\text{MergeGrp}(G_i,m_i) = \begin{cases} \{\frac{1}{n} \sum_{x \in G_i} x\} &\text{, if } m_i\\ G_i &\text{, otherwise}\end{cases}
>\end{aligned}\\
>\text{Merge}(\{G_i\}, \{m_i\}) = \text{Cat}(\{\text{MergeGrp}(G_i,m_i)\})
>$$

**Token Splitting**

If a processed token group $G_i'$ was not merged in the previous step, copy it to its original position. Otherwise, replicate the merged token $G_i' = \{x\}$ for $n$ times and place them at their original index.

$$
\begin{aligned}
\text{SplitGrp}(G_i',m_i) = \begin{cases} \{x, \dots, x\} &\text{, if } m_i\\ G_i' &\text{, otherwise}\end{cases}
\end{aligned}\\
\text{Split}(\{G_i'\}, \{m_i\}) = \text{Cat}(\{\text{SplitGrp}(G_i',m_i)\})
$$

**Attention Bias Correction**

This correction realigns the post-softmax attention weights distribution with the original distribution.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/CoMe.png" style="max-width: 100%; height: auto;">
</div>

>[!danger] Merging tokens into one concentrates multiple attention weights into a single entry. This causes the softmax operator to suppress that entry's normalized attention weight and distorts the distribution.
>
>*attention bias correction* compensates by adding a bias term $\log n$ to get the corrected attention logit:
>
>$$
>\tilde{a_i} = a_i + \log n
>$$
>
>* $a_i$ is the raw attention logit.
>
>Since softmax is exponential, adding $\log n$ to the merged logit scales its weights by $n$ and effectively restores the same total mass that $n$ individual logits contributed before:
>
>$$
>\text{softmax}(\tilde{a_i}) = \frac{e^{a_i + \log n}}{\sum_j e^{a_j}} \approx \sum_{k \in G_i} \frac{e^{a_k}}{\sum_j e^{a_j}}
>$$

**Pose Estimation**

Sim(3) Umeyama alignment is applied to remove scale and reference frame ambiguity -- this could help with the translations estimates as they would anchor everything into the same frame and therefore, one could trust the results [[VGGT]] offers. The rotations do not suffer from this ambiguity.

In [[VGGT]] the translations are computed w.r.t the first frame, which is why they don't generalize to other cases.