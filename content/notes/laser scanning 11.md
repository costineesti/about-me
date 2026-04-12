---
title: Q&A session
draft: true
tags:
---
 
# ALS Lecture - Done

**context**: A single pulse can result in multiple reflections if it hits several objects (e.g., tree canopy then the ground). Systems can record discrete returns (first and last echoes) or the **full waveform**.

Q: How do you know which pulse is attributed to what echo? 
A: I solve it by slightly varying the intervals between emitted pulses. And make these intervals irregular so I can ensure the correct $\Delta t$ ⇒ correct association. Do I need to ensure that the time between pulses is larger than maximum ToF?(no, that was done originally).  And I measure the incoming relflection of the light ray on the rising edge when it exceeds a set threshold, correct?

Actual answer: when you vary the emition time, you now can verify through delta time and through distance, because now they would both differ in case of misalignment. You can see when you had exact seconds (2.0, 5.0, 7.0), etc. then you can have wrong distances or delta times, but it's just not intuitive enough.

Q: How do I measure the full waveform?
A: To measure the full waveform, the common practice is to discretize the return

advantage of full waveform: better characterize the surface elements which I have captured. From the width of the returning peak I can determine if it's solid ground or just vegetation. I can conlude the reflection is not from a single altitude, but from multiple altitudes if the return is wider than the emitted pulse. Can be good in forestry to estimate the biomass levels. 

# MLS Lecture

Q: So the difference between Multi-line LiDARs and Single-line is the density? And Single-line achieves higher point density? Also, in MLS, ALS, TLS, which one uses which?

A: I understand the multi-line is better for vegetation penetration and would mostly be considered in MLS since it covers more on the horizontal and it achieves 360 degrees. But what else?

Actual answer: multi-line scanner would understand the instant idea of the environment. In autonomous driving you want to understand the motion of different objects. A single scan line can not extract objects and understand the motion of the scene. Mainly used in MLS.

# Point Cloud Segmentation Lecture

Q: Explaining the Hough Space? So determining which square contains the most lines gives us an idea on how to compute $\alpha$ and $d$. But maybe a refreshment on that idea? Because if you fix the point, of course the equation's only variable is $\alpha$, and that's how I get the multiple lines, but isn't the exact location of the point always the region where I'll find the most lines? It's confusing a bit.

A: d = distance of line to origin. alfa is the angle between the line and Y-axis. let's say x=-2 and y=-1. I plug those, and as a result i get the curved line in terms of alfa. They all intersect in the Hough Space because they are all aligned in the object space. 

Q: A lot of ideas in this lecture rely on the normal vector of a point. I assume I don't get it for free?

A: It's very expensive. First we get the vicinity of a point. I don't want to calculate the distance to all the other points. This kDD tree allows me to search what are the ten nearest points around a certain point. Then just fit a plane and then get the normal vector of that. But not all the points get the same normal vector. Assume a curved surface - you would need to fit a plane for multiple point to get the different normal vectors.

Q: In the SAM practical, we talked about projection. It helps me go from 3D to 2D and it lets me leverage deep neural networks like CNNs or SAM. That was the main idea right? Go from unordered 3D sets to organized grids in 2D, apply the segmentation in that space since it's less expensive and there are countless models who can do it, and then reproject the label of each point back to its 3D representation?

A: 

Q: So basically the previous topic [[laser scanning 5|Point Cloud Segmentation]] applied the segmentation techniques in directly in the 3D unordered space of point clouds using Hough, Growing Surface, etc., and this one applies segmentation in the projected 2D space using deep NNs.

A: yes/no

Q: the trade-offs are that in 3D you don't lose data and in 2D it's less expensive?

A: if you go to 2D you do lose data. In most datasets the point cloud usually reveals which point belongs to the same surface. 

# Building Detection Lecture - Done

Slide 10 -- please explain the 2D $\alpha$-shape concept from picture C?

Q: What's $\alpha$ shape?

A: So you have a point cloud. I have a circle with radius $r=\alpha$. I'm going to take that circle and move it around the outside of my point cloud. Then I am able to mark the points which I can touch with my shape. The $\alpha$ shape is the interpolation between each point I touched => the outline. It's in 2D.

# Classification Lectures

In terms of papers, should we only prepare PointNet and RandLA? As in, should we know the improvements that led to PointNet++, or is it enough that we know that PointNet missed local structure, and so the **Ball Query** and **Farthest Point Sampling** topics were introduced? So, how far?

# Stupid Questions - Done

1. Could you please explain the Q(15\%) from the sample?
2. Open book means we also get the book chapters or only the lecture slides? yes, lecture slides and book chapters + papers.


Model driven - you have a library where you just fit different topologies to my data and see which fits best. Data driven is basically trying every possible possibility and selecting from those.