---
title: The Nadaraya-Watson Model
draft: false
tags:
date: 2026-10-28
---
 
 >[!summary] Nadaraya-Watson
 The Nadaraya-Watson model applies the concept of kernel density estimation to solve continuous regression problems, allowing us to predict a target variable $t$ based on an input $\mathbf{x}$.

Instead of just estimating the distribution of the inputs, this model first evaluates the joint probability distribution $p(\mathbf{x},t)$ of both the inputs and the targets. It achieves this by centering a kernel function, denoted as $f$, on every single training data pair $(\mathbf{x}_n,t_n)$ and summing them up. 

$$
p(\mathbf{x}, t) = \frac{1}{N} \sum_{n=1}^N f(\mathbf{x} - \mathbf{x}_n, t - t_n)
$$

To make a prediction for a new input $\mathbf{x}$, the model computes the conditional probability density $p(t \mid \mathbf{x})$. As shown in the equations, this is done by taking the joint distribution and dividing it by the marginal distribution (the integral of the joint distribution over all possible values of $t$).

$$
\begin{aligned}
p(t \mid \mathbf{x}) &= \frac{p(\mathbf{x}, t)}{\int p(\mathbf{x}, t) \mathrm{d}t} \\
&= \frac{\sum_{n=1}^N f(\mathbf{x} - \mathbf{x}_n, t - t_n)}{\sum_{m=1}^N \int f(\mathbf{x} - \mathbf{x}_m, t - t_m) \mathrm{d}t}
\end{aligned}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml45.png" style="max-width: 100%; height: auto;">
</div>

* The blue dots represent the given training data points.
* The ellipses drawn around each dot represent the individual kernels placed directly on those observations.
* The green curve shows the true underlying function, while the red curve shows the model's predicted expectation (the regression line) derived from the kernels.
* The pink shaded region visualizes the spread of the conditional probability density $p(t \mid \mathbf{x})$, illustrating the model's predictive uncertainty at different points along the x-axis.

