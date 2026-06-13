---
title: Representation Learning
draft: false
tags:
date: 2026-06-13
---

[source -- Steven Gong](https://stevengong.co/notes/Representation-Learning)

Representation learning learns useful feature representations of data, often in an unsupervised or self-supervised way, so that they can be reused for downstream tasks (e.g. classification, clustering).

TL;DR: Essentially, the latent space that this data gets encoded in should capture some useful representation.

Some examples include [[genai2|Autoencoders, VAE]], the contrastive learning concept from [[CLIP]], masked modelling as in BERT.

However, the current project in [[foundation models]] uses DINO (no negative examples). Those that use a contrastive loss in [[CLIP]] don’t suffer as much from [[genai11|mode collapse]], because the negative examples serve as a regularization term.

>[!NOTE] Representation learning and generative models often overlap, but they are not the same thing.
>
>* Many [[genai|generative models]] naturally learn useful representations as a by-product.

