---
title: Model-Based Reinforcement Learning
draft: false
tags:
date: 2026-06-27
---

**Model-Based RL**

only differs from its model-free counterpart in learning or using a **dynamic model** to improve policy learning. It learns/uses the model to predict the next state and reward given a state an action: $s_{t+1}, r_{t+1} = f_\theta(s_t, a_t)$.

doesn't require real-world interaction.

**Advantages**

* Reduces the need for real-world interactions by using synthetic data.
* Better exploration since the models predict outcomes of unexplored actions.
* Transfer Learning

**Disadvantages**

* Training models and planning can be expensive.
* Some methods struggle with high-dimensional or continuous spaces.