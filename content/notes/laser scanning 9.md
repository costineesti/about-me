---
title: Building Detection and Reconstruction
draft: false
tags:
date: 2026-03-16
---
 
Related to [[laser scanning 1|ALS]].

Surface growing is suggested for segmentation of a point cloud. The process would involve removing points in small segments (such as terrain points) and shaping the remaining segments into continuous surfaces. This idea is related to the detection side, since in the end I want to classify segments as buildings, vegetation, etc. 

* The classification is done by examining the height differences between segments.

For reconstruction, it's useful to first detect the outline of the building (as in bird-eye-view). Apparently it's not so straight-forward since the outline is not at the intersection of planes and the point density is not as high. We also need to make assumptions on building shapes. A relevant paper on this topic is Dorninger and Pfeifer 2008. The idea is that the boundary of roof segments is not a straight line, so we need to model the edge as a straight line. We want to ensure 90 degrees between the lines. The outliers get removed.

The pictures below are from Dorninger and Pfeifer 2008. Note to self: [READ IT](https://www.mdpi.com/1424-8220/8/11/7323).

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ls9_1.png" alt="segment 1" width="350" height="300"> </div> <div> <img src="../static/notes/ls9_2.png" alt="segment 2" width="350" height="300"> </div> </div>

**2D $\alpha$-shape**: represents the radius of a circle and we can specify the circle by ? We can visualize the 2D shape as a circle that's moving towards the point cloud. It's used to draw edges because it somehow connects the edges?

>[!question] What should the size of $\alpha$ be?
>
>If too small (lower than the distance between points), we get edges within the point cloud, which we don't want.
>
>Try to start at least with a larger value than the point distance. Too large leads to missing the correct shape. I guess it's empirical?

The intersection of 4 planes (two walls, two roof faces) define a possible corner. Look closer to the right image above. Realistically, picture C is met in real life - roofs with overhangs.

Lafarge et. Mallet 2012 focus on 2D arrangement before adding the 3rd dimension. They also represent complex roofs through meshes (collection of triangles).

* Complex roofs are represented by meshes (think of a stadium). How close to reality depends on the constraints, but it's mainly done through manipulating the number of final facets (triangles).

> But what do we do when data is missing? What's mentioned above works when all roof faces are detected.

Points could be missing

* absorbed by water,
* absorbed by dark tiles like slate materials. LOL? it's because they are very thin?
* mirrored by solar panels

Solutions to data gaps

* select the best model for the data (parametric models)
* we can use additional data like **ground planes** (those maps containing the building shapes and all that - you have a slide on it).
	* Some **decompositions** can be derived from them and so build primitives based on these partitions. Then the model with the best fit can simply be selected (left image).
	* Sometimes they are not useful if there are too many options (see right image).

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ls9_3.png" alt="segment 1" width="350" height="300"> </div> <div> <img src="../static/notes/ls9_4.png" alt="segment 2" width="350" height="300"> </div> </div>

**Common Problems in Building Detection**

Naturally, it's when objects interfere with each other, like dense tree canopies with roof edges.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls9_5.png" style="max-width: 100%; height: auto;">
</div>

**Does Deep Learning apply in this case?**

Outlining is still very data driven, followed by a cartographic generalization. Deep learning models are limited only to detection and semantic segmentation.

Apparently, they can work together when combining the data with 2D floor plans? Interesting.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls9_6.png" style="max-width: 100%; height: auto;">
</div>

==High point density== is required for data-driven approaches and it's best to have it for everything in general.