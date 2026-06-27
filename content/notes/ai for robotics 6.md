---
title: Reinforcement Learning Basics
draft: false
tags:
date: 2026-06-26
---

Reinforcement Learning (RL) was invented as a way to model and solve problems of **decision making under uncertainty.**

>[!NOTE] Main goal of RL
>The goal is to maximize the expected sum of discounted rewards: $\max_\theta \mathbb{E} [\sum_t \lambda_t r(s_t, a_t)]$ or to find the optimal policy $\pi^*$ that will maximize the expected cumulative reward.

>[!summary] Terminology
>
>**Agent**: Entity that perceives its environment and acts upon that environment. Learns through trial and error.
>
>**State**: A configuration of the agent in its environment.
>
>**Actions**: Choices that can be made in a state. Defined as a function:
>
>* $a(s)$ returns as output the set of actions that can be executed in state `s`.
>
>The goal is to go from the initial state to the goal state by choosing actions.
>
>**Transition Model**: A description of what state results from performing any application action in any state. In code: `RESULT(s,a)`
>
>**State Space**: The set of all states reachable form the initial state by any sequence of actions.
>
>**Goal Test**: The condition that determines whether a given state is a goal state.
>
>**Path cost**: Numerical cost associated with a given path. Goal is to minimize this cost.
>
>* $p^\pi (\tau)$ gives the likelihood of a trajectory $\tau$ under policy $\pi$.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/rl2.png" style="max-width: 100%; height: auto;"> </div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rl1.png" style="max-width: 100%; height: auto;">
</div>

Contrast to other learning tasks:

1. It is active rather than passive
2. Interactions are often sequential

>[!question] What makes reinforcement learning different from other machine learning paradigms?
>
> - There is no supervisor, only a reward signal
> - Feedback is delayed,
> - not instantaneous
> - Time really matters (sequential, non i.i.d data)
> - Agent’s actions affect the subsequent data it receives
>
>RL is like a one-size fits all solution.

---

**Exploitation vs Exploration**

* **Exploration** is exploring the environment by trying random actions in order to find more information about the environment
* **Exploitation** is exploiting known information to maximize the reward.

There is a trade-off. We need to balance the two.

---

**Type of task in RL**

* **Episodic task**: here is a starting point and an ending point (**a terminal state**). This creates an episode: a list of States, Actions, Rewards, and new States.
* **Continuing task**: These are tasks that continue forever (**no terminal state**). In this case, the agent must learn how to choose the best actions and simultaneously interact with the environment.

---

**Policy**

A policy is a mapping $\pi : \mathcal{S} \times \mathcal{A} \rightarrow [0,1]$ that, for every state $s$ assigns for every action $a \in \mathcal{A}$ the probability of taking that action.

* it's the "brain" of the agent
* we want to find the optimal policy $\pi^*$ through training.

>[!NOTE] The goal of an RL agent is to find a behavior policy $\pi$ that maximizes the expected return $G_t$. 
>
>$G_t = R_{t+1} + R_{t+2} + R_{t+3} + \dots$ 
>
>"_Any goal can be formalized as the outcome of maximizing a_ _cumulative reward_"
>
>`However, in reality, we can’t just add them like that.` The rewards that come sooner (at the beginning) are more likely to happen since they are more predictable than the long-term future reward.
>
>Therefore we define the **_discount_** $\gamma \in [0,1]$. Mostly between $[0.95, 0.99]$.
>
>$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots$
>
>* larger $\gamma$ => smaller discount => agent cares more about `long-term reward`
>* smaller $\gamma$ => bigger discount => agent cares more about `short-term reward`

> A MDP is considered "solved" if we find a policy that maximizes the expected discounted return. See [[Markov Decision Process]].

* **Deterministic policy**: $a = \pi(s) \rightarrow$ a policy at a given state will always return the same action.
* **Stochastic policy**: $\pi(a \mid s) = p(a \mid s) \rightarrow$ outputs a probability distribution over actions.

We need to find the optimal policy $\pi^*$, which maximizes the expected return.

* [[ai for robotics 8|Policy-based methods]]: by training your policy directly: the agent learns which action to take given a state
	* This function will define a mapping from each state to the best corresponding action
* [[ai for robotics 7|Value-based methods]]: by training a value function that tells us the expected return the agent will get at each state, and use this function to define our policy
	* $\pi(s) = \arg \max_a Q_{\pi}(s,a)$

**On-policy learning** $\rightarrow$ use the deterministic outcomes or samples from the target policy to train the algorithm

**Off-policy learning** $\rightarrow$ training on a distribution of transitions or episodes produced by a different behavior policy rather than that produced by the target policy.

---

**Observations vs. States**

<div class="encoder-section">
  <img src="../static/notes/rl3.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>State</b>: is a <b>complete</b> description of the state of the world (no hidden info).</li>
      <li><b>Observation</b>: is a <b>partial</b> description of the state.</li>
      <li><b>History</b>: is the sequence of observations, actions, and rewards.
    </ul>
  </div>
</div>

$$
\mathcal{H}_t = O_0, A_0, R_1, O1, \dots, O_{t-1}, A_{t-1}, R_t, O_t
$$

---

**Discrete vs. Continuous Action space**

* **Discrete Space**: finite number of actions
* **Continuous Space**: infinite number of actions

> kinda intuitive

---

**Offline vs. Online**

Deep Reinforcement Learning agents learn with batches of experience. The question is, how do they collect it?

* In **Online RL**, the agent **gathers data directly**: it collects a batch of experience by interacting with the env. Then, it uses this experience immediately (or via some replay buffer) to learn from it (update its policy).
	* It implies either training your agent in the real world or have a simulator
* In **Offline RL**, the agent only uses data collected from **other agents or human demonstrations**. It does not interact with the env.



<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>