---
title: Rotation Matrix Time Derivative
draft: false
tags:
date: 2025-11-19
---
 
In [[RPCN 3|Coordinate Systems]], I found the challenge of "how do we find the time derivative of the rotation matrix?". So because I didn't want to load that page with explanations, I am doing it here (the mathematical argument)

# Basics

> So we know that the rotation matrix is **orthogonal**: $R^TR = RR^T = I$

* So we can write:

$$
R_\mathbf{x}(\theta)R_\mathbf{x}^T(\theta) = I
$$

* If we derivate this wr.t. time:

$$
\begin{bmatrix} \frac{d}{d\theta} R_\mathbf{x}(\theta) \end{bmatrix} R_\mathbf{x}^T(\theta) + R_\mathbf{x}(\theta) \frac{d}{d\theta} R_\mathbf{x}^T(\theta) = 0
$$

* We know that $A^TB^T = (BA)^T$, thus:

$$
\begin{bmatrix} \frac{d}{d\theta}R_\mathbf{x}(\theta) \end{bmatrix} R_\mathbf{x}^T(\theta) + \begin{bmatrix} \frac{d}{d\theta} R_\mathbf{x} (\theta)R_\mathbf{x}^T(\theta) \end{bmatrix}^T = 0
$$

* We define the first part as S: $\begin{bmatrix} \frac{d}{d\theta}R_\mathbf{x}(\theta) \end{bmatrix} R_\mathbf{x}^T(\theta)$
* And we know that S is a skew-symmetric matrix! ($S+S^T=0$) and ($-S = S^T$)
* In 3 dimensions, the skew-symmetric matrix has a definite form. It's also an alternative way to express the cross product $a \times b = S(a) b$

$$
S_{3D}(\mathbf{u}) = \begin{pmatrix} 0 & -u_z & u_y \\ u_z & 0 & -u_x \\ -u_y & u_x & 0 \end{pmatrix}, \mathbf{u} = [u_x, u_y, u_z]
$$

# Now here comes some generalization

## For one dimension:

* $S = \frac{d}{d\theta}R_\mathbf{x}(\theta) R_\mathbf{x}^T(\theta)$ **AND** $R_\mathbf{x}(\theta) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos \theta & -\sin \theta \\ 0 & \sin \theta & \cos \theta \end{bmatrix}$. 
* If we solve this, we will get that $S = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} = S([1, 0, 0])$ 
* Therefore, $\frac{d}{d\theta}R_\mathbf{x}(\theta) = S([1, 0, 0]) R_\mathbf{x}(\theta)$

>[!NOTE] THIS HOLDS FOR ALL OF THE EXAMPLES IN 1D!
> $\frac{d}{d\theta}R_\mathbf{y}(\theta) = S([0, 1, 0]) R_\mathbf{y}(\theta)$
> $\frac{d}{d\theta}R_\mathbf{z}(\theta) = S([0, 0, 1]) R_\mathbf{z}(\theta)$

* So we get the general form: $\frac{d}{d\theta}R_\mathbf{l}(\theta) = S(l) R_\mathbf{l}(\theta)$

## Going further..

* Now we look at the time derivative of the rotation.

$$
\frac{d\theta}{dt} \frac{d}{d\theta} R_l(\theta) = \frac{d\theta}{dt}S(l)R_l(\theta)
$$

$$
\frac{\cancel{d\theta}}{dt} \frac{d}{\cancel{d\theta}} R_l(\theta) = \frac{d\theta}{dt}S(l)R_l(\theta)
$$

$$
\frac{d}{dt} R_l(\theta) = S(\omega)R_l(\theta), \omega = \dot \theta l
$$

* The angular velocities ($\omega_x, \omega_y, \omega_z$) come directly from the **IMU gyroscopes**. $S(\omega) = \begin{pmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{pmatrix}$

## Based on Taylor Series, we can write

* The expansion of a Rotation Matrix around a point C: $R(\alpha) \approx R(c) + \frac{R'(c)}{1!}(\alpha-c) + \frac{R''(c)}{2!}(\alpha-c)^2 + ...$
* We know that $R_\mathbf{x}(\alpha) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos \alpha & -\sin \alpha \\ 0 & \sin \alpha & \cos \alpha \end{bmatrix}$ and $\frac{dR_x}{d\alpha} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$
* If we evaluate at point $c=0$ and keep only the first 2 terms from the expansion above, we get: $R_\mathbf{x}(\alpha) \approx R(0) + \frac{R'(0)}{1!}(\alpha-0) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix} +  \begin{pmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{pmatrix}\alpha = I_3 + S([1,0,0] \alpha$


So if we go back to the first question from [[RPCN 3|Coordinate Systems]], $\dot r^i = \dot R^i_b r^b + R^i_b \dot r^b$, we can write:

$$
\dot r^i = (R_b^i \Omega_{ib}^b)r^b + R_b^i \dot r^b
$$

$$
\dot r^i = R_b^i (\Omega_{ib}^b r^b + \dot r^b), \Omega_{ib}^b = S(\omega) = \begin{pmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{pmatrix}
$$
# Second Derivative (Time Derivative of Velocity)

$$
\dot r^i = R_b^i (\Omega_{ib}^b r^b + \dot r^b)
$$

$$
\ddot r = \dot R_b^i (\Omega_{ib}^b r^b + \dot r^b) + R_b^i \frac{d}{dt}(\Omega_{ib}^b r^b + \dot r^b)
$$

$$
\frac{d}{dt}(\Omega_{ib}^b r^b + \dot r^b) = \dot \Omega_{ib}^b r^b + \Omega_{ib}^b \dot r^b + \ddot r^b
$$

$$
\ddot r^i = R_b^i(\ddot r^b + 2 \Omega_{ib}^b \dot r^b + \dot \Omega_{ib}^br^b + \Omega_{ib}^b\Omega_{ib}^br^b)
$$

> The last part, $\Omega_{ib}^b\Omega_{ib}^br^b$ simply means the skew-symmetric matrix is applied **twice**. This is equivalent to the **cross product applied twice**: $\omega \times (\omega \times r^b)$. This double cross product represents the **centrifugal acceleration**, which points radially outward from the rotation axis. 

