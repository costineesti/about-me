---
title: Diffusion Models
draft: false
tags:
date: 2025-12-05
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
>$$\begin{align} \text{Var}(x_t) &= \text{Var}(\sqrt{1-\beta_t}x_{t-1} + \sqrt{\beta_t}\epsilon) \\ &= \text{Var}(\sqrt{1-\beta_t}x_{t-1}) + \text{Var}(\sqrt{\beta_t}\epsilon) \\ &= (1-\beta_t)\text{Var}(x_{t-1}) + \beta_t\text{Var}(\epsilon) \\ &= (1-\beta_t)I + \beta_t I \\ &= I \end{align}$$

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


