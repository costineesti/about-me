---
title: Quaternions
draft: false
tags:
date: 2025-11-19
---
 
* Related to [[gimbal lock|Gimbal Lock]], [[RPCN 3|Coordinate Systems]] and [[rotational frames|Understanding rotational frames in 3D]].
* Source: UTwente slides and [Steven Gong](https://stevengong.co/notes/Quaternion)

A quaternion is a four-part hypercomplex number used to describe 3D rotations and orientations.

>[!summary] Think of quaternions as 3 parameters to indicate **a unit vector** and 1 to indicate **a rotation around it**.

* In math, we have: 
	* $q = q_0 + q_1i + q_2j + q_3k$
	* $q = \begin{bmatrix} q_0 \\ q_1 \\ q_2 \\ q_3 \end{bmatrix} \in R^4$ and $\mid \mid q \mid \mid = 1$. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/quaternion.png" style="max-width: 100%; height: auto;">
</div>

> Important property: **q** $=$ **-q**

# Notes from Steven

>[!summary] Double Cover Property (Singularity)
>
>Quaternions have singularities in the context of representing orientation, known as the double-cover property. This means that two quaternions can represent the same orientation. Specifically, a quaternion (q) and its negation (-q) represent the same spatial orientation.
>
>So then why are quaternions better if they also have singularities? Because

A quaternion q has a real part and three imaginary parts.

$$
q = q_0 + q_1i + q_2j + q_3k
$$

The three imaginary parts of the quaternion $i,j,k$ satisfy the following relationship:

$$
\begin{cases}
i^2 = j^2 = k^2 = -1 \\
ij = k, \quad ji = -k \\
jk = i, \quad kj = -i \\
ki = j, \quad ik = -j
\end{cases}
$$

### Rotation with quaternions

To rotate a point **p** using [[rotational frames|Rotation Matrix]], we know that **p' = Rp**. How do we do that with a quaternion?

We can also use a scalar and a vector to express quaternions: **q** $=[s,v]^T$ with **s** $= q_0 \in R, v= [q_1,q_2,q_3]^T \in R^3$.

Let the rotation be specified by a unit quaternion **q**. First, we extend the 3D point to an imaginary quaternion **p** $= [0, x, y, z]^T = [0, v]^T$ 

We just put the three coordinates into the imaginary part and leave the real part to be zero. Then, the rotated point p′ can be expressed as such a product:

$$
p' = qpq^-1
$$

The multiplication here is the quaternion multiplication, and the result is also a quaternion. Finally, we take the imaginary part of p′ and get the coordinates of the point after the rotation.

