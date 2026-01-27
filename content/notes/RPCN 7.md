---
title: PPROS and CONS of Sensor Configurations
draft: false
tags:
date: 2025-12-08
---
 
# Typologies of Image-Based 3D Vision

* Visual Odometry
* Visual SLAM
* Structure from Motion (SfM)

### Structure from Motion vs Dense Matching

SfM

* Sparse point cloud
* SIFT
* No constraints that can be used
* Epipolar geometry unknown
* Goal: estimate camera poses

Dense Matching

* Identify many more corresponding points
* If you have 2 images that overlap, you want the disparity for each pixel (Pixel Wise disparity estimation)
	* From the pixel-wise disparity, we get the depth map.
* Parallax = Disparity
* Epipolar geometry is known
* Goal: estimate the shape of object surfaces in detail

You first need to do SfM and then Dense Matching.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/SfM_Dense.png" style="max-width: 100%; height: auto;">
</div>

**Difficulties in finding corresponding points**:

* Images have different perspectives => The wider the baseline, the harder it gets.
* Repetitive patterns (brick wall) -- how do you find the correspondent?
* Surfaces without texture
* Visibility (rain, fog, smoke)

# Setups

**One Camera - Forward Looking**:

* Poor intersection of rays, hence
	* Poor positioning in direction of the corridor
	* No depth estimation for the end of the corridor
		* The motion of the camera is in the same direction as the depth perception, so the baseline which is perpendicular to the depth direction is missing.
* Nice solution: Panoramic Camera

**Two Cameras**:

* Reasonable measurements in nearby part of corridor
* Poor accuracy at end of corridor because of bad depth-to-base ratio. Recall $\sigma_Z = \frac{Z^2}{B_f} \sigma_D$

**Three Cameras**:

* I would be able to get 3 pairs (3 different baselines)
* I can project the points from the first two images into the third image.
* Adds a lot of robustness -- makes the data way more reliable.
	* Repetitive patterns
	* Random dot patterns

**Camera + IMU**:

* VIO / VISLAM
	* You can rely on the IMU sometimes (for a short period)
	* Sensor alignment

**LiDAR**:

* Have to understand which parts of the scene are stable (fixed) and which are in motion
* For 3D pose estimation, point clouds need to contain three surfaces with independent normal vectors
	* Otherwise we risk **sliding**: Because the data hasn't changed, the software "slides" along that axis, unable to tell if the robot moved 10 centimeters or 10 meters. 

**LiDAR + IMU**:

* IMU: how much you've moved in the past seconds
* Can be used to eliminate mistakes
* Add stability. IMU observations can prevent sliding

**Camera + LiDAR**:

* They have complementary properties:
* 
	* Camera has poor depth perception with a small baseline
		* LiDAR has high ranging accuracy
	* Camera depends on surface texture
		* LiDAR doesn't require surface texture
	* Camera has high spatial resolution
		* LiDAR has large point spacing on distant surfaces
	* Camera has little scene structure needed
		* LiDAR depends on scene structure!
* Don't forget about sensor alignment
	* Rotation between axes should be calibrated
	* Offset between sensor origins should be calibrated
	* Strong stiff connection between lidar and camera body

**Camera + LiDAR + IMU**:

* Further improvement of accuracy and robustness
* Sensor Alignment again!
* They are highly complementary. Whenever possible, combine them!
