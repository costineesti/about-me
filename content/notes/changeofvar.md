---
title: Change-of-Variable Formula (Jacobian Matrix)
draft: false
tags:
date: 2026-01-26
---

Given a random variable $z$ and its known probability density function $z \sim \pi(z)$, we would like to construct a new random variable using 1-1 mapping function $x = f(z)$. The function $f$ is invertible, so $z = f^{-1}(x)$. Now the question is *how to infer the unknown probability density function of the new variable*, $p(x)$?

$$
\int p(x)dx = \int \pi(z)dz = 1 \text{ , Definition of prob. distr.}
$$

$$
p(x) = \pi(z) \left| \frac{dz}{dx} \right| = \pi(f^{-1}(x)) \left| \frac{df^{-1}}{dx} \right| = \pi(f^{-1}(x)) |(f^{-1})'(x)|
$$

>[!summary] The Change-of-Variable Formula
>Suppose that the variables $x$ and $y$ are related to the variables $u$ and $v$ by the equations $x=x(u,v), y=y(u,v)$. Then
>
>$\iint_{R_{xy}} f(x, y) \, dx \, dy = \iint_{R_{uv}} f[x(u, v), y(u, v)] \left| \frac{\partial(x,y)}{\partial(u,v)} \right| \, du \, dv$
>
>$\frac{\partial(x,y)}{\partial(u,v)} = \det \begin{bmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{bmatrix}$
>
>This function is called the *Jacobian* of the transformation, denoted by **$J$**.

The Jacobian is a factor that is introduced to compensate for the distortion of the domain that occurs when we move it from one coordinate system to another.

>[!danger] Restriction to formula
>There is one important restriction on the transformation $(x,y) \rightarrow (u,v)$; **we must not have** $J=0$ **at any point on the interior of** $R_{uv}$​. This condition ensures that the transformation is invertible on the domain of integration.

This is where the Jacobian comes from when moving from one coordinate system to another. $|(f^{-1})'(x)|$ indicates the ratio between the area of rectangles defined in two different coordinate of variables $z$ and $x$ respectively.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/normflow3.png" style="max-width: 100%; height: auto;">
</div>
