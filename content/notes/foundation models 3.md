---
title: Transformers in depth and time
draft: false
tags:
date: 2026-04-29
---

> The mean-field particle perspective

We started with a small recap on Neural ODEs (do look into it a bit). The concept is basically an extension of the mathematics covered in [[genai4|Normalizing Flows]] and [[changeofvar|Change-of-Variable Formula]].

The goal is to plan a path (via **K** and $b$) such that the initial data can be linearly separated. It happened automatically in NNs and Neural ODEs show that. It's called ==gradient flow==. See *Deep Neural Networks Motivated by Partial Differential Equations, J Mathematical Imaging and Vision, 2019*. Also *Neural Ordinary Differential Equations, Neurips, 2018*.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/foundmod3_2.png" style="max-width: 100%; height: auto;">
</div>

**Layer Normalization**

RMSNorm is moving the current distribution to a sphere.

$$
\text{RMSNorm}(x)_i = g_i \frac{x_i}{||x||_2}
$$

* $g[i]^n_{i=1}$ are learned parameters

So project our points to a sphere and hope it translates to something? The $\pi$ in the formula is actually $\pi$, since we have a circle now. **K** plays with the depth. Also we go from discrete to continuous (sum to integral). Understand the inner product and limit idea in slide 37. In slide 38 we moved the time to infinitely long? that's what he said. 

In slide 39, $\mu_t$ is the density. We can separate dots from the whole distribution. complete the idea. The velocity field in the bottom helps us form the continuity equation from next slide.

$$
\partial_t \mu_t+ div(V[\mu_t]\mu_t) = 0
$$

If you take the entries of the gradient and sum them up, you get the diversion $div$. Here comes the nice idea of the **trace** of the Jacobian Matrix from [[genai4|Flow Matching]]. This is how the Transformer comes to its answer. ufffff

Slide 43 (Page 42) is what **rank collapse** or [[genai11|mode collapse]] looks like in Transformers. And it can happen very easily apparently. **So the eigenvalues of $D$ provide concrete explainability of issues like this (rank collapse)**. If $D$ changes in time, then we have Neural PDEs. Optimal transport of particle(tokens) distributions directly links to [[genai4|Flow Matching]] and [[genai5|Diffusion models]].

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/foundmod3_3.png" style="max-width: 100%; height: auto;">
</div>

With **Un-supervised learning** we apply SVD and PCA to see the clusters that form in the data (cats that have similar faces sit together etc). Slide 49. Another application is the reconstruction.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/foundmod3_4.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/foundmod3_5.png" alt="flow 2" width="350" height="300"> </div> </div>

**Self-supervised learning** is done through similarity or dissimilarity. You look at a patch for two different POVs (features) and compute how similar they are => there's learning involved. Complete this idea. Also understand the difference between each learning technique. Does distillation fall in this category? See the student-teacher model. I think it's related to adversarial learning (GANs). Page 57. Digestion unfolds the problem (what does that even mean?)..

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/foundmod3_6.png" style="max-width: 100%; height: auto;">
</div>

* First layer is on **(dis)-similarity** and **feature extraction**
* Second layer is for "**Disentanglement**" of the learnt representations
* Third layer is for "**Digestion**" -- what exactly does it do?

> **Self-supervised learning** allows us to see what the heads are learning.

==Golden rules of Self-supervised learning==: 

1. **don't let your features collapse (make it stable)** 
2. **don't make your features random (whatever that means).**

>[!summary] Foundation Model
>Anything that gives you meaningful re-usable features.

Understand the consistent view alignment.

