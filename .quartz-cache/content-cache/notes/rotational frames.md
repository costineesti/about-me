---
title: Understanding rotational frames in 3D
draft: false
tags:
date: 2025-11-14
---
 
Related to [[coordinate frame|Coordinate Frame]].

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/3d_frame.png" style="max-width: 100%; height: auto;">
</div>

So I will explain on this example. We know the three rotational matrices.

**R_x(p):**
$$
\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos p & -\sin p \\
0 & \sin p & \cos p
\end{bmatrix}
$$

**R_y(r):**
$$
\begin{bmatrix}
\cos r & 0 & \sin r \\
0 & 1 & 0 \\
-\sin r & 0 & \cos r
\end{bmatrix}
$$

**R_z(ψ):**
$$
\begin{bmatrix}
\cos\psi & -\sin\psi & 0 \\
\sin\psi & \cos\psi & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

If I apply rotation on x axis (pitch), and then on y axis (roll) and at the end on z axis (yaw), the final rotational matrix will be

$$
R = R_z(\psi) R_y(r) R_x(p) = 
\begin{bmatrix}
\cos\psi\cos r & \cos\psi\sin r\sin p - \sin\psi\cos p & \cos\psi\sin r\cos p + \sin\psi\sin p \\
\sin\psi\cos r & \sin\psi\sin r\sin p + \cos\psi\cos p & \sin\psi\sin r\cos p - \cos\psi\sin p \\
-\sin r & \cos r\sin p & \cos r\cos p
\end{bmatrix}
$$

>[!question] But why does $R_z$ come first??
>It doesn't, you muppet. Think of it as functions. If you want to apply $f$ and then $g$, you would write $g(f(x))$, right?

> So, if I apply rotation on X axis first and then on Y axis, I get $R = R_y(r) \times R_x(p)$. To get accelerations, multiply by gravity vector $[0,0,g]^T$(assuming gravity points down z-axis initially).

$$
\begin{bmatrix}
a_x \\
a_y \\
a_z
\end{bmatrix}
=
\begin{bmatrix}
\cos r & 0 & \sin r \\
0 & 1 & 0 \\
-\sin r & 0 & \cos r
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos p & -\sin p \\
0 & \sin p & \cos p
\end{bmatrix}
\begin{bmatrix}
0 \\
0 \\
g
\end{bmatrix}
=
\begin{bmatrix} g\cos r \sin p \\ -g\sin p \\ g\cos r \cos p \end{bmatrix}
$$

# Small exercise: Angular Velocities

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex_earth.png" style="max-width: 100%; height: auto;">
</div>

* Considering that Z points is the pure vertical.
* The earth only rotates East-West (y axis) and vertically (z axis)
* $\omega_x$ will be 0 for all cases.
* $\omega_y$ takes values for Equator (Earth's rotation along the y-axis, tangent to surface) and for Arbitrary position
* $\omega_z$ takes values for North Pole and arbitrary position

|     | Equator | Arbitrary position* | North pole |
| --- | ------- | ------------------- | ---------- |
| ω_x | 0       | 0                   | 0          |
| ω_y | ω_e     | cos(ω_e)            | 0          |
| ω_z | 0       | sin(ω_e)            | ω_e        |

> Note: if the direction of the true north is unknown, but the z axis is still pointing upwards, we may write
> 
> $\omega_{xy} = \sqrt{\omega_x^2 + \omega_y^2} = \cos\omega_e$
> 
> $\omega_z = \sin\omega_e$
> 
> Since it is not known how the cos component is divided between x and y axes, this holds because $\sin^2\alpha + \cos^2\alpha = 1$

Safe to say I don't really understand what this all is. I will just stick to the first question I asked above.