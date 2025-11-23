---
title: Zero-Shot Learning (ZSL)
draft: false
tags:
date: 2025-11-23
---
 
I encountered this topic multiple times in my [[genai|GenAI Models and Robotic Applications]] course and in [[CLIP]].

Zero-shot learning (ZSL) is a problem setup in machine learning, where at test time, a learner observes samples from classes, which were not observed during training, and needs to predict the class that they belong to.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/zsl.png" style="max-width: 100%; height: auto;">
</div>

The idea is that you learn a mapping from a feature space to a category embedding. 

Also, the problem of multi-label also exists. Like say you annotate an image, maybe it has both a mountain and a beach. (wait how do you solve this? - ah nvm you muppet, it was explained in CLIP how you select the pair with the highest cosine similarity -- at least for that case)