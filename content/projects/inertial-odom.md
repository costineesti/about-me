---
title: Inertial Odometry
draft: false
tags:
  - projects
---
 Inertial Odometry is great because it does not care of the environment variables. I used a [[BNO055]] which is an "absolute orientation" sensor made by Bosch. The main disadvantage of this type of sensor is that in time it's readings can only decrease. The variable I wanted to extract from this sensor was the rotation along the Z-axis which is also called "Yaw Rate" and it is given by the gyroscope.

 $$
\dot{\psi} = \omega_z,
 $$
 $$
 \psi(t) = \psi(0) + \int_{0}^{\textbf{t}} \dot{\psi}(\tau) \, d\tau.
 $$