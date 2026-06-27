---
title: Actor-Critic Methods
draft: false
tags:
date: 2026-06-27
---

The point of actor critic is to decouple the gradient update from the Q-function update.

* [[ai for robotics 8|Policy-based methods]] directly optimize the policy but have high variance
* [[ai for robotics 7|Value-based methods]] estimate values but don't give a *parametrized* policy.

Unlike [[Q-Learning]] (value based), which directly attempts to learn the optimal Q-function, actor-critic methods aim to learn the Q-function corresponding to the current parametrized policy $\pi_\theta(a \mid s)$, which must obey the equation:

$$
Q^\pi (s,a) = \mathbb{E}_{s',r \sim p(\cdot \mid s,a)}[r + \gamma \mathbb{E}_{a' \sim \pi(\cdot \mid s')}Q^\pi(s',a')]
$$

**Methods**

* `A3C`
* [[SAC]]
* `GAE`
* [[PPO]]
* [[TD3]]

>[!NOTE] Definition
>**Actor-Critic** is a hybrid architecture combining value-based and policy-based methods that helps to stabilize the training by reducing the variance using two elements:
>
>1. actor $\rightarrow$ controls how our agent behaves (policy-based)
>2. critic $\rightarrow$ measures how good the taken action is (value-based)
>

Needless to say, the two learn in parallel. The **actor** learns the policy $\pi_\theta$ and the **critic** assists the policy update by measuring the performance of the action that we take $\hat{q}_w(s,a)$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/rl12.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/rl13.png" alt="flow 2" width="350" height="300"> </div> </div>

The workflow is straightforwards:

**Step 1**: At each timestep t, we get the current state $s_t$ from the environment and pass it as input through our Actor and Critic $\rightarrow$ the policy takes the state and outputs an action $a_t$.

**Step 2**: The Critic takes $a_t$ as input and, together with $s_t$, it computes the value of taking that action at that state $\hat{q}_w(s,a)$ (i.e. the **Q-value**).

**Step 3**: The performed action outputs a new state $s_{t+1}$ and a reward $r_{t+1}$.

**Step 4**: The Actor updates it policy parameters using the Q-value.

$$
\Delta \theta = \alpha \nabla_\theta (\log \pi_\theta(s,a)) \cdot \hat{q}_w(s,a)
$$

**Step 5**: The Critic then updates again its value parameters $\Delta \omega$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl14.png" style="max-width: 100%; height: auto;">
</div>

> Note that the policy and value have different learning rates (i.e. $\alpha$ and $\beta$)

---

**Improvements -- Advantage function**

>[!summary] Advantage function
>calculates the **relative advantage** of an taking an action compared to the average value of the state.
>
>$$
>A(s,a) = Q(s,a) - V(s)
>$$
>
>* $V(s)$ is the average value of that state.
>* $Q(s,a) = r + \gamma V(s')$
>
>Therefore $A(s,a) = r + \gamma V(s') - V(s)$ is the [[Temporal Difference Learning|TD Error]].
>
>$$
>\text{Gradient Update Direction} = \begin{cases} +\nabla_\theta \log \pi_\theta(a|s) & \text{if } A(s,a) > 0 \text{ i.e. does better} \\ -\nabla_\theta \log \pi_\theta(a|s) & \text{if } A(s,a) < 0 \text{ i.e. does worse} \end{cases}
>$$

We use $A(s,a)$ instead of $Q(s,a)$ since $V(s)$ acts as a **baseline**, centering the updates around 0, which directly reduces variance without introducing bias.