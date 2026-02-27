---
title: Fundamentals of parameter estimation - Part II
draft: true
tags:
date: 2026-02-27
---
 
This is the continuation to [[optimal estimation 3|Fundamentals of parameter estimation - Part I]]. Exercise 2/8 from my [[optimal estimation]] course.

I need to reconsider the ultrasonic depth gauge discussed in Part 1. The Figure below shows two data sets that are obtained from the probabilistic model. Each data set contains 200 points $(x_n,z_n)$. The realizations are a-select and independent. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex2_oeds1.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] The goals, in the end, are:
>
>* To design a linMMSE estimator and an unbiased linMMSE estimator using the first data set.
>* To evaluate these estimators with respect to bias and variance using the second data set.

---

**First topic**: Create an xy-scatter diagram showing the true values $x_n$ against the measurements $z_n$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex2_oeds2.png" style="max-width: 100%; height: auto;">
</div>

---

**Second topic**: Design a linear MMSE estimator $\hat{x}_{MMSE}(z) = \alpha z$, i.e. determine $\alpha$, using estimates of $\mathbb{E}[xz]$ and $\mathbb{E}[z^2]$ derived from the first data set.