---
title: DDPMS for Dynamical Systems (State Space Approach)
draft: false
tags:
date: 2025-12-08
---
 
This guy notates the states in state space as *s* and the inputs as *a* (actions). 

* $s(0) = s_0$
* $a(k)$
* $s(t+1) = f(s(t), a(t))$

When the system becomes very complicated, it can become either unknown or unreliable.

chaos in dynamics = we can get different $s(0)$ depending on the conditions (think of double pendulum). Even if you have a deterministic model(state space), you are limited in terms of predicting its states. In practice, even if you have a good model, you are limited.

Inpainting is another way to condition the generative diffusion step (please research this, because I did not get it)

From Claude: **Inpainting** = Filling in missing or corrupted parts of data while keeping known parts fixed. it's replacing part of a trajectory (like changing a car to a tank) while maintaining consistency with the rest of the sequence.

**Guided sampling**: Steering the generation process toward desired outcomes by incorporating additional constraints or goals. For example, generating trajectories that satisfy specific conditions (reach a target, avoid obstacles, follow certain dynamics).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/control1.png" style="max-width: 100%; height: auto;">
</div> 

### DYNAMICALLY-CONSISTENT TRAJECTORY GENERATION

DDPMS for Dynamical Systems: they corrupt the discrete trajectory in time $\tau$ where we stack the states $\tau_t^k = [s_t^k, s_{t+1}^k, ..., s_{t+T}^k]$. $k$ stands for the amount of corruption we apply (noise). 

So basically we corrupt this trajectory with noise. 

We learn directly the closed loop system if we store in a RL (Reinforcement Learning) way: $\tau_t^k = [s_t^ka_t^k, s_{t+1}^ka_{t+1}^k ... s_{t+T}^ka_{t+T}^k]$

How denoising is done: copy paste from difussion denoising process -- aka NN. In this phase, the causal relations are learned. In the paper you will find one time-axis and one diffusion-axis.

The loss function is formulated as:

$$
\mathcal{L}(\theta)
=
\mathbb{E}_{k,\;\tau^k,\;\epsilon}
\left[
\left\lVert
\epsilon
-
\epsilon_\theta
\!\left(
\sqrt{\bar{\alpha}_k}\,\tau^k
+
\sqrt{1-\bar{\alpha}_k}\,\epsilon,
\;
k
\right)
\right\rVert^2
\right]
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/control2.png" style="max-width: 100%; height: auto;">
</div> 

Use *guided sampling* and *inpainting* to set up optimal control schemes.

* The dataset is augmented with reward signals (like in RL).
* The DDPM $V_\psi(\tau^k, k) = \mathcal{N}\!\left(\mu_\psi(\tau^k, k), \beta_k I \right)$ is trained to predict the expected cumulative return of trajectories.
* The DDPM $B_\psi(\tau^k, k) = \mathcal{N}\!\left(\mu_\psi(\tau^k, k), \beta_k I \right)$ is trained to predict the safety condition at each step of the trajectory.
* After training, we use $V_\psi$ and $B_\psi$ to guide the generation of $D_\theta$
* In this phase, the specific task is encoded and the safety conditions($B_\psi$) are also encoded.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/control3.png" style="max-width: 100%; height: auto;">
</div> 

Notice that we don’t need the dynamics $s_{t+1} = f(s_t,a_t)$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/control4.png" style="max-width: 100%; height: auto;">
</div> 

One advantage is the flexible prediction horizon.

This whole concept requires collecting good examples.



Difference between classifier free and classifier guidance??????

**Classifier free**: you have an extra vector that you add as extra input for DDPM which acts as additional conditions for the system you want to learn

**Classifier guidance**: train another NN to generate the V (map) function which maps a closed loop trajectory into a value. This value is the value-function in a RL sense. If the value is very high, it is a very good behaviour.

From Claude, because I don't trust myself:

**Classifier guidance**: Train a separate classifier network that predicts p(condition|x_t) at each noise level. During sampling, use its gradient to steer the diffusion toward high-probability regions for your desired condition. You're essentially using ∇log p(condition|x_t) to guide the denoising.

**Classifier-free guidance**: Train a single model that learns both conditional p(x|condition) and unconditional p(x) distributions (by randomly dropping the condition during training). At sampling time, extrapolate away from the unconditional prediction: ε_guided = ε_uncond + w(ε_cond - ε_uncond), where w is guidance scale.

Still have to understand these concepts.