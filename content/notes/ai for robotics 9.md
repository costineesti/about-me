---
title: Imitation Learning
draft: false
tags:
date: 2026-06-27
---

Instead of learning from a reward signal, the agent learns by mimicking an **expert's demonstrations** (state-action pairs or trajectories). The goal is to learn a policy that replicates expert behavior -- often without access to a reward function at all.

**Three approaches:**

- **Behavioural Cloning** -- treats it as supervised learning directly on state-action pairs. Fast, but suffers from **compound errors** (small mistakes snowball over time since the agent never sees how to recover).
- **Inverse RL (IRL)** -- instead of copying actions, infer the **reward function** the expert was optimizing. More principled but computationally expensive.
- **GAIL** -- uses adversarial training ([[genai2|GAN]]-style): a discriminator distinguishes expert from agent trajectories, pushing the agent to match the expert's distribution. Powerful but unstable.

**Advantages:**

- No reward engineering (e.g. how do you even define "good driving"?)
- Safer exploration -- no random actions in high-stakes environments
- Can be used as **pretraining** before RL fine-tuning

**Disadvantages:**

- Quality is bounded by the expert -- can't surpass it
- Garbage in, garbage out -- highly sensitive to demonstration quality

> Imitation Learning bridges supervised learning and RL: you get the structure of SL (labeled demonstrations) but the goal is a deployable policy like in RL.