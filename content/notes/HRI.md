---
title: Human Robot Interaction
draft: false
tags:
date: 2026-02-04
---
 
The structure will be:

* Robot and Human modelling
* Intention detection and expression
* Verbal communication
* Decision making
* Learning human behavior
* Task sharing and use cases
* Safety and ergonomics
* Ethics

# Lecture 1: Introduction

HRI = even more interdisciplinary than Robotics because we take the social world in consideration and the interactions the robot has with humans.

>[!summary] HRI
>
>* Robotics,
>* Philosophy,
>* Humans,
>* Design,
>* AI,
>* HCI (Human Computer Interaction) i.e. Sociology \& Anthropology

> Robotics $\leftarrow$ Robots navigate and manipulate the physical world

> HRI $\leftarrow$ Robots interact with people in the social world

There's levels to this shit

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hri_levels.png" style="max-width: 100%; height: auto;">
</div>

<div class="encoder-section">
  <img src="../static/notes/hri_axis.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>Scientists</b> combine the goal of <b>Understanding the World</b> with <b>Explicit Knowledge</b> to develop theories on how humans perceive robots and use the <b>Human</b> axis to conduct controlled behavioral studies.</li>
      <li><b>Engineers</b> focus on <b>Transforming the World</b> through <b>Technology</b> and <b>Explicit Knowledge</b>, prioritizing the development of robust hardware and reliable software architectures that allow the robot to function.</li>
      <li><b>Designers</b> bridge the gap by utilizing <b>Implicit Knowledge</b> and the <b>Human</b> axis to ensure the interaction is intuitive, focusing on the "how it feels" aspect of the robot's presence in a social environment.</li>
    </ul>
  </div>
</div>

# Lecture 2: Robot Modelling

>[!summary] Robot Modelling
>
>* Robot morphology and types
>* Sensors and outputs
>* Kinematics
>* Challenges

Therefore, we could define a robot as an autonomous machine capable of sensing its environment, carrying out computations to make decisions, and performing actions in the real world.

### Hardware: Robot Morphology

The **Uncanny Valley** is a critical concept in HRI that dictates how important robot morphology is.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hri_morph.png" style="max-width: 100%; height: auto;">
</div>

- **Affinity and Likeness**: As a robot becomes more human-like, our affinity for it increases.
- **The Dip**: When a robot is "almost" human but not quite perfect, there is a sharp drop in affinity where it becomes creepy or repulsive (labeled as "corpse" or "zombie" levels).
- **The Movement Multiplier**: Movement (the dashed line) amplifies these feelings. A likable robot becomes more endearing when it moves, but a creepy robot becomes significantly more disturbing.

### Software: Sensors and outputs

Here we have 3 possible architectures:

* **Reactive** (simply sense using the sensors and then act using actuators). Open loop.
* **Sense-Plant-Act** (Introduce the Planning phase to the prior concept). It's also closed-loop.
* **Behavior-Based** (Here we already have decision-making abilities such as avoiding objects or exploring the world).

### Robot Modelling: Forward Kinematics

We describe the pose of the end-effector using a 4x4 transformation matrix (affine transformation -- it makes transformations from one state to another simpler by combining the Rotation and Translation vectors into one matrix)

$$
T = \left[ \begin{array}{c|c} 3 \times 3 & 3 \times 1 \\ \hline 1 \times 3 & 1 \times 1 \end{array} \right] = \left[ \begin{array}{ccc|c} & & & posi \\ & orientation & & - \\ & & & tion \\ \hline 0 & 0 & 0 & 1 \end{array} \right]
$$

**Forward Kinematics** is the process of calculating the final position and orientation of the **end effector** (the robot's "hand") based on the angles of its joints ($q$) and the lengths of its links ($l$).

* **Chaining Transformations**: We calculate individual transformation matrices for each joint $(R_0^1​,R_1^2​,R_2^3​,R_3^4​$) and multiply them together to get the total transformation $(R_0^4​)$.
* The final matrix is a function of joint positions $(q_1, q_2, q_3)$ and link lengths $(l_1,l_2,l_3)$.

### Example

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hri_fwk.png" style="max-width: 100%; height: auto;">
</div>

> Simply understand what each value represents in the following steps and where it should be inserted if we want a Rotation around an axis or a translation along another.

**Step 1: Base Frame to Joint 1**

This represents a translation along the Z-axis and a rotation around the X-axis.

$$
R_{0}^{1} = Trans(Z, 1)R(X, q_{1}) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & c_{1} & -s_{1} & 0 \\ 0 & s_{1} & c_{1} & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

**Step 2: Joint 1 to Joint 2**

This involves a translation along the Y-axis by the length of the first link (l1​) and a rotation around the X-axis.

$$
R_{1}^{2} = Trans(Y, l_{1})R(X, q_{2}) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & l_{1} \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & c_{2} & -s_{2} & 0 \\ 0 & s_{2} & c_{2} & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

**Step 3: Joint 2 to Joint 3**

This follows the same pattern, translating by link length $l_2$​ and rotating by joint angle $q_3$​.

$$
R_{2}^{3} = Trans(Y, l_{2})R(X, q_{3}) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & l_{2} \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & c_{3} & -s_{3} & 0 \\ 0 & s_{3} & c_{3} & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

**Step 4: Final Tool Tip Translation**

This final matrix accounts for the length of the end effector link ($l_3$​).

$$
R_{3}^{4} = Trans(Y, l_{3}) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & l_{3} \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

**Final Result: Forward Kinematics Matrix ($R_0^4$​)**

This is the combined matrix representing the total position and orientation of the end effector relative to the base.

$$
R_{0}^{4} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & c_{1,2,3} & -s_{1,2,3} & l_{3}c_{1,2,3} + l_{2}c_{1,2} + l_{1}c_{1} \\ 0 & s_{1,2,3} & c_{1,2,3} & l_{3}s_{1,2,3} + l_{2}s_{1,2} + l_{1}s_{1} + 1 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

Therefore, we can deduce the definition:

>[!summary] Forward Kinematics
>The FKM is a transformation matrix, a function of the joint positions and link lengths. If we know these variables, we can calculate the position and orientation of the end effector (or any other point).

**Denavit-Hartenberg (DH) convention**

The Denavit-Hartenberg convention define the relationship between consecutive joint frames, specifically from joint $i$ to joint $i+1$. It reduces the transformation between links to four specific parameters.

- **$d_i$​ (Joint offset)**: The length along the Z-axis from joint i to joint i+1.
- **$\theta_i$​ (Joint angle)**: The rotation around the Z-axis between joint i and joint i+1.
- **$r_i$​ (Link length)**: The distance along the X-axis from joint i to joint i+1.
- **$\alpha_i$​ (Link twist)**: The angle around the X-axis from joint i to joint i+1.

$$
T_{i}^{i+1} = Rx(\alpha_{i}) \cdot Tx(r_{i}) \cdot Rz(\theta_{i}) \cdot Tz(d_{i})
$$

**Robot Velocity: The Jacobian**

The Jacobian is specifically defined as a $6\times n$ matrix, where $n$ is the number of joint velocities. It relates joint velocities ($\dot q$​) to the 6D end-effector velocity vector ($\zeta$) consisting of three linear velocities ($u$) and three angular velocities ($\omega$).

$$
\begin{bmatrix} \dot{x} \\ \dot{y} \\ \dot{z} \\ \omega_{x} \\ \omega_{y} \\ \omega_{z} \end{bmatrix} = \xi = J\dot{q} = J \begin{bmatrix} \dot{q}_{1} \\ \dot{q}_{2} \\ \vdots \\ \dot{q}_{n} \end{bmatrix}
$$

### Inverse Kinematics

The primary distinction between the two models is the direction of the calculation:

>[!question] Difference between Forward and Inverse Kinematics
> * **Forward Kinematics**: specific coordinate values are given to each joint $\rightarrow$ where the end-effector will be located
> * **Inverse Kinematics**: desired end-effector position $\rightarrow$ what the joint coordinate values should be

$$
g(P_{x}, P_{y}, P_{z}, \phi, \theta, \psi) \mapsto q = [q_{1}, q_{2}, \dots, q_{n}]
$$

> As a rule of thumb, the end-effector is the **terminal component** that facilitates the robot's **interaction with its environment** to accomplish its specific mission.

### Example of Forward and Inverse Kinematics Modelling for a mobile robot (differential drive)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hri_diff_drive.png" style="max-width: 100%; height: auto;">
</div>

The robot's state in the environment is defined by its **Pose ($P$)**, and its movement is dictated by the **Control Input ($U$)**.

- **Pose ($P$)**: The robot's position $(x,y)$ and its orientation angle $(\theta)$ in the global frame.
- **Control Input ($U$)**: Consists of the robot's linear velocity ($U$) and its angular velocity ($\Omega$).

In differential drive, to follow a trajectory, the robot rotates around an **Instantaneous Center of Rotation (ICR)** which is the point around which the robot appears to be rotating at a specific moment. 

**Rotation Radius (R)**: The distance from the ICR to the center of the robot. It is determined by the wheel velocities $(U_r​,U_l​)$ and the distance between wheels $(L)$.

**Forward Kinematics**:

If we define $r = U_r + U_l$, the final step combines these relations into a single matrix that maps the **rotational velocities of the wheels** $(\omega_r, \omega_l​)$ to the **robot's overall velocities** $(U,\Omega)$.

$$ 
\begin{bmatrix} U \\ \Omega \end{bmatrix} = \begin{bmatrix} \frac{r}{2} & \frac{r}{2} \\ \frac{r}{L} & \frac{-r}{L} \end{bmatrix} \begin{bmatrix} \omega_{r} \\ \omega_{l} \end{bmatrix} 
$$

**Inverse Kinematics**:

Inverse kinematics for a differential drive robot involves calculating the individual wheel velocities ($\omega_r, \omega_l$​) required to achieve a desired global robot motion $(U, \Omega)$ or a specific rotation radius $(R)$.

$$
\omega_{r} = \Omega \frac{R + \frac{L}{2}}{r} = U \frac{1 + \frac{L}{2R}}{r}
$$

$$
\omega_{l} = \Omega \frac{R - \frac{L}{2}}{r} = U \frac{1 - \frac{L}{2R}}{r}
$$

> It's basically writing the output in terms of the input.

And if we define the kinematics model in the world frame in terms of a homogenous transformation, we get

$$
\begin{bmatrix} \dot{x} \\ \dot{y} \\ \dot{\theta} \end{bmatrix} = \begin{bmatrix} \cos\theta & 0 \\ \sin\theta & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} U\\ \Omega \end{bmatrix} = \begin{bmatrix} \cos\theta & 0 \\ \sin\theta & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \frac{r}{2} & \frac{r}{2} \\ \frac{r}{L} & -\frac{r}{L} \end{bmatrix} \begin{bmatrix} \omega_{r} \\ \omega_{l} \end{bmatrix} = \begin{bmatrix} \frac{r \cos\theta}{2} & \frac{r \cos\theta}{2} \\ \frac{r \sin\theta}{2} & \frac{r \sin\theta}{2} \\ \frac{r}{L} & -\frac{r}{L} \end{bmatrix} \begin{bmatrix} \omega_{r} \\ \omega_{l} \end{bmatrix}
$$

### How do we estimate the pose when we have noise? Slap a Kalman Filter

$$
X_k = AX_{k-1} + BU_{k-1} + w_k
$$

$$
Y_k = HX_k + v_k
$$

where $w_k$ is the **process noise** and $v_k$ is the **measurement noise**

The noise signals $w_k$, $v_k$ are considered to be normally distributed with zero means and covariance matrices $Q$ and $R$ respectively. We talk about covariance when we have multiple states and we have to estimate noise for each of them. 

> Basically, it's a way to introduce uncertainty in our modelling.

In the ROS ecosystem, localization is organized through a standardized hierarchy of coordinate frames to ensure different sensors and algorithms can communicate effectively. This structure follows a specific chain: **earth $\rightarrow$ map $\rightarrow$ odom $\rightarrow$ base_link**.

* **earth**: Can be used for connecting multiple robots on different maps
* **map**: Calculated based on discontinuous sensors (e.g. GPS)
* **odom**: Calculated based on continuous sensors, (e.g. IMUs)
* **base_link**: Attached on the robot, as forward, left, up

There are also two ROS standard systems:

* **REP 103**: Defines standard units of measure and coordinate conventions.
* **REP 105**: Specifically defines the coordinate frames for mobile platforms mentioned above.

### Lagrangian of a robot

The **Lagrangian** of a robot provides a condensed way to describe its dynamic behavior, relating the forces or torques acting on the joints to the resulting motion.

The general dynamic equation:

$$
D(q)\ddot{q} + C(q, \dot{q})\dot{q} + g(q) = \tau
$$

* The matrix $D$, contains information about the inertia of the system, therefore contains all the masses and moments of inertia.
* The matrix $C$ has elements related to the centrifugal and Coriolis terms.
* $g(q)$ (Gravity Vector): This term represents the dependence of the robot's potential energy on its position, accounting for gravity.
* $\tau$ (Torque): The vector of generalized forces or torques applied to the joints

This equation above is the **inverse dynamics** where we want to know what torque $\tau$ should be applied to achieve a specific acceleration $\ddot q$. You use this to determine how much power your motors must output to move the robot in a specific way.

The **forward dynamics** tells us what acceleration $\ddot q$ we get if we apply a specific torque $\tau$. You use this primarily for simulation to see how the robot will actually react to motor inputs.

$$
\ddot{q} = D(q)^{-1} \left( \tau - C(q, \dot{q})\dot{q} - g(q) \right)
$$







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