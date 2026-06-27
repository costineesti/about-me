---
title: Monte Carlo Learning
draft: false
tags:
date: 2026-06-27
---

Related to [[ai for robotics 7|Value Based Methods]].

It's a Model-Free Policy Evaluation method together with [[Temporal Difference Learning|TD Learning]]. 

Monte Carlo uses an entire episode of experience before learning. 

* this means we can only apply it to **episodic** MDPs.

$$
V(S_t) \leftarrow V(S_t) + \alpha[G_t - V(S_t)]
$$

> So basically it takes averages of actual returns over episodes?