---
title: Sensor Fusion
draft: false
tags:
date: 2026-01-29
---
 
* **Competitive Fusion:** Sensors provide equivalent information about the same object (e.g., voting logic) to increase reliability and accuracy. Imagine three thermometers in a room -- I guess you have something to fallback on?
* **Complementary Fusion:** Sensors provide different information about the same object or environment (e.g., a camera seeing color and a Lidar seeing depth) to increase completeness.
* **Cooperative Fusion:** Sensors work together to derive information that neither could provide alone (e.g., triangulation from multiple viewpoints). So multiple cameras.

**Situational Awareness**

There are three levels to this:

1. Perception of elements in current situation: state vectors
2. Comprehension of the current situation (done through cognition with onthology)
3. Projection of future states as in path planning.

Each sensor brings something to the table.

* IMUs handle fast rotations gracefully and create good initial estimations.
* Lidars provide point-cloud maps, offer good translation estimates.
* Cameras can help a lot with semantics.
* GNSS provides precise positioning in open sky conditions.

**Time Synchronization**

Each sensor has its own clock (with a time offset from the main clock), therefore we need to synchronize them.

One SOFTWARE idea could be to stamp the moment the data reaches the CPU. It doesn't help with the Offset, though.

Another HARDWARE idea is to implement a Master Clock and measure the PPS (Pulse per Second)?

I researched a bit in [[seaclear|SeaClear]] when I collected the hardware timestamps of a ArduCam -- [[system monotonic clock|System Monotonic Clock]].

**Low Cost Sensors and Errors**

Low-cost sensors have lower resolution with lower pulse power and accuracy. Weaker pulses are harder to detect which leads to more noise and lower scan resolution.

* Low-cost lidar averages over the reflector strip area due to higher beam divergence => Individual reflectors become blurred and create sparse point clouds.

In IMUs, one of the main challenges is the quality of the low-cost sensors since usually they present a lot of variation in their calibration parameters. Temperature changes cause further variation.

The error vector will include 15 elements:

* Position errors (3)
* Velocity errors (3)
* Attitude errors (3)
* Gyroscope bias (3)
* Accelerometer bias (3)

Let's consider only the IMU. 15 unknowns and 6 observations might be a bit of an overkill. Consider estimating only 6 unknowns from the 6 observations of the IMU. I guess the bias.

6 degrees of freedom AND 6 unknowns cannot be solved with 6 measurements from the IMU.