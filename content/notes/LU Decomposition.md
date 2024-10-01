---
title: LU Decomposition
draft: false
tags:
  - notes
---
 
We can write any square matrix $M$ as the product of two simpler matrices. We will write
$$
M = LU
$$
, where:

* L is lower triangular i.e. all entries above the main diagonal are zero,
* U is the upper triangular, i.e. all entries below the main diagonal are zero.
$$
L = \begin{pmatrix}
l_1^1 & 0     & 0     & \cdots \\
l_1^2 & l_2^2 & 0     & \cdots \\
l_1^3 & l_2^3 & l_3^3 & \cdots \\
\vdots & \vdots & \vdots & \ddots
\end{pmatrix}
$$

$$
U = \begin{pmatrix}
u_1^1 & u_2^1 & u_3^1 & \cdots \\
0     & u_2^2 & u_3^2 & \cdots \\
0     & 0     & u_3^3 & \cdots \\
\vdots & \vdots & \vdots & \ddots
\end{pmatrix}
$$

$M=LU$ is called an LU Decomposition of M. It's an useful trick for computational reasons; it is much easier to compute the inverse of an upper or lower triangular matrix than general matrices. Since inverses are useful for solving linear systems, this makes solving any linear system associated to the matrix much faster as well.

>[!note] The determinant -- a very important quantity associated with any square matrix -- is very easy to compute for triangular matrices.
