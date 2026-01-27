---
title: Bundle Adjustment
draft: false
tags:
date: 2026-01-27
---
 
# Bundle Adjustment

### Collinearity Equation

Setup: We have a scene that we see from different perspective (same idea from SfM -- let's say the Colosseum).

I know the distortion, I know the principal point location, etc.

I want to estimate the location of all the points in 3D space.

In BA, in one go we estimate the 3D geometry of all the points in the coordinate system and their location at the same time.

**Collinearity Equation**: you complete this.

Let's say we have 5 points that can be extracted in 5 different images. 

* In total: 5x5x2 camera coordinates/tie point = 50 collinearity equations
* 5 images x 6 pose parameters = 30 pose parameters
* 5 tie points x 3 world coordinates = 15 world coordinates
* 45 unknown parameters
* So we have 50 equations with 45 unknown parameters. Redundant, but possible.

**Bundle Adjustment**: 

* Obtain approximate values needed for unknown parameters
* Linearize collinearity equations

### Least Squares Parameter Estimation

The equations are non-linear $y = g(\beta)$ and least squares requires linear relation $y = X \beta$. 

So we linearize $g(\beta)$ using Taylor series.

$$
g(\beta_1, \beta_2) = g(\tilde{\beta_1}, \tilde{\beta_2}) + \frac{\partial g}{\partial \beta_1}(\tilde{\beta_1}, \tilde{\beta_2}) \cdot ({\beta_1} - \tilde{\beta_1}) + \frac{\partial g}{\partial \beta_2}(\tilde{\beta_1}, \tilde{\beta_2}) \cdot ({\beta_2} - \tilde{\beta_2})
$$

So we solve

$$
y - g(\tilde\beta) = y - g(\tilde{\beta_1}, \tilde{\beta_2}) = \sum \frac{\partial g}{\partial \beta_i} \triangle \beta_i
$$

And in the end we get

$$
\hat{\beta_1} = \tilde{\beta_1} + \triangle \beta_1
$$

We do Least Squares Estimation until we minimize $\triangle \beta$

We need to define the origin of the world!!! (could be the first camera pose).

### Error Propagation

Recall simple rules from Linear Algebra

$$
(AB)^T = B^TA^T
$$

Covariance matrix is symmetric

$$
Q_y = Q^T_y
$$

Everything is simplified when you have the same type of measurements (let's say camera).

If we over parametrize the system, we get singularity. Even if we have rank efficiency of 7, some values will come out. Make sure the system is not singular.

We compute the covariance between parameters. If it gets too close to 1, it means they are very correlated so we might need to take one of them out.

**Parameter Estimability**: 

Check condition number of $(X^TX)$.

Check correlation coefficients $p_{kl}$

For self-calibration, we for e.g. add the intrinsic parameters as unknowns.

We need to make sure we have points that make correlation possible.


