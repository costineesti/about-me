---
title: Support Vector Machine (SVM)
draft: false
tags:
date: 2026-10-19
---
Classification technique. Supervised learning technique. [Watch this 2 min video on SVM](https://youtu.be/_YPScrckx28?si=OAYali5kb4rSVmB-).

The SVM is a linear classifier that finds the **max-margin** separating hyperplane, giving a unique, optimal solution (unlike [[ml 5|MLP]]). Its dual form depends only on dot products, which enables the kernel trick.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml28.png" style="max-width: 100%; height: auto;">
</div>

<div class="encoder-section">
  <img src="../static/notes/ml29.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
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
    <img src="../static/notes/ml32.png" style="max-width: 100%; height: auto;">
</div>

# Separating Hyperplanes

* Let's consider a vector perpendicular on the median line $\vec{w}$
* Then we also have some unknown $\vec{u}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml31.png" style="max-width: 100%; height: auto;">
</div>

We are interested if this unknown is on the left part of the street or if it is on the right part of the street.

* We project $\vec{u}$ on the perpendicular direction.
	* Thus, $\vec{w} \cdot \vec{u} \geq c$ (constant)

>[!NOTE] (1) Decision rule:
>If $\vec{w} \cdot \vec{u} + b \geq 0$ then "$+$"
>
>* where $c = -b$

Page 21. See the notes from Claude as well to continue the idea.



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