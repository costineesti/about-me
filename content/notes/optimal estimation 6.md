---
title: Fundamentals of parameter estimation - Part III
draft: false
tags:
date: 2026-03-09
---
 
This is the continuation to [[optimal estimation 5|Fundamentals of parameter estimation - Part II]]. Exercise 3/8 from my [[optimal estimation]] course. The focus is on **random vectors and unbiased linear MMSE estimation**.

At the end of this exercise I should understand insights about the concept of covariance matrices and about unbiased linear MMSE estimation.

# Context

**Prior knowledge**

I have a ship. The parameter vector to estimate is the position vector of that ship $\mathbf{x} = [x \quad y]^T$. The prior knowledge, obtained via dead reckoning, is captured as a prior expectation $\mu_{\mathbf{x}}$ and a covariance matrix which expresses the prior uncertainty that we have about the position $C_{\mathbf{x}}$. 

**Measurement**

In order to increase the accuracy, the navigator of the ship measures the direction $\varphi$ of a beacon, e.g. lighthouse, relative to the ship as in the Figure below.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds1.png" style="max-width: 100%; height: auto;">
</div>

The beacon has a known reference position $\mathbf{x}_0$. The line of sight is defined by the position of the beacon and by the measured direction $\theta$. The compass reading gives $\theta = \varphi + \triangle \theta$. The following equation defines the line of sight in the $(\xi, \eta)$ plane:

$$
x_0 \sin\theta - y_0 \cos\theta = \xi \sin\theta - \eta \cos\theta
$$

**The measurement model**

The relation between the ship's true position $\mathbf{x} = (x,y)$ and the true bearing $\varphi$ is:

$$
x_0 \sin \varphi - y_0 \cos \varphi = x \sin \varphi - y \cos \varphi
$$

or, by substituting $\varphi = \theta - \triangle \theta$

$$
x_0 \sin(\theta - \Delta\theta) - y_0 \cos(\theta - \Delta\theta)

=

x \sin(\theta - \Delta\theta) - y \cos(\theta - \Delta\theta)
$$

The relation between the ship's true position $\mathbf{x}$ and the observed direction $\theta$ is nonlinear. To get a linear approximation, we apply a truncated Taylor series expansion to the sine and cosine functions:

$$
\sin(\theta - \Delta\theta) \approx \sin\theta - \Delta\theta \cos\theta
$$

$$
\cos(\theta - \Delta\theta) \approx \cos\theta + \Delta\theta \sin\theta
$$

$$
\Downarrow \text{after some rearrangements}
$$

$$
x_0 \sin\theta - y_0 \cos\theta \approx x \sin\theta - y \cos\theta + \Delta\theta \left((x_0 - x)\cos\theta + (y_0 - y)\sin\theta \right)
$$

Since $\theta \approx \varphi$, the factor $(x_0 - x)\cos\theta + (y_0 - y)\sin\theta$ almost equals $(x_0 - x)\cos\varphi + (y_0 - y)\sin\varphi$. The latter equals the distance $d$ between beacon and ship. Therefore:

$$
x_0 \sin\theta - y_0 \cos\theta

\approx

x \sin\theta - y \cos\theta + d\,\Delta\theta
$$

This can be written in the form $z = H\mathbf{x} + v$ with the following definitions $\begin{cases}z = x_0 \sin\theta - y_0 \cos\theta \\ H = [\sin\theta \;\; -\cos\theta] \\ v = d\,\Delta\theta \end{cases}$

The distance $d$ is unknown, but can be estimated from prior knowledge $\mu_{\mathbf{x}}$ of the ship's position and the position of the beacon: $d \approx ||\mathbf{x}_0 - \mu_{\mathbf{x}}||$. Assuming the measurement of the bearing has an uncertainty of $\sigma_{\Delta \theta}$, the standard deviation of $v$ is $\sigma_v = d \sigma_{\Delta \theta}$ \[radians\].

# The Case

$$
\text{prior knowledge:} \quad

\mu_x =

\begin{bmatrix}

10\\

20

\end{bmatrix}

\qquad

C_x =

\begin{bmatrix}

25 & -25\\

-25 & 70

\end{bmatrix}
$$

$$
\text{measurement:} \quad

\mathbf{x}_0 =

\begin{bmatrix}

100\\

100

\end{bmatrix}

\qquad

\theta = 35^\circ

\qquad

\sigma_{\Delta\theta} = 1^\circ
$$


> Physical units are Nautical miles (Nm).

### Uncertainty regions and principal axes

For normal distributions $p(\mathbf{x}) = \frac{1}{\sqrt{(2\pi)^N |C_x|}} \exp\left(-\frac{(\mathbf{x}-\mu_x)^T C_x^{-1} (\mathbf{x}-\mu_x)}{2} \right)$, the equation for the contour simplifies to: $(\mathbf{x}-\mu_x)^T C_x^{-1} (\mathbf{x}-\mu_x) = k^2 \text{ with } k = 1,2,3$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds2.png" style="max-width: 100%; height: auto;">
</div>

The eigenvectors and eigenvalues are solutions of $C_x \mathbf{v} = \lambda \mathbf{v}$ and the corresponding scaling factors are $a_m = \sqrt{\lambda_m}$

---

**First topic**: Determine the eigenvalues and eigenvectors of $C_{\mathbf{x}}$ and draw the associated uncertainty region. 

**1.1 Generate a set of points on a circle with unit radius. The centre of the circle is positioned at the origin**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds3.png" style="max-width: 100%; height: auto;">
</div>

**1.2 Scale the $x$ and $y$ coordinates of these points in accordance with the scaling factors $a_0$ and $a_1$. The resulting points form an ellipse with the right shape, but not with the right orientation and position.**

So based on the Figure 5 above, I need to extract the $a_0$ and $a_1$ scaling factors of the ellipse defined by $C_\mathbf{x}$. The corresponding scaling factors are $a_m = \sqrt{\lambda_m}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds4.png" style="max-width: 100%; height: auto;">
</div>

**1.3 Rotate the set of points in accordance with the direction of the principal axes. The eigenvector-matrix is a rotation matrix.**

This is really just a no-brainer, since the eigenvector-matrix is in itself the Rotation Matrix I need to apply.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds5.png" style="max-width: 100%; height: auto;">
</div>

**1.4+1.5 Shift the whole set to the position determined by $\mu_{\mathbf{x}}$. Plot the curve defined by the resulting set of points.**

Again, I simply add to each axis the values from $\mu_{\mathbf{x}}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds6.png" style="max-width: 100%; height: auto;">
</div>

