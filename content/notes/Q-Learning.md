---
title: Q-Learning
draft: false
tags:
date: 2026-06-27
---

Related to [[ai for robotics 7|Value Based Methods]].

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl4.png" style="max-width: 100%; height: auto;">
</div>

Q-Learning is an **off-policy value-based method** that uses a [[Temporal Difference Learning|TD approach]] to train its action-value function.

DQL is for the continuous state case. instead of using a table, uses a Neural Network that takes a state and approximates Q-values for each action based on that state

**Tabular Q-Learning**

* Consider off-policy learning of action-values $Q(s,a)$
* Next action is chosen using behavior policy $a_{t+1} \sim \mu(\cdot \mid s_t)$
* But we consider alternative successor $a' \sim \pi(\cdot \mid s_t)$
	* We let $a' = \arg \max_a Q(s_{t+1},a)$
* And update $Q(s_t, a_t)$ towards value of alternative action $Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha[r_{t+1} + \gamma Q(s{t+1},a') - Q(s_t,a_t)]$

>[!NOTE] Q-Learning Properties (Off-policy learning)
>Q-Learning converges to optimal policy -- even if it's acting suboptimally
>
>Q-learning generally uses the 1-step bellman optimality backup
>
>Q-learning can produce excellent results for relatively small environments because each state space is discrete and small. For comparison, the state space of a simple video game could contain few billion states, making it practically useless

* **Sarsa** is the on-policy version of Q-learning

**Off-policy Control with Q-Learning**

* We now allow both behavior and target policies to improve
* The target policy $\pi$ is greedy w.r.t. $Q(s,a) \pi(S+{t+1}) = \text{argmax}_{a'} Q(S_{t+1}, a')$

Q-Learning control algorithm: $Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t) \right]$

* $\max_{a'} Q(s_{t+1}, a')$ is the **off-policy target aspect**: this is what makes Q-learning "off-policy". Instead of looking at the action the agent _actually_ chooses next, it looks ahead to the next state $s_{t+1}$​ and assumes it will select the absolute best possible action ($a′$) available there.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl5.png" style="max-width: 100%; height: auto;">
</div>

