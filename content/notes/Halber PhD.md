---
title: Pipeline for Indoor Scene Reconstruction and Understanding
draft: false
tags:
date: 2026-11-19
---

This is the PhD thesis of Maciej Stanisław Halber, which is the author of [[Fine-To-Coarse Global Registration of RGB-D Scans]]. That paper is from 2017, the thesis was published in 2019.

I only cover the extensions to that paper, not all 105 pages. In the end it should be about 20-25 pages covered.

>[!summary] Context
>This approach considers only the problem of reconstructing a 3D model from a sequence of color and depth frames. 
>
>The thesis is split in 3 projects
>
>1. correcting the depth measurements through an error reduction technique based on estimating an image-space undistortion field. It eventually improves the reconstruction quality.
>2. adressing the problem of registering RGBD frames over a long video sequence into a globally consistent 3D model. This is basically his work in [[Fine-To-Coarse Global Registration of RGB-D Scans]].
>3. they show how repeated scans of the same space can be used to establish associations between the different observations. Specifically, a situation where 3D scans are acquired repeatedly at sparse time intervals. This builds a temporal model of a scene with semantic instance information. I guess this could help with moving objects -- not my topic of research right now.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/halber1.png" style="max-width: 50%; height: auto;"> </div>
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/halber2.png" style="max-width: 50%; height: auto;"> </div>

I will be focusing on 1. He presents a calibration procedure that increases the effective range of depth. Calibration data can be obtained in minutes and does not require costly setup.

>[!question] Does it make sense to cover this since the study mentions it focuses only on PrimeSense-class devices such as Microsoft Kinect, Asus Xtion Pro, and Occipital Structure Sensor?
>
>Apparently no, drop it.

