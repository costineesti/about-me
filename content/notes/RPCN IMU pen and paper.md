---
title: Pen and Paper Exercises Coordinate Systems
draft: false
tags:
date: 2025-12-01
---
 
# 1. ATTITUDE FROM THE GRAVITY VECTOR

**Context**:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/penandpaper1.png" style="max-width: 100%; height: auto;">
</div>

Consider that there is an IMU mounted on the claw.

**Attitude from the gravity vector**: Approximating the attitude of the claw by using the gravity vector. We know which way is up, and which is down.

<div class="encoder-section">
  <img src="../static/notes/penandpaper2.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Consider a drone that is flying and experiencing rotations. The drone has a claw that hangs from a cord and swings with 3 rotational DoF.</li>
	      <ul>
		      <li>The drone has an IMU and the palm of the claw is equipped with an IMU as well.</li>
	      </ul>
	<li> <b>Question</b>: What is the attitude of the claw, relative to the drone?
		<ul>
			<li>The attitude can be estimated by using the gravity vector</li>
			<li>Calculate a relative position, assume that the string is non-elastic (3 rotational DOF, of which yaw and pitch are the relevant ones, if we assume the gripper is symmetric w.r.t. Roll angle)</li>
		</ul>
    </ul>
  </div>
</div>

**Solution**:

So we have the following **setup**:

* A claw hangs from a drone on a cord with 3 rotational degrees of freedom
* IMUs on both the drone and claw measure acceleration
* The claw's attitude (orientation) relative to the drone needs to be determined

So we know the gripper is symmetric w.r.t. Roll angle and the string is non-elastic. This makes it much easier as we only need the drone's IMU.

What we need to do is calculate the angle between the IMU's z-axis and the gravity vector using the accelerometer readings.

$$
cos(\phi) = \frac{\text{z-axis} \cdot \text{gravity}}{|\text{z-axis}| \times |\text{gravity}|}
$$

* The z-axis is simply $[0, 0, 1]$, so the dot product is just $a_z$.
* The magnitude of gravity is $\sqrt{a_x^2 + a_y^2 + a_z^2}$

In the end, the angle between the IMU's z-axis and the gravity vector is:

$$
\phi = arccos \begin{pmatrix} \frac{a_z}{\sqrt{a_x^2 + a_y^2 + a_z^2}} \end{pmatrix}
$$

>[!question] Can we measure the angular velocities of the claw?
>Yes, but only if the claw IMU is on the center of rotation. 
>
>**Why**: An IMU measures angular velocity using its gyroscope. However, if the IMU is offset from the center of rotation, the accelerometer will also pick up centripetal acceleration from the rotation, which results in big drift. When the IMU is at the center of rotation, there's no linear acceleration due to rotation -- only pure angular velocity is measured by the gyroscope, giving you clean angular velocity data.

---

# 2. Where to mount the IMU on an autonomous car?

**A) On the roof** - Used for sensor fusion with GNSS (GPS)

**B) Rear wheel axis** - Benefits:

* No acceleration along the rear wheel axis (assuming no wheel slip)
* Can omit one accelerometer axis bias
* Simplifies to a point-like robot model for yaw angle
* Angular velocity comes from road inclination in the velocity direction

**C) Center of mass** - Sounds intuitive but offers no advantages

**D) Anywhere** - Funnily enough, this actually works

The idea is that the placement doesn't affect rotation measurements. Angular velocity $\omega$ and forces $f$ transform the same regardless of location:

* $\omega^B = R_S^B \omega^S$
* $f^B = R_S^B f^S$

However, the acceleration at the body frame origin does depend on IMU position:

* $a_{OB}^B = f^B + g^B + \alpha^B \times r^B - \omega^B \times (\omega^B \times r^B)$
* This depends on the IMU position vector $r^B$ and angular acceleration $\alpha^B$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/penandpaper1.png" style="max-width: 100%; height: auto;">
</div>

---

# 3. IMU-to-Body Frame Transformations

Consider an autonomous car driving on a road. We define a car body frame **B**

<div class="encoder-section">
  <img src="../static/notes/datasmooth.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Origin OB: center of the rear-wheel axis.</li>
      <li>x-axis: forward along the car's longitudinal axis</li>
      <li>y-axis: to the left of the car</li>
      <li>z-axis: upwards, completing a right-handed frame</li>
    </ul>
  </div>
</div>

An IMU is mounted somewhere inside the car, at an arbitrary orientation and position.

## Part 1: Single IMU on the Car

**Context**: The IMU has its own sensor frame **S**. The rigid-body relationship between **S** and the car body frame **B** is known from calibration:

* Rotation from IMU frame to body frame: $R_S^B \in SO(3)$ (rotates vectors from **S** to **B**)
* Position of the IMU origin in the body frame: $r^B \in R^3$ (vector from OB to the IMU)

At time $t_k$, the IMU measures the angular rate and specific force, expressed in **S**:

* $\omega^S(t_k) \in R^3$
* $f^S(t_k) \in R^3$

### (a) Transforming to the car body frame

**Question**: Write the expressions for $\omega^B(t_k)$ and $f^B(t_k)$ in the car body frame **B**, in terms of $R_S^B$ and $\omega^S$.

**Solution**:

Since we know the IMU measures $\omega^S(t_k)$ and $f^S(t_k)$ each $t_k$, then we covered earlier that we can go from the IMU sensor frame **S** to the car's body frame **B** by simply applying the rotation matrix $R_S^B$

Thus, the solution is:

* $\omega^B(t_k) = R_S^B \omega^S(t_k)$
* $f^B(t_k) = R_S^B f^S(t_k)$

---

**Question**: Explain in one or two sentences why it is important for vehicle state estimation (e.g. Kalman Filter) to express these quantities in the car body frame **B** rather than in the IMU frame **S**.

**My response**: In vehicle state estimation we usually talk about kinematics -- and the kinematics we want to model is of the car's. Since the car is our reference frame in this case, it makes perfect sense to transform everything into car body frame **B** and it further helps with sensor fusioning.

**From professor**: Using IMU-frame quantities directly would introduce frame-dependent biases and incorrect coupling between states.

---

### (b) From specific force at the IMU to acceleration at the rear-axle

**Context**: Let the body have body-frame angular velocity $\omega^B(t_k)$, angular acceleration $\alpha^B(t_k)$, and linear acceleration of the rear axle origin $a^B_{OB}(t_k)$, all expressed in **B**.

Let the car's orientation in the world be $R_B^W(t_k)$ and let gravity in the world frame be

* $g^W = \begin{bmatrix} 0 \\ 0 \\ -g \end{bmatrix}$
* $g^B$ = ${R_B^W}^T g^W$

The rigid-body relation for the acceleration at the IMU origin (expressed in **B**) is:

$$
a_{IMU}^B = a_{OB}^B + \alpha^B \times r^B + \omega^B \times (\omega^B \times r^B)
$$

Moreover, the IMU accelerometer measures specific force:

* $f^S = R_B^S(a_{IMU}^B - g^B)$
* $R_B^S = {R_S^B}^T$

**Question**: Show that the specific force in the body frame is $f^B = a_{IMU}^B - g^B$

**Solution**:

We know that

$$
f^S = R_B^S(a_{IMU}^B - g^B)
$$

So, naturally:

$$
R_S^B f^S = R_S^B R_B^S (a_{IMU}^B - g^B)
$$

And we know that Rotation Matrices are orthogonal, so $RR^T = I$. And since $R_B^S = {R_S^B}^T$:

$$
f^B = a_{IMU}^B - g^B, q.e.d.
$$

---

**Question**: Use the rigid-body relation to derive an expression for the acceleration of the rear-axle center in the body frame (you may assume $\omega^B$ and $\alpha^B$ are known from other sensors or from numerical differentiation of the gyroscope data):

$$
a_{OB}^B = f^B + g^B - \alpha^B \times r^B - \omega^B \times (\omega^B \times r^B)
$$

**Solution**:

We know that $f^B = a^B - g^B$, and therefore, $a^B = f^B + g^B$ and the follow:

$$
a_{IMU}^B = a_{OB}^B + \alpha^B \times r^B + \omega^B \times (\omega^B \times r^B)
$$

So, in conclusion:

$$
a_{OB}^B = f^B + g^B - \alpha^B \times r^B - \omega^B \times (\omega^B \times r^B)
$$

---

## Part 2: Two arbitrarily aligned IMUs on the same car

**Context**: Now suppose there are two IMUs, with frames **S$_1$** and **S$_2$**, each with known $R_{BI_i}$ and $r^B_i$. For each IMU $i \in \{ 1,2 \}$, the relations from Part 1 hold with the corresponding index.

**Question**: Write the body-frame specific force for each IMU:

$$
f_i^B = a_{OB}^B - g^B + \alpha^B \times r_i^B + \omega^B \times (\omega^B \times r_i^B)
$$

Subtract the two equations to extract

$$
\Delta f^B = f_2^B - f_1^B = \alpha^B \times (r_2^B - r_1^B) + \omega^B \times (\omega^B \times (r_2^B - r_1^B))
$$

Assume a planar car motion so that

$$
\omega^B = \begin{bmatrix} 0 \\ 0 \\ \omega_z \end{bmatrix}, \alpha^B = \begin{bmatrix} 0 \\ 0 \\ \alpha_z \end{bmatrix}
$$

and define $d^B = r_2^B - r_1^B = [d_x, d_y, d_z]^T$. Compute $\alpha^B \times d^B$ and $\omega^B \times (\omega^B \times d^B)$, and show that the **x** and **y** components of $\Delta f^B$ yield two scalar equations involving $\alpha_z$ and $\omega_z^2$

**Solution**:

I need to use the [[cross product]]. Here I covered that to compute the cross product between two vectors **v** and **w**, we do

$$
\mathbf{v} \times \mathbf{w} = [\mathbf{v}]_\mathbf{x} \mathbf{w} = \begin{bmatrix} 0& -v_z& v_y \\ v_z& 0& -v_x \\-v_y& v_x &0 \end{bmatrix} \begin{bmatrix} w_x \\ w_y \\ w_z \end{bmatrix}
$$

And so, we calculate

$$
\alpha^B \times d^B = \begin{bmatrix} 0 & -\alpha_z & 0 \\ \alpha_z & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix} = \begin{bmatrix} -\alpha_zd_y \\ -\alpha_zd_x \\ 0 \end{bmatrix}
$$

$$
(\omega^B)^2 \times d^B = \begin{bmatrix} -\omega_z^2 & 0 & 0 \\ 0 & -\omega_z^2 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix} = \begin{bmatrix} -\omega^2_zd_x \\ -\omega^2_zd_y \\ 0 \end{bmatrix}
$$

$$
\Delta f^B = \begin{bmatrix} -\alpha_zd_y \\ -\alpha_zd_x \\ 0 \end{bmatrix} + \begin{bmatrix} -\omega^2_zd_x \\ -\omega^2_zd_y \\ 0 \end{bmatrix} = \begin{bmatrix} -\alpha_zd_y-\omega^2_zd_x \\ -\alpha_zd_x-\omega^2_zd_y \\ 0 \end{bmatrix}
$$

Therefore, the **x** and **y** components are two scalar eq. involving $\alpha_z$ and $\omega_z^2$.

---
## Part 3: Attitude Update Using Rodrigues' Formula

**Context**: Rodrigues’ formula provides a closed-form, minimal-parameter, numerically stable way to update orientation from an angular velocity vector without using [[quaternions]] or integrating differential equations. Let $\hat{\omega}^B$ be an estimate of the body-frame angular velocity, obtained e.g. from the IMUs.

We define

* The [[axis-angle|single-axis pair]] rotation $\theta = \hat{\omega}^B \Delta t$
* The rotation magnitude $\phi = ||\theta||$
* The skew-symmetric matrix $[\theta]_{\mathbf{x}} = \begin{pmatrix} 0 & -\theta_z & \theta_y \\ \theta_z & 0 & -\theta_x \\ -\theta_y & \theta_x & 0 \end{pmatrix}$

The exact attitude is

$$
R_B^W(t_{k+1}) = R_B^W(t_k) exp([\theta]_{\mathbf{x}})
$$

---

**Question**: Using [[rodrigues|Rodrigues' Rotation Formula]], show that

$$
\exp([\theta]_\times) = I + \frac{\sin\phi}{\phi}[\theta]_\times + \frac{1-\cos\phi}{\phi^2}[\theta]_\times^2
$$

**Solution**: To show this, we need to use [[lie algebra]] to go from SO(3) to $so(3)$. I covered this whole explanation in [[RPCN 4|Mechanization]].

For any matrix $A$, the exponential is defined by

$$
exp(A) = \frac{A^n}{n!} = I + A + \frac{A^2}{2!} + ...
$$

When $A = [\theta]_{\mathbf{x}} \in so(3)$, its powers satisfy

* $[\theta]^3_{\mathbf{x}} = -||\theta||^2 [\theta]_{\mathbf{x}}$
* $[\theta]^4_{\mathbf{x}} = -||\theta||^2 [\theta]^2_{\mathbf{x}}$

Starting from

$$
exp([\theta]_{\mathbf{x}}) = \frac{[\theta]^n_{\mathbf{x}}}{n!} = I + [\theta]_{\mathbf{x}} + \frac{[\theta]^2_{\mathbf{x}}}{2!} + ...
$$

use

* $[\theta]^3_{\mathbf{x}} = - \phi^2 [\theta]_{\mathbf{x}}$
* $[\theta]^4_{\mathbf{x}} = - \phi^2 [\theta]^2_{\mathbf{x}}$
* $\phi = ||\theta||$

**Odd powers** are proportional to $[\theta]_\times$:

$$
[\theta]_\times - \frac{\phi^2}{3!}[\theta]_\times + \frac{\phi^4}{5!}[\theta]_\times - \cdots = \frac{\sin\phi}{\phi}[\theta]_\times
$$

**Even powers** are proportional to $[\theta]_\times^2$:

$$
\frac{[\theta]_\times^2}{2!} - \frac{\phi^2}{4!}[\theta]_\times^2 + \frac{\phi^4}{6!}[\theta]_\times^2 - \cdots = \frac{1-\cos\phi}{\phi^2}[\theta]_\times^2
$$

Using these identities, the series can be summed in closed form:

$$
\exp([\theta]_\times) = I + \frac{\sin\phi}{\phi}[\theta]_\times + \frac{1-\cos\phi}{\phi^2}[\theta]_\times^2, \quad \phi = ||\theta||
$$

q.e.d.

---

**Question**: Using the Taylor expansions for $\sin \phi$ and $\cos \phi$, derive the second-order small-angle approximation

$$
exp([\theta]_\times) \sim I + [\theta]_\times + \frac{1}{2}[\theta]_\times^2
$$

**Solution**:

The second-order Taylor expansions for $\sin$ and $\cos$ are:

* $\sin \phi = \phi - \frac{\phi^3}{3!} + ... \sim \phi$ AND after we neglect the higher-order terms we remain with $\phi$
* $\cos \phi = 1 - \frac{\phi^2}{2!} + ...$ AND after we neglect the higher-order terms we remain with $1 - \frac{\phi^2}{2!}$

Which translates into:

* $\frac{\sin\phi}{\phi} = \frac{\phi}{\phi} = 1$
* $\frac{1 - \cos\phi}{\phi^2} = \frac{1 - 1 + \frac{\phi^2}{2!}}{\phi^2} = \frac{1}{2}$

Therefore, we derive the second-order small-angle approximation:

$$
\exp([\theta]_\times) = I + \frac{\sin\phi}{\phi}[\theta]_\times + \frac{1-\cos\phi}{\phi^2}[\theta]_\times^2 \sim I + [\theta]_\times + \frac{1}{2}[\theta]_\times^2
$$

q.e.d.

---

**Question**: Let $R_B^W(t_k) = I$, $\hat{\omega}^B = \begin{bmatrix} 0 \\ 0 \\ 2\pi \end{bmatrix}$ rad/s, $\Delta t = 0.01$ s.

Compute(numerically):

* $\theta$,
* $[\theta]_\times$ and $[\theta]_\times^2$
* $\Delta R \sim I + [\theta]_\times + \frac{1}{2}[\theta]_\times^2$
* $R_B^W(t_{k+1}) = \Delta R$

**Solution**:

* $\theta = \hat{\omega}^B \Delta t = \begin{bmatrix} 0 \\ 0 \\ 2\pi \cdot 0.01 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0.06283 \end{bmatrix}$ 
* $[\theta]_{\mathbf{x}} = \begin{pmatrix} 0 & -\theta_z & \theta_y \\ \theta_z & 0 & -\theta_x \\ -\theta_y & \theta_x & 0 \end{pmatrix} = [\theta]_{\mathbf{x}} = \begin{pmatrix} 0 & -0.06283 & 0 \\ 0.06283 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}$
* $[\theta]_\times^2 = \begin{pmatrix} 0 & -0.06283 & 0 \\ 0.06283 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & -0.06283 & 0 \\ 0.06283 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix} = \begin{pmatrix} −0.00395 & 0 & 0 \\ 0 & −0.00395 & 0 \\ 0 & 0 & 0 \end{pmatrix}$
* $\Delta R = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix} + \begin{pmatrix} 0 & -0.06283 & 0 \\ 0.06283 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix} + \begin{pmatrix} −0.001975 & 0 & 0 \\ 0 & −0.001975 & 0 \\ 0 & 0 & 0 \end{pmatrix} = \begin{pmatrix} 0.998025 & -0.06283 & 0 \\ 0.06283 & 0.998025 & 0 \\ 0 & 0 & 1 \end{pmatrix}$
* $R_B^W(t_{k+1}) = \Delta R$. We can, of course, approximate $0.9980 \sim 1$ and so we end up with a rotation around the **z-axis** of about $0.06283 [rad] \sim 3.6[\deg]$ which is a very small angle and the second-order approximation makes sense in this case.



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