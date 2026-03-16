---
title: Building Detection and Reconstruction
draft: false
tags:
date: 2026-03-16
---
 
Related to [[laser scanning 1|ALS]].

Surface growing is suggested for segmentation of a point cloud. The process would involve removing points in small segments and analyzing the remaining segments. This idea is related to the detection side. 

For reconstruction, it's useful to first detect the outline of the building (as in bird-eye-view). Apparently it's not so straight-forward since the outline is not at the intersection of planes and the point density is not as high. We also need to make assumptions on building shapes. A relevant paper on this topic is Dorninger and Pfeifer 2008. The idea is that the boundary of roof segments is not a straight line, so we need to model the edge as a straight line. We want to ensure 90 degrees between the lines. The outliers get removed.

**2D $\alpha$-shape**: represents the radius of a circle and we can specify the circle by ? We can visualize the 2D shape as a circle that's moving towards the point cloud. It's used to draw edges because it somehow connects the edges?

>[!question] What should the size of $\alpha$ be?
>
>If too small (lower than the distance between points), we get edges within the point cloud, which we don't want.
>
>Try to start at least with a larger value than the point distance. Too large leads to missing the correct shape. I guess it's empirical?

The intersection of 4 planes (two walls, two roof faces) define a possible corner? See picture d from "Deriving 3D building models". Realistically, picture C is met in real life - roofs with overhangs.

Lafarge et. Mallet 2012 focus on 2D arrangement before adding the 3rd dimension. They also represent complex roofs through meshes (collection of triangles).

> But what do we do when data is missing?

Points could be missing

* absorbed by water,
* absorbed by dark tiles like slate materials. LOL? it's because they are very thin?
* mirrored by solar panels

Solutions to data gaps

* select the best model for the data (parametric models)
* we can use additional data like **ground planes** (those maps containing the building shapes and all that - you have a slide on it).
	* Some **decompositions** can be derived from them and so build primitives based on these partitions. Then the model with the best fit can simply be selected.
	* Sometimes they are not useful if there are too many options.

