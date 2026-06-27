---
title: Value Based Methods
draft: false
tags:
date: 2026-06-27
---

Related to [[ai for robotics 6|Reinforcement Learning]].

**Policy-based** methods directly train the policy to select what action to take given a state (or a probability distribution over actions at that state) and the **optimal policy** ($\pi^*$) is found by training the policy directly.

* can be deterministic or stochastic

>[!NOTE] Definition
>**Value-based** methods learn the value function that maps a state to the expected value of being at that state to have an optimal policy $\pi^*$. 
>
>$$
>\pi^*(s) = \arg \max_a Q^*(s,a)
>$$

$$
v(s) = \mathbb{E}[G_t \mid S_t=s]
$$

* $v(s)$ is the value of a state $s$
* $\mathbb{E}[G_t \mid S_t=s]$ is the expected discounted return of the agent if it starts in that state $s$

**State value functions**

Two typologies of value-based functions:

* **state-value function** (denoted with $v$): it calculates the value of a state $S_t$
	* $v(s) = \mathbb{E}[G_t \mid S_t = s] = \mathbb{E}[R_{t+1} + R_{t+2} + R_{t+3} + \dots \mid S_t = s]$
	* For each state, the state-value function $v(s)$ outputs the expected return $\mathbb{E}$ if the agent starts at that state **_s_** and then follows the policy $\pi$ forever afterwards (for all future timesteps, if you prefer).
* **action-value function** (denoted with $q$): calculate the value of the state-action pair $(S_t, A_t)$.
	* $q(s,a) = \mathbb{E}[G_t \mid S_t=s, A_t=a] = \mathbb{E} \left[ R_{t+1} + R_{t+2} + R_{t+3} + \dots \mid S_t = s, A_t=a \right]$
	* for each state and action pair, the action-value function outputs the expected return if the agent starts in that state, takes that action, and then follows the policy forever after.

>[!danger] To calculate **EACH** value of a state or a state-action pair is redundant. 
>Bellman Equation simplifies the state value or state-action value calculation.

In this course, we will focus on Epsilon Greedy $\epsilon$-greedy policy that handles the exploration/exploitation trade-off.

There are two strategies on how train our value function or our policy function.

1. [[Monte Carlo Learning]]
2. [[Temporal Difference Learning]]

---

**On-policy vs. Off-policy**

**On-policy** = learning from policy’s own demonstrations

* Direct experience. Evaluates or improves the policy that is used to make decisions. **Less** sample efficient
* **Examples**: `Value-Based Methods`(Sarsa), `Policy Gradient Methods`(PPO, A2C, A3C)

**Off-policy** = learning from other policy’s demonstrations. Off-Policy Learning is the idea of evaluating target policy $\pi(a \mid s)$ while following behavior policy $\mu(a \mid s)$.

* Evaluates or improves a policy different from that used to generate the data. **More** sample efficient.
* **Examples**: `Value-Based Methods`([[Q-Learning]], DQN), `Policy Gradient Methods`(DDPG, SAC, TD3)

>[!question] [[Q-Learning]] is off-policy, but we only update states that we visited?
>The fundamental difference is that the optimal policy is not followed from that. You learn about the optimal policy using data collected from a different policy.

---

**$\epsilon$-greedy Exploitation/Exploration**

The $\epsilon$-greedy strategy is a policy that handles the exploration/exploitation trade-off. With an initial value of $\epsilon = 1.0$:

* With _probability $1-\epsilon$ : we do exploitation (aka our agent selects the action with the highest state-action pair value).
* With probability $\epsilon$ : we do exploration (trying random action).

> At the beginning of the training, the probability of doing exploration will be huge since $\epsilon$ is very high, mainly exploring. But as the training goes on, Q-table estimates better, $\epsilon$ is reduced since we will need less and less exploration and more exploitation.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl6.png" style="max-width: 100%; height: auto;">
</div>

