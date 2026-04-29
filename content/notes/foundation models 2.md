---
title: Introduction to Transformers in Deep Learning
draft: false
tags:
date: 2026-04-22
---

Depths via Compositions/Folding

The left plot si the first approx. The right plot we apply again some representations. And the result is something more complex which we can use? Verify this.

$a$ stands for activation functions in this lecture. $\Omega$ stands for weights $W$. $\beta$ is bias? The subindex of each hidden layer $h_i$ represents the $i^{th}$ hidden layer of the neural network.

Convolution assumes *weights sharing*. Which means it always goes with the same parameters over the image. Each layer is a filter. We only have width and depth. The connections are sparse (between the hidden layers), but we have the same information in the layers, if I understood that correctly. Equivariant features (i.e. due to the parameter sharing used in CNNs, the feature maps are equivariant w.r.t. translations. so in my own words, if i rotate the image; the filter also rotates with it?)

Understand what registration is in the slide with the brain and the u-net. He said something about understanding the vector field between the two images and (you learn the vector field and then you do something)

In NLP it's different because the input size usually fluctuates. You embed each word, and it's kind of challenging to relate every word to every word (ofc with [[transformers|Transformers]]). 

Apparently, Attention is Not all you need (look at the paper, lol. it's exactly this name). 

In Language Processing, we use Tokens, not pixels or smth else.

**How to handle a sequence of tokens?**

* In CNN, token features depend on those of neighboring tokens
	* 
* RNNs maintain a hidden state of past data.
	* Vanishing gradients for long-term dependencies
	* Struggle with parallel processing

# Attention

* Query **q**: How do I bake bread?
* Keys **k**: Book titles
* Values **v**: Book contents

The keys are the inputs. The query enters everywhere (the actual question), we get the attention scoring function, ensure all weights sum up to 1 (softmax), and then getting that results as the respective value which gives me an idea of how relevant that key is to the query, if I understand correctly?

As a measure of similarity, we use the dot product between the query and keys inside the softmax function. 

Look into GeLU (Gaussian Error Linear Unit). Why is it more stable and meaningful than ReLU?

He mentioned byte-pair encoding for reduction of the tokens (see, sea example).

Understand Encoder/Decoder models. For example BERT vs GPT

