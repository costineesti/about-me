---
title: Policy Gradient Methods
draft: false
tags:
date: 2026-06-27
---

So far, I covered the [[ai for robotics 7|Value Based Methods]], where we estimate a value function as an intermediate step towards finding an optimal policy.

* In [[ai for robotics 7|Value Based Methods]], the policy ($\pi$) is a function that will select the action with the highest value given a current state. For example, in [[Q-Learning]] we used a $\epsilon$-greedy policy.

---

In policy-based methods, we directly learn to approximate $\pi^*$ without having to learn a value function. 

Classes of policy gradient methods:

* `Vanilla Policy Gradient`
* `TRPO` (Trust Region Policy Optimization)
* [[PPO]] (Proximal Policy Optimization)
* `REINFORCE` (Monte-Carlo Policy Gradient)

>[!NOTE] The main idea is to parametrize the policy.
>aka NN.
>
>This way, the policy will output a probability distribution over actions (stochastic policy).
>
>$$
>\pi_\theta(s) = \mathbb{P}[a \mid s; \theta]
>$$
>
>To optimize it, we define an objective function $J(\theta)$ (the **expected cumulative reward**) and look to maximize it using gradient ascend $\rightarrow$ the parameter $\theta$ will affect the **distribution of actions over a state**.

> The main advantage is the simplicity of integration $\rightarrow$ we can estimate the policy directly without storing additional data (action-values).

---

**Policy Gradient versus Value Based**

PG can learn a stochastic policy, while [[ai for robotics 7|value methods]] cannot. It introduces some consequences:

**Advantages**

* no **exploration/exploitation trade-off** implementation by hand. Since we output a probability distribution over actions, the agent explores the state space without always taking the same trajectory.
* we **don't face perceptual aliasing** $\rightarrow$ when two states seem (or are) the same but need different actions.
	* an optimal stochastic policy will **randomly move** left or right, and it will not reach the goal state with a higher probability (what?)
* **more effective** in high-dimensional action spaces \& continuous actions spaces.
* **better convergence properties**:
	* [[ai for robotics 7|Value functions]] $\rightarrow$ use an aggressive operator to change the value function. The action probabilities may change drastically for an arbitrarily small change in the estimated action values if that change results in a different action having the maximal value.
	* PG methods $\rightarrow$ stochastic policy action preferences (probability of taking action) change smoothly over time.

**Disadvantages**

* typically converge to a local rather than global optimum.
* evaluating a policy is typically inefficient (slow) and high variance.
	* the high variance problem is partially solved using Actor Critic methods.

> In some cases, stochastic policies are the best. Imagine rock-paper-scissors: if your policy was deterministic, your opponent would eventually figure it out, and you would keep losing.

---

Policy-Based vs Policy-Gradient

$$
\text{Policy-gradient methods} \in \text{Policy-based Methods}
$$

The difference is in how they optimize the parameter $\theta$.

* **policy-based** methods $\rightarrow$ search directly for the optimal policy $\pi^*$ and optimize the parameters $\theta$ **indirectly** by maximizing the local approximation of the objective function.
* **policy-gradient** methods $\rightarrow$ search directly for the optimal policy $\pi^*$ and optimize the parameters $\theta$ **directly** by performing the gradient ascend on the objective function $J(\theta)$.

With policy based methods, this pseudo code represents the idea perfectly. The aim is to increase (or decrease) the $P(a \mid s)$. If we win the episode, we consider that each action taken was good and must be more sampled in the future.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl11.png" style="max-width: 100%; height: auto;">
</div>

But you don't know how good that policy is. Exactly why policy gradient methods introduced the objective function.

---

**Mathematics of Policy Gradient, briefly**

$J(\theta)$ gives us the performance of the agent given a trajectory ($\tau$) and it outputs the expected cumulative reward $R(\tau)$. Our goal is therefore to maximize this expected return:

$$
\max_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi}[R(\tau)]
$$

* the expected return will be the weighted average.
	* weights are given by $P(\tau ; \theta)$ of all possible values that the return $R(\tau)$ can take.
		* $P(\tau, \theta)$ -- probability of each possible trajectory $\tau$ depends on $\theta$ since it defines the policy that it uses to select the actions.
* $R(\tau)$ -- return from an arbitrary trajectory.
	* we consider all the possible trajectories “weighted” by their probabilities to calculate the expected return $\rightarrow r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots$

Therefore we can write the same objective functions as:

$$
J(\theta) = \sum P(\tau; \theta) R(\tau)
$$

We update our parameters with gradient-ascend

$$
\theta \leftarrow \theta + \alpha \cdot \nabla J(\pi_\theta)
$$

* can't calculate the true gradient $\rightarrow$ it requires calculating the probability of each possible trajectory
* can't differentiate this objective function since it's attached to the environment. The problem is we might not know about it.

>[!summary] Policy Gradient Theorem
>
>helps us reformulate the objective function into a differentiable function that does not involve the differentiation of the state distribution.
>
>$$
>\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}[ \nabla_\theta \log \pi_\theta(a_t \mid s_t) R(\tau)]
>$$
>
>* $\nabla_\theta \log \pi_\theta(a_t \mid s_t)$ is the direction of the steepest increase of probability of selecting action $a_t$ from state $s_t$.
>* $R(\tau)$ is just the cumulative reward we discussed earlier.

---

As mentioned in the beginning, `REINFORCE` is a policy-gradient algorithm based on [[Monte Carlo Learning|Monte Carlo]] methods to estimate the return over an entire episode before updating the data. It works according to sequential steps:

* use the policy $\pi_\theta$ to collect an episode $\tau$
* use the episode to estimate the gradient $\hat{g} = \nabla_\theta J(\theta)$
* update the weights of the policy $\theta \leftarrow \theta + \alpha \hat{g}$

