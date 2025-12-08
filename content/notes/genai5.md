---
title: Diffusion Models
draft: false
tags:
date: 2025-12-08
---
 
Add noise gradually and learn to reverse the process

$$
x_{t-1} = \alpha_t(x_t - \gamma \epsilon_{\theta}(x_t,t)) + N(0, \sigma_t^2)
$$

which can also be interpreted as

$$
x' = x - \gamma \triangledown E(x)
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_1.png" style="max-width: 100%; height: auto;">
</div>

# Denoising Diffusion Probabilistic Model (DDPM)

DDPMs are a class of generative mode where the output generation is modeled as a denoising process, often called Stochastic Langevin Dynamics.

Looking at the figure above, it's really only a 2-step process:

1. A fixed (or predefined) forward diffusion process **q** that adds Gaussian noise
2. A learned reverse denoising diffusion process $p_{\theta}$

## 1. Forward Diffusion Process in DDPM

In the forward diffusion process, for each timestep **t**, we add unit Gaussian noise to the previous sample $x_{t-1}$ to produce $x_t$:

$$
x_t = \sqrt{1-\beta_t} \cdot x_{t-1} + \sqrt{\beta} \cdot \epsilon, \epsilon \sim N(0,I)
$$

* $I$ is the Identity Matrix

As a condition probability, this is written as:

$$
q(x_t \mid x_{t-1}) = (\sqrt{1 - \beta_t})x_{t-1} + \sqrt{\beta_t} \epsilon
$$

or in general form:

$$
q(x_T \mid x_0) = \prod_{k=1}^T q(x_t | x_{t-1})
$$

* $\sqrt{\beta_t}$ is the variance of the noise
* $\sqrt{1-\beta_t} \cdot x_{t-1}$ is the mean

So basically, **Forward Diffusion** is a Markov Chain.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_2.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Why $\sqrt{1-\beta_t}$?
>
>Apparently, this is to ensure that the total variance remains 1. This shows that using $\sqrt{1-\beta_t}$ ensures that $x_t$ remains unit gaussian. The fact that $x_{t-1}$ and $\epsilon$ are independent, allows the variances to sum.
>
> $$
> \begin{align} \text{Var}(x_t) &= \text{Var}(\sqrt{1-\beta_t}x_{t-1} + \sqrt{\beta_t}\epsilon) \\ &= \text{Var}(\sqrt{1-\beta_t}x_{t-1}) + \text{Var}(\sqrt{\beta_t}\epsilon) \\ &= (1-\beta_t)\text{Var}(x_{t-1}) + \beta_t\text{Var}(\epsilon) \\ &= (1-\beta_t)I + \beta_t I \\ &= I \end{align}
> $$

>[!summary] Variance Schedule
>
>$\beta_t$ does not have to be constant at each time step, we actually define variance schedule, $0 < \beta_1 < \beta_2 < ... < \beta_T < 1$.
>
>* it's quite similar to the ideas behind Learning Rate
>* Can be linear, quadratic, cosine, etc.
>

>[!NOTE] Forward Diffusion is a Stochastic Differential Equation

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_4.png" style="max-width: 100%; height: auto;">
</div>

## 2. Denoising Process

Now, let's say we want to reverse the process. We know how $p(x_t \mid x_{t-1})$ is calculated. So we want to get $p(x_{t-1} \mid x_t)$.

We know from Bayes Rule that

$$
P(x_{t-1} \mid x_t) = \frac{P(x_t \mid x_{t-1}) \cdot P(x_{t-1})}{P(x_t)}
$$

* From all this, we don't know $P(x_{t-1})$. That is the thing we want to predict.

Apparently, the solution is to always slap a universal function approximator, aka neural network

$$
p_{\theta}(x_{t-1} \mid x_t) = N(\mu_{\theta}(x_t,t), \sigma_{\theta}(x_t,t))
$$

* The neural net learns two parameters: $\mu_{\theta}$ and $\sigma_{\theta}$

>[!NOTE] In the original paper
>
>They only made the neural net learn $\mu$, and fixed $\sigma$ the variance.
>
>$p_{\theta}(x_{t-1} \mid x_t) = N(\mu_{\theta}(x_t,t), \sigma_{\theta}I)$
>
>We will also assume in this course that the variance of the (to be) removed noise is also diagonal.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_3.png" style="max-width: 100%; height: auto;">
</div>

The reverse process is also a Markov Chain:

$$
p_{\theta}(x_0) = p(x_T) \prod_{t=1}^T p_{\theta}(x_{t-1} \mid x_t)
$$

### Formulating the loss function

We go from the forward pass

$$
x_t = (\sqrt{1-\beta_t})x_{t-1} + \sqrt{\beta_t}\epsilon
$$

to the generative pass

$$
x_{t-1} = \frac{\sqrt{1}}{{\sqrt{1-\beta_t}}} \begin{pmatrix} x_t - \sqrt{\beta_t} \hat{\epsilon}_{\theta}(x_t, t) \end{pmatrix}
$$

And so we formulate the **loss function** as:

$$
\mathcal{L}_{\text{DM}} = \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}), t} \left[ \| \boldsymbol{\epsilon} - \hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t) \|_2^2 \right] 
$$

**How do we formulate the objective function for the neural net to learn?**

We use U-Net (page incoming)

>[!question] Flow matching vs. Diffusion?
>
>The image kinda says it all.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/diffusion_5.png" style="max-width: 100%; height: auto;"> </div>
>
>**Diffusion**:
>* Stochastic models: given a noise sample, it generates diverse samples (many trajectories),
>* Gradually destroys a data point over time by progressively adding Gaussian Noise,
>* Trains by estimating the added noise at step t (to be removed to obtain the sample at t-1),
>* Needs many step for generation.
>
>**Flow**:
>* Deterministic model: given a noise sample, it generates a specific sample(single trajectory),
>* The forward process is a linear interpolation of the data point and noise sample,
>* Trains by minimizing the difference between an estimated and ground truth (Euler) velocity,
>* Generates in many less steps than DMs.

# Conditional Diffusion

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_6.png" style="max-width: 100%; height: auto;">
</div>

The reverse process becomes

$$
p_{\theta}(x_0 \mid c) = p(x_T) \prod_{t=1}^T p_{\theta}(x_{t-1} \mid x_t,c)
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_7.png" style="max-width: 100%; height: auto;">
</div>

## Classifier Guidance and Classifier-Free Guidance

Sources: [Ho and Salimans, 2021 -- Classifier Free](https://arxiv.org/pdf/2207.12598), [Song et al., 2021 -- Classifier Guidance](https://arxiv.org/pdf/2011.13456), [Diffusion models beat gans on image synthesis](https://arxiv.org/pdf/2105.05233), [meta guide, page 33](https://arxiv.org/pdf/2412.06264)

>[!danger] Make sure you cover this part

$$
\mathcal{L}_{DM} = E_{x_0, \epsilon \sim \mathcal{N}(0,I), t} \left[ \left\| \epsilon - \left( \hat{\epsilon}_\theta(x_t, t) - \gamma \nabla_{x_t} \log p(y|x_t) \right) \right\|_2^2 \right]
$$

# Latent Diffusion Model (LDM)

You go through decoder, do diffusion in latent space, and then decode that.

* The idea is that diffusion is a very expensive process, but encoding / decoding is much faster

The paper covering this is **High-Resolution Image Synthesis with Latent Diffusion Models**.

>[!quote] Being likelihood-based models, they do not exhibit mode-collapse and training instabilities as GANs and, by heavily exploiting parameter sharing, they can model highly complex distributions of natural images without involving billions of parameters as in AR models
>
>To stage training:
>
>1. Train an autoencoder to encode images in latent space
>2. Train diffusion to predict in latent space
>
>Be predicting in latent space, we can reduce the computational load.

So what I should remember is that:

* The diffusion and denoising are done on a compressed (lower-dimensional) version of the samples

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_8.png" style="max-width: 100%; height: auto;">
</div>

I love when professors do charity work:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/diffusion_9.png" style="max-width: 100%; height: auto;">
</div>

Some applications where we want to use diffusion models:

* text-to-image generation
* image editing and composition
* visual illusions
* novel view synthesis
* policy generation in robotics
* video generation
* ...

