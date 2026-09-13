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

The question is literally ask me to derive the formula, not simply use it. This is where I need to use vectors.

> The concept is: move from the point along the normal direction until you hit the line; the distance moved is the answer.

What I know is that $(w_1w_2)$ is perpendicular to the line. Therefore, I need to make use of projections:

Let's say that the point $(4,3)$ hits the line in point $y$ of coordinates $(y_1,y_2)$. A distance from a point to a line is the perpendicular from that point on the line. That means we have the same direction as $(w_1,w_2)=(1,3)$, since it's also perpendicular on the line.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml5.png" style="max-width: 100%; height: auto;">
</div>

Since the point $y$ must lie on the line, we can compute $w+0 + w_1y_1 + w_2y_2 = 0$. Also, to go from $(4,3)$ straight to the line, I must move along the direction $(1,3)$. Any point along that direction, starting from $(4,3)$ can be written as:

_start point_ + (scalar) $\times$ (direction) = $(4,3) + \lambda (1,3)$

λ is just "how far" I move along that direction -- could be positive, negative, or zero.

$$
\begin{cases}
\begin{pmatrix} y_1 \\ y_2 \end{pmatrix} = \begin{pmatrix} x_1 \\ x_2 \end{pmatrix} + \lambda \begin{pmatrix} w_1 \\ w_2 \end{pmatrix} \\[6pt]
-7 + y_1 + 3y_2 = 0
\end{cases}
$$

**Plug into the line equation**:

$$
\begin{aligned}
w_0 + w_1(x_1 + \lambda w_1) + w_2(x_2 + \lambda w_2) = 0 \\
(w_0+w_1x_1+w_2x_2) + \lambda(w_1^2+w_2^2) = 0 \\
\lambda = \frac{-(w_0+w_1x_1+w_2x_2)}{||w_1,w_2||^2}
\end{aligned}
$$

Since $y-(x_1,x_2) = \lambda(w_1,w_2)$, the distance between the point and $y$ is:

$$
|\lambda| \cdot ||(w_1,w_2)|| = \frac{|w_0+w_1x_1+w_2x_2|}{||w_1,w_2||^2} \cdot ||w_1,w_2|| = \frac{|w_0+w_1x_1+w_2x_2|}{||w_1,w_2||}
$$

q.e.d.


5. What is the distance of the line to the origin $(0,0)$ and how can this be computed in terms of $(w_0,w_1,w_2)$?

I simply need to use the formula from the last question, and replace $(x_1,x_2)$ for $(0,0)$

$$
\text{dist} = \frac{| w_0 + w_1x1 + w_2x_2|}{|| (w_1,w_2) ||} = \frac{|-7|}{\sqrt{1^2+3^2}} = \frac{7}{\sqrt{10}}
$$

---

# Calculus

1. Show that the derivative of $\sigma(y) = 1/(1+e^{-y})$ w.r.t $y$ is given by:

$$
\sigma'(y) = \sigma(y) (1-\sigma(y))
$$

just know that $(e^u)' = u' \cdot e^u$

$$
\begin{aligned}
\begin{pmatrix}\frac{1}{1+e^{-y}}\end{pmatrix}' = \begin{pmatrix}\frac{f}{g}\end{pmatrix}' &= \frac{f'g -fg'}{g^2} \\
&= \frac{e^{-y}}{(1+e^{-y})^2} \\
&= \frac{1+e^{-y} -1}{(1+e^{-y})^2} \\
&= \frac{1+e^{-y}}{(1+e^{-y})^2} - \frac{1}{1+e^{-y})^2} \\
&= \sigma(y) - \sigma(y)^2 \\
&= \sigma(y)(1-\sigma(y)), \quad q.e.d
\end{aligned}
$$

2. Show that:

* for $y$ large, i.e. $y \rightarrow \infty$, $\sigma(y) \approx 1$. I haven't done limits since highschool. is this really ML?..

$$
\lim_{y \rightarrow \infty} {\frac{1}{1+_e^{-y}}} = \frac{1}{1+0} = 1
$$

* for $y=0$, $\sigma(y) = 0.5$

$$
\lim_{y \rightarrow 0} {\frac{1}{1+_e^{-y}}} = \frac{1}{1+1} = 0.5
$$

* for $y$ small, i.e. $y \rightarrow - \infty$, $\sigma(y) \approx 0$

$$
\lim_{y \rightarrow -\infty} {\frac{1}{1+_e^{-y}}} = \frac{1}{\infty} \rightarrow 0
$$

* for $y$ large, $\sigma'(y) \approx 0$

$$
\lim_{y \rightarrow \infty} {\sigma'(y)} =\lim_{y \rightarrow \infty} \sigma(y) (1-\sigma(y)) = 1(1-1) = 0
$$

3. From before, assume $w_0 + w_1x1 + w_2x_2 = y$. Show that the partial derivative of $\sigma$ w.r.t $x_1$ is given by:

$$
\frac{\partial \sigma}{\partial x_1} = \sigma(y)(1-\sigma(y))w_1
$$

I already know $\sigma'(y) = \sigma(y) (1-\sigma(y))$. And if I look at the line equation from above, $\frac{\partial \sigma}{\partial x_1} = w_1$. Therefore, we have the equation.

$$
\frac{\partial \sigma}{\partial x_1}(y) = \sigma'(y) \frac{\partial y}{\partial x_1}(y) = \sigma(y)(1-\sigma(y))w_1
$$

4. Once again assume that $w_0 + w_1x1 + w_2x_2 = y$. Show that:

* the gradient of $\sigma$ w.r.t. the vector $w=(w_0,w_1,w_2)$ (denoted $\nabla_w \sigma(y))$ is given by $\nabla_w \sigma(y) = \sigma(y)(1-\sigma(y))x$, where $x$ is the vector $x=(1,x_1,x_2)$.

i see that each partial derivative corresponds to that vector: $\frac{\partial \sigma}{\partial w_0} = \sigma(y)(1-\sigma(y)) \cdot 1$, $\frac{\partial \sigma}{\partial w_1} = \sigma(y)(1-\sigma(y)) \cdot x_1$, $\frac{\partial \sigma}{\partial w_2} = \sigma(y)(1-\sigma(y)) \cdot x_2$.

$$
\nabla_w \sigma(y) = \begin{pmatrix} \frac{\partial \sigma}{\partial w_0}(y), \frac{\partial \sigma}{\partial w_1}(y), \frac{\partial \sigma}{\partial w_2}(y) \end{pmatrix} = \sigma(y)(1-\sigma(y)) \cdot (1,x_1,x_2) = \sigma(y)(1-\sigma(y)) \cdot x, \quad q.e.d.
$$

5. Show that:

* 