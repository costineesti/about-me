---
title: Cross Product
draft: false
tags:
date: 2025-11-26
---
 
I have to apply it in my [[RPCN]] course.

For **any** vector **v** $\in$ $R^3$, $v = \begin{pmatrix} v_x \\ v_y \\ v_z \end{pmatrix}$, the skew-symmetric matrix is always:

$$
[\mathbf{v}]_\mathbf{x} = \begin{bmatrix} 0& -v_z& v_y \\ v_z& 0& -v_x \\-v_y& v_x &0 \end{bmatrix}
$$

**Key Properties**:

1. **Diagonal is always zero**
2. Antisymmetric: $[\mathbf{v}]_\mathbf{x}^T = -[\mathbf{v}]_\mathbf{x}$

So when we want to compute the cross product between two vectors $\mathbf{v}$ and $\mathbf{w}$, we do 

$$
\mathbf{v} \times \mathbf{w} = [\mathbf{v}]_\mathbf{x} \mathbf{w} = \begin{bmatrix} 0& -v_z& v_y \\ v_z& 0& -v_x \\-v_y& v_x &0 \end{bmatrix} \begin{bmatrix} w_x \\ w_y \\ w_z \end{bmatrix}
$$

Or, if you think you can memorize

$$
\begin{bmatrix} a_1 \\ a_2 \\ a_3 \end{bmatrix} \times \begin{bmatrix} b_1 \\ b_2 \\ b_3 \end{bmatrix} = \begin{bmatrix} a_2b_3 - a_3b_2 \\ a_3b_1 - a_1b_3 \\ a_1b_2 - a_2b_1 \end{bmatrix}
$$

