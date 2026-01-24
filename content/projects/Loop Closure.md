---
title: Loop Closure
date: 2026-01-24
draft: false
tags:
---
 
<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/bachelors/loop_closure.png" style="max-width: 100%; height: auto;">
</div>

You need loop closure to correct for the error when you do [[RPCN 6|SLAM]].

In practice, when a loop is detected, what this is doing under the hood is merely adding an edge to the Pose Graph.

There are multiple solutions:

* Almost identical positions (e.g. $x_6 \approx x_1$) $\rightarrow$ merge them
* Scan matching (similarity)
	* Key Frame matching
	* Each state corresponds to a local 2D occupancy grid (laser scan representation).
* Features -- not practical in real systems because it works in $O(N^2)$

In the cost function $J_{graphSLAM}$​, a loop closure is integrated by adding a new term that replaces the standard landmark measurement model $h(⋅)$ with a **pose-match** function $f(⋅)$. This allows the algorithm to match any two arbitrary poses $x_i$​ and $x_j$​ by defining the relationship $x_i​=f(u_{ij}​,x_j​)+\lambda_{ij}$​, where $\lambda_{ij}$​ represents the associated Gaussian noise. This effectively creates a new spatial constraint between non-consecutive nodes in the graph

From

$$
J_{graphSLAM} = x_0^T \Omega_0 x_0 + \sum_{t=0}^{T}[x_t - g(u_t, x_{t-1})]^T R^{-1}[x_t - g(u_t, x_{t-1})] + \sum_{t=0}^{T}[z_t - h(m_{c_t}, x_t)]^T Q^{-1}[z_t - h(m_{c_t}, x_t)]
$$

to

$$
J_{graphSLAM} = \text{Odometry Constraints} + \sum_{i,j}sig(s_{ij}) 
\cdot ||f(x_i, u_{ij}) - x_j||^2 + \text{Switch Prior Constraints}
$$

Instead of $x_t$ seeing a landmark, we say pose $x_i$ *sees* pose $x_j$ through scan matching or feature comparison. This is the explanation for the right part of the $J$ equation.

To ensure a robust back-end, **switchable constraints** are introduced as an "on/off switch" for loop closure edges. This is mathematically implemented via a **sigmoid function** $sig(s_{ij}​)=\frac{1}{1+e^{−s_{ij}}​}$​which acts as a weight for the constraint. This allows the optimizer to effectively discard incorrect associations during the global optimization process.

The **Switch Prior Constraints** term penalizes the switch for moving away from its initial guess $\gamma_{ij}$: $\sum_{i,j} ||\gamma_{ij} - s_{ij}||^2$. It creates a "cost" for switching and handles the **poor measurement geometry**.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/loop_closure.png" style="max-width: 100%; height: auto;">
</div>

