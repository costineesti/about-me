---
title: Gaussian Distribution
draft: false
tags:
  - projects
---
 
A Gaussian or normal distribution always has a bell-shaped curve and is determined by two parameters: the mean $\mu$ and the standard deviation $\sigma$. The graph associated with this phenomenon is symmetric with its center at the mean, and its shape is determined by the standard deviation. The value of this function at a point $x$ is given by formula 
$$
p(x) = \frac{1}{\sqrt{2 \pi \sigma^2}} \exp \left( -\frac{(x - \mu)^2}{2 \sigma^2} \right) .
$$
The term $\frac{1}{\sqrt{2\pi\sigma^{2}}}$ ensures that the integral of the function over the entire range of $x$ converges to 1.
$$
\int p(x) \, dx = 1
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../public/static/bell.png" style="max-width: 100%; height: auto;">
</div>