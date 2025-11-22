---
title: .
draft: false
tags:
date: 2025-11-19
---
TODO

The accelerometer measures the specific force $f = a-g$.
We know that $f \cdot g = \mid f \mid \mid g \mid \cos \theta$. g is $a_z$.

$\frac{a_z}{\sqrt{a_x^2+a_y^2+a_z^2}} = \cos \theta$ (ideal i think?)

From intertial to ECEF, we need to add $\omega_e$ on z axis since ECEF rotates with the earth and inertial is fixed.

In the slides we compensate for h as well in inertial(i think?)

# Mechanization (Atitude)

* with gyroscope measurements.
* the level of noise from this assignment's imu is so large that it's impossible to estimate the gyro scale.

Try to use taylor expansion for rodrigues in the homework.

