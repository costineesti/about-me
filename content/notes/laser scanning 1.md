---
title: Aerial Laser Scanning (ALS)
draft: false
tags:
date: 2026-02-08
---
 
This is lecture 1 from Laser Scanning and Point Cloud Processing. Related to [[laser scanning 2|TLS]].

Accurate digital terrain levels using LiDARS in the NL. They want to upgrade the elevation of the country since they are 1/3 below sea level.

8th week -- oral reports on assignment. (Monday 30-3). Team up with Lars. Download the book chapters locally.

# Introduction

An **ALS** system relies on the integration of three primary instruments to determine the exact 3D coordinates of points on the ground:

- **Global Navigation Satellite System (GNSS):** Used for aircraft positioning through kinematic differential positioning, typically at a frequency of 1–2 Hz.
- **Inertial Measurement Unit (IMU):** Determines the aircraft's attitude (orientation) using gyroscopes and accelerometers at a higher frequency of 40–200 Hz.
- **Laser Range Finder:** A reflectorless sensor that measures the distance to the terrain by timing the travel of laser pulses (the time-of-flight principle). It's also eye-safe. Pulse frequencies can go up to 2000 kHz.

>Basically, airborne Lidar.

**Infra red light gets absorbed by water, it doesn't get reflected!** If it's turbulent water, then you do get some reflections.

It is **highly influenced** by the flight date -- they show a difference between two scans of the Danube River -- one in 26 March and one in 23 April. In april, the river was already covered with leaves.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/als_12.png" style="max-width: 100%; height: auto;">
</div>

# Laser Ranging and Pulse Reflection

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/als_2.png" alt="2" width="350" height="300"> </div> <div> <img src="../static/notes/als_1.png" alt="1" width="350" height="300"> </div> </div>

The technology has evolved from early **laser profiling** (inhomogeneous points along a line -- left picture) to modern **laser scanning** (right picture), which uses rotating mirrors to create broad scanning patterns.

- **Echo Detection:** A single pulse can result in multiple reflections if it hits several objects (e.g., tree canopy then the ground). Systems can record discrete returns (first and last echoes) or the **full waveform**.
- **Full Waveform Benefits:** This provides more detail for terrain reconstruction (distinguishing ground from non-ground) and forestry (biomass estimation). To measure the full waveform, the common practice is to discretize the return (1ns discretization corresponds to 15cm vertical distance).
- **Pulse Frequencies:** Rates have increased significantly from 2 kHz in 1993 to up to 2000 kHz in 2020. Modern systems (like Riegl) use irregular pulse intervals to allow multiple pulses to be "in the air" simultaneously without confusing their return order

A good practice is to measure the incoming relflection of the light ray on the rising edge when it exceeds a set threshold!

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/als_3.png" style="max-width: 100%; height: auto;">
</div>

> https://www.ahn.nl/ahn-viewer : you can view the NL in point cloud measurements! Holy shitt

How do you deal with echoes? How do you know which pulse is attributed to that echo? I solve it by slightly varying the intervals between emitted pulses. So, irregular intervals between emitted pulses => correct association. Riegl introduced this concept in 2012.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/als_4.png" style="max-width: 100%; height: auto;">
</div>

Example:

* Suppose $f = 500 kHz$, pulse emitted every $2 \micro s$.
* Suppose H = 750m, travel time $\Delta t = 2 \times 750 / v = 5 \micro s$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/als_5.png" alt="5" width="350" height="300"> </div> <div> <img src="../static/notes/als_6.png" alt="6" width="350" height="300"> </div> </div>

We can see in the right picture that, if we associate the wrong emitted and received pulses, we can get varying wrong distances. The effects are visible in the following picture, where the middle point cloud shows clear boundaries and segmentations.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/als_7.png" style="max-width: 100%; height: auto;">
</div>

# Types of LiDARS

**Linear-mode:** Conventional 1 transmitter to 1 receiver setup

**Geiger-mode LiDAR** **(GmLiDAR)** receives an array of points that come from a certain direction (? search this). Photo diode with 4096 detectors => 200 milion points in one sec.

**Single Photon LiDAR** splits the beam into 10x10 beamlets and then process (achieves high point density, e.g. 20 points / $m^2$)

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/als_8.png" alt="8" width="350" height="300"> </div> <div> <img src="../static/notes/als_9.png" alt="9" width="350" height="300"> </div> </div>

See accuracy for them. When you want to use each. For e.g. NL requires <5cm accuracy.

You can set speed limits for boats by measuring the waves levels. 

You want to tune the scan rate based on the pulse rate to get a good variety of the point density.

Pulse Position Modulation -- see what that is

ALS is applied across various fields:

- **Digital Elevation Models (DEM):** Essential for coastal zone management, flood risk assessment, and avalanche monitoring.
- **3D City Modelling:** Used in urban planning and telecommunications.
- **Vegetation and Forestry:** Monitoring biomass and precision farming.
- **Corridor Mapping:** Surveys for roads, railroads, and power lines.
- **Side-products:** Discovery of archaeological structures and mapping ship wakes

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/als_10.png" alt="10" width="350" height="300"> </div> <div> <img src="../static/notes/als_11.png" alt="11" width="350" height="300"> </div> </div>

Complete with information from the book.


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