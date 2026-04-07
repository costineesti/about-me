---
title: Error Analysis of Airborne Laser Scanning Data
draft: false
tags:
date: 2026-02-17
---

Laser scanners consist of three different sensors. A lot of issues can go wrong with the individual sensors as well as with their integration.

Imaging point clouds: use binning to define a raster and for each raster cell I can see if I have points inside. If there is, I assign a height to each point in that cell.

I can also use interpolation techniques (some cells have no data) like Nearest neighbor, TIN, Splines. In the Figure, he used triangulation.

Converting heights to grey value range 0-255. There you get a histogram and the low points are the ground. You get a lil bit of over saturation, but you need to move 255 a lil bit to the left to not get over-darkened images.

**Pseudo Shading**

For this, we use Roberts gradient $k = \begin{pmatrix}-1 \quad 0\\0 \quad 1\end{pmatrix}$, $g' = k*g$. I can go into second and third derivatives. Use $\log$ to handle big values? They are not derivatives, they are simply steps.

### Data Completness

We need to ask "Has all the data been collected? Is it complete?".

* Binning per strip: they just use a binary mask. 1 - there is data in a raster cell, 0 - there is not. You add up and get the image on the right. The color indicates in how many flight lines the data has been collected. What you don't want is the empty spaces. Here you can check if you are missing any data.

It's more advantageous to do your data collection at night. Don't have missing parts! Your contract will be declined!

### Systematic Height Errors

The second picture is the gradients. The cause of the weird endings of the roofs: between 2 flight lines, the height was different. The triangulation (mesh) will simply connect those points and that's exactly what's causing that effect.

**Height offsets between strips**

The terrain might look bumpier in the middle region. That's because of the same reason above.

**Overlaid Flight Lines**

2-3 degrees difference in perspective give those lines. I think :))

# Measurements in strip overlays

If you fly over the same area twice, you assume the area hasn't changed in the meantime. The roofs and the ground should be pretty much the same. So if you measure the height differences, you can get nice measurements to analyze the quality of your data. You're hoping for the mean around 0.

In the next slide, I see the mean is ~0.05. If I zoom in, I find the systematic patterns in the height. Those are coming from the GNSS, apparently. The IMU interpolates between those points. It's basically the interpolation between the GNSS points.

The differences between scan lines showcased (first - the rotating mirror) and second the polygonal mirrors? It just shows bad calibration

### Planimetric Offsets between strips

basically a combination of multiple errors. For example, the rotation between the IMU and Laser scanner itself.

The II slide simply shows that height is not enough to get the exact position. More features on the roofs help on this. The red lines are one flight and the yellow lines are the second flight. If you have this data, you can just shift the point cloud.

# Strip Adjustment of Airborne Laser Scanning Data

This is where we talk about how we solve these errors

First, ask myself if it's really necessary. 

* 0.2-0.3m for USGS DEMs
* 0.1m for more detailed DEMs
* 0.02m for water level decisions

### Strip Adjustment

> Aligning the multiple laser scans.

Identify the patches where you find corresponding points. That's how we get rotation and translation from different flights.

$Z_{ref}$ could be the gps ground truth height of a point and $Z_s$ could be the point from the laser scan. Only if you have reference.

Smiley error: you have a flat terrain, but the reconstructed point cloud looks like a smiley. So if I have 3 flight lines that connect with each other, we can rotate the point clouds and apply an offset such as to minimize the distortions (you can see in the "after adjustment"). But you still have an extremely curved trend. To avoid it, we can use more reference points (can force the difference in height between strips). Another solution is to take cross strips (perpendicular). So if I assume I'm rotatin between $[-30,30]$ degrees, maybe I'm actually rotating between $[-31,31]$ degrees.

**3-D Adjustment**

I explain the differences around the center of the strip + translation. And then try to find the rotations.

Companies mostly care about improvement in height, not X and Y.

In case of slopes, the error in the viewing direction of the laser beam will have different effect on the point cloud. This can be used to estimate the angle error. In a flat terrain, we should see pretty much the same height regardless of the viewing direction. You can't really do too much with that. You have the picture on your phone.

Look at the data of a single flight line and extract your features there. And then you can combined the independent data, viewed together. It's usually simpler than trying to fix multiple things at once.