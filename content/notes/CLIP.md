---
title: Learning Transferable Visual Models From Natural Language Supervision (CLIP)
draft: false
tags:
---
 
Used it first in my [[Visual-Language Models for Object Detection and Segmentation]] project that I did for a startup (THEKER) and now I encountered it again in my [[genai|Generative AI in Robotic Applications]] course at [[twente|Twente]].

Resource: [Original paper](https://arxiv.org/pdf/2103.00020), [this blog on medium](https://medium.com/one-minute-machine-learning/clip-paper-explained-easily-in-3-levels-of-detail-61959814ad13)

CLIP was trained on 400 million (image, text) pairs collected from the internet.

>[!summary] CLIP is a **pretrained** model for telling you how well a given **image** and a given **text** fit together.
>* In training CLIP, the similarity scores of the correct image-text pairs are found on the diagonal of the similarity score matrix for the current batch.

> In **training**, it tries to **maximize** the cosine similarity between **correct** image-caption vector pairs, and **minimize** the similarity scores between all **incorrect** pairs.

> In **inference**, it calculates the similarity scores between the vector of a **single image** with **a bunch of possible caption** vectors, and picks the caption with the highest similarity.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/CLIP.png" style="max-width: 100%; height: auto;">
</div>

The training method mentioned above is called **contrastive loss**: a contrastive function that will modify the weights of the model such that correct image-caption pairs get a high similarity score, and incorrect pairs get low similarity scores. It's extremely similar to the [[NLP 5|Skip-gram loss function from Word2Vec]].

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/CLIP2.png" style="max-width: 100%; height: auto;">
</div>

