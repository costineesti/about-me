---
title: Dropout
draft: false
tags:
date: 2026-10-27
---

Related to [[ml 5|MLP]] and [[ml|Machine Learning]]. 

Dropout is a **regularization** technique that randomly zeroes activations during training so no single neuron can be relied on. 

>It prevents overfitting.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml36.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Why would randomly deactivating the network help?
>Because it forces redundant representations and prevents co-adaptation (neuron A can't rely on neuron B always being on).
>
>* When an activation is dropped, its output thus its gradient in backprop are both 0.
>
>You can’t rely on any specific teammate showing up, so every neuron has to be _individually useful_. No “this feature works only if that other feature co-activates” hacks, because at any given step the other feature might be dropped. It’s ensemble learning disguised as a regularizer: you train an exponential number of subnetworks with shared weights, and at test time you implicitly average them by scaling.
>

- **Train:** at each forward pass, sample a random binary mask $z$ and zero out activations with probability $1−p$, common setting $p=0.5$
- **Test:** don’t drop, instead scale all activations by $p$ so the expected output matches training

>[!tip] Intuition
>
>At train time, each neuron fires with probability $p$, so its downstream expected contribution is $p \cdot \text{activation}$. At test time nothing drops, so activations are larger on average by a factor of $1/p$. Scaling by $p$ at test time (or equivalently $1/p$ at train time, “inverted dropout”) lines the two up so the network sees the same expected input distribution in both phases.
