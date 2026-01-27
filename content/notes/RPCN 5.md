---
title: Lidar-Inertial Perception
draft: false
tags:
date: 2025-12-09
---
 
LiDAR = light detection and ranging

Lidars have an *emitter* to send light and a *receiver* to detect the backscattered signal. They are different to cameras in terms that a camera only has a receiver. One receiver is like a single pixel.

There different types of lidars:

<div class="encoder-section">
  <img src="../static/notes/lidar_types.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>continuous-wave lidars</li>
      <li>pulsed lidars</li>
      <li>single-photon lidars</li>
    </ul>
  </div>
</div>

**Continuous-wave lidars**:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/lidar_1.png" style="max-width: 100%; height: auto;">
</div>

CW Lidar emits a steady light beam, unlike pulsed lidar. They work based on FMCW (Frequency Modulated Continuous Wave) which modulate the light's frequency or phase to measure distance and velocity with high precision.

**Single Photon Lidars**:

* Illuminate the scene with a specific wavelength (typically 800 nm)
* Light can be non-collimated
* Receivers can form an array
	* Typically Single-Photon-Avalance-Diodes (SPAD)
	* Triggered when the first photon within a narrow bandwidth arrives
* Limitations: very susceptible to background illumination (=direct and diffuse sunlight)

**Pulsed Lidars**:

TIME-OF-FLIGHT (TOF) MEASUREMENT is done to obtain the range to the object. A collimated light pulse is emitted, travels to the object, and then is backscattered to the receiver (elementary physics type of shi)

$$
r = c \frac{\triangle t}{2}
$$

where

* *r* is the range to the target
* *c* is the speed of light
* $\triangle t$ is the time between pulse emission and reception
* Factor of 2, because the pulse flies back and forth

**The Design**:

<div class="encoder-section">
  <img src="../static/notes/lidar_2.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Typically, lidars require energy (more than cameras) because the scene needs to be illuminated for measurements.</li>
      <li>Pulse energy needs to be high if a long range is needed</li>
	  <ul>
	  <li>Having collimated beams avoids the energy from being dispersed</li>
	  </ul>
      <li>Pulse frequency is important to get a sufficiently high point cloud density (”point resolution”)</li>
    </ul>
  </div>
</div>

Most important properties include **Frequency**, **Resolution**, **Accuracy**, **Precision** (applies to all types of sensors).

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/lidar_3.png" alt="lidar 1" width="350" height="300"> </div> <div> <img src="../static/notes/lidar_4.png" alt="lidar 2" width="350" height="300"> </div> </div>

# Coordinate Frame for 2D LiDAR

## Polar Coordinates

We have two vectors which define the polar coordinates, vector $\hat r$ which changes the radius of the compass and vector $\hat \theta$ which changes the angle $\theta$. $\hat \theta$ is perpendicular to $\hat r$ (and is thus, orthogonal). $\hat \theta$ is called the **azimuthal vector**.

$$
p_{polar}^s = (r, \theta)
$$

where

* $r \in[min\_range, max\_range]$
* $\theta \in [0, 360]$

## Cylindrical coordinates 

are basically polar coordinates in 3D. We follow the left hand rule and thus $r$ is the first vector, $\theta$ is the second vector and $z$ is the third vector.

## Conversion from Cartesian to Polar Coordinates

We simply let

* $x = r \cos \theta$
* $y = r \sin \theta$

And define $p_{xyz}^s = (x,y,z=0)^T$

To get a point in body frame, we do:

$$
p^b = R_s^b p^s + t_s^b
$$

To get a point in the ECEF frame, we need to use IMU+GNSS for orientation:

$$
p^e = R_b^e(R_s^b p^s + t_s^b) + t_b^e
$$

>[!question] Questions
>
>What is needed to measure far away? 
>* It's basically a design choice. Since more power requires more energy, it's basically a cost decision?
>
>What does a pulsed lidar measure?
>* It measures the range to the target using the time-of-flight measurement equation from physics.
>
>Which lidar type does amplitude, frequency, or time modulation?
>* The frequency modulated continuous wave lidars (fmcw lidars) use frequency modulations.
>* Pulsed lidars and single-photon lidars use time modulation

# 3D LiDARS

They basically give us the 3D point cloud in body frame.

## MAP Representations

This is how a robot can understand the world. A map can be represented through:

* Metric Maps
	* Point Clouds
	* Voxels (or rasters)
	* Features (or vectors)
	* Meshes
* Topological Maps
	* Factor graph: a pose graph and a landmark graph
	* Semantic graphs / Scene graphs
* Hybrid Maps
	* Semantic and metric information together

### Metric Maps

They are point-based maps. In 2D, they are represented through occupancy grids.

### Topological Maps

They represent the environment as a graph where:

* **Nodes**: Locations, places, regions
* **Edges**: Connectivity between nodes, such as traversable paths

**Semantic Graphs**: Focus on objects and their relationships within a scene

* **Nodes** contain **semantic labels** (e.g., "chair," "door")
* **Edges** describe spatial relationships (e.g., "next to," "on top of").

# Scan Matching

<div class="encoder-section">
  <img src="../static/notes/lidar_5.png" style="width: 200px; height: auto; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Check difference between two latest frames <i>a</i> and <i>b</i></li>
      <ul>
	  <li>Calculate translation and rotation using ICP (Iterative Closest Point)</li>
	  </ul>
      <li>Run algorithm with a high frequency to keep up with the motion</li>
	  <ul>
	  <li>Keeps translations and rotations small!</li>
	  </ul>
    </ul>
  </div>
</div>

## Iterative Closest Point (ICP) Algorithm

Goal: Estimate the transformation to move one cloud so that it is aligned with the other.

Detailed more at [[ICP]] and [[RPCN SLAM pen and paper|Pen and Paper Exercises SLAM]].

**Problem in Scan Matching**: Lidar errors may cause drift. Looking at two very similar scans gives a lot of weight to the noise -- especially when the robot is stationary since there should be no drift.

**Solution**: 

* Use a ==keyframe== (first introduced in [PTAM](https://www.robots.ox.ac.uk/~gk/publications/KleinMurray2007ISMAR.pdf))
	* Store one scan as a keyframe
	* Check updates against the keyframe, not against the previous frame. This way, we don’t process every single new frame that don’t add information.
	* Update the keyframe when the sensor moves significantly, e.g., 10 cm or 0.1 degrees

More tricks include noise handling through markers or features, or use an IMU for the theta prediction of the scan registration.

## Matching Techniques

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/lidar_6.png" style="max-width: 100%; height: auto;">
</div>

### Lidar-Inertial Fusion

**Context**: a spinning lidar collects points sequentially over time, leading to motion distortions if the sensor moves or rotates during data acquisition. This results in points in the point cloud don't accurately represent their real-world positions because the lidar's frame of reference changes during the scan.

**Solution**: IMU preintegration is a process that uses high-frequency inertial measurements (linear accelerations and angular velocities) to estimate the sensor's pose (position and orientation) changes over time.

Rotation is the most critical to minimize in ICP formalism.

* IMU saves multiple ICP iterations
* CPU effort saved

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/lidar_7.png" style="max-width: 100%; height: auto;">
</div>



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