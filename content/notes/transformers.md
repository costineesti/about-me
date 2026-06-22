---
title: Transformers
draft: false
tags:
date: 2025-11-22
---

Resources: UTwente slides + [Attention is all you need](https://arxiv.org/abs/1706.03762). Also, I genuinely suggest watching this [video](https://www.youtube.com/watch?v=bCz4OMemCcA) which explains very well the mathematics and architecture of the Transformers. See [[foundation models 3|Transformers in depth and time]] to understand the mathematics behind transformers and how they reach their conclusion.

# Transformers

The main motivation for the transformer architecture was to improve the ability of neural networks to handle sequential data. Transformers can process data in parallel.

Dimensions:

```python
B: batch size
L: sequence length
H: number of heads
C: channels(also called d_model, n_embed)
V: number of models
```

Input embedding (B, L, C).

<div class="encoder-section">
  <img src="../static/notes/transformer.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>A parallel encoder on the left</li>
      <li>An autoregressive decoder on the right</li>
      <li>We can see that the output of the encoder is input for the decoder</li>
    </ul>
  </div>
</div>

I already covered what encoders and decoders are in [[genai2|Autoencoders]].

## What is an input embedding?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/input_embed.png" style="max-width: 100%; height: auto;">
</div>

What's important to understand is that: 

* the original sentence is derived into tokens (can be multiple tokens)
* then the tokens are mapped to some unique IDs that represent their position in the vocabulary. This one doesn't change since the vocabulary is fixed.
* embedding is the actual numerical representation of what the token means to the model (the meaning of the word). These values can change with fine tuning or training. They are supposed to change w.r.t the loss function.

## What is positional encoding?

* We want the word to carry some information about its position in the sentence.
* We want the model to map words that are close to each other as "close" and those that are distant as "distant".
* We want the positional encoding to represent a pattern that can be learned by the model.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pos_encoding.png" style="max-width: 100%; height: auto;">
</div>

Having the original sentence, we first convert to embeddings using the previous layer, to which we add the *Position Embedding Vector* of size *d_model* which is only computed once, and not learned! This vector represents the position of the word inside of the sentence. The output should represent the *encoder input* of size *d_model*.

>[!question] okok but hoooow do you get the positional embedding vector?
>* Sinusoidal Embedding Intuition

### Sinusoidal Embedding Intuition

In the paper we can see the following 2 formulas which are sine and cosine functions of different frequencies:

$$
PE_{(pos, 2i)} = \sin(\frac{pos}{10000^{\frac{2i}{d_{model}}}})
$$

$$
PE_{(pos, 2i+1)} = \cos(\frac{pos}{10000^{\frac{2i}{d_{model}}}})
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pos_encod_sin.png" style="max-width: 100%; height: auto;">
</div>

## Multi-Head Attention

### Self-Attention

Self-Attention allows the model to relate words to each other. It is a special case of attention where the query($Q$), key($K$), and value($V$) all come from the same source. It allows each element of a sequence to consider (or “attend to”) all other elements in the same sequence.

$$
Attention(Q,K,V) = softmax \begin{pmatrix} \frac{QK^T}{\sqrt{d_k}} \end{pmatrix}V
$$

 * Let's consider the sentence with sequence length $seq=6$ and $d_{model}=d_k=512$.
 * The matrices $Q,K,V$ are the same matrix representing input of 6 words represented by a vector of size 512. 
 * The softmax function ensures the values on each row sum up to 1. The values on each column represent how strong the words are correlated to one another.
 * By multiplying the softmax results with matrix V of size (6,512), we get a result that is of the same size as the input. This way, we not only get the position and meaning of the word, but also the relationship with ALL the other words.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/attn1.png" alt="Attn1" width="350" height="300"> </div> <div> <img src="../static/notes/attn2.png" alt="Attn2" width="350" height="300"> </div> </div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/attn.png" style="max-width: 100%; height: auto;">
</div>

### Multi-Head Attention

So I covered what Self-Attention is. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.

$$
MultiHead(Q,K,V) = Concat(head_1, ..., head_h)W^0
$$
$$
head_i = Attention(QW^0_i, KW^0_i, VW^0_i)
$$

Where the projections are parameter matrices

$$
W_i^Q \in R^{d_{model} \times d_k}, W_i^K \in R^{d_{model} \times d_k}, W_i^V \in R^{d_{model} \times d_v}, W^0 \in R^{hd_{v} \times d_{model}}
$$

* In the original paper, they employ h = 8 parallel attention layers, or heads. For each of these we use $d_k = d_v = d_{model}/h = 64$. Due to the reduced dimension of each head, the total computational cost is similar to that of single-head attention with full dimensionality.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/multihead_attn.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] A summary on MultiHead Attention as to how I understand it
>* So in my words, we get the input and split it into 3 copies of it (Q,K,V). Each of this copy is multiplied with their respective *parameter* matrices $W^Q, W^K, W^V$. The result (Q', K', V') is 3 matrices with the same size as the input which we further split into smaller matrices of size ($seq$, $d_k = d_{model}/h$). Every head will see the full sentence, but a smaller part of the embedding of each word. Then we calculate the attention of these smaller matrices ($Q_1, K_1, V_1$) using the formula from Self-Attention resulting into the $head_i$ matrices of the same size as before. And in the end we apply the MultiHead formula where we concatenate them and get the matrix $H(seq, h \times d_v = d_{model})$ which we further multiply with $W^0(h \times d_v, d_{model})$ and get the final MultiHead Attention Matrix (MH-A). 

We do this because we want each head to look at a different aspect of the same word. We know that, depending on the context, one word could be a noun, a verb, adverb, etc. So each head might learn how to relate that word as a noun, verb, adverb, etc. 

>[!question] Steven covered this pretty nicely: don't the heads just end up doing the same things?
>
>Intuitively, it could happen. But here’s why it usually doesn’t:
>
>* Each head has its own $W^Q, W^K, W^V$​ matrices, all initialized differently.
>* During training, if two heads start doing the same thing, they don’t both get rewarded equally -- gradients nudge them to specialize and reduce redundancy.
>* Why? Because doing the same thing doesn’t reduce the loss as effectively as learning different complementary patterns.
>
>This way, each head learns to watch different aspects of the same word.

### QKV

**Attention Mechanism**

<div class="encoder-section">
  <img src="../static/notes/QKV.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>Query(Q)</b>: "What am I looking for?"</li>
      <li><b>Key(K)</b>: "What do I have?"</li>
      <li><b>Value(V)</b>: "What you get for choosing me?"</li>
    </ul>
  </div>
</div>

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V \text{ In matrix form}
$$

$$
\begin{bmatrix}
\text{softmax}\left(\frac{\langle \mathbf{q}_1, \mathbf{k}_1 \rangle}{\sqrt{d}}\right) \mathbf{v}_1^T + \cdots + \text{softmax}\left(\frac{\langle \mathbf{q}_1, \mathbf{k}_n \rangle}{\sqrt{d}}\right) \mathbf{v}_n^T \\
\vdots \\
\text{softmax}\left(\frac{\langle \mathbf{q}_m, \mathbf{k}_1 \rangle}{\sqrt{d}}\right) \mathbf{v}_1^T + \cdots + \text{softmax}\left(\frac{\langle \mathbf{q}_m, \mathbf{k}_n \rangle}{\sqrt{d}}\right) \mathbf{v}_n^T
\end{bmatrix} \in \mathbb{R}^{seq \times d_{model}}
$$

## Layer Normalization

Layer Normalization applies normalization across features instead of across batches in the case of Batch Normalization

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/layernorm1.png" alt="LayerNorm1" width="350" height="300"> </div> <div> <img src="../static/notes/layernorm2.png" alt="LayerNorm2" width="350" height="300"> </div> </div>


* For example, if we take 3 items (could be the embedded inputs or features), we calculate the mean($\mu_i$) and the variance ($\sigma_i^2$) independently from each other and we replace each value with another value that is given by this expression $\hat{x}_j = \frac{x_j - \mu_j}{\sqrt{\sigma_j^2 + \epsilon}}$
* So basically, we are normalizing so that all values are in the range of $[0,1]$. 
* This was not in the lecture, but normally, we would also introduce two new parameters usually called **gamma**(multiplicative) and **beta**(additive) that introduce some fluctuations in the data, because maybe having all values between 0 and 1 may be too restrictive for the network. The network will learn to tune these two parameters to introduce fluctuations when necessary.

## Decoder

<div class="encoder-section">
  <img src="../static/notes/cross_MHA.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>On the decoder side of the transformer, we get the input from the encoder as (K,V) but the Query comes from the <b>Masked Multi-Head Attention</b> layer in the decoder. This is called cross multi-head attention.</li>
      <li>The Masked Multi-Head Attention layer is the self-attention of the input sentence of the decoder.</li>
    </ul>
  </div>
</div>

### Masked Multi-Head Attention

>[!summary] Summary of MMHA
>Our goal is to make the model causal: it means the output at a certain position can only depend on the words from the previous position. The model **must not** be able to see future words.

$$
\text{MaskedAttention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}} + M\right) V
$$

We just add the causal mask $M = \begin{bmatrix} 0 & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0\end{bmatrix}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/MMHA.png" style="max-width: 100%; height: auto;">
</div>

In the MultiHead Attention process, we apply this process before we apply the softmax function. 

## Inference and Training of a Transformer Model

\<SOS\> and \<EOS\> are two special tokens of the vocabulary that tell the model what the start and end of a sentence is.

* Let's say we want to translate the English sentence "I love you very much" to the Italian "Ti amo molto". 
* We can see that in the architecture of the transformer, the input of the decoder says (shifted right). That's because we add the \<SOS\> token at the start.
* We have to feed two sentences of the same length to the transformer. How to do this? **We add padding words to reach the desired length**.
* We expect the output to be "Ti amo molto \<EOS\>". This is called the "label" or the "target". 
* Then we compute the Cross-Entropy Loss and back-propagate through all the weights.
* **It all happens in one time step!**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/transf_training.png" style="max-width: 100%; height: auto;">
</div>

>[!quote] Inference is **the phase where a trained transformer processes new inputs and generates outputs, such as translating text or completing sentences**. Unlike training, where the model sees the entire sequence at once, during inference, the transformer generates output step-by-step, especially in tasks like text generation.

The main difference here is that we predict each token step-by-step. It doesn't all happen in one time step as in the training process.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/inference.png" style="max-width: 100%; height: auto;">
</div>

At the next time steps we don't need to compute the encoder output again. We take the output from the previous time step "Ti", we append it to the input of the decoder \<SOS\> and we repeat.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/inference2.png" style="max-width: 100%; height: auto;">
</div>

We stop when we see the \<EOS\> token. 

>[!question] Why do we need more time steps?
>* We selected, at every step, the word with the maximum softmax value. This strategy is called **greedy** and usually does not perform very well.
>* A better strategy is to select at each step the top *B* words and evaluate all the possible next words for each of them and at each step, keeping the top *B* most probable sequences. This is the **Beam Search** strategy and generally performs better.

## Linear Layer

The linear layer maps the output of the decoder from $(seq, d_{model})$ back to (seq, vocab_size). 


<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>