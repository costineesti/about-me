---
title: Prediction in a linear dynamic system
draft: false
tags:
date: 2026-03-16
---
 
This is exercise 4/8 from my [[optimal estimation]] course. The focus is on propagation of uncertainty and prediction.

# Context

Again, to gather data, we use dead reckoning. The navigator uses a log to measure the speed of the vessel and a compass to determine the heading. Together, they can be used to extract the velocity $v$. 

* Consider $\hat{\xi}(i)$ an estimate that is available for position $\xi(i)$ and $v(i)$ the velocity determined at time $i$.
* Together, $\xi(i)$ and $v(i)$ provide sufficient information to deduce an estimate of the position valid for time $i+l$. So we call $\hat{\xi}(i+l)$ the prediction with a lead of $l$ i.e. $l$-step ahead prediction.

So I want to develop a predictor that can predict the position of the ship and that provides an uncertainty region. So in this application, the mean and the covariance will be propagated in time as opposed to [[optimal estimation 6|Fundamentals of parameter estimation - Part III]], where they were static. And the whole application was static.

I am provided with the identified linear state space model

$$
\left\{
\begin{aligned}
v(i) &= \xi(i+1) - \xi(i) \\
a(i) &= v(i+1) - v(i) \\
a(i+1) &= F_1 a(i) + w_1(i)
\end{aligned}
\right.
$$

where $F$ is a time invariant system matrix, and $w(i)$ is a white sequence of Gaussian random vectors with zero mean and a time invariant covariance matrix $C_w$.

> Invariant means they do not change over time. Now I'm a lil' bit confused, I thought I would have dynamic parameters now. So it's the states that change over time and not the params?

so the state space is of type

$$
\mathbf{x}(i+1) = F \mathbf{x}(i) + w(i)
$$

Like any shitty dead reckoning which I don't support, velocity and position are obtained through integration of their respective derivative. I guess she said white noise so maybe not so bad if accumulate but still bad you know what I mean? I want a beer.

>[!NOTE] These equations hold only for dt=1. In continuous time:
>
>* $v(t) = \partial \xi / \partial t$
>* $a(t) = \partial v/ \partial t$

>[!NOTE] In discrete time with sampling period $\Delta t$:
>
>* $v(i) = (\xi(i+1) - \xi(i)) / \Delta t$
>* $a(i) = (v(i+1)-v(i)) / \Delta t$
>
>So integration becomes
>
>* $\xi(i+1) = \xi(i) + \Delta t \cdot v(i)$
>* $v(i+1) = v(i) + \Delta t \cdot a(i)$

# Questions

**1. Using the first two state space equations, determine the matrix $F$ and the covariance matrix $C_w$. Use the xsi array (load mat) to deduce the $6 \times (N-2)$ state vector $\mathbf{x}(i)$**.

By focusing on extracting the next state (updates), I can simply rewrite

$$
\left\{
\begin{aligned}
\xi(i+1) &= v(i) + \xi(i) \\
v(i+1) &= a(i) + v(i) \\
a(i+1) &= F_1 a(i) + w_1(i)
\end{aligned}
\right.
$$
> Clarification: The 3 dimensions are all 2-dimensional vectors representing the $x$ and $y$ axes. Because of this, the next time step requires $2 \times 2$ identity matrices, moving the overall system matrix $F$ to $6 \times 6$.

so, according to the equations above, $F$ and $C_w$ should look like this

$$
F = \begin{bmatrix} I_2 \quad I_2 \quad O_2 \\ O_2 \quad I_2 \quad I_2 \\ O_2 \quad O_2 \quad F_1 \end{bmatrix}
$$

$$
C_w = \begin{bmatrix} O_2 \quad O_2 \quad O_2 \\ O_2 \quad O_2 \quad O_2 \\ O_2 \quad O_2 \quad C_{w_1} \end{bmatrix} \text{ with } w(i) = [0,0,w_1(i)]^T
$$

