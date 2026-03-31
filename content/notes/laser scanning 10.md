---
title: Real-Time LiDAR Point-Cloud Moving Object Segmentation for Autonomous Driving
draft: false
tags:
date: 2026-03-31
---
 
Link to research [paper](https://www.mdpi.com/1424-8220/23/1/547).

# Context and adjacent research

As an abstract, autonomous driving should be able to recognize static and moving objects in the environment in order to avoid collisions and plan tasks (i.e. **predicting the future state of the environment**). To be able to perform real-time, they propose a lightweight MOS (Moving Object Segmentation) network structure based on LiDAR point-cloud sequence range images with only 2.3 M parameters, which was 66\% less than the state-of-the-art network at that time.

**RTX 3090 GPU Performances**:

* 35.82ms processing time per frame
* IoU score of 51.3\% on the SemanticKITTI dataset.

On a custom FPGA, they reach 32fps, highly exceeding the standard of 10 fps regarding LiDAR navigation algorithms for real-time. 

Autonomous Vehicles can already perform point-cloud **pre-processing** and neural network segmentation. Therefore, only post-processing is left for the ECU (Electronic Control Unit). This is where their contribution shines:

1. their implementation was one of the first end-to-end FPGA (ZCU104 MPSoC FPGA platform) implementations where a LiDAR is directly connected to the processing system (PS) side. **After pre-processing**, the point-cloud is **stored in the DDR memory, which is accessible by the hardware accelerator** on the programmable logic (PL) side
2. they made the implementation "`hardware-friendly`" by r**eplacing deconvolution with bi-linear interpolation** (look into it)

<div class="encoder-section">
  <img src="../static/notes/lidar_paper.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Moving objects are represented by red masks.</li>
      <li>The yellow box is a parked car. So I assume yellow means stationary?</li>
      <li>Most of the existing architectures only predict semantic labels (vehicles, buildings, people), but cannot distinguish between moving and static objects as in this example.</li>
    </ul>
  </div>
</div>

Existing MOS networks really can be categorized into two groups:

1. computer-vision-based. Here I remember a paper from TNO where they fed consecutive frames to a CNN to detect small moving objects. Maybe similar to that.
2. LiDAR-sensor-based

However, it is the processing of LiDAR data that remains challenging due to the sparsity characteristic of point clouds. 

>[!tip] One problem with all networks based on operating directly on the point cloud is the dramatic increase in processing power and memory requirements, causing the point cloud to become larger

`LMNet` utilizes the residual between the current frame and the previous frame as an additional input to the semantic segmentation network to achieve class-independent moving object segmentation. The same idea is adapted in `RangeNet++` and `SalsaNext` for performance evaluation. In `Efficient Spatial-Temporal Information Fusion for LiDAR-Based 3D Moving Object Segmentation`, they utilize a dual-branch structure to fuse the spatio-temporal information of LiDAR scans to improve the performance of MOS. 

Shifting towards attention-based architectures (==check this info==), `EmPointMovSeg: Sparse Tensor Based Moving Object Segmentation in 3D LiDAR Point Clouds for Autonomous Driving Embedded System` the **autoregressive system identification (AR-SI) theory** was used and it significantly improved the segmentation effect of the traditional encoder-decoder structure.

**Why FPGAs?** They provide high energy efficiency ratio and flexible reconfiguration. In `Real-Time LiDAR Point Cloud Semantic Segmentation for Autonomous Driving`, a LiDAR sensor is directly connected to FPGA through an Ethernet interface, realizing a deep learning platform of end-to-end 3D point cloud semantic segmentation based on FPGA, which can process point-cloud segmentation in real time.

# Their proposed network

**Spherical Projection of LiDAR Point Cloud**

They were mainly inspired by LMNet. Therefore, the residual image is used as an additional input to the designed semantic segmentation network to achieve moving object segmentation.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/bev_range_point.png" style="max-width: 100%; height: auto;">
</div>

Following this previous work, they use a 2D CNN to extract features from the range view of the LiDAR. Specifically, they project the 3D points $(x,y,z)$ of the lidar onto a sphere and then convert them to image coordinates $(u,v)$ with the following equations (is this the **Ball query** concept I covered in [[pointnet|PointNet]]?):

$$
\begin{pmatrix}
u \\
v
\end{pmatrix}
=
\begin{pmatrix}
\frac{1}{2}\left[1 - \arctan(y, x)\pi^{-1}\right] w \\
\left[1 - \left(\arcsin(z r^{-1}) + f_{up}\right) f^{-1}\right] h
\end{pmatrix}
$$

* $r$ represents the range of each point as $r=\sqrt{x^2+y^2+z^2}$
* desired height and width $[h,w]$
* $f = |f_{down}| + |f_{up}|$ is the sensor's vertical FOV.

By extracting these features, they transform the problem from point-cloud moving segmentation to image moving segmentation. Here again, TNO did something interesting.

**Residual Images**

>[!quote] The residual image and range view based on LiDAR point cloud are used as the input of the segmentation network, and the temporal information in the residual image is used to distinguish the static object and the pixels on the moving object, so the actual moving object and the static object can be distinguished.

















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