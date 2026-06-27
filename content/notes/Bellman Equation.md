---
title: Bellman Equation
draft: false
tags:
date: 2026-06-26
---

Related to [[ai for robotics 7|Value Based Methods]]. Mathematics and ideas taken from [Steven](https://stevengong.co/notes/Bellman-Equation).

**FUNDAMENTAL IDEA**: Consider the value of any state as:

$$
\text{Value} = \text{immediate reward} + \text{discounted sum of future rewards (values)}
$$

i.e.

$$
V^\pi(s) = \mathbb{E}_\pi[r+\gamma V^\pi(s')]
$$

The bellman equation relates the value of a current state with the value of successive states. Apparently the problem is divided in **bellman expectation** and **bellman optimality**.

* the expectation is used in Policy Evaluation which defines the expected value of a state relating to successor states.

$$
\begin{aligned}
V^\pi(s) &= \mathbb{E}_{a \sim \pi(\cdot|s), s', r \sim p(\cdot|s,a)} [r + \gamma V^\pi(s')] \\
&= \sum_a \pi(a|s) \sum_{s', r} p(s', r | s, a) [r + \gamma V^\pi(s')] \\
\\
Q^\pi(s, a) &= \mathbb{E}_{s', r \sim p(\cdot|s,a)} [r + \gamma \mathbb{E}_{a' \sim \pi(\cdot|s')} Q^\pi(s', a')] \\
&= \sum_{s', r} p(s', r | s, a) [r + \gamma \sum_{a'} \pi(a'|s') Q^\pi(s', a')]
\end{aligned}
$$

We can write it recursively:

$$
\begin{aligned}
v(s) &= \mathbb{E}[R_{t+1} + v(S_{t+1}) \mid S_t = s] \\
\\
q(s,a) &= \mathbb{E}[R_{t+1} + q(S_{t+1}, A_{t+1}) \mid S_t = s, A_t = a]
\end{aligned}
$$

