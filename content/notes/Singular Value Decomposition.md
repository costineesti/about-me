---
title: Singular Value Decomposition
date: 2025-07-23
draft: false
tags:
  - research
  - perception
  - SeaClear
  - deep_learning
---
 
Source: [Multiple View Geometry in Computer Vision](https://github.com/mlzxy/slam-1/blob/master/Multiple%20View%20Geometry%20in%20Computer%20Vision.pdf) by Richard Hartley and Andrew Zisserman.

The singular value decomposition (SVD) is one of the most useful matrix decompositions, particularly for numerical computations. Its most common application is in the solution of over-determined systems of equations.

Given a square matrix $A$, the SVD is a factorization of $A$ as $A = UDV^T$, where $U$ and $V$ are orthogonal matrices, and $D$ is a diagonal matrix with non-negative entries. Note that it is conventional to write $V^T$ instead of $V$ in this decomposition. The decomposition may be carried out in such a way that the diagonal entries of $D$ are in descending order, and we will assume that this is always done. Thus a circumlocutory phrase such as “the column of $V$ corresponding to the smallest singular value” is replaced by “the last column of $V$.”

I did something of the sort in my [[Analysis and Prediction of Stock Market]] project where I implemented the QR Decomposition from scratch, using the Householder method.

The SVD also exists for non-square matrices $A$. Of most interest is the case where $A$ has more rows than columns. Specifically, let $A$ be an $m \times n$ matrix with $m \geq n$. In this case, $A$ may be factored as:

$$
A = U D V^T
$$

where:
- $U$ is an $m \times n$ matrix with orthogonal columns,
- $D$ is an $n \times n$ diagonal matrix, and
- $V$ is an $n \times n$ orthogonal matrix.

The fact that $U$ has orthogonal columns means that:

$$
U^T U = I_{n \times n}
$$

Furthermore, $U$ has the **norm-preserving** property:

$$
\|Ux\| = \|x\| \quad \text{for any vector } x,
$$

as one readily verifies. On the other hand, $UU^T$ is **not** the identity unless $m = n$.

Best implementation is in [Press-88]

### **Singular values and eigenvalues**

The diagonal entries of matrix $D$ in the SVD are non-negative. These entries are known as the **singular values** of the matrix $A$. They are not the same thing as eigenvalues.

To see the connection of the singular values of $A$ with eigenvalues, we start with:

$$
A = U D V^T
$$

From this, it follows that:

$$
A^T A = V D U^T U D V^T = V D^2 V^T
$$

Since $V$ is orthogonal, $V^T = V^{-1}$, and so:

$$
A^T A = V D^2 V^{-1}
$$

This is the defining equation for eigenvalues, indicating that the entries of $D^2$ are the eigenvalues of $A^T A$, and the columns of $V$ are the eigenvectors of $A^T A$. In short, the singular values of $A$ are the square roots of the eigenvalues of $A^T A$.

>[!NOTE] NOTE
> $A^T A$ is symmetric and positive semi-definite, so its eigenvalues are real and non-negative. Consequently, singular values are real and non-negative.

