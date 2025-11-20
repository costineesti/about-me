---
title: Gimbal Lock
draft: false
tags:
date: 2025-11-19
---
 
> Never really encountered it, but I know it's one of the reasons we use [[rodrigues|Rodrigues Rotation Formula]] instead of Euler angles. Also related to [[RPCN 3|Coordinate Systems]], [[coordinate frame|Coordinate Frame]], and [[rotational frames|Understanding rotational frames in 3D]].

>[!summary] Euler angles present a failure: the so-called Gimbal Lock
>* **the loss of one degree of freedom** in a three-dimensional, three-gimbal mechanism.
>* occurs when the axes of two of the three gimbals are driven into a parallel configuration, "locking" the system into rotation in a **degenerate two-dimensional space**.
>* no actual locking happens, the word 'lock' is a bit misleading.

Resource: - [GuerrillaCC on yt](https://www.youtube.com/watch?v=zc8b2Jo7mno&ab_channel=GuerrillaCG)

4D Space: [[quaternions|Quaternions]] operate in 4D space and encode rotation as a single operation, not as sequential rotations around individual axes. This intrinsic nature avoids the conditions that lead to gimbal lock.

# GIMBAL LOCK, PROOF

$R = \begin{bmatrix}1 & 0 & 0 \\ 0 & \cos \alpha & -\sin \alpha \\ 0 & \sin \alpha & \cos \alpha \end{bmatrix} \begin{bmatrix} \cos \beta & 0 & \sin \beta \\ 0 & 1 & 0 \\ -\sin \beta & 0 & \cos \beta \end{bmatrix} \begin{bmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{bmatrix}$

* For $\beta = \pi/2$, we have $\cos \pi/2 =0, \sin \pi/2 = 1$

$$
R = \begin{bmatrix}1 & 0 & 0 \\ 0 & \cos \alpha & -\sin \alpha \\ 0 & \sin \alpha & \cos \alpha \end{bmatrix} \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 1 \\ \sin \alpha & \cos \alpha & 0 \\ -\cos \alpha & \sin \alpha & 0 \end{bmatrix} \begin{bmatrix} \cos \gamma & -\sin \gamma & 0 \\ \sin \gamma & \cos \gamma & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$


$$
R = \begin{bmatrix} 0 & 0 & 1 \\ \sin \alpha \cos \gamma + \cos \alpha \sin \gamma & -\sin \alpha \sin \gamma + \cos \alpha \cos \gamma & 0 \\ -\cos \alpha \cos \gamma + \sin \alpha \sin \gamma & \cos \alpha \sin \gamma + \sin \alpha \cos \gamma & 0 \end{bmatrix}
$$


* We know the trigonometric formula: $\sin(\alpha + \beta) = \sin \alpha \cos \beta + \sin \beta \cos \alpha$

$$
R = \begin{bmatrix} 0 & 0 & 1 \\ \sin(\alpha + \gamma) & \cos(\alpha + \gamma) & 0 \\ -\cos(\alpha + \gamma) & \sin(\alpha + \gamma) & 0 \end{bmatrix}
$$

> We can notice that only $\alpha$ and $\gamma$ appear as $(\alpha + \gamma)$ -- they're coupled together. 
> This means:
> 	* We've lost one degree of freedom
> 	* Rotating $\alpha$ and $\gamma$ by opposite amounts produces the same result
> 	* We cannot independently control rotation around the x and z axes
> 	* The gimbal is "locked" - two rotation axes have become aligned

