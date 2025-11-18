---
title: Contextual Word Embeddings and Transformers
draft: false
tags:
date: 2025-10-04
---
This is Lecture 6 from my [[NLP|Natural Language Processing]] course. 

# Neural Networks

### Logistic Regression

We wrote the posterior probability of the class given a datapoint as:
  
$$
\begin{align*}

    p(c_1 \mid \mathbf{x}) &= \sigma(\mathbf{w} \cdot \mathbf{x}) \\

    p(c_2 \mid \mathbf{x}) &= 1 - p(c_1 \mid \mathbf{x})

\end{align*}
$$
  
The parameters of this model, $\mathbf{w}$, can be trained by conditional Maximum Likelihood:
  
$$
\begin{align*}

    \mathbf{w}^* &= \arg\max_{\mathbf{w}} \prod_i p(c_i \mid \mathbf{x}_i) \\

                 &= \arg\max_{\mathbf{w}} \prod_i \sigma(\mathbf{w} \cdot \mathbf{x}_i)^{y_i} \left(1 - \sigma(\mathbf{w} \cdot \mathbf{x}_i)\right)^{1 - y_i}

\end{align*}
$$

This is equivalent with minimizing the binary cross-entropy *loss*.

### Activation Functions

The activation functions (turn to 0-1 possibility) used the most are:

$$
\begin{align*}
\sigma(x) &= \frac{1}{1 + e^{-x}} \\[1em]
\tanh(x) &= \frac{e^x - e^{-x}}{e^x + e^{-x}} \\[1em]
\text{ReLU}(x) &=
\begin{cases}
0 & \text{if } x < 0 \\
x & \text{otherwise}
\end{cases} \\[1em]
\text{IReLU}(x) &=
\begin{cases}
\alpha x & \text{if } x < 0 \\
x & \text{otherwise}
\end{cases}
\end{align*}
$$

# Feed-forward networks and back-propagation
### Computational Graphs

Consider the following function

$$
L(a,b,c) = c(a+2b)
$$

We can decompose this into temporary variables and compute the forward and backward propagations

$$
\begin{align*}
d &= 2b &\
e &= a + d &\
L &= ce
\end{align*}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/backpass.png" style="max-width: 100%; height: auto;">
</div>

If we consider the function $f(x) = u(v(w(x)))$, then the derivative of $f$ with respect to $x$ can be decomposed into $\frac{df}{dx} = \frac{du}{dv} \cdot \frac{dv}{dw} \cdot \frac{dw}{dx}$

# Transformers

### Self-attention layers (Basic version)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/selfatt.png" style="max-width: 100%; height: auto;">
</div>

* Weigh each input $x$ by its importance within the context
* Most basic version:

$$
\text{score}(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{x}_i \cdot \mathbf{x}_j
$$

$$
\alpha_{i,j} = \text{softmax}_j(\text{score}(\mathbf{x}_i, \mathbf{x}_j)) \quad \forall j \leq i
$$

$$
\mathbf{y}_i = \sum_{j \leq i} \alpha_{ij} \mathbf{x}_j
$$

* all $y_i$ can be computed in parallel.

### Self-attention layers (Extended version)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/selfattext.png" style="max-width: 100%; height: auto;">
</div>

Each input embedding plays multiple roles:
* Current focus of attention (Query)
* Preceding input compared to query (Key)
* Input weighted in computing the output (Value)

So, we encode these as:

$$
\mathbf{q}_i = \mathbf{W}^Q \mathbf{x}_i \quad

\mathbf{k}_i = \mathbf{W}^K \mathbf{x}_i \quad

\mathbf{v}_i = \mathbf{W}^V \mathbf{x}_i
$$

and get:

$$
\text{score}(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{q}_i \cdot \mathbf{k}_j \quad \quad \mathbf{y}_i = \sum_{j \leq i} \alpha_{ij} \mathbf{v}_j
$$

# Transformers

* Map sequence $x_1, x_2, ..., x_n$ to sequence $y_1, y_2 ..., y_n$
* Made of stacks of transformer blocks

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/transformers.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] Units of transformer blocks
>* Self attention layers
>* Residual connections
>	* Directly pass information from lower to higher layer
>	* Similarly improves training
>* Normalisation layers
>	* Limits range of values: facilitates gradient-based learning
>	* Make all vector elements have zero mean, unit variance

### Multi-head attention and positional encoding

* How to capture different kinds of relationships between inputs?
	* various versions of Q,K,W
		* $\text{MultiHeadAttn}(\mathbf{X}) = (\mathbf{h}_1 \oplus \mathbf{h}_2 \oplus \cdots \oplus \mathbf{h}_h) \mathbf{W}^O$
		* $\mathbf{h}_i = \text{SelfAttention}(\mathbf{Q}_i, \mathbf{K}_i, \mathbf{V}_i)$
* Positional encoding
	* Embedding contains position information

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/multihead_transf.png" style="max-width: 100%; height: auto;">
</div>

# Masked training and fine tuning

* Unidirectional: Predict future from past

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/unidtransf.png" style="max-width: 100%; height: auto;">
</div>

* Bidirectional: Predict anything from anything

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/bidirtransf.png" style="max-width: 100%; height: auto;">
</div>

* No encoder-decoder architecture

### BERT: Bidirectional encoder representations from transformers

>[!summary] BERT
>* Sub-word vocabulary, Word-Piece: 30k tokens
>* Hidden layers: 768 nodes
>* 12 transformer blocks
>* 12 multihead attention, each

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/BERT1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/BERT2.png" style="max-width: 100%; height: auto;">
</div>

#### Training BERT

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/BERTtraining.png" style="max-width: 100%; height: auto;">
</div>

