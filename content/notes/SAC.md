---
title: Soft Actor Critic (SAC)
draft: false
tags:
date: 2026-06-27
---

Related to [[Actor Critic Methods]].

SAC is an **off-policy actor-critic** algorithm but adds an **entropy term** to the reward, encouraging the policy to **explore more** by remaining **stochastic during training**.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl16.png" style="max-width: 100%; height: auto;">
</div>

It uses **two critic networks** like TD3 to reduce overestimation in bias and improve stability.

$$
\pi^* = \arg\max_\pi \mathbb{E}_{\tau \sim \pi} \left[ \sum_{t=0}^{\infty} \gamma^t \left( R(s_t, a_t, s_{t+1}) + \underbrace{\alpha H(\pi(\cdot|s_t))}_{\text{Entropy}} \right) \right]
$$

SAC qualities:

* **stable training** by reducing overestimation
* **exploration**: entropy regularization prevents early convergence.
* **sample efficiency**: off-policy learning (replay buffer) improves data usage.
* **automatic tuning**: learns $\alpha$ to balance exploration and exploitation.
* **continuous actions**: naturally handles high-dimensional action spaces.

