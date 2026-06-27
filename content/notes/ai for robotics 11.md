---
title: Decision Transformers
draft: false
tags:
date: 2026-06-27
---

Instead of fitting a value function or optimizing a policy, Decision Transformers reframe RL as a **sequence modelling problem** using a [[transformers|Transformer]] architecture.

The key shift: rather than _maximizing_ return, the model _generates_ actions conditioned on a **desired return**. You tell it what return you want, and it produces the actions to get there.

> This is a complete paradigm shift — no [[Bellman Equation]], no reward maximization, just trajectory generation.

**Input sequence at each step:**  

$$
(\hat{R}_t, s_t, a_t, \hat{R}_{t+1}, s_{t+1}, a_{t+1}, \dots)
$$

where $\hat{R}_t$​ is the **return-to-go** (desired future return from timestep $t$).

**How it works:**

1. Represent the RL problem as a sequence of $(R, s, a)$ tuples
2. Condition the transformer on a target return
3. Autoregressively predict the next action given history + return condition
4. At inference, sample actions step-by-step conditioned on the highest return seen during training

**Advantages:**

- Leverages transformer strengths -- handles long-horizon and multi-task problems well
- No reward engineering or value function needed
- Trajectories are interpretable as sequences

**Disadvantages:**

- Sensitive to data quality and trajectory length
- Computationally expensive
- Can't discover strategies _beyond_ what's in the training data -- unlike RL, it can't explore