---
title: Motion Prediction
draft: false
tags:
date: 2025-12-04
---
 
Generating trajectories

**Conditional Prediction**: you need to make decisions in either seconds (e.g. autonomous driving), or minutes (e.g. marine application)

We model the **trajectory prediction** as **spatial-temporal mapping** and then we can divide it into:

* scene constraints
* multi-path prediction
* interaction modeling

**Mainstream Approaches**:

* SFM, GP, KF
* RNN (e..g. LSTM), GRU
* CNN, GCN
* Transformer

