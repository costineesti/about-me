---
title: Coordinate Frame
date: 2025-07-25
draft: false
tags:
  - SeaClear
  - robotics
---
 
# Coordinate Frame

When thinking about the 3-axis coordinate frame; I always use this representation

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/coord_frame.png" style="max-width: 50%; height: auto;">
</div>

>[!NOTE] In Robot (Canonical) Frames we have
>
>**X forward, Y left, Z up**

But apparently this is only for Robotics applications.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/camera_frame.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] In Optical Frames we have
>**X right, y down, z forward**
>
>This is because an image is drawn on the `x-y` plane

So in [[seaclear|SeaClear]] I have to assign a global coordinate frame.

>[!question] The situation does that I have 2 different camera streams with 2 different point of views
>
>The `GoPro` gives a `bird-eye-view` and the `USB Camera` provides more of a humanly perspective over the pool.
>
>But they see the same `ArUco` marker and get both the `translation and rotation vectors` from the built-in aruco functions from OpenCV. So I know both camera coordinates in the ArUco frame!
>
>I must convert the coordinates of the ROV from both perspectives by doing Transformations. In ROS, this is done through the tf2 library.
