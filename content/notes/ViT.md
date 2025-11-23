---
title: Vision Transformer (ViT)
draft: false
tags:
date: 2025-11-23
---

 
Well it’s basically the same as a normal [[transformers|transformer]]. You split the image into 16x16 pixel patches, and they are encoded into vector using linear projection. And then you have one extra token for positional encoding.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vit_16.png" style="max-width: 100%; height: auto;">
</div>

I used Vision Transformers in my [[Visual-Language Models for Object Detection and Segmentation]] project that I did for a startup (THEKER). There I learned about the segmentation model SAM (Segment Anything) and about [[CLIP]] which made the connection from text (NLP) to the actual object in the image (vision).

From the original paper: Transformers lack some of the inductive biases inherent to CNNs, such as translation equivariance and locality, and therefore do not generalize well when trained on insufficient amounts of data.

# An Image is worth 16x16 Words: Transformers for Image Recognition at Scale

Resources: [the original paper](https://arxiv.org/abs/2010.11929) and [Steven](https://stevengong.co/research-papers/An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale)

Original image: 224x224x3 patch size: 16x16x3 total number of patches: 14x14 = 196

Each flattened patch is a vector of length 768.

>[!question] Why is the Linear Projection Filter needed?
>This lets the model reweight and mix the 768 raw pixel values into a better representation (e.g. combining color channels, edges, local contrasts).
>
>As in [[transformers|Transformers]], the embeddings in the embedding representation can all change for a given token. We want the same here, which is why letting the model learn an Affine Transformation $(z = Wx + b)$ is useful.

> Input for the transformer encoder: \[CLS\], patch1, patch2, \[MASK\], patch4, \[MASK\], ...

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vit_arch.png" style="max-width: 100%; height: auto;">
</div>

