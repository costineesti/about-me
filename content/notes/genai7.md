---
title: Motion Prediction
draft: false
tags:
date: 2026-01-22
---

Sources: UTwente slides, [Stochastic trajectory prediction via motion indeterminacy diffusion](https://arxiv.org/pdf/2203.13777), [Vectornet: Encoding hd maps and agent dynamics from vectorized representation](https://arxiv.org/pdf/2005.04259), [LAformer: Trajectory Prediction for Autonomous Driving with Lane-Aware Scene Constraints](https://arxiv.org/pdf/2302.13933)
 
<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred1.png" style="max-width: 100%; height: auto;">
</div> 

**Trajectory Conditional Prediction**:

$$
Y \leftarrow p_{\theta}(Y_{H+1:F} \mid X_{0:H}, \text{constraints})
$$

* where the constraints include social interactions with other agents, maps for e.g.
* $[0,H]$ is the observation time horizon and $[H+1,F]$ is the prediction time horizon.

**Conditional Prediction**: you need to make decisions in either seconds (e.g. autonomous driving), or minutes (e.g. marine application)

We model the **trajectory prediction** as **spatial-temporal mapping** and then we can divide it into:

* Scene constraints
* Multi-path prediction
* Interaction modeling

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred2.png" style="max-width: 100%; height: auto;">
</div> 

The limitations of generative models on this task are:

* Difficult to train,
* Limited variety, e.g. [[genai11|modal collapse]] problem.

# Diffusion Models for Trajectory Prediction

>[!question] Why Diffusion?
>
>* **Multi-modality**: naturally generate diverse possible futures (not just one)
>* **Stable training**: unlike GANs, no [[genai11|mode collapse]] or adversarial instability
>* **Uncertainty modeling**: probabilistic sampling fits real-world robotics needs
>* **Flexible conditioning**: can incorporate maps, goals, dynamics, safety constraints
>* **Strong empirical results**: state-of-the-art in trajectory forecasting & robot planning

So basically, they are state-of-the-art. And in this case, many applications have already been developed on top of Diffusion. There are interesting improvements like [[genai5|Mean Flow]] which appeared in May 2025. Anyways..

So we return to the Conditional Prediction:

**Encoding of the condition (C): scene constraints and interactions**

$$
Y \leftarrow p_{\theta}(Y_{H+1:F} \mid X_{0:H}, \text{C})
$$

This can be done through:

<div class="encoder-section">
  <img src="../static/notes/motion_pred3.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Rasterized maps</li>
	      <ul>
	      <li>e.g. bird-eye-views, semantic maps</li>
	      </ul>
	<li>Vectorized maps</li>
		<ul>
	      <li>e.g. HD maps</li>
	      </ul>
    </ul>
  </div>
</div>

**PROS and CONS** of these visualizations

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred4.png" style="max-width: 100%; height: auto;">
</div> 

**Interaction Modeling**:

1. Global interactions using **Graph Convolutional Networks** (GCN).

* A fully-connected graph models agent-to-agent, agent-to-scene, and scene-to-scene interactions
* Self-supervised learning is used to predict the masked nodes

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred5.png" style="max-width: 100%; height: auto;">
</div> 

2. Agent-to-scene interactions using using likelihood estimation

* Use a binary classifier to estimate the likelihood of each lane aligned with the target agent’s motion dynamics at each time step
* Only select the top-**k** lane candidates

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred6.png" style="max-width: 100%; height: auto;">
</div> 

3. Interactions modeling with attentions (a.k.a. leveraging [[transformers]]).

* Each agent computes a **query** vector (as in its own. the queries are individual)
* Other agents provide the **keys** and **values**.
* Then simply compute the attention weights.
* We can expect the result to be a weighted sum of interactions.
* My intuition tells me you would need lots of data for this.

**Multi Path-Prediction**:

Reminding [[genai5|diffusion]]: a forward diffusion process that gradually corrupts an input sample $x_0$ by adding Gaussian noise over $T$ timesteps.

$$
q(x_t \mid x_0) = \mathcal{N}\begin{pmatrix} x_t; \mu=\sqrt{\bar{\alpha}_t}x_0, \sigma = (1-\bar{\alpha}_t)I \end{pmatrix}
$$

where $\bar{\alpha}_t = \sum_{s=1}^t \alpha_s$ is the cumulative product of the noise schedule parameters with $\alpha_s = 1 - \beta_s$

The **denoising** step trains a neural network to **reverse the noise** and recover data.

$$
\mu_\theta(x_t, t)
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t
-
\frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}}
\,
\epsilon_\theta(x_t, t)
\right)
$$

$$
p_\theta(x_{t-1} \mid x_t)
=
\mathcal{N}\!\left(
x_{t-1};
\mu_\theta(x_t, t),
\Sigma_\theta(x_t, t)
\right)
$$

>[!question] So, how to apply diffusion models for trajectory prediction?
>
>We defined the conditional prediction as $Y \leftarrow p_{\theta}(Y_{H+1:F} \mid X_{0:H}, \text{C})$.
>
>Now we are going to denoise $Y$:
>
>* $f$ is the encoding of the condition $(X_{0:H}, \text{constraints})$
>* $k \in [1, K]$, where $K$ is the maximum number of diffusion steps.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/motion_pred7.png" style="max-width: 100%; height: auto;"> </div>

code implementation: [github lik](https://github.com/Gutianpei/MID/blob/main/models/diffusion.py). There were also lots of teams who submitted their approaches to the `Argoverse 2: Motion Prediction Challenge`. I will leave the link here in case of future need: [link to challenge](https://eval.ai/web/challenges/challenge-page/1719/leaderboard/4098).

One colleague asked in class why do we always have to make it stochastic? A concept such as trajectory prediction can be very simply be made deterministic using concepts such as cubic polynomials, splines, or Bezier Curves. For example, during my [[Bachelors|bachelors thesis]], I was collaborating with the Bosch Future Mobility Challenge group, and they approximated the future short-distance trajectory using Bezier Curves; which I found extremely interesting. But I guess stochasticity allows you to slap the universal function approximator (aka Neural Networks).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/motion_pred8.png" style="max-width: 100%; height: auto;">
</div> 

Some **metrics** include *Average Displacement Error* (ADE), *Final Displacement Error* (FDE)

$$
\mathrm{ADE}
=
\frac{1}{N T}
\sum_{i=1}^{N}
\sum_{t=1}^{T}
\left\lVert \hat{x}_{i,t} - x_{i,t} \right\rVert
$$

$$
\mathrm{FDE}
=
\frac{1}{N}
\sum_{i=1}^{N}
\left\lVert \hat{x}_{i,T} - x_{i,T} \right\rVert
$$

where

* $N$ is the number of agents,
* t are the timesteps,
* $\hat x$ is the predicted step while $x$ is the ground-truth position.

On top of these two, some other metrics can be defined.

* **Miss Rate** (MR)
	* The number of scenarios where none of the forecasted trajectories are within 2.0 meters of ground truth according to the endpoint error
	* $\mathrm{FDE} = \frac{1}{N} \sum_{i=1}^{N} \left\lVert \hat{x}_{i,T} - x_{i,T} \right\rVert > 2.0$
	* This metric gives a hint, in general, **how many scenarios are failed**
* **Collision Rate** (CR)
	* Percentage of generated trajectories that collide with other agents or obstacles, distance < 0.1m
* **Multimodal Predictions**: as models output $K$ samples
	* **minADE_K $\mid$ minFDE_K**
		* best-of-K error (take the predictions closest to the ground-truth)
	* **Miss Rate** (MR@K)
		* Fraction of cases where none of the $K$ predicted trajectories fall within a set threshold (e.g., 2m) of the ground truth final point
		* Useful to measure coverage of plausible futures
	* **Brier-minFDE**
		* $\text{Brier-minFDE} = (1-p)^2 \cdot \text{minFDE}$,
		* $p$ is the probability of the best predicted trajectory out of the K samples.
* **Negative Log-Likelihood**




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