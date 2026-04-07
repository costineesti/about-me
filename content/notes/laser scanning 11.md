---
title: Q&A session
draft: true
tags:
---
 
# ALS Lecture

**context**: A single pulse can result in multiple reflections if it hits several objects (e.g., tree canopy then the ground). Systems can record discrete returns (first and last echoes) or the **full waveform**.

Q: How do you know which pulse is attributed to what echo? 
A: I solve it by slightly varying the intervals between emitted pulses. And make these intervals irregular so I can ensure the correct $\Delta t$ ⇒ correct association. Do I need to ensure that the time between pulses is larger than maximum ToF?  And I measure the incoming relflection of the light ray on the rising edge when it exceeds a set threshold, correct?

Q: How do I measure the full waveform?
A: To measure the full waveform, the common practice is to discretize the return

# MLS Lecture

Q: So the difference between Multi-line LiDARs and Single-line is the density? And Single-line achieves higher point density? Also, in MLS, ALS, TLS, which one uses which?

A: I understand the multi-line is better for vegetation penetration and would mostly be considered in MLS since it covers more on the horizontal and it achieves 360 degrees. But what else?

# Point Cloud Segmentation Lecture

Q: Explaining the Hough Space? So determining which square contains the most lines gives us an idea on how to compute $\alpha$ and $d$. But maybe a refreshment on that idea? Because if you fix the point, of course the equation's only variable is $\alpha$, and that's how I get the multiple lines, but isn't the exact location of the point always the region where I'll find the most lines? It's confusing a bit.

Q: A lot of ideas in this lecture rely on the normal vector of a point. I assume I don't get it for free?

Q: In the SAM practical, we talked about projection. It helps me go from 3D to 2D and it lets me leverage deep neural networks like CNNs or SAM. That was the main idea right? Go from unordered 3D sets to organized grids in 2D, apply the segmentation in that space since it's less expensive and there are countless models who can do it, and then reproject the label of each point back to its 3D representation?

Q: So basically the previous topic [[laser scanning 5|Point Cloud Segmentation]] applied the segmentation techniques in directly in the 3D unordered space of point clouds using Hough, Growing Surface, etc., and this one applies segmentation in the projected 2D space using deep NNs.

# Building Detection Lecture

Slide 10 -- please explain the 2D $\alpha$-shape concept from picture C?

# Classification Lectures

In terms of papers, should we only prepare PointNet and RandLA? As in, should we know the improvements that led to PointNet++, or is it enough that we know that PointNet missed local structure, and so the **Ball Query** and **Farthest Point Sampling** topics were introduced? So, how far?

# Stupid Questions

1. Could you please explain the Q(15\%) from the sample?


