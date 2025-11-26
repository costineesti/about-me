---
title: Mechanization
draft: false
tags:
date: 2025-11-26
---

Lecture from the [[RPCN]] course. Motivation: How does a stabilizer work?

**Mechanization** is the process of converting the output of an IMU into position, velocity and attitude information. The outputs include rotation rates about three body axes $\omega_{ib}^b$ measured by the gyroscopes triad and three specific forces $f^b$ along the body axes measured by the accelerometer triad, all of which are with respect to the inertial frame. Mechanization is a recursive process that starts with a specified set of initial values and iterates on the output.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/INS.png" style="max-width: 100%; height: auto;">
</div>

**Properties of angular velocities**:

* We usually write $\omega_{mk}^p$ which means the angular velocity of frame **m**, relative to frame **k**, expressed in frame **p** coordinates.
* For example, if we have a robotic arm with the **fixed** base-frame (**k**), the **moving** end-effector (**m**), and we want to express it in **p** frame coordinates: The angular velocity describes how fast **m** is rotating relative to **k**, but you can write those rotation rates using any coordinate system **p**.
* $\omega^p_{mk} = \omega^p_{mh} + \omega^p_{hk}$ (chain rule)
	* **m** rotates relative to **h**
	* **h** rotates relative to **k**
	* Therefore, **m** rotates relative to **k**
	* All expressed in **p-frame coordinates**

I covered in [[RPCN 3|Coordinate Systems]] that $f^b = a^b-g^b$ is the specific force of the IMU measured in **body frame** and that $\Omega_{ib}^b = \begin{pmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{pmatrix}$ is the skew-symmetric matrix which represents the **cross product** as a matrix multiplication.

# INS Mechanization in an Inertial Frame of Reference

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/INS1.png" style="max-width: 100%; height: auto;">
</div>

In the figure above we can see the mechanization of an INS(Inertial Navigation System) in the inertial frame. We want to integrate $p$, $v$, and $\theta$ from the IMU measured accelerations $a$ and angular velocities $\omega$.

We know that

$$
f^i = a^i - \overline{\mathbf{g}}^i
$$

By letting $a^i = \ddot r^i$, this can be rewritten as:

$$
\ddot r^i = f^i + \overline{\mathbf{g}}^i
$$

And for ease of solution, the set of three second-order differential equations can be transformed to a set of first-order differential equations as follows:

$$
\dot r^i = \mathbf{v}^i
$$

$$
\dot{\mathbf{v}}^i = f^i + \overline{\mathbf{g}}^i
$$

The measurements are usually made in the body frame, w.r.t. inertial frame. We can use the rotation matrix $R_b^i$ to extract

$$
f^i = R_b^i f^b
$$

Since the gravitational vector is usually expressed in either the e-frame or the l-frame, it can be transformed to the i-frame through a rotation matrix $R_e^i$ or $R_l^i$. We'll consider e-frame

$$
\overline{\mathbf{g}}^i = R_e^i \overline{\mathbf{g}}^e
$$

Substituting in the first-order differential equations, we get:

$$
\dot{\mathbf{v}}^i = R_b^if^b + R_e^i \overline{\mathbf{g}}^e
$$

As discussed in [[rot derivative|Rotation Matrix Time Derivative]], the rate of change of a transformation matrix is 

$$
\dot R_b^i = R_b^i \Omega_{ib}^b
$$

The mechanization equations for the i-frame can therefore be summarized as:

$$
\begin{bmatrix}
\dot{r}^i \\
\dot{v}^i \\
\dot{R}_b^i
\end{bmatrix}
=
\begin{bmatrix}
v^i \\
R_b^if^b + R_e^i \overline{\mathbf{g}}^e \\
R_b^i \Omega_{ib}^b
\end{bmatrix}
$$

These all use the measurement from the IMU.

---

# INS Mechanization in ECEF Frame

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/INS2.png" style="max-width: 100%; height: auto;">
</div>

>[!danger] A note on the difference in which frame the angular velocity is expressed in
>* Related to [[rot derivative|Rotation Matrix Time Derivative]]
>* If $\omega$ is expressed in the **inertial/fixed frame**: $\dot R = \Omega \cdot R$
>* If $\omega$ is expressed in the **rotating/body** frame: $\dot R = R \cdot \Omega$

**Mathematical Proof (From the book)**:

A position vector in the $r^e$ in the e-frame can be transformed into the i-frame $r^i$ by using the Rotation Matrix as follows:

$$
r^i = R_e^i r^e
$$

After differentiating twice and rearranging the terms ([see here](https://costinchitic.wiki/notes/rot-derivative#second-derivative-time-derivative-of-velocity)) we get:

$$
\ddot{\mathbf{r}}^i = R_e^i \left( \ddot{\mathbf{r}}^e + 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \dot{\Omega}_{ie}^e \mathbf{r}^e + \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e \right)
$$

But we know that $\ddot r^i = a^i$, therefore $\ddot r^i = f^i + g^i$, so:

$$
R_e^i \left( \ddot{\mathbf{r}}^e + 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \dot{\Omega}_{ie}^e \mathbf{r}^e + \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e \right) = \mathbf{f}^i + \mathbf{g}^i
$$

$$
R_e^i \left( \ddot{\mathbf{r}}^e + 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \dot{\Omega}_{ie}^e \mathbf{r}^e + \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e \right) = R_b^i \mathbf{f}^b + R_e^i \overline{\mathbf{g}}^e
$$

This can be simplified by letting $R_b^i = R_e^i R_b^e$ and $\dot \Omega_{ie}^e r^e = 0$, because the Earth's rotation rate $\omega_{ie}$ is approximately constant.

$$
R_e^i \left( \ddot{\mathbf{r}}^e + 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e \right) = R_e^i R_b^e \mathbf{f}^b + R_e^i \overline{\mathbf{g}}^e
$$

$$
\ddot{\mathbf{r}}^e = R_b^e \mathbf{f}^b - 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \overline{\mathbf{g}}^e - \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e
$$

and because the gravity vector is defined as $\mathbf{g}^e = \overline{\mathbf{g}}^e - \Omega_{ie}^e \Omega_{ie}^e \mathbf{r}^e$ (true gravitational acceleration - centrifugal acceleration due to Earth's rotation), this can be further reduced to:

$$
\ddot{\mathbf{r}}^e = R_b^e \mathbf{f}^b - 2\Omega_{ie}^e \dot{\mathbf{r}}^e + \mathbf{g}^e
$$

which is equivalent to

$$
\dot r^e = v^e, \dot v^e = R_b^e \mathbf{f}^b - 2\Omega_{ie}^e v^e + \mathbf{g}^e
$$

q.e.d.

The rate of change of the rotation matrix $R_b^e$ can be given as

$$
\dot R_b^e = R_b^e \Omega_{eb}^b
$$

To extract $\Omega_{eb}^b$, we can do the following chain rule:

$$
\Omega_{ib}^b = \Omega_{ie}^b + \Omega_{eb}^b
$$

$$
\Omega_{eb}^b = - \Omega_{ie}^b + \Omega_{ib}^b
$$

Substituting, we get:

$$
\dot R_b^e = R_b^e \begin{pmatrix} - \Omega_{ie}^b + \Omega_{ib}^b \end{pmatrix}
$$

So the e-frame mechanization equations can be summarized as:

$$
\begin{bmatrix}
\dot{\mathbf{r}}^e \\
\dot{\mathbf{v}}^e \\
\dot{R}_b^e
\end{bmatrix}
=
\begin{bmatrix}
\mathbf{v}^e \\
R_b^e \mathbf{f}^b - 2\Omega_{ie}^e \mathbf{v}^e + \mathbf{g}^e \\
R_b^e (\Omega_{ie}^b + \Omega_{ib}^b)
\end{bmatrix}
$$

The term $- 2\Omega_{ie}^e$ in the velocity derivative comes from the rotation of the Earth. 

---

# INS Mechanization in Local-Level (Navigation) Frame

In many applications the mechanization equations are desired in the local frame for the following reasons:

* The navigation equations in the l-frame furnish a navigation solution that is intuitive to the user on or near the Earth’s surface.
* Since the axes of the l-frame are aligned to the local east, north and up directions, the attitude angles (pitch, roll and azimuth) can be obtained directly at the output of the mechanization equations when solved in the local-level frame.
* The computational errors in the navigation parameters on the horizontal (E-N) plane are bound by the Schuler effect

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/INS3.png" style="max-width: 100%; height: auto;">
</div>

The position vector $r^l$ of a moving platform expressed in the geodetic (curvilinear) coordinates in the ECEF frames as:

$$
r^l = \begin{bmatrix} \varphi, \lambda, h \end{bmatrix}^T
$$

The rate of change of its position is expressed in terms of the velocity in the east, north and up directions. The rate of change of the platform’s latitude, longitude and altitude are

$$
\dot{\varphi} = \frac{v_n}{R_M + h}
$$

$$
\dot{\lambda} = \frac{v_e}{(R_N + h) \cos \varphi}
$$

$$
\dot{h} = v_u
$$

* $v_e$ is the component of the velocity in the east direction
* $v_n$ is the component of the velocity in the north direction
* $v_u$ is the component of the velocity in the up direction
* $R_M$ is the meridian radius of the ellipsoid
* $R_N$ is the normal radius of the ellipsoid

Thus, we can write

$$
\begin{bmatrix}
\dot{\varphi} \\
\dot{\lambda} \\
\dot{h}
\end{bmatrix}
=
\begin{bmatrix}
0 & \frac{1}{R_M + h} & 0 \\
\frac{1}{(R_N + h) \cos \varphi} & 0 & 0 \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
v_e \\
v_n \\
v_u
\end{bmatrix}^l
$$

$$
\dot{\mathbf{r}}^l = D^{-1} \mathbf{v}^l
$$

in which $D^{-1}$ **transforms the velocity vector from rectangular coordinates into curvilinear coordinates** in the ECEF frame.

**Calculation of the velocity derivative**:

The Earth-referenced velocity vector $\dot r^e$ can be transformed into the local-level frame by using the rotation matrix $R_e^l$

$$
v^l = R_e^l \dot r^e
$$

where $v^l = \begin{bmatrix} v_e, v_n, v_u \end{bmatrix}^T$. The time derivative is therefore:

$$
\dot{\mathbf{v}}^l = \dot{R}_e^l \dot{\mathbf{r}}^e + R_e^l \ddot{\mathbf{r}}^e
$$

We substitute $\dot{R}_e^l$ for $R_e^l \Omega_{le}^e$, where $\Omega_{le}^e$ is the skew-symmetric matrix corresponding to $\omega^l_{el}$

$$
\dot{\mathbf{v}}^l = R_e^l \left( \Omega_{le}^e \dot{\mathbf{r}}^e + \ddot{\mathbf{r}}^e \right)
$$

and since $\Omega_{le}^e = -\Omega_{el}^e$ and $\dot r^e = v^e$:

$$
\dot{\mathbf{v}}^l = R_e^l \left( \ddot{\mathbf{r}}^e - \Omega_{el}^e \mathbf{v}^e \right)
$$

We can transform the position vector r from the ECEF frame into the inertial frame by $r^i = R_e^i r^e$. Taking the time derivative and using the relationship $\dot R^i_e = R_e^i \Omega_{ie}^e$ gives:

$$
\dot{\mathbf{r}}^i = \dot{R}_e^i \mathbf{r}^e + R_e^i \dot{\mathbf{r}}^e = R_e^i \Omega_{ie}^e \mathbf{r}^e + R_e^i \dot{\mathbf{r}}^e = R_e^i \left( \Omega_{ie}^e \mathbf{r}^e + \dot{\mathbf{r}}^e \right)
$$

where $\Omega_{ie}^e$ is the skew-symmetric matrix corresponding to $\omega_{ie}^e$.

After a lot of mathematics and simplifications, we get to the final local-frame mechanization equations:

$$
\begin{bmatrix}
\dot{\mathbf{r}}^l \\
\dot{\mathbf{v}}^l \\
\dot{R}_b^l
\end{bmatrix}
=
\begin{bmatrix}
D^{-1} \mathbf{v}^l \\
R_b^l \mathbf{a}^b - (2\Omega_{el}^l + \Omega_{ie}^l) \mathbf{v}^l + \mathbf{g}^l \\
R_b^l (\Omega_{ib}^b - \Omega_{il}^b)
\end{bmatrix}
$$

with

$$
\omega_{ie}^l = 
\begin{bmatrix}
0 \\
\omega^e \cos \varphi \\
\omega^e \sin \varphi
\end{bmatrix}
\rightarrow
\Omega_{ie}^l = 
\begin{bmatrix}
0 & -\omega^e \sin \varphi & \omega^e \cos \varphi \\
\omega^e \sin \varphi & 0 & 0 \\
-\omega^e \cos \varphi & 0 & 0
\end{bmatrix}
$$

$$
\omega_{el}^l = 
\begin{bmatrix}
-\frac{v_n}{R_M + h} \\
\frac{v_e}{R_N + h} \\
\frac{v_e \tan \varphi}{R_N + h}
\end{bmatrix}
\rightarrow
\Omega_{el}^l = 
\begin{bmatrix}
0 & -\frac{v_e \tan \varphi}{R_N + h} & \frac{v_e}{R_N + h} \\
\frac{v_e \tan \varphi}{R_N + h} & 0 & \frac{v_n}{R_M + h} \\
-\frac{v_e}{R_N + h} & -\frac{v_n}{R_M + h} & 0
\end{bmatrix}
$$

>[!summary] Dead Reckoning: the process of calculating one's current position by using a previously determined position, or fix, by using estimations of speed and course over elapsed time
>This sounds like drift errors.

# Mechanization (Attitude)

* Attitude is independent of position and velocity.
* Position and velocity depend on attitude.
* **IMU output**: angular rate of body frame wr.t. inertial frame $\omega_{ib}^b$
* **Desired output**: angular increment of body frame w.r.t. local-level frame $\theta_{lb}^b$
* It's a first order differential equation
	* $\dot \theta_{lb}^b = \frac{d\theta_{lb}^b}{dt}$
	* $\theta_{lb}^b = \omega_{lb}^b \triangle t$

**Mathematical Foundation**:

$$\omega_{ib}^b = \omega_{il}^b + \omega_{lb}^b$$

$$
\omega_{lb}^b = \omega_{li}^b + \omega_{ib}^b = \omega_{ib}^b - \omega_{il}^b
$$

$$
\omega_{il}^b = R_l^b \omega_{il}^l
$$

$$
\omega_{il}^l = \omega_{ie}^l + \omega_{el}^l
$$

where $\omega_{ie}^l$ is the Rotation of the Earth and $\omega_{el}^l$ is the ellipsoid model for the geographical coordinate system.

We know that $\omega_{ie}^l = R_e^l \omega_{ie}^e = \begin{bmatrix} -\sin \lambda & \cos \lambda & 0 \\ -\sin \phi \cos \lambda & -\sin \phi \sin \lambda & \cos \phi \\ \cos \phi \cos \lambda & \cos \phi \sin \lambda & \sin \phi \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ \omega_e \end{bmatrix} =\begin{bmatrix} 0 \\ \omega_e \cos \phi \\ \omega_e \sin \phi \end{bmatrix}$ and that $\omega_{el}^l = \begin{bmatrix} -\dot{\phi} \\ \dot{\lambda} \cos \phi \\ \dot{\lambda} \sin \phi \end{bmatrix} =\begin{bmatrix} -\frac{v_n}{M+h} \\ \frac{v_e}{N+h} \\ \frac{v_e \tan \phi}{N+h} \end{bmatrix}$ where N and M are the radius of curvature of the prime vertical and meridian ($R_M, R_N$).

In the end, we can extract the desired output $\theta_{lb}^b$ based on $\omega_{ib}^b$ (IMU's output w.r.t. the inertial frame -- measured) and $(\omega_{ie}^l + \omega_{el}^l)$ (Earth's rotation w.r.t. the inertial frame -- known)

$$
\theta_{lb}^b = \left( \omega_{ib}^b - R_l^b (\omega_{ie}^l + \omega_{el}^l) \right) \Delta t
$$

## Mechanization of Velocity in Navigation Frame

The change of velocity in local-level frame where $v_k^l = [v_e, v_n, v_u]^T$ and $\mathbf{g}^l = [0, 0, -\mathbf{g}]^T$:

$$
\Delta v_{k+1}^l = R_b^l \mathbf{a}^b \Delta t - (2\Omega_{ie}^l + \Omega_{el}^l) v_k^l \Delta t + \mathbf{g}^l \Delta t
$$

## Mechanization (Position)

$$
\varphi_{k+1} = \varphi_k + \frac{1}{2} \frac{v_{n,k} + v_{n,k+1}}{N+h} \Delta t
$$

$$
\lambda_{k+1} = \lambda_k + \frac{1}{2} \frac{v_{e,k} + v_{e,k+1}}{(N+h) \cos \varphi} \Delta t
$$

$$
h_{k+1} = h_k + \frac{1}{2} (v_{u,k} + v_{u,k+1}) \Delta t
$$

>[!question] What happens at the North pole?
>* The equation diverges as $\cos \varphi$ goes to zero! That's why we create a Wander Frame where the z-vector is pointing elsewhere than at the North pole.

# Data Smoothing

<div class="encoder-section">
  <img src="../static/notes/datasmooth.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>INS rely on accelerometer and gyroscope data for estimating position, velocity, and orientation</li>
      <li>Data Smoothing <b>reduces noise</b> and thus improves the reliability of navigation solutions</li>
    </ul>
  </div>
</div>

**Sliding Window Averaging**: 

1. Applies a moving average over recent measurements
2. Reduces short-term fluctuations while preserving trends
3. Velocity is calculated for example by using modified Euler formula $\mathbf{v}_{k+1}^l = \mathbf{v}_k^l + \frac{1}{2} (\Delta \mathbf{v}_k^l + \Delta \mathbf{v}_{k+1}^l)$

**Kalman Filtering**:

1. Optimal estimation combining sensor data and system dynamics
2. Correct for drift and noise by incorporating external measurements like GPS

**Complementary Filtering**:

1. Combined high-freq data (gyroscopes) and low-freq data (accelerometers)
2. Simple and computationally efficient
3. Can be used e.g. for gyro bias estimation



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