---
title: Flow Matching
draft: false
tags:
date: 2025-11-28
---
 
Lecture from the [[genai|GenAI Models and Robotic Applications]]. Related to [[genai3|Normalizing Flows]].

Resources: [Flow Matching for Generative Modeling paper](https://arxiv.org/pdf/2210.02747), [this blog from Cambridge](https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html)

>[!summary] Flow matching is a training method used to learn a mapping from a source distribution to a target distribution by approximating the underlying vector field.

Diffusion $\in$ Flow Matching $\in$ Generative Models

# Velocity Fields and Continuous Normalizing Flows (CNF)

In [[genai3|NF]], we had $\mathbf{x} = f(z)$ and $\mathbf{x} = f_K \circ f_{K-1} \circ ... \circ f_1(z)$. The transformations are independent.

<div class="encoder-section">
  <img src="../static/notes/FM1.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Deblai: base probability density (to sample from)</li>
      <li>Remblai: target probability density (images, videos).</li>
    </ul>
  </div>
</div>

### Time-Dependent Velocity Field

We have a trajectory from the noise to a realistic output $\phi_0(\mathbf{x}) = \mathbf{x}_0$ .... 

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/flow1.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/flow2.png" alt="flow 2" width="350" height="300"> </div> </div>

>[!NOTE] Different definitions use different steps. We use $t = 0 \rightarrow t = 1$.
> We can now consider the rate of displacement in time with help of derivatives.

$$
\frac{d}{dt} \phi_t(x) = v_t(\phi(x))
$$

The velocity is essentially a model that given an input, time step, and parameter, it's able to approximate the velocity with a neural network.

$$
f(x,t,\theta) = v_t(\theta_t(x))
$$

We have a ordinary differential equation (ODE). 

$$
v_t(\phi(x)) = \frac{d}{dt} \phi_t(x)
$$

$$
f_t(x) = \frac{dx}{dt}
$$

>[!question] Which velocity fields are relevant?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FM3.png" style="max-width: 100%; height: auto;">
</div>

We already covered in [[genai3|Normalizing Flows]] that with the help of [[changeofvar|Change-of-Variable Formula]] we can go from one Density Function to another with the following formula:

$$
p_{base}(\mathbf{x'}) = q(\mathbf{z'}) \left| det[J_{\phi}] \right|
$$

* which is the same as

$$
q(z') = p_{base}(\mathbf{x'}) \left| det[J_{\phi^{-1}}] \right|
$$
* where training is done via [[MLE|Maximum Likelihood Estimation]]

$$
\log{q(\mathbf{z})} = \log{p_{base}(\mathbf{x})} + \log{\left| det[J_{\phi^{-1}}] \right|}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FM4.png" style="max-width: 100%; height: auto;">
</div>

* don't forget that to go from **target distribution space $\mathbf{x}$ to latent space $\mathbf{z}$**, we define $\mathbf{x} = \phi^{-1}(z)$

>[!quote] The logarithmic compression of a volume element equals the time-integrated expansion rate along its path
>Jacobi's formula

At this moment, we have complexity $O(n^2)$ because the Jacobian Matrix $J$ has $n \times n$ elements. If we want to compute the determinant of that, we actually have $O(n^3)$ complexity.

So using Jacobi's formula, we show that we only need the **Trace** of the Jacobian Matrix (sum of the diagonal) 

$$
\left| \det [J_{\phi^{-1}}] \right| = \left| \det \begin{bmatrix}
\colorbox{orange}{$\frac{\partial x_1}{\partial z_1}$} & \frac{\partial x_1}{\partial z_2} & \cdots & \frac{\partial x_1}{\partial z_n} \\
\frac{\partial x_2}{\partial z_1} & \colorbox{orange}{$\frac{\partial x_2}{\partial z_2}$} & \cdots & \frac{\partial x_2}{\partial z_n} \\
\vdots & \vdots & \colorbox{orange}{$\ddots$} & \vdots \\
\frac{\partial x_n}{\partial z_1} & \frac{\partial x_n}{\partial z_2} & \cdots & \colorbox{orange}{$\frac{\partial x_n}{\partial z_n}$}
\end{bmatrix} \right|
$$

$$
\log \left| \det [J_{\phi^{-1}}] \right| = - \int_0^1 \text{Tr} \left( \frac{\partial \mathbf{v}_t(\phi_t(\mathbf{x}))}{\partial \phi_t(\mathbf{x})} \right) dt
$$

This reduces the complexity from $O(n^2)$ to $O(n)$.

So now, considering the equations from before, we can express the **end location** as the **start** $+$ **the accumulated displacement** over $t={0,1}$:

$$
\log{q(\mathbf{\phi_1(\mathbf{x}}))} = \log{p_{base}(\phi_0(\mathbf{z}))} + \int_0^1 \text{Tr} \left( \frac{\partial \mathbf{v}_t(\phi_t(\mathbf{x}))}{\partial \phi_t(\mathbf{x})} \right) dt
$$

$$
\phi_1(\mathbf{x}) = \mathbf{x} + \int_{t=0}^1 \mathbf{v}_t(\phi_t(\mathbf{x}))dt
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FM5.png" style="max-width: 100%; height: auto;">
</div>


>[!danger] ODE numerical simulations are very expensive
>Since we want to train a ODE NN with max likelihood. This is where Euler's Method comes in.

>[!quote] For ordinary differential equations (ODEs) we can approximate their solution by taking small sequential steps using a tangent
>Euler's Method
>$$
>\mathbf{x} = \mathbf{x}_0 + f_{t=0}(\mathbf{x}_0)(t-t_0)
>$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FM6.png" style="max-width: 100%; height: auto;">
</div>

So I hope it's clear that we approximate the velocity field with an ODE solver (e.g. Euler's rule).

Now we can define the **Loss Function of Flow Matching based models** which is based on MSE (Mean Squared Error):

$$
\mathcal{L}_{FM}(\theta) = E_{t,p_t(\mathbf{x})} \left|| \mathbf{v_t(\mathbf{x};\theta) - u_t(\mathbf{x})} \right||^2
$$

where

* $p_t(\mathbf{x})$ is the probability path
* $\mathbf{v_t(\mathbf{x};\theta)}$ is the velocity NN with $\theta$ params
* $u_t(\mathbf{x})$ is the velocity field from solver (Euler)

So I covered the fact that CNFs are slow due to the ODE integration at each iteration. CFMs are a very nice solution!

# (Conditional) Flow Matching (CFM)

Can be CLIP as the condition(the label). They use the Euler approximation which gives those cartoonish effects in most generative models' output. So it's basically always sampling through an enormous database (400 million) in case of CLIP.

**But what should the probability path be?**

$$
p_t(\mathbf{x}) = \int p_t(\mathbf{x} \mid \mathbf{x}_1) d\mathbf{x}_1
$$

The CFM loss function learns a velocity field conditioned on target samples $\mathbf{x}_1$ from $q(\mathbf{x}_1)$, where $p_t(\mathbf{x} \mid \mathbf{x}_1)$ is a path distribution.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FM8.png" style="max-width: 100%; height: auto;">
</div>

**The key difference**: CFM conditions on individual data points $\mathbf{x}_1$ from the target distribution $q(\mathbf{x}_1)$, making training easier by decomposing the problem into simpler conditional paths.

$$
\mathcal{L}_{\text{CFM}}(\theta) = \mathbb{E}_{t,q(\mathbf{x}_1),p_t(\mathbf{x}|\mathbf{x}_1)} ||\mathbf{v}_t(\mathbf{x}; \theta) - \mathbf{u}_t(\mathbf{x}|\mathbf{x}_1)||^2
$$

* $\mathbf{x}_1$ is the image in the database 
* $\mathbf{x}_0$ is the noise sample. 
* **c** is the constraint from CLIP (text) or any other [[VLM]].

**CFM inference**: find a image in the database based on the constraint (c = labels(i)).

<div class="encoder-section">
  <img src="../static/notes/FM7.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Key Insights:</li>
	      <ul>
	      <li>Their gradients are identical. The two loss functions only differ by a constant offset <b>C</b></li>
	      <li>Optimizing CFMs is equivalent to optimizing FMs (same optimal parameters)</li>
	      <li>So you can train using CFM and get the same results as the harder-to-compute FM</li>
	      </ul>
    </ul>
  </div>
</div>

Reminder: velocity is the rate of change between random noise and the image from the database. 

# Diffusion

We are filtering out the noise.

# Mean Flow

e = noise
x = actual data

The bigger the step, much farther away we are from the actual image. I want to not be constrained by where I am. I want to start at *r* and stop at *t*. I'll take the average velocity accumulated. $\tau = t-r$ is the new timestep. It works best for bigger steps.

The loss function is as in FM, but they take the mean velocity. Understand the highlighted part from the paper (t=r). You mix the mean flow and the normal flow (In some steps you do one, in some you do the other).






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