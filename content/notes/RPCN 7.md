---
title: PPROS and CONS of Sensor Configurations
draft: false
tags:
date: 2025-12-08
---
 
# Typologies of Image-Based 3D Vision

* Visual Odometry
* Visual SLAM
	* Key difference: You're building up a map (helps me understand where I am compared to the past) -- For e.g. it is aware it was in one point before (loop closure)
* Structure from Motion (SfM)

### Structure from Motion vs Dense Matching

SfM

* Sparse point cloud
* SIFT
* no constraints that can be used

Dense Matching

* Identify many more corresponding points
* If you have 2 images that overlap, you want the disparity for each pixel (Pixel Wise disparity estimation)
* Parallax = Disparity
* From the pixel-wise disparity, we get the depth map.

You first need to do SfM and then Dense Matching.

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

**LiDAR + IMU**:

* IMU: how much you've moved in the past seconds
* Can be used to eliminate mistakes
* Add stability

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

# Bundle Adjustment

### Collinearity Equation

Setup: We have a scene that we see from different perspective (same idea from SfM -- let's say the Colosseum).

I know the distortion, I know the principal point location, etc.

I want to estimate the location of all the points in 3D space.

In BA, in one go we estimate the 3D geometry of all the points in the coordinate system and their location at the same time.

**Collinearity Equation**: you complete this.

Let's say we have 5 points that can be extracted in 5 different images. 

* In total: 5x5x2 camera coordinates/tie point = 50 collinearity equations
* 5 images x 6 pose parameters = 30 pose parameters
* 5 tie points x 3 world coordinates = 15 world coordinates
* 45 unknown parameters
* So we have 50 equations with 45 unknown parameters. Redundant, but possible.

**Bundle Adjustment**: 

* Obtain approximate values needed for unknown parameters
* Linearize collinearity equations

### Least Squares Parameter Estimation

The equations are non-linear $y = g(\beta)$ and least squares requires linear relation $y = X \beta$. 

So we linearize $g(\beta)$ using Taylor series.

$$
g(\beta_1, \beta_2) = g(\tilde{\beta_1}, \tilde{\beta_2}) + \frac{\partial g}{\partial \beta_1}(\tilde{\beta_1}, \tilde{\beta_2}) \cdot ({\beta_1} - \tilde{\beta_1}) + \frac{\partial g}{\partial \beta_2}(\tilde{\beta_1}, \tilde{\beta_2}) \cdot ({\beta_2} - \tilde{\beta_2})
$$

So we solve

$$
y - g(\tilde\beta) = y - g(\tilde{\beta_1}, \tilde{\beta_2}) = \sum \frac{\partial g}{\partial \beta_i} \triangle \beta_i
$$

And in the end we get

$$
\hat{\beta_1} = \tilde{\beta_1} + \triangle \beta_1
$$

We do Least Squares Estimation until we minimize $\triangle \beta$

We need to define the origin of the world!!! (could be the first camera pose).

### Error Propagation

Recall simple rules from Linear Algebra

$$
(AB)^T = B^TA^T
$$

Covariance matrix is symmetric

$$
Q_y = Q^T_y
$$

Everything is simplified when you have the same type of measurements (let's say camera).

If we over parametrize the system, we get singularity. Even if we have rank efficiency of 7, some values will come out. Make sure the system is not singular.

We compute the covariance between parameters. If it gets too close to 1, it means they are very correlated so we might need to take one of them out.

**Parameter Estimability**: 

Check condition number of $(X^TX)$.

Check correlation coefficients $p_{kl}$

For self-calibration, we for e.g. add the intrinsic parameters as unknowns.

We need to make sure we have points that make correlation possible.


