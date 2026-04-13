---
title: 3D HD Roads
draft: false
tags:
date: 2026-04-12
---
 
Topic encountered in [[laser scanning]]. This is more of a [[laser scanning 3|MLS]] application. The practical involved using RandLA-Net.

The **rail environment** is pretty much standardized these days, with known shapes and sizes. One **application** could be **monitoring** track deformations and nearby vegetation.

The **road environment** is a little bit less standardized, but the main idea still revolves around lanes, cars, people, traffic signs, etc. One **application** could be **monitoring** the road surface, vegetation, rocks, visibility analyses, etc.

**Object Detection and Scene Classification**

**It helps massively if you know what you are looking for**. Take the Figures below for example. 

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ls12_1.png" alt="segment 1" width="350" height="300"> </div> <div> <img src="../static/notes/ls12_2.png" alt="segment 2" width="350" height="300"> </div> </div>

Scene classification and object detection **rely** heavily **on** **similarity** measures. This involves using segment-based attributes like height histograms and bounding box dimensions, followed by correlation calculations across all other segments based on user-selected samples.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_3.png" style="max-width: 100%; height: auto;">
</div>

Furthermore, interpreting street furniture involves decomposing pole-like structures using 3D shape, **reflectance**(material properties), **geometric**(bbox), and **contextual features** such as relative heights, angles and relative positions among poles and their attached components.

**Trajectory and Positioning Enhancement**

**Mobile Mapping** (MM) Lidar positioning is significantly enhanced by **matching** it with **stereo aerial images** to extract 3D tie points. These tie points serve as additional observations to continuously adjust the 6 Degrees of Freedom (DoF) trajectory over time using **B-splines**. Focusing on high-quality tie points **improves trajectory accuracy** from 25-50 cm down to 10-15 cm, proving more effective than simply using all available tie points. The idea is nicely visualized below.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_4.png" style="max-width: 100%; height: auto;">
</div>

* filter the MM Lidar and covert to ortho image
* detect keypoints
* find matches with the stereo aerial images and extract the tie points

Updating the **spline coefficients** involves a fusion between all the sensors from GNSS to IMU. Even the observation of the tie points help. I am not going in detail, but `Hussnain et al, 2018` provides it if necessary.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_5.png" style="max-width: 100%; height: auto;">
</div>

> I guess the idea is **the 3D tie points are successfully used for trajectory adjustment**. Which means that orientation and overlap of aerial images is important.

**Application in Autonomous Driving**

Real-time Lidar processing is crucial for autonomous systems. Sparse real-time Lidar sweeps are registered against an Offline HD Map using both geometry-based and laser reflectivity-based matching. The Offline HD Map provides essential correctness and completeness, allowing for the application of traffic rules and thorough semantic feature extraction. A major challenge in semantic segmentation for these complex environments remains dealing with minority classes and a lack of sufficient training data.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_6.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_7.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls12_8.png" style="max-width: 100%; height: auto;">
</div>
