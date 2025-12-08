---
title: DDPMS for Dynamical Systems (State Space Approach)
draft: false
tags:
---
 
This guy notates the states in state space as *s* and the inputs as *a* (actions). 

$s(0) = s_0$

$a(k)$

$s(t+1) = f(s(t), a(t))$

When the system becomes very complicated, it can become either unknown or unreliable.

chaos in dynamics = we can get different $s(0)$ depending on the conditions (think of double pendulum). Even if you have a deterministic model(state space), you are limited in terms of predicting its states. In practice, even if you have a good model, you are limited.

Impainting is another way to condition the generative diffusion step (please research this, because I did not get it)

DDPMS for Dynamical Systems: they corrupt the discrete trajectory in time $\tau$ where we stack the states $\tau_t^k = [s_t^k, s_{t+1}^k, ..., s_{t+T}^k]$. k stands for the amount of corruption we apply (noise). 

So basically we corrupt this trajectory with noise. 

We learn directly the closed loop system if we store in a RL (Reinforcement Learning) way: $\tau_t^k = [s_t^ka_t^k, s_{t+1}^ka_{t+1}^k ... s_{t+T}^ka_{t+T}^k]$

How denoising is done: copy paste from difussion denoising process -- aka NN. 

In the paper you will find one time-axis and one diffusion-axis.

Use *guided sampling* and *impainting* to set up optimal control schemes.

Difference between classifier free and classifier guidance??????

classifier free: you have an extra vector that you add as extra input for DDPM which acts as additional conditions for the system you want to learn

classifier guidance: train another NN to generate the V (map) function which maps a closed loop trajectory into a value. This value is the value-function in a RL sense. If the value is very high, it is a very good behaviour.



