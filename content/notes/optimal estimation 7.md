---
title: Particle Filter
draft: false
tags:
date: 2026-03-10
---
 
Lecture 9 from [[optimal estimation]].

The number of particles is important.

We need a physical process (the hidden part) and a online state estimator (not hidden). It is not only for physical processes, you can also apply it for financial applications, covid pandemics extensions etc.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pf1.png" style="max-width: 100%; height: auto;">
</div>

the Transition Probability Density helps us get from one state to another.

$$
x(i+1) = f(x(i),w(i)) => p_t(x(i+1) | x(i))
$$

**General outline of optimal filter**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pf2.png" style="max-width: 100%; height: auto;">
</div>

> Particle Filter relates highly to Monte Carlo.

Apparently, with the dirac function I go from 2D to 3D. $\int \delta(x) dx = 1$, $\delta(x)=0$ everywhere except at $x=0$.

In this case, the delta function is the same (unweighted). If I go into weighted delta function, the dirac will have different peaks.

**Parzen Estimate** instead of Dirac function $h$

> It is continuous now. And it's also shaped as a interpolation function (PDF) through all those dirac functions. And you get a less spiky interpretation.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pf3.png" style="max-width: 100%; height: auto;">
</div>

If you trust your data, you could go with left. Also, it depends on the number of particles.

There is a price to pay when you represent the PDF in different ways. You have to find some parameters. Try to understand what that 68 means.

**Resampling**

So the idea is you don't know what the true PDF looks like. And with resampled, unweighted particle representation, we could get somewhat close.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pf4.png" style="max-width: 100%; height: auto;">
</div>

Large particles get chosen multiple times. Therefore, we can compute $K_{\text{eff}}$ to reduce the number from 120 to 40.6 (check this line, I'm not sure that's what it means). This is less accurate from a statistical perspective. With the weighted repr. you get the height, and with resampled, unweighted, we get the areas? Again check

You could approximate $p(x \mid z) = \frac{p(z \mid x)p(x)}{p(z)} \propto p(z\mid x)p(x)$ when you don't really trust your measurements. Just as a small curiosity I asked. But usually you do want to take them into account.

