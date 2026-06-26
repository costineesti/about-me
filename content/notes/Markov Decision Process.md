---
title: Markov Decision Process (MDP)
draft: false
tags:
date: 2026-06-26
---

Markov decision processes formally describe an environment for reinforcement learning where the environment is **fully observable**. 

* i.e. The current state completely characterizes the process
* Almost all problems can be casted as MDPs
* Optimal control primarily deals with continuous MDPs
* Bandits are MDPs with one state.

>[!quote] The future is independent of the past
>**Markov's property**
>
>A state $S_t$ is Markov if and only if $\mathbb{P}[S_{t+1} \mid S_t] = \mathbb{P}[S_{t+1} \mid S_1, \dots , S_t]$ i.e. the current state captures all relevant information from the history.
>
>* $\mathbb{P}$ is the conditional probability
>* i.e. The state is a sufficient statistic of the future

>[!NOTE] Definition
> **Markov Decision Process**
> A Markov Decision Process is a tuple $(\mathcal{S}, \mathcal{A}, \mathcal{T}, \mathcal{R}, \mathcal{S}_0, \gamma, H)$
> 
> - $\mathcal{S}$ is the set of all possible states
> - $\mathcal{A}$ is the set of all possible actions
> - $\mathcal{T}$ is the transition function $p(s' \mid s, a)$ which is the probability of landing at the next state $s'$ given a previous state $s$ and a selected action $a$
> - $\mathcal{R}$ is the reward function $r: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ mapping the expected reward achieved in a transition starting at $(s, a)$
>   $$r = \mathbb{E}[R \mid s, a]$$
> - $\mathcal{S}_0$ is the initial state distribution
> - $\gamma$ is the discount factor
> - $H$ is the planning horizon
> 

A MDP is considered "solved" if we find a policy that maximizes the expected discounted return.

$$
\max_\pi \mathbb{E} \bigg[ \sum_{t=0}^H \gamma^t R(S_t, A_t, S_{t+1}) \mid \pi \bigg]
$$

* i.e. the sum of discounted rewards from state $s$ and acting optimally

