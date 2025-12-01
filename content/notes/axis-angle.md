---
title: Axis-Angle Representation (Rotation Vector)
draft: false
tags:
date: 2025-12-01
---
 
Covered to understand [[rodrigues|Rodrigues' Rotation Formula]] in [[RPCN 4|Mechanization]].

Axis-Angle Representation are implemented with rotation vectors. This vector is parallel with the axis of rotation and the length is equal to the angle of rotation.

For a rotation axis with unit-length vector **n** and the angle $\theta$, the rotation vector is represented by $\theta$**n**

>[!summary] Euler's Rotation Theorem
>All 3D rotations have an axis-angle representation.

There is a difference in comparison with Euler Angles.

* With Euler Angles, we have 3 rotation angles expressed relative to 3 fixed axes $x,y,z$ (pitch, roll, yaw)
* Angle-Axis Representation expresses a rotation as a single rotation by an angle around a specific axis. Thus, only a 3D vector here is needed to describe the rotation.

# Rotation Vector to Rotation Matrix

See [[rodrigues|Rodrigues' Rotation Formula]].