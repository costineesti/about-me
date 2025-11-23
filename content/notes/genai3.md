---
title: Normalizing Flows
draft: false
tags:
date: 2025-11-23
---

Resources: [1](https://hongruizheng.com/2020/03/13/normalizing-flow.html), [2](https://lilianweng.github.io/posts/2018-10-13-flow-models/), [3](https://stevengong.co/notes/Normalizing-Flow)

Topic that I encountered in my [[genai|GenAI Models and Robotic Applications]] course at [[twente|Twente]].

>[!summary] Basic Concept
>Normalizing flow exploit the rule for change of variables. Normalizing flow begin with an initial distribution, and apply a sequence of K invertible transforms to formulate a new distribution.

Learns complex joint densities by decomposing the joint density into a product of one-dimensional conditional densities, where each $(x_i)$ depends on only the previous $(i-1)$ values (so just like in Markov):

$$
p_{model}(x)=\prod_i p\left(x_i | x_{1: i-1}\right)
$$

>[!summary] Quick summary of the difference between GAN, VAE, and flow-based generative models
> 1. **Generative adversarial networks**: GAN provides a smart solution to model the data generation, an unsupervised learning problem, as a supervised one. The discriminator model learns to distinguish the real data from the fake samples that are produced by the generator model. Two models are trained as they are playing a minimax game.
> 2. **Variational autoencoders**: VAE inexplicitly optimizes the log-likelihood of the data by maximizing the evidence lower bound (ELBO).
> 3. **Flow-based generative models**: A flow-based generative model is constructed by a sequence of invertible transformations. Unlike other two, the model explicitly learns the data distribution and therefore the loss function is simply the negative log-likelihood.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/normflow.png" style="max-width: 100%; height: auto;">
</div>

# What is Normalizing Flow?

Normalizing flow learns an invertible transformation $f$ between data and latent variables: $x = f(z), z = f^{-1}(x)$

* $x$ is a data sample
* $z$ is a latent variable sampled from a simple distribution

We can write in terms of probability density function (see [[changeofvar|Change-of-Variable Formula]] theorem in probability): $x=f(z) \text{, } p_x(x') = p_z(z) \left| \det \left( \frac{\partial f^{-1}}{\partial x} \right) \right|$ or $p_x(x') = p_z(z') \left| det[J_f] \right|$

Intuitively, we can also write $p_z(z) = p_x(x') \frac{1}{\left| det[J_f] \right|}$

>[!summary] Explaining the Jacobian
> $J_f$ is the Jacobian of the model from **z to x**.
>
> Since $\mathbf{x} = f(\mathbf{z})$, we have:
>
>$$
>J_f = \frac{\partial f}{\partial \mathbf{z}} = \frac{\partial \mathbf{x}}{\partial \mathbf{z}}
>$$
>
>It describes how the transformation $f$ maps from the latent space (z) to the data space (x).
>
> Conversely, $J_{f^{-1}} = \frac{\partial f^{-1}}{\partial \mathbf{x}} = \frac{\partial \mathbf{z}}{\partial \mathbf{x}}$ maps from x to z.
>
> $$
>\det[J_{f^{-1}}] = \frac{1}{\det[J_f]}
> $$


>[!NOTE] You can't just have $z$
>The function $f$ in normalizing flows is perfectly invertible. In normalizing flows, we care about density estimation, not reconstruction. The loss is based on the log-likelihood of data $x$ under the model (more below).
>
>* That would basically be an [[genai2|Autoencoder]].

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/normflow2.png" style="max-width: 100%; height: auto;">
</div>

* In **training**, data flows from $x \rightarrow z$ where $z = f^{-1}(x)$. We minimize the loss over $f^{-1}$ by computing the **Log Likelihood** using the [[changeofvar|Change-of-Variable Formula]]: $\log p_x(x) = \log p_z(z) + \log \left| \det \left( \frac{\partial f^{-1}}{\partial x} \right) \right|$
* In **sampling/generation**, data flows from $z \rightarrow x$, sample $z \sim p(z)$ from the base distribution, and apply the forward flow: $x = f(z)$. 

A normalizing flow transforms a simple distribution into a complex one by applying a sequence of invertible transformation functions. Flowing through a chain of transformations, we repeatedly substitute the variable for the new one according to the change of variables theorem and eventually obtain a probability distribution of the final target variable.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/normflow1.png" style="max-width: 100%; height: auto;">
</div>

We apply a chain of invertible transformations (**map the target distribution sequentially**):

$$
\mathbf{x} = f_K \circ f_{K-1} \circ ... \circ f_1(z) \text{, thus } \mathbf{z} = f^{-1} \circ ... \circ f_K^{-1}(\mathbf{x})
$$

As defined in the figure above, we have

$$
z_i \sim p_i(z_i) 
$$

$$
z_i = f_i(z_{i-1}), \text{ thus } z_{i-1} = f_i^{-1}(z_i)
$$

What does f look like? They’re generally Affine Transforms

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/flow1.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/flow2.png" alt="flow 2" width="350" height="300"> </div> </div>

**Flow Path (Forward Pass):**

$$
z[1:d] = x[1:d]
$$

$$
z[d+1:D] = x[d+1:D] \odot \exp(s_{\theta}(x[1:d])) + t_{\theta}(x[1:d])
$$

**Generative Path (Inverse Pass):**

$$
x[1:d] = z[1:d]
$$

$$
x[d+1:D] = (z[d+1:D] - t_{\theta}(z[1:d])) \odot \exp(-s_{\theta}(z[1:d]))
$$

* $s_{\theta}$ and $t_{\theta}$ are neural networks (often small CNNs or MLPs)
* Same parameters are reused in both directions.

# How weight updates work in flow-based models

Training is done via **maximum likelihood estimation (MLE)** using the change-of-variables formula.

### Change of Variables

Given $\mathbf{x} = f(z)$ and $\mathbf{z} \sim \mathcal{N}(0, I)$ (just a unit Gaussian):

$$
\log p_X(\mathbf{x}) = \log p_Z(f^{-1}(\mathbf{x})) + \log \left| \det \left( \frac{\partial f^{-1}}{\partial \mathbf{x}} \right) \right|
$$

We know that $\mathbf{z} = f^{-1}(\mathbf{x})$ and so we can write in the end:

$$
\log p_Z(\mathbf{z}) = \log p_X(f(\mathbf{z})) + \log \left| \det[J_{f^{-1}}] \right|
$$

### Training Steps

1. **Inverse Pass**: Given data $\mathbf{x}$, compute $\mathbf{z} = f^{-1}(\mathbf{x})$
2. **Compute log-likelihood loss:

$$
\mathcal{L} = -\log p_Z(\mathbf{z}) + \log \left| \det \left( \frac{\partial f}{\partial \mathbf{z}} \right) \right|
$$

3. **Backpropagate** through:
	* the inverse transformations $f^{-1}$
	* the neural nets $s_{\theta}$ and $t_{\theta}$
	* the log-determinant term
4. **Gradient Descent**:
	* Use Adam/SGD to update parameters $\theta$ in $s_{\theta}$ and $t_{\theta}$


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