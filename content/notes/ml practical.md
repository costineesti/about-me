---
title: A practical on ML basics
draft: false
tags:
date: 2026-09-11
---

to refresh some knowledge.

# Geometry

1. Given the two points $(4,1)$ and $(-2,3)$, give an equation for the line through these two points. The equation should have the form:

$$
w_0 + w_1x_1 + w_2x_2 = 0
$$

There's the line equation given by two points:

$$
\frac{x-x_A}{x_B-x_A} = \frac{y-y_A}{y_B-y_A}
$$

so after I plug in the values, I get:

$$
\begin{aligned}
\frac{x-4}{-2-4} &= \frac{y-1}{3-1} \\
2x-8 &= -6y + 6 \\
x+3y-7 &= 0
\end{aligned}
$$

If we substitute, the solution would be $w = \begin{pmatrix}w_0 \\ w_1 \\ w_2\end{pmatrix} = \begin{pmatrix}-7 \\ 1 \\ 3\end{pmatrix}$

2. Make a plot of the line and the vector $(w_1,w_2)$. The direction of $(w_1,w_2)$ is called the positive side of the line.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml4.png" style="max-width: 100%; height: auto;">
</div>

3. Consider the point $(x_1, x_2)=(4,3)$. Is this point on the positive side or negative side of the line? Also compute $w_0 + w_1x_1 + w_2x_2$ for this point.

I only need to plug the point into the line equation and see if it's positive or negative.

$-7 + 4 + 9 = 6 > 0$ => on the positive side.

4. Show that the distance of the point $(x_1, x_2) = (4,3)$ to the line is equal to:

$$
\frac{| w_0 + w_1x1 + w_2x_2|}{|| (w_1,w_2) ||}
$$

Distance from a point to a line is effectiv