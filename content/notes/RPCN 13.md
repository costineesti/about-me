---
title: Camera Intrinsics
draft: false
tags:
date: 2026-01-26
---
 
**Coordinate Systems**

**Intrinsic camera calibration** is the process of determining the internal geometric and optical characteristics of a camera. These parameters are essential because they allow a robot to convert a 2D image pixel into a 3D direction in the real world.

Measurements in images are used to retrieve information on the imaged objects. The calculations involve three coordinate systems:

* The **3D** **World** in which the imaged object should be described,
* the **2D Image** in which the measurements are done,
* The **3D Camera**.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intrinsic_1.png" style="max-width: 100%; height: auto;">
</div>

# Core Intrinsic Parameters

**Focal distance ($f$ or $v$)**: It describes the distance from the lens center to the image sensor. Recall the lens formula with $u$ the object distance and $v$ the image distance. $v$ is also called the **principal distance** (or camera constant).

$$
\frac{1}{f} = \frac{1}{u} + \frac{1}{v}
$$

It reads as: to **obtain a sharp image** of an object positioned at distance $u$ from the camera, the distance between the lens and the image plane should be $v$. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intrinsic_2.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] However, in practice, the focal length of a camera is often very small compared to the object distances, and hence $1/u$ is very small compared to $1/f$ and $1/v$. As a consequence, the difference between $f$ and $v$ is ignored and the focal length $f$ is also considered to describe the distance between the lens and the image plane.
>
>* For distant objects, $v$ can be set to $f$.
>* For nearby objects, $v$ cannot be set to $f$.

**Principal Point ($p$)** is the intersection of the optical axis of the lens with the image plane. $p(r_p, c_p)$ is only approximately at the center of the CCD / CMOS chip. Therefore, calibration is needed. Due to lens imperfections, images may show **radial and tangential distortions**. The radial distortions are symmetric around the principal point. Coordinates in the camera coordinate system are considered free of distortions.

**Relation between image coordinate system and camera coordinate system

Let $s_r$ and $s_c$ be the sizes of a pixel in respectively the row and the column direction. For an arbitrary point $q$, the relation between its **image coordinates** $(r,c)$ and its **camera coordinates** $(x,y)$ is then given by

$$
x = (c-c_p) \cdot s_c
$$

$$
y = -(r-r_p) \cdot s_r
$$

* with $(r_p,c_p)$ as the coordinates of the **principal point** $p$. 

The **focal length** $f$ and the **principal point** $p$ describe the location of the lens centre w.r.t the image plane, i.e. the CCD or CMOS chip.Together with the **pixel sizes** $s_r$ and $s_c$ , the location of a point in the image can be converted to a three-dimensional vector $(x,y,f)$ in the camera coordinate system. Together with the **lens distortion parameters** $(k_1, k_2, k_3, p_1, p_2)$, the 4 highlighted concepts constitute the **intrinsic camera parameters**.

>[!summary] The required accuracy of intrinsic camera parameters
>
>Consider the parameters
>
>* $f = 6mm$,
>* pixel size $s_c = 1.55 \mu m/pixel$
>* Assume $c_p$ is in the centre: $4056/2=2028$ pixels
>* Maximum ratio $X/Z = (2028 * 0.00155) / 6 = 0.524$
>
>The equation $c = \frac{f}{Z s_c}X + c_p = 4056.00$ converts world coordinate X to pixel coordinate c.
>
>Furthermore, $\frac{\partial c}{\partial f} = \frac{X}{Z s_c} = 0.524 / 0.00155 = 338$ pixel/mm, this derivative shows how pixel position changes when focal length changes.
>
>Suppose you get $f=5.99 mm$ so $\partial f = 0.01$. For this **small error**, we get $\partial c = \frac{X}{Z s_c} \partial f = 338 \cdot 0.01 = 3.38$ pixels. The coordinate error of 3.38 pixels is far more than a measurement error of 0.1 -- 0.5 pixels. Focal length must be calibrated very accurately.

