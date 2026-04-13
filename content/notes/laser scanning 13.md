---
title: 3D Indoor Reconstruction
draft: false
tags:
date: 2026-04-12
---
 
This is a topic from my [[laser scanning]] course. Related to [[laser scanning 3|MLS]]. A more practical view can be visualized in [[laser scanning 14|3D Point Cloud Shape Detection for Indoor Modelling]].

The divide-and-conquer approach is the central strategy for 3D indoor reconstruction from point clouds. This involves breaking the massive point cloud into smaller, solvable sub-problems.

* **First split**: segmentation (surfaces from point clouds)
* **Second split**: room segmentation and space subdivision
* **Third split**: opening detection (doors, windows, occlusions, reflections)

> Also divided in Segmentations (S) and Reconstruction (R). And challenges appear on both sides.

**The First Split: Segmentation** 

The initial step partitions the raw point cloud into tractable surfaces. This relies on methods such as RANSAC, region growing, or deep learning architectures like **PointNet++**, **RandLA-Net**, or **KPConv**.

>[!summary] Wall Detection Pipeline
>
>1. Generate wall patches (surface growing or RANSAC)
>2. Intersect segments
>3. Generate an adjacency graph
>4. Label graph edges as: wall-wall, wall-ceiling, wall-floor
>5. Label graph nodes based on number of edges' labels. Each node represents a segment.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ls13_1.png" style="max-width: 100%; height: auto;"> </div>

**The second split: Room Segmentation and Space Subdivision**

After segmenting surfaces, the building is still one giant puzzle. Next split: divide the building into rooms. Each room becomes its own modeling sub-problem. Classical approaches use mathematical morphology or cell decomposition to divide the space uniformly. Smarter modern techniques use 3D scene graphs and Graph Neural Networks to adapt the split based on the functional relationships of the space.

* The trajectory divides space at doorway crossings
* Trajectory loops identify room candidates
* Limitation: over-segmentation, untraversed doors are missed.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls13_2.png" style="max-width: 100%; height: auto;">
</div>

**The third split: Opening Detection from cluttered data**

This step isolates doors and windows while managing scanning artifacts. Ray-casting helps distinguish genuine openings from occlusions. Additionally, algorithms must account for glass and metal surfaces, which create false "ghost" objects due to laser reflections.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ls13_3.png" alt="segment 1" width="350" height="300"> </div> <div> <img src="../static/notes/ls13_4.png" alt="segment 2" width="350" height="300"> </div> </div>

A voxel on the wall is opening if there is a point behind the wall, otherwise occluded. **After walls** are known, we can focus on **door detection**.

>[!summary] Door detection (after walls are known)
>
>1. The trajectory is converted to line segments.
>2. Each line segment is intersected with the wall segments.
>3. The intersection is a door candidate.
>4. The orientation of the door is inherited from the wall’s plane.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ls13_5.png" style="max-width: 100%; height: auto;"> </div>

**The third split: Reflective Surfaces**

Modern indoor spaces are full of metal and glass. This is again a divide-and-conquer problem that can fall in 3 cases:

After a laser pulse **hits a surface** we observe:

1. The back-scattered pulse **(case1)**

After a laser pulse **hits a reflective surface** we observe:

1. Back-scatter from the surface (case1)
2. Reflection via the incident angle (**mirror** **image**, **case2**)

After a laser pulse **hits a glass surface** three things can happen:

1. Back-scatter from the glass (e.g. if the glass is dirty, **case 1**)
2. Reflection via the incident angle (**mirror image**, **case2**)
3. Back-scatter from behind the glass (**real object, case3**)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls13_6.png" style="max-width: 100%; height: auto;">
</div>

Limitations: Each surface is converted to a rectangular grid, consequently some of the openings are not accurate or don’t exist (false openings in the image).

**Reconstruction**

The segmented pieces are ultimately reassembled to form a watertight, volumetric 3D model. **AI inpainting techniques are increasingly used to fill in any remaining geometric gaps caused by occlusions** i.e. learn from intact surfaces to fill holes. 

Reconstruction can be done by:

* volumetric walls vs planar walls vs volumetric space

Parametric models can be used for merging wall faces, as in [[laser scanning 9|Building Detection and Reconstruction]].

The volumetric space is divided into **O-SPACE** (Occupied) and **R-SPACE** (Remaining/Free space). 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls13_7.png" style="max-width: 100%; height: auto;">
</div>

**AI FILLS WHAT THE SPLITTING MISSED**. Funny, [[genai2|GANs]] are a possible solution for geometry and color. It does make sense since they are generative architectures.

**Applications**

* saw a evacuation simulation using a building model reconstructed from scanned data.
* digital twins
* robotic navigation -- O-Space voxels for collision avoidance (cleaning robots, hospital delivery)

[[genai9|NeRF]] and [[genai10|3D Gaussian Splatting]] produce photorealistic visuals from scans.

---

**Questions**

1. What are the challenges in reconstructing an indoor 3D model from point clouds?

First of all, the problem is so vast that it needs splitting in three sub-problems, hence this is a divide-and-conquer approach. The first split, segmentation, partitions the raw point cloud into tractable surfaces. However, after segmentation, the model is still one big puzzle. The next split is dividing the building into rooms where each room becomes its own modeling sub-problem. Limitations in this part include over-segmentation, untraversed doors are missed. The last split consists of handling data that comes from reflective surfaces. The main limitation here is each surface is converted to a rectangular grid, and consequently some of the openings are not accurate or don’t exist. At last, the reconstruction step needs to take all of the segmented parts into consideration and rebuild the whole model. Of course, **occluding objects, reflective surfaces, inaccurate parts all contribute to accumulating errors** and gaps are nowadays filled by using Deep Neural Networks.

2. In four steps, explain the ray casting procedure for opening detection.

Step 1: After walls are known, cast rays from the scanner trajectory through the wall plane.

Step 2: Check if any points are detected **behind** the wall along that ray.

Step 3: If a point exists behind the wall $\rightarrow$ the voxel is an opening (the ray passed through).

Step 4: If no point exists behind $\rightarrow$ the voxel is occluded, not an opening.

3. Explain how the MLS trajectory can be used for room segmentation and door detection.

The MLS trajectory reveals interesting insights about the building. For example, once the walls are segmented, we can safely assume that loops in the trajectory represent rooms, and intersections of this trajectory with the wall planes would naturally reveal the doors of the building. The orientation of the doors will be inherited from the belonging wall.

4. Explain the divide-and-conquer strategy for indoor 3D reconstruction.

I think I already answered that in the first question, where I definitely over-extended the answer; since only the last part really addresses the question. However, I used Claude to re-answer it:

The strategy breaks the massive point cloud into three progressively smaller sub-problems: segmentation (surfaces), room segmentation (space subdivision), and opening detection (doors, windows, reflections). Each split makes the problem tractable, and reconstruction reassembles the pieces into a watertight model.

5. Compare mathematical morphology and cell decomposition for room segmentation.

Mathematical morphology divides space using erosion/dilation operations on a binary occupancy grid — simple but tends to over-segment. Cell decomposition subdivides space uniformly into cells regardless of functional meaning. Both are classical, geometry-driven, and don't understand what a "room" semantically is.

6. How do modern AI approaches (scene graphs, GNNs) improve upon classical room segmentation methods?

Classical methods split space purely geometrically. Scene graphs encode functional relationships between spaces (e.g. kitchen connects to hallway). GNNs learn from these relational structures, adapting the segmentation based on semantic context rather than just geometry — producing splits that better reflect actual room boundaries.

**Reading Material**: Sections 3.6-3.9 from Book chapter, Indoor 3D: Overview on Scanning and Reconstruction Methods.