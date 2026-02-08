---
title: Introduction to Optimal Estimation and Dynamics
draft: false
tags:
date: 2026-02-08
---
The *estimation paradigm* involves taking a **control signal** (like engine thrust) and **sensor data** (such as range or speed) to determine the **estimated properties** of an object, such as its position, orientation, or velocity.

### Key Components

- **Dynamic & Kinematic Models**: Mathematical equations that describe how a system changes over time.
- **Process Noise**: Unpredictable factors that cause a real track to deviate from a planned path. While noise itself cannot be predicted, the **uncertainty** it creates can be quantified.
- **Uncertainty Regions**: Areas where an object is likely to be (e.g., a 91% probability region). These are mathematically represented by **covariance matrices**.

Therefore, an uncertain position is quantified by:

* the position of the **uncertainty region**: $\bar{\mathbf{x}} = \begin{bmatrix} \mathbf{x}_0 \\ \mathbf{y}_0 \end{bmatrix}$ i.e. the expectation of the position,
* the size and shape of the region (the covariance matrix) $C_{\mathbf{x}}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/oed_intro1.png" style="max-width: 100%; height: auto;">
</div>

### Linearization through Taylor Series Expansion

From the nonlinear state equation:

$$
\begin{bmatrix}
x(i+1) \\
y(i+1)
\end{bmatrix} = 
\begin{bmatrix}
x(i) \\
y(i)
\end{bmatrix} + 
T(V + \tilde{v}(i)) 
\begin{bmatrix}
\cos(\varphi(i) + \tilde{\varphi}(i)) \\
\sin(\varphi(i) + \tilde{\varphi}(i))
\end{bmatrix}
$$

If we apply 1st order Taylor Series, we get the linearized state equation:

$$ 
\underbrace{ \begin{bmatrix} x(i+1) \\ y(i+1) \end{bmatrix} }_{\text{state}} = \begin{bmatrix} x(i) \\ y(i) \end{bmatrix} + \underbrace{ TV(1-\frac{1}{2}\sigma_{\tilde{\varphi}}^{2}) \begin{bmatrix} \cos \varphi(i) \\ \sin \varphi(i) \end{bmatrix} }_{\text{control}} + \underbrace{ \begin{bmatrix} w_{1}(i) \\ w_{2}(i) \end{bmatrix} }_{\text{process noise}}
$$

We can define the linear state equation under this format:

$$
\mathbf{x(i+1)} = \mathbf{Fx(i)} + \mathbf{Lu(i)} + \mathbf{w(i)} 
$$

In the previous kinematic model, $\mathbf{F=L=I}$.

>[!summary] The propagation of uncertainty in time can be described mathematically by modelling how the covariance matrix changes in time.
>
>$\mathbf{C(i+1) = FC(i)F^T + C_{\text{process noise}}}$
>
>where:
>
>We define the statistical definition of process noise:
>* $\mathbf{E[w(i)]} = 0$
>* $\mathbf{E[w(i)w(i)^T] = C_{\text{process noise}}}$
>
>And the statistical definition of initial conditions:
>
>* $\mathbf{E[x(0)] = \bar{x}(0)}$
>* $\mathbf{E\bigg[\bigg(x(0) - \bar{x}(0)\bigg)\bigg(x(0)-\bar{x}(0)\bigg)^T\bigg] = C_{\text{init}}}$

# Updating = Prediction + Measurement

> Basically, when the uncertainty of the prediction becomes too large, we perform measurements to calculate a new uncertainty region and recalculate the path.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/oed_intro2.png" style="max-width: 100%; height: auto;">
</div>

Dead reckoning is simply estimating your future position given your current position and relative measurements.

* Here we use the first starting point as the reference position.
* If we make a loop along a coastline, we know the last point should be the initial point. Error comes from drift.

I guess we could call it a SLAM problem when we use *landmarks (beacons)* to *anchor* our positions.

Chapters from the book to look over for this part:

* 3 -- parameter estimation (partly)
* 4 -- state estimation
* 8 -- state estimation in practice
* 9.3 -- worked out example
