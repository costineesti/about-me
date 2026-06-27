---
title: Temporal Difference Learning
draft: false
tags:
date: 2026-06-27
---

Related to [[ai for robotics 7|Value Based Methods]].

It's a Model-Free Policy Evaluation method together with [[Monte Carlo Learning|MC Learning]]. 

TD learns from incomplete episodes via bootstrapping. It waits for only one step to form a TD target and update $V(S_t)$ using the immediate reward $R_{t+1}$ and the current discounted guess of how good the next state is  $\gamma \cdot V(S_{t+1})$.

>[!summary] Bootstrapping
>
>bootstrapping in RL means that **you update a value based on some estimates and not on some exact values** and it's done via [[Bellman Equation|Bellman Update]].

Unlike [[Monte Carlo Learning]],

* TD can learn before knowing the final outcome
* TD can learn without the final outcome

TD exploits the [[Markov Decision Process|MDP]] structure.

**Simplest TD learning algorithm TD(0):** Update value $V(S_t)$ towards the TD target $R_{t+1} + \gamma \cdot V(S_{t+1})$. The **update equation** becomes:

$$
V(S_t) = V(S_t) + \alpha\delta_t
$$

where $\delta_t$ is the **TD Error** term between the estimated returns:

$$
\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)
$$

> Notice the similarity/difference to [[Monte Carlo Learning]]. We just replaced $G_t$ in the update equation with the Bellman Expectation Backup, $G_t=R_{t+1} + \gamma V(S_{t+1})$. Because we did this, the problem has to be MDP. It's not mandatory for Monte-Carlo.