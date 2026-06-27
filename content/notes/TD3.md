---
title: Twin Delayed DDPG (TD3)
draft: false
tags:
date: 2026-06-27
---

TD3 is an evolution of DDPG algorithms and it uses an [[Actor Critic Methods|Actor-Critic]] framework with twin critics and delayed policy updates. 

* off-policy algorithm
* only for envs with continuous action spaces

Why is TD3 better than DDPG?

- The learned Q-function begins to dramatically overestimate Q-values, so policy exploits these errors in the Q-function.

**Trick one: Twin Critic Networks**: Two Q-function estimators to mitigate overestimation.

**Trick two: Delayed Policy Updates**: Policy updated less frequently than Q-functions.

**Trick three: Target Policy Smoothing**: Adds clipped noise to target actions for robustness i.e. make it harder for the policy to exploit Q-function errors by smoothing out Q along changes in action.