---
title: Coordinate Systems
draft: false
tags:
date: 2025-11-18
---
 
This is Lecture 3 from my [[RPCN|Robotic Perception, Cognition and Navigation]] course. Also related to [[coordinate frame|Coordinate Frame]].

# Geographic Coordinate System ($\phi, \lambda, h$)

<div class="encoder-section">
  <img src="../static/notes/geographical_system.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>Geographic Latitude (φ)</b></li>
	      <ul>
		      <li>the angle between the ellipsoidal normal through point "P" and the equatorial plane</li>
	      </ul>
	<li><b>Geographic Longitude (λ)</b></li>
		<ul>
			<li>angle in the equatorial plane between the zero median and the meridian of point "P"</li>
		</ul>
	<li><b>Elipsoidal Height (h)</b></li>
		<ul>
			<li>the distance along the normal from the surface of the ellipsoid. </li>
		</ul>
	<li><b>Geometric surface (Geoid)</b>: An equipotential surface where gravity is constant everywhere. It approximates mean sea level extended through continents.</li>
	<li><b>Reference surface (Ellipsoid)</b>: A mathematical approximation of the geoid used for navigation and mapping. It's a smooth ellipsoid shape.</li>
    </ul>
  </div>
</div>

* Lines of equal latitude are called parallels. They form circles on the surface of the ellipsoid.
* Lines of equal longitude are called meridians and they form ellipses (meridian ellipses) on the ellipsoid of the Earth.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/earth_ref.png" style="max-width: 100%; height: auto;">
</div>

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/earth_1.png" alt="Earth 1" width="350" height="300"> </div> <div> <img src="../static/notes/earth_2.png" alt="Earth 2" width="350" height="300"> </div> </div>

* The Earth is an ellipsoid (or a spheroid)

# Geocentric Coordinate System ($X,Y,Z$)

* Cartesian coordinate system
* Origin (0,0,0) is at the center of the Earth (goecentric)

<div class="encoder-section">
  <img src="../static/notes/geocentric_system.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>Earth-centered, Earth-fixed (ECEF)</b></li>
	      <ul>
		      <li>OZ Axis – along the rotational axis</li>
		      <li>OX Axis - lies on the equatorial plane and intersect prime meridian</li>
		      <li>OY Axis – lies on the equatorial plane perpendicular to OX and OZ such that OX, OY, OZ form a right-handed coordinate system</li>
	      </ul>
    </ul>
  </div>
</div>

### Geographic coordinates to Geocentric

* The distance is $v(NP') = \frac{a}{\sqrt{1-e^2 \sin^2\varphi}}$
* The eccentricity squared is $e^2 = \frac{a^2-b^2}{b^2}$. Ellipsoid!
* Required is the projection of $OQ = (v+h) \cos\varphi$ onto $XY$ plane, and $PQ$ on $Z$ axis:

$$
X = (v+h) \cos \varphi \cos \lambda
$$
$$
Y = (v+h) \cos \varphi \sin \lambda
$$
$$
Z = (v(1-e^2)+h) \sin \varphi
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/geographic_to_geocentric.png" style="max-width: 100%; height: auto;">
</div>

# IMU Measurement, BODY FRAME

* Gyroscopes: 3 angular velocities in **body frame** (=b) with respect to **Earth inertial frame** (=i) $\omega_{ib}^b = \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix}$
* Accelerometers, 3 specific forces in **body frame**. $f^b = \begin{bmatrix} f_x \\ f_y \\ f_z \end{bmatrix}$
* $f^b = a^b - g^b$.

# FROM EARTH INERTIAL TO BODY FRAME

* All IMU measurements are in body frame but relative to the inertial frame.
* How do we connect these two frames? We'll use the following frames
	* Earth-centered Inertial Frame (Inertial frame)
	* Earth-centered Earth-fixed Frame (ECEF)
	* Local-level (navigation) Frame
	* Body Frame

### EARTH-CENTERED INERTIAL FRAME (INERTIAL FRAME)

* The origin ($X=0, Y=0, Z=0$) is at the center of mass of the Earth => a geocentric coordinate system
* **Z-axis:** Along Earth's rotation axis through the Conventional Terrestrial Pole (CTP).
* **X-axis:** In the equatorial plane pointing toward the vernal equinox (a fixed direction in space).
	* **Does not rotate with respect to the stars (inertial)**.
* **Y-axis:** Completes a **right-handed** coordinate system.

This frame is "inertial" because the x-axis remains fixed relative to distant stars rather than rotating with Earth. This is different from Earth-fixed frames (like latitude/longitude coordinates) which rotate along with the planet. The inertial frame is "inertial" precisely because it doesn't accelerate or rotate - it maintains a constant orientation relative to distant stars.

## EARTH-CENTERED EARTH-FIXED FRAME (ECEF)

<div class="encoder-section">
  <img src="../static/notes/geocentric_system.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>The origin (X=0, Y=0, Z=0) is at the center of mass of the Earth => a geocentric coordinate system</li>
      <li>The Z-axis is along axis of the Earth’s rotation through the conventional terresterial pole (CTP).</li>
      <li>The X-axis passes through the intersection of the equatorial plane and the reference maridian (Greenwich)</li>
      <ul>
      <li><b>Rotates as Earth rotates</b>.</li>
      </ul>
      <li>The y-axis completes a <b>right-handed</b> system in the equatorial plane.</li>
      <li>Handy, since our robot moves with the Earth’s rotation!</li>
    </ul>
  </div>
</div>

## LOCAL-LEVEL (NAVIGATION) FRAME, NEU

<div class="encoder-section">
  <img src="../static/notes/NEU.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>The origin coincides with the center of the sensor frame.</li>
      <li>The Y-axis points to true north.</li>
      <li>The X-axis points to east.</li>
      <li>The Z-axis completes the <b>left-handed</b> coordinate systems but pointing up</li>
      <ul>
      <li>Determine the height above the chosen reference from GNSS (e.g., ellipsoid) or other measurements (e.g. terrain).</li>
      </ul>
      <li>Could be also used in right-handed NED format. Then down is positive, so height decreases as altitude increases (e.g., height = 0 at sea level, height = -500 m for an object 500 m above sea level</li>
    </ul>
  </div>
</div>

## BODY FRAME

<div class="encoder-section">
  <img src="../static/notes/bodyframe.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>The origin usually coincides with the center of mass of the vehicle.</li>
      <li>The y-axis points towards the forward direction.</li>
      <li>The x-axis points toward the right side of the platform.</li>
      <li>The z-axis points toward the vertical direction completing a right-handed system.</li>
    </ul>
  </div>
</div>

>[!question] How to transform between the frames?
>* Transformations from one frame into another are rotations for
>	* Acceleration
>	* Angular Velocity
>* The subscript of the rotation matrix is the original frame and the superscript is the destination frame: $v^i = R_e^i v^e$.
>* Rotations are linear transformations.


# Rotation Matrices

* Attitude, velocity, acceleration and angular velocity are all vectors in 3D space: $v^a \in R^3$.

> Frame indices: i (inertial), e (ECEF), l (local), b (body).

## The rule of the right hand

<div class="encoder-section">
  <img src="../static/notes/coord_frame.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>For a right-handed coordinate system with axes x, y, z, we have the following cross product rules:</li>
	      <ul>
		      <li>Y x Z = X</li>
		      <li>X x Y = Z</li>
		      <li>Z x X = Y</li>
	      </ul>
    </ul>
  </div>
</div>

## Rotation from one system to another

### 1. ECEF to Inertial (Time-Dependent)

* Earth rotation rate vector: $\omega^i_{ie} = [0, 0, \omega_e]^T$.
* This transformation is time-dependent because ECEF rotates with Earth while the inertial frame stays fixed relative to stars.
* Rotation matrix (time-dependent)

$$\mathbf{R}^i_e = \begin{bmatrix} \cos \omega_e t & \sin \omega_e t & 0 \\ -\sin \omega_e t & \cos \omega_e t & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

## 2. Local to ECEF

$$\mathbf{R}^e_l = \mathbf{R}_3(-\lambda - 90)\mathbf{R}_1(\phi - 90)$$

$$\mathbf{R}^e_l = \begin{bmatrix} -\sin \lambda & -\sin \phi \cos \lambda & \cos \lambda \cos \lambda \\ \cos \lambda & -\sin \phi \sin \lambda & \cos \lambda \sin \lambda \\ 0 & \cos \phi & \sin \phi \end{bmatrix}$$

## 3. Body to Local

$$\mathbf{R}^l_b = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos \alpha & -\sin \alpha \\ 0 & \sin \alpha & \cos \alpha \end{bmatrix} \begin{bmatrix} \cos \beta & 0 & \sin \beta \\ 0 & 1 & 0 \\ -\sin \beta & 0 & \cos \beta \end{bmatrix} \begin{bmatrix} \cos \gamma & -\sin \gamma & 0 \\ \sin \gamma & \cos \gamma & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

# Derivative of the Rotation Matrix

* Let's consider the position vector $r^i = R_b^i r^b$.
* If we want to get the velocity, we do $\dot r^i = \dot R^i_b r^b + R^i_b \dot r^b$.

>[!question] Why do we need the derivative of the rotation matrix?
>* To transform **velocities** from one frame to another
>* To transform **accelerations** from one frame to another
>* To transform **angular velocities** from one frame to another
>* So basically, the derivatives (not position or attitude, those use the basic [[rotational frames|Rotation Matrix]]).

The **key challenge** is to determine the time derivative of the rotation matrix $\dot R^i_b$. In [[rot derivative|Rotation Matrix Time Derivative]] I covered the mathematics behind finding the following solution:

$$\dot r^i = R_b^i (\Omega_{ib}^b r^b + \dot r^b), \Omega_{ib}^b = S(\omega) = \begin{pmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{pmatrix}$$

Also, the second derivative (the acceleration) will be:

$$
\ddot r^i = R_b^i(\ddot r^b + 2 \Omega_{ib}^b \dot r^b + \dot \Omega_{ib}^br^b + \Omega_{ib}^b\Omega_{ib}^br^b)
$$

> The last 3 terms are the **Coriolis force**, the **Euler force** and **Centrifugal force** respectively.

## FICTITIOUS FORCES

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fict_forces.png" style="max-width: 100%; height: auto;">
</div>

These deserve their own dedicated page. Will make one!

# GIMBAL LOCK

Covered in [[gimbal lock|Gimbal Lock]]. Basically, we lose one degree of freedom when two axes align in parallel.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/gimbal.png" style="max-width: 100%; height: auto;">
</div>

The solution is using [[quaternions|Quaternions]]

# QUATERNIONS

Covered in [[quaternions|Quaternions]]. It's a 4D way of representing rotations and orientations.

# Homogenous Coordinates

Without homogenous coordinates, if we have 3 points

$$
p_B = R_1p_A + t_1
$$

$$
p_C = R_2p_B + t_2
$$

$$
p_D = R_3p_C + t_3
$$

then $p_D = R_3(R_2(R_1p_A + t_1) + t_2) + t_3$

> Rotation and scaling can be represented by a matrix, but translation cannot.
> 
> Translation requires vector addition. $p^w = R_b^wp^b + t_b^w$
> 
> Homogenous coordinates overcome this limitation by adding an extra coordinate (from (x,y,z) to (x,y,z,1) in 3D). This enables all transformations, including translation, to be represented as matrix multiplications.

Therefore, if now we have the same 3 points but represented as

$$
p_B = H_1p_A
$$

$$
p_C = H_2p_B
$$

$$
p_D = H_3p_C
$$

then $p_D = H_3H_2H_1p_A$


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