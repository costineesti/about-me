---
title: Multi Layer Perceptron (MLP)
draft: false
tags:
date: 2026-10-16
---

The topics introduced in [[ml 4|Linear Regression with Gradient Descent]] suffer from one big drawback: linearity is assumed. However real-life data is mostly never linear and [[representation learning|Representation Learning]] is a very efficient way of learning the underlying relationships of the data.

MLPs are basically Feedforward Neural Networks:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml24.png" style="max-width: 100%; height: auto;">
</div>

> Each layer creates a new representation of the input data.

We can create computational graphs out of MLPs too once we consolidate them in blocks.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml25.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml26.png" style="max-width: 100%; height: auto;">
</div>

Small reminder that for classification, the $\text{softmax}$ function represents normalized probabilities that sum up to 1. (strictly positive)

# Design decisions

* **Output activation function** -- $\text{softmax}$
	* $p(y = j \mid x) = \frac{e^{\mathbf{x}^\top w_j}}{\sum_{k=1}^n e^{\mathbf{x}^\top w_k}}$
	* Multinoulli output distributions
* **Hidden layer activation function** -- ReLU
* **Architecture of the model**
	* Number of hidden layers (e.g. 2) -- deeper
		* The segments grow exponentially
	* Number of neurons/layer (e.g. 256) -- wider
		* The segments grow polynomialy.
	* This refers to how a neural network divides the input space into different regions (or piecewise linear segments) to approximate a complex function.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml27.png" style="max-width: 100%; height: auto;">
</div>

* **Loss function** (e.g. Cross entropy)
	* Differentiable (smooth)
	* Monotonically increasing with the distance from the target value

> In case we use $\text{sigmoid}$ instead of $\text{softmax}$, we get Bernoulli output distributions -- $p(y = 1 \mid x) = \frac{1}{1 + e^{-\mathbf{w}^\top \mathbf{x}}}$

If all neurons are linear, the MLP is linear, which limits the generalization! Additionally, capacity scales poorly -- to learn a complex function the model needs exponentially more neurons.

>[!quote] Universal Approximation Theorem (Hornik, 1991)
>
>A single hidden layer neural network with a linear output unit can approximate any continuous function arbitrarily well, given enough units.
>
>Mind the two ideas above, however!

# Training

Regarding standard Gradient Descent, we can stop the model from overfitting by applying:

* early stopping, learning rate adaption
* L1/L2 regularization (ridge regression), Weight decay
* [[dropout|Dropout]] regularization

See [[SGD]] for continuation on this topic.

page 49. See [these notes](https://stevengong.co/notes/Perceptron) from Steven.

[mandatory watch](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-12b-deep-neural-nets/index.html)

**Mandatory read**: Sections 5.1, 5.2, 5.3, and 5.5 of Chapter 5 (Neural Networks) from Cristopher Bishop, Pattern Recognition and Machine Learning, 2006