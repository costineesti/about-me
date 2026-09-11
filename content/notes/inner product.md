---
title: Inner Product
draft: false
tags:
date: 2026-09-10
---

An inner product is a generalization of the dot product. In a vector space, it is a way to multiply vectors together, with the result of this multiplication being a scalar.

$\langle x, w \rangle = w^\top x$

The inner product (scalar product) of two *n*-dimensional vectors is defined as:

$$
\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^{n} a_i \, b_i
$$

* which is equivalent to $\mathbf{a} \cdot \mathbf{b} = \mid a \mid \cdot \mid b \mid \cdot \cos \theta$

>[!summary] Two (non-zero) vectors are *orthogonal* if and only if their inner product is zero (i.e. $\theta=90 ^\circ$)

>[!summary] When two vectors are *linearly independent*, it means neither vector is a scalar multiple of the other (at an angle different than 0 or 180). Two orthogonal vectors are linearly independent.

>[!NOTE] The inner product can be used to project a vector on another.
>
><div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml1.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml2.png" alt="flow 2" width="350" height="300"> </div> </div>
>
>In the vectors shown here:
>
>$$
>\begin{aligned}
>\mathbf{a} \cdot \mathbf{b} &= \mid a \mid \cdot \mid b \mid \cdot \cos \theta = \sqrt{8} \sqrt{8} \cos 90^\circ = 0 \text{, or } \\
>&=2 \cdot 2 + 2 \cdot (-2) = 4-4 =0
>\end{aligned}
>$$
>
>$$
>\begin{aligned}
>\mathbf{b} \cdot \mathbf{c} &= \mid b \mid \cdot \mid c \mid \cdot \cos \theta = \sqrt{8} \sqrt{25} \cos 45^\circ = 2 \sqrt{2} \cdot 5 \cdot \frac{\sqrt{2}}{2}=10 \text{, or } \\
>&=2 \cdot 5 + 2 \cdot 0 =10
>\end{aligned}
>$$
>
>Notice that the result of the projection of a vector on a vector is a **scalar** (the signed length of the shadow along the line, see the red vertical line)
>
>The length of the projection is proportional to the inner product of the projected vector (scaled by the length of the projection vector).
>
>* what this means is that if $\mid \mathbf{v} \mid$ is not a unit vector, the raw dot product $\mathbf{u} \cdot \mathbf{v}$ is inflated by $|| \mathbf{v} ||$. To get the exact geometric shadow length, I must divide out by $|| \mathbf{v} ||$. If the target vector is already unit length, the dot product directly equals the shadow length.









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