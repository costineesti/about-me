---
title: Gaussian Splatting
draft: false
tags:
date: 2025-12-11
---
 
Resource endorsed by the professor: [learnopencv](https://learnopencv.com/3d-gaussian-splatting/).

Massively used in many application nowadays. It's taking ground from [[genai9|NeRF]]. 

[[genai9|NeRF]] excels in producing high-quality, photorealistic renderings at the cost of computational efficiency, while Gaussian Splatting offers a faster and more memory-efficient alternative with potentially lower rendering quality. The choice between the two depends on the specific requirements of the application, such as the need for real-time rendering versus the demand for high-fidelity imagery.

I mean, how cool is [this](https://x.com/Arata_Fukoe/status/1714931950719508967)?

It's a rasterization method that enables real-time rendering of photorealistic scenes learned from a limited set of images. The scene is represented by millions of Gaussians.

Fast rendering using GPU and avoiding ray-marching.

PRO: Gaussians are differentiable => you can include them in stochastic infrastructures
Can be parallelized -- use of GPU

NeRF is heavy computationally. It's mainly why it lost ground. It was using the volumetric ray marching: for each pixel, you want to know along the projective line if that particular points is empty or full.

The meshes (triangle representing the surface), are not able to reproduce complicated geometries and thin details (hair, vegetation, etc.)

Meshes are not efficient when you have billions of points representing a surface (let's say a building)

3DGS is a simple yet nice idea: the scene (3D world) can be represented by big collections of 3D Gaussians (ellipsoids), and they are overlayed one over another and create shapes.

When you have a homogenous surface (a wall), you only need 1 Gaussian to represent it with small amounts of parameters.

It's called splatting because they get these 3d volumes and go with them into 2D (splatting)

We assume the 3 axes are always positive (because we need real space).

Each Gaussian has 5 learnable parameters:

* Mean
* Covariance
* Color (changes in terms of the direction I'm looking at)
* Opacity
* Spherical Harmonic Parameters

A scene has 10M gaussian => $5 \times 10 =$ 50M parameters.

Ray Marching: Sample iteratively in my volume (the colors) and take the sum to estimate the volume.

SSIM reflect and try to merge the 3D components together. Just understand that it considers Luminance, Contrast and Structural Information.

The goal of Gaussian Splatting is to make the image good looking, not 3D realistic.

