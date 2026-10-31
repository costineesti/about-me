---
title: Curse of Dimensionality
draft: false
tags:
date: 2026-10-31
---

The curse of dimensionality is the phenomenon where data, computation, and intuition all break down as the number of input dimensions grows. Volume grows exponentially with $d$, so to densely sample a unit cube you need $n$ exponential in $d$.

As $n \rightarrow \infty$, $\sigma \rightarrow 0$

>[!tip] Intuition
>
>In high dimensions, the volume of a unit ball vanishes relative to its bounding cube: almost all the mass sits in the corners. Random points drawn uniformly from a high-$d$ cube are all roughly the same distance from each other, so $"$nearest$"$ neighbor loses meaning. Distance-based methods (kNN, clustering, Gaussian kernels) degrade because there is nothing distinctive about the closest point.

Two consequences stacked together:

- **Data sparsity**: any finite dataset looks sparse relative to the volume it lives in
- **Distance concentration**: ratios of max to min pairwise distances tend to $1$, so ranking by distance becomes meaningless

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml57.png" style="max-width: 50%; height: auto;">
</div>

