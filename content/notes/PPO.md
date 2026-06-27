---
title: Proximal Policy Optimization (PPO)
draft: false
tags:
date: 2026-06-27
---

Related to [[Actor Critic Methods]]. PPO $\in$ [[Actor Critic Methods|Actor Critic]] $\in$ [[ai for robotics 8|Policy-Gradient]] $\in$ Policy-Based.

>[!question] How can we take the biggest possible improvement step on a policy using the data we currently have, without stepping so far that we accidentally cause performance collapse?
>motivation.
>

PPO is a family of first-order methods that use a few other tricks to keep new policies close to old, therefore improving training stability of the policy. To do that, we use a ratio that indicated the difference between our current and old policy and clip it to a specific range $[1-\epsilon, 1+\epsilon]$.

> Empirically, smaller policy updates during training are more likely to **converge** to an optimal solution. Too big of a step in the wrong direction can take a long time or even having no possibility to recover.

* **on-policy** algorithm.
* can be used for environments with either discrete or continuous action spaces

The problem with `REINFORCE` (Vanilla policy gradient), a [[ai for robotics 8|policy-gradient method]], is that having a too small advantage results in slow training process, and having a too high advantage results in too much variability in the training.

$$
L^{PG}(\theta) = \mathbb{E}[\log \pi_\theta(a_t \mid s_t) * A_t]
$$

* $A_t$ is the advantage we are talking about.

In PPO, the clipped surrogate **objective function** is given by:

$$
L^{CLIP}(\theta) = \hat{\mathbb{E}} \big[ \min(r_t(\theta) \hat{A}_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t) \big]
$$

* $r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)}$ is the ratio of probabilities to taken an action given a state in two consecutive policies. It replaces the log probability.
	* if $r_t(\theta)>1$ => the action $a_t$ at state $s_t$ is **more likely** in the current policy than in the old one
	* if $r_t(\theta) < 1$ => it's between $[0,1]$ and the action is **less likely** for the current policy than for the old one.

The objective function penalizes changes that lead to a huge change (far from 1) in the ratio. We take the minimum of the clipped and non-clipped objective, so the final objective is a lower bound (pessimistic bound) of the unclipped objective.

> Interesting, we only clip updates that are too large, but harmful ones we still take. That's why it says pessimistic/conservative.

* the clipped part is the pessimistic boundary, to be more precise.
* if the ratio is $> 1+\epsilon$ or $< 1-\epsilon$, the gradient will be equal to 0. (see image explanation)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl15.png" style="max-width: 100%; height: auto;">
</div>

Looks like PPO only blocks updates that would push the policy **further outside the trust region in the direction it's already gone**.

For example, rows 3 and 4:

* Row 3: action is less likely than before ($r<1−\epsilon$) but was **good** ($A_t > 0$) $\rightarrow$ we should increase its probability $\rightarrow$ gradient allowed
* Row 4: action is less likely than before ($r < 1-\epsilon$) but was **bad** ($A_t < 0$) $\rightarrow$ we'd be pushing probability down even further $\rightarrow$ **too large a step**, so clip it and zero the gradient

