---
title: Linear Regression with Gradient Descent
draft: false
tags:
date: 2026-10-08
---

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml21.png" style="max-width: 100%; height: auto;">
</div>

Formalisms:

Given data $X=\{x^{(1)}, \dots, x^{(n)}\}$ corresponding to labels $\mathbf{y} = \{y^{(1)}, \dots, y^{(n)}\}$, find $h : \mathbb{R}^d \rightarrow \mathbb{R}$, where $h \in H \text{ (i.e. the set of all hypothesis)}$ performs best according with the evaluation criteria.

$$
h(\mathbf{x}) = \sum_{j=1}^d \theta_j \mathbf{x}_j + \theta_0 \mathbf{x}_0 = \theta^\top \mathbf{x}, \text{ where x0 = 1}
$$

And then we can define the Cost Function as:

$$
J(\theta) = \frac{1}{2n} \sum_{i=1}^n \big( h_\theta(\mathbf{x}^{(i)}) - y^{(i)} \big)^2
$$

where we minimize $J(\theta)$ to find the model parameters $\theta$.

**Gradient Descent**

* initialize $\theta$
* Repeat until convergence

$$
\theta_j \leftarrow \theta_j - \alpha \frac{\partial}{\partial \theta_j}J(\theta)
$$

For linear regression:

$$
\begin{aligned}
\frac{\partial}{\partial \theta_j} J(\theta) &= \frac{\partial}{\partial \theta_j} \frac{1}{2n} \sum_{i=1}^n (h_\theta(x^{(i)}) - y^{(i)})^2\\
&= \frac{\partial}{\partial \theta_j} \frac{1}{2n} \sum_{i=1}^n \Big( h_\theta(x^{(i)}) - y^{(i)}\Big)^2 \rightarrow \text{consider it as } (u^2)'=2\times u \times u'\\
&= \frac{1}{n} \sum_{i=1}^n \Big( h_\theta(x^{(i)}) - y^{(i)} \Big) \times \frac{\partial}{\partial \theta_j} \Big( h_\theta(x^{(i)}) - y^{(i)} \Big) \\
&= \frac{1}{n} \sum_{i=1}^n \Big( \sum_{k=0}^d h_\theta(x^{(i)}) - y^{(i)} \Big) \times \frac{\partial}{\partial \theta_j} \Big( \sum_{k=0}^d \theta_k x_k^{(i)} - y^{(i)} \Big)\\
&= \frac{1}{n} \sum_{i=1}^n \Big( \sum_{k=0}^d h_\theta(x^{(i)}) - y^{(i)} \Big) (x_j^{(i)})
\end{aligned}
$$

* Assume convergence when $|| \theta_{new} - \theta_{old}||_2 < \epsilon$


page 53.