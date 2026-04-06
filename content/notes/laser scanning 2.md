---
title: Terrestrial Laser Scanning (TLS)
draft: false
tags:
date: 2026-02-08
---
 
Lecture 2 from [[laser scanning|Laser Scanning and Point Cloud Processing]]. Also related to [[laser scanning 1|ALS]].

**Scanner Types**

<div class="encoder-section">
  <img src="../static/notes/tls_1.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Window scanner</li>
      <ul>
	      <li>FOV similar to conventional area camera</li>
	      <li>Needs multiple scans to cover 360 degrees</li>
      </ul>
    </ul>
  </div>
</div>

<div class="encoder-section">
  <img src="../static/notes/tls_2.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Panoramic scanner</li>
      <ul>
	      <li>Rotation around vertical and horizontal axis</li>
      </ul>
    </ul>
  </div>
</div>

**Properties of TLS/MLS**

* Eye-safety
* Power Consumption
* Range, Weight
* Occlusions, Point Density
	* **To avoid these two shortcomings, we acquire multiple scans from different POVs.**
* Scanner Settings
	* One or two scanners
	* coverage, orientation of scanning plane
		* **Relative Orientation** $\rightarrow$ **Registration**
		* **Absolute Orientation** $\rightarrow$ **Georeferencing**
* Single or multiple scans

# RELATIVE ORIENTATION, REGISTRATION

>[!summary] Relative Orientation i.e. Registration
>
>* **Relative Orientation (Registration):** This involves aligning scans using at least three corresponding points (**Rotation** \& **Translation**)
>* **Targeting:** Registration can be achieved using **artificial targets** like spheres or retro-reflective markers.
>* **Algorithms:** The [[ICP]] algorithm is highlighted as a method to minimize the distance between point sets without the absolute need for physical targets.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/tls_3.png" style="max-width: 100%; height: auto;">
</div>

The [[ICP]] is looking to find the parameters for estimating the rotation and translation from one scan to another (remember, we want the same point in at least 3 different POVs).

$$
\mathbf{y}_i = R \mathbf{x}_i + \mathbf{y}_0
$$

> More engineer-like formulation: iterative minimization of sum of squares of Euclidean distances between nearest transformed point from main and sub data (because we have main and sub scans).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/tls_4.png" style="max-width: 100%; height: auto;">
</div>

**Feature-Based Registration**

<div class="encoder-section">
  <img src="../static/notes/tls_5.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
	 <li>Good for coarse alignment of scans</li>
      <li>Comparison of fewer pairs than if working in point cloud directly</li>
      <ul>
	      <li>It also leads to a pruned (reduced) search tree</li>
      </ul>
      <li>Fewer feature points are required to fix the DOF of the transformation</li>
    </ul>
  </div>
</div>

# ABSOLUTE ORIENTATION, GEOREFERENCING

>[!summary] Absolute Orientation i.e. Georeferencing
>This process places the data into an absolute coordinate system, often using GPS or surveyed control points.
>
>It also involves relative adjustment of sub scans to the main georeferenced scan.

>[!danger] Attention at error propagation!

Some **applications** include:

* Cultural Heritage Documentation
* Building/Façade Reconstruction
* Tree Detection and Modeling
* Landslide Activity, Displacements
* Mapping of Caves.

Complete with information from the referenced books/sources.



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