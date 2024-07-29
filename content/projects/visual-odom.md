---
title: Visual Odometry
draft: false
tags:
  - projects
---

Visual Odometry was my main contribution to my [[Bachelors|bachelor's degree]]. It represents the update step in the Kalman Filter and I based it on the lane-detection algorithm that was already implemented on the Raspberry. It's goal is to give the yaw-rate with respect to a starting point.

The main disadvantage of this approach is that the camera is very sensitive to any environmental variables, the most significant one being the proper lightning.

>[!NOTE] I approached this case by using the RANSAC - Random Sample Consensus algorithm.
> By taking the POV to Bird-Eye-View, I succeeded in constraining the lines to always be parallel to each other. Having this achieved, I only needed to find out how to determine the rotation from one frame to the next one. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/bev_err.png" style="max-width: 100%; height: auto;">
</div>

To enhance the confidence of the rotation I used [[RANSAC]] because the camera measurements can be very noisy depending on the lightning, angle, etc. It succeeds in separating the data into [[inliers]] and [[outliers]] and it tries to fit a model based on the inliers.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/ransacvslinear.png" style="max-width: 100%; height: auto;">
</div>

The [[algorithm]] used is based on affine transformations which preserves the parallelism of the lanes by solving the next equational system:

$$
\begin{aligned}
    T(x) &= Ax + b, & \quad A &= \begin{bmatrix}
        a & b \\
        c & d
    \end{bmatrix},
\end{aligned}
$$
$$
\begin{bmatrix}
x_i' \\
y_i'
\end{bmatrix}
=
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x_i \\
y_i
\end{bmatrix}
+
\begin{bmatrix}
t_x \\
t_y
\end{bmatrix},
$$
$$
\begin{bmatrix}
x_1 & y_1 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & x_1 & y_1 & 1 \\
\vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
x_n & y_n & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & x_n & y_n & 1
\end{bmatrix}
\begin{bmatrix}
a \\
b \\
t_x \\
c \\
d \\
t_y
\end{bmatrix}
=
\begin{bmatrix}
x_1' \\
y_1' \\
\vdots \\
x_n' \\
y_n'
\end{bmatrix},
$$
$$
\begin{aligned}
    scale = \sqrt{a^2+b^2}, & \quad R = \begin{bmatrix}
\cos \theta & -\sin \theta \\
\sin \theta & \cos \theta
\end{bmatrix}
= \begin{bmatrix}
\frac{a}{\text{scale}} & \frac{b}{\text{scale}} \\
\frac{c}{\text{scale}} & \frac{d}{\text{scale}}
\end{bmatrix}
\end{aligned}
$$
The third equation is only the second one but extended. In my case I has a vector of pixel coordinates for X and Y.

> [!question] How good were the results?
> I would say it depends on more factors but I won't go in depth. The only one I am willing to share is that I came up with a threshold in order to determine if the curve is to the left; to the right; or simply a straight line. 
> 
> By using a threshold of 7, I managed to accentuate the angle of the curves, but the straight path suffered in this representation. On the other hand, a treshold of 10 accentuated the straight path while the curves had a little bit more to suffer.


<div style="display: flex; justify-content: space-around;"> <div> <p style="text-align: center;">Threshold of 10</p> <img src="../static/offline.png" alt="Threshold of 10" width="350" height="400"> </div> <div> <p style="text-align: center;">Threshold of 7</p> <img src="../static/offline7.png" alt="Threshold of 7" width="350" height="400"> </div> </div>
