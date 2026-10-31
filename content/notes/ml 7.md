---
title: Support Vector Machine (SVM)
draft: false
tags:
date: 2026-10-19
---
Classification technique. Supervised learning technique. [Watch this 2 min video on SVM](https://youtu.be/_YPScrckx28?si=OAYali5kb4rSVmB-). Of course [Steven's notes](https://stevengong.co/notes/Support-Vector-Machine) are always a form of inspiration.

The SVM is a linear classifier that finds the **max-margin** separating hyperplane, giving a unique, optimal solution (unlike [[ml 5|MLP]]). Its dual form depends only on dot products, which enables the kernel trick.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml28.png" style="max-width: 100%; height: auto;">
</div>

<div class="encoder-section">
  <img src="../static/notes/ml29.png" style="width: 400px; height: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>It's all about decision boundaries.</li>
    </ul>
  </div>
</div>

>[!question] We have positive and negative examples. How to separate these points?
>
>**Vapnik Theory**: Try to put the lines which separates the negative points from the positive points as wide as possible.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml30.png" style="max-width: 100%; height: auto;"> </div>
>
>MLP finds _any_ separator. SVM picks the one with the **largest margin**, which generalizes better.
>
>**Geometric picture**: SVM finds the widest street separating the two classes. The decision hyperplane runs down the centerline; the margin is the curb-to-curb width. A wide street is robust: small perturbations in the data do not flip a point’s side. Without the margin requirement, the solution is not unique (infinitely many hyperplanes separate the same points), so SVM imposes a principled tiebreaker.

**1D example to show why MLP finds any separator**

Suppose we have three data points:

$$
\begin{aligned}
x=-3, \quad &y=-1\\
x=-1, \quad &y=-1\\
x=2, \quad &y=1
\end{aligned}
$$

And many separating perceptrons, $T[wx + b]$, the equation to solve will become $wx +b =0$. The solutions will gve:

$$
\begin{aligned}
b &< 3w-1\\
b &< w-1 \\
b &> -2w + 1
\end{aligned}
$$

which satisfy for whatever $x \in [-1,2]$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml32.png" style="max-width: 50%; height: auto;">
</div>

# Separating Hyperplanes

* Let's consider a vector perpendicular on the median line $\vec{w}$
* Then we also have some unknown $\vec{u}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml31.png" style="max-width: 50%; height: auto;">
</div>

We are interested if this unknown is on the left part of the street or if it is on the right part of the street.

* We project $\vec{u}$ on the perpendicular direction.
	* Thus, $\vec{w} \cdot \vec{u} \geq c$ (constant)

>[!NOTE] (1) Decision rule:
>If $\vec{w} \cdot \vec{u} + b \geq 0$ then "$+$"
>
>* where $c = -b$
>
>We will later rewrite it as:
>
>$$
>\sum_i \alpha_i y_i (\vec x_i\cdot\vec u)+b\geq 0
>$$
>
>* It only depends on the dot product, never $\vec{w}$ itself.

Now we want to encode the *margin* (street width) into the math, not just the boundary.

**Introduce $y_i$**: Instead of writing two separate cases (one inequality for “$+$” points, one for “$-$” points), Vapnik’s trick multiplies both sides by $y_i$ (which is +1 or -1 depending on class) so a single inequality covers both classes at once.

$$
\left.
\begin{aligned}
y_i(\vec{x}_i \cdot \vec{w} + b) \ge 1 \\
y_i(\vec{x}_i \cdot \vec{w} + b) \ge 1
\end{aligned}
\right\} \quad \Rightarrow \quad y_i(\vec{x}_i \cdot \vec{w} + b) - 1 \ge 0
$$

>[!NOTE] (2) For samples on the gutter (*sitting on the margin*) -- the support vectors
>
>$$
>y_i(\vec{x}_i \cdot \vec{w} + b) - 1 = 0
>$$

To derive the optimal **WIDTH** that separates the hyperplanes, we project the vector $(\vec{x}_+ - \vec{x}_-)$ (connecting a point on each gutter) onto the unit normal $\frac{\vec{w}}{||\vec{w}||}$ to get the street width:

$$
\text{WIDTH} = (\vec{x}_+ - \vec{x}_-) \cdot \frac{\vec{w}}{||\vec{w}||}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml33.png" style="max-width: 100%; height: auto;">
</div>

Using the gutter equations ($\vec{w}\cdot\vec{x}_+ = 1-b$ and $\vec{w}\cdot\vec{x}_- = -1-b$, i.e. distances $1-b$ and $1+b$ from origin along $\vec w$):

$$
\text{WIDTH} = \frac{2}{||\vec{w}||}
$$

>[!NOTE] (3) Optimal Separating Hyperplanes
>
>$$
>\text{WIDTH} = (\vec{x}_+ - \vec{x}_-) \cdot \frac{\vec{w}}{||\vec{w}||} = \frac{2}{||\vec{w}||}
>$$

**Goal**: maximize the **WIDTH**. However, maximizing $\frac{2}{||\vec{w}||}$ is the same as minimizing $||\vec{w}||$. For convenience in optimization, it's turned into minimizing $\frac{1}{2}||\vec{w}||$.

$$
\max \frac{2}{||\vec{w}||} \;\equiv\; \min ||\vec{w}|| \;\equiv\; \min \frac12||\vec{w}||^2
$$

Through this objective we define the **Quadratic optimization problem (Lagrange)**

---

# Quadratic Optimization Problem (Lagrange)

Apparently this is the heart of why SVM works.

**1. Hard-Margin SVM (Primal)**

Assume the data is linearly separable. Maximize the margin:

$$
\min_{w,b} \frac{1}{2} \|w\|_2^2 \quad \text{subject to} \quad y_i(\langle w, x_i \rangle + b) \ge 1 \quad \forall i
$$

* Build the **Lagrangian** -- attach one multiplier $\alpha_i>0$ per constraint, subtract them from the objective.

$$
L = \frac{1}{2} \|\vec{w}\|^2 - \sum_i \alpha_i [y_i(\vec{w} \cdot \vec{x}_i + b) - 1]
$$

* Find the **stationary point** w.r.t. $w$ and $b$ i.e. take partial derivatives, set to zero. This doesn't solve for $\alpha$ yet, only expresses $\vec{w}$ and a condition on $\alpha$ in terms of each other.

$$
\begin{aligned} \frac{\partial L}{\partial \vec{w}} = \vec{w} - \sum_i \alpha_i y_i \vec{x}_i = 0 \quad &\Rightarrow \quad \boxed{\vec{w} = \sum_i \alpha_i y_i \vec{x}_i} \\ \frac{\partial L}{\partial b} = -\sum_i \alpha_i y_i = 0 \quad &\Rightarrow \quad \boxed{\sum_i \alpha_i y_i = 0} \end{aligned}
$$

* **Substitute back**: plug $\vec{w} = \sum_i \alpha_i y_i \vec{x}_i$ back into $L$. This eliminates $\vec{w}$ entirely, and the $b$ term cancels exactly because of the $\sum_i \alpha_i y_i = 0$ condition. What's left is the **dual** objective $L_D$, written purely in terms of $\alpha$ and dot products $\vec x_i \cdot \vec x_j$.

$$
L_D = \sum_i \alpha_i - \frac12\sum_i\sum_j \alpha_i\alpha_j y_i y_j\, \vec x_i\cdot\vec x_j
$$

>[!tip] Key Observation
>
>The dual depends on the data only through dot products $\langle x_i, x_j \rangle$. Replace with a kernel $k(x_i, x_j)$ and you can operate in (infinite-dimensional) feature spaces for free.

* **The dual problem**: now maximize $L_D$ over α instead of minimizing over (w,b). The extra condition $\alpha_i[y_i(\vec x_i\cdot\vec w+b)-1]=0$ is called **complementary slackness**.

>[!summary] Complementary Slackness
>It forces either:
>
>* $\alpha_i=0 \Rightarrow y_i(\vec x_i\cdot\vec w+b)>1$ (point is on correct side of margin, doesn’t contribute), or
>* $\alpha_i>0 \Rightarrow y_i(\vec x_i\cdot\vec w+b)=1$ (point sits exactly _on_ the margin (gutter) or violates it, a **support vector**)

The solution is a sum over support vectors: $w = \sum_{i:\alpha_i > 0} \alpha_i y_i x_i$. Only support vectors define the hyperplane, a form of sparsity.

>[!tip] Intuition
>Only the points right on the curb (support vectors) matter. Delete a point deep inside its class’s territory and the solution does not change. This is why SVMs are memory-efficient at inference (you only keep the support vectors) and why they are less sensitive to outliers that sit far from the boundary, though close-to-boundary outliers can still hijack the fit.

Because the problem is [[convex optimization|convex]], this optimization never gets stuck in a local maximum (unlike MLP/neural net training).

**What tells me this problem is convex**:

1. The objective $\frac12||\vec w||^2$ is a quadratic (sum of squares) — quadratics of this form (positive semi-definite) are always convex.
2. The constraints $y_i(\vec x_i\cdot\vec w+b)\geq 1$ are _linear_ in $(w,b)$ — linear (affine) constraints always carve out a convex feasible region.

This way, we’re guaranteed any solution found is _the global optimum_, not a potentially-worse local one.

Non-traditional data like strings and trees can be used as input to SVM, instead of feature vectors.

The downside is we need to choose an appropriate kernel function, which is non-trivial. And it does not provide directly probability estimates. For that we perform logistic regression on the SVM output of a set of data (validation set) that is not used for training.

Look over [[Kernel Trick]], since it's a continuation of SVM for cases where the data is non-linearly separable.

Reading material: Bishop book, [Bottou and Lin, Sections 1, 2.1, and 2.2 of Support Vector Machine Solvers](https://leon.bottou.org/publications/pdf/lin-2006.pdf)



<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>