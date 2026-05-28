---
title: Improving the Generalization of ViTs for Action Understanding with VLM Pre-Training
draft: false
tags:
date: 2026-05-28
---

Guest Lecture provided by Dr. Ronald Poppe (Utrecht University).

>[!summary] Context
>
>Vision Transformers ([[ViT]]s) are currently the best performing models in video action understanding. However, when these models are frozen and applied to downstream tasks, their performance drops significantly, revealing poor generalization. In this presentation, they introduce the Four-Tiered Prompts (FTP) framework that employs feature processors to transform the ViT's visual embeddings. With FTP, one can increase the [[ViT]]'s generalization ability by forcing the visual encoder to incorporate relevant, semantic information. Importantly, we only employ the VLM during training, inference incurs a minimal computation cost.

* **ViTs** are **unimodal** models (handle image/videos)
	* excellent image feature extraction abilities
	* challenging to "infuse" semantic information without additional labeling
* **VLMs** are **multimodal** models -- can handle images/videos and textual inputs.
	* provide semantic embeddings
	* not adapted to specific domains
	* fine-tuning is a challenge due to large number of params

**Parameter-efficient fine-tuning (PEFT)**

>[!summary] TL;DR
>
>* Train a limited number of additional model parameters
>* Alternative fol full fine-tuning

There are different variants. additive, selective, etc.

PERFT can be applied:

* in parallel to blocks/layers
* within blocks/layers
* after blocks/layers

The adapter block projects activations to same dimensionality which is relatively a lightweight operation.

**Four-Tiered Prompts Framework**

**Video-VLMs underperform**, but VITs perform very well on specific datasets. However, there's **no common pre-trained ViT for action recognition** as different datasets focus on different action qualities. The idea is to combine the strengths of VLM and ViT's visual encoder by adding an adapter between ViT's encoder and classifier. Each **feature processor** focuses on four action perspectives:

1. Action category
2. Action components
3. Action description
4. Action context

The feature processors are trained with VLM supervision. The only things we are training are the feature processors as the VLM is something like GPT-4 which you can't really touch. Same for the text and visual encoders.

Keyframe sequences: concatenate evenly spaced keyframes to ... (finish this idea)

>[!question] What happens if GPT-4 hallucinates?
>
>You just take the risk.

During fine-tuning, VLM is not needed. Only integration and classifier layers are trained. Try to understand the projection layers, pooling blocks.

>[!danger] So you don't deploy the VLM, you only add it in training. You deploy the feature processors.

**The classes that see most improvements are the ones including spatial information** (skydiving, ice climbing, tasting beer). **The classes that decline in performance are less defined by their surroundings** (e.g. parkour? breakdancing? ski jumping?) -- I don't see it.

Visualizing t-SNE, classes are better separated with FTP => better visual encoder.

>[!question] What kind of biases get introduced?
>
>* Focus on spatial information.
>* No screening of VLM outputs.

