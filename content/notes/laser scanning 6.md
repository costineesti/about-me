---
title: Point Cloud Segmentation with Segment Anything (SAM)
draft: false
tags:
date: 2026-02-16
---
 
We will use Segment Anything (SAM) from META. I also used it in [[Visual-Language Models for Object Detection and Segmentation]]. Again, I can see the similarity between image processing and point cloud segmentation.

# Projection from 3D to 2D

* (ortho) **Normal projection** i.e. setting a plane direction and/or orthogonal projection direction.
	* Mostly for parallel views. We ignore Z.
* **Spherical/Cylindrical projection**
	* Set a center location
	* generate an artificial sphere/cylinder
	* project point cloud onto the cylinder/sphere (intersection between each point and center point)
* **Perspective projection** using a camera's intrinsics and extrinsics
	* Not based on features, look into it.

>[!question] What kind of information do I project?
>
>* Color
>* Height
>* Normal

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sam_segment_1.png" style="max-width: 100%; height: auto;">
</div>

SAM is applied on the image => automatic segmentation based on given number of input prompts (in our case a regular grid of point of interest)

