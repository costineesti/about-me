---
title: SUN3DSfM
draft: false
tags:
date: 2026-11-19
---

From 2013. It was mentioned in [[Fine-To-Coarse Global Registration of RGB-D Scans]]. VPR seems like a good application for detecting loop closures, initially, but this paper explicitly notes it *fails* on their corridor sequence due to repetitive/self-similar geometry -- which I need to be aware of.

However, recent findings (NetVLAD and transformer-based ones) might make a difference.

>[!summary] SUN3D
>A large scale RGB-D video database with camera pose and object labels. 
>
>The **core problem** they identify is that [[ai for robotics 3|SfM]] is ==unreliable for large spaces==. Drift and loop-closure failures are frequent, and hand-labeling long videos is painstaking. Their solution is to combine both tasks so each helps the other.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/sun3d2.png" style="max-width: 50%; height: auto;"> </div>

* They use the object labels to fix errors in the reconstruction.
* They introduce a generalization of [[RPCN 15|BA]] that incorporates object-to-object correspondences.
* The algorithm works by constraining point for the same object from different frames to lie inside a fixed-size bbox, parametrized by its rotation and translation.

**Intuition**: This establishes **long-range connections** between frames that may be far apart in the video but contain the same object instance -- directly helping with drift and loop-closure failure, without needing a separate visual place recognition step.

* i.e. instead of relying purely on point/feature correspondences (which can fail over long ranges), object identity itself becomes a geometric constraint. "This chair in frame 5 and this chair in frame 800 are the same physical object" is a strong, semantically-grounded long-range correspondence -- of the same _kind_ of problem [[Fine-To-Coarse Global Registration of RGB-D Scans|fine-to-coarse’s]] plane-merging aims to solve, but via semantic labels instead of planar structure.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sun3d1.png" style="max-width: 50%; height: auto;">
</div>

# Algorithm

**Local tracking of adjacent frames**

Match SIFT keypoints between consecutive frames, back-project to 3D, and use a 3-point-algorithm inside a [[laser scanning 14|RANSAC]] loop to find the relative transformations between pairs of frames. Pretty much similar to [[Fine-To-Coarse Global Registration of RGB-D Scans|fine-to-coarse’s]] local alignment `L[k]`. Or opposite I should say, since Sun3d was published first.

**Loop closure via VPR (BoW)**

>[!summary] Bag of Words
>compute a feature vector for each frame and store them, to later compare incoming frames to these reference ones.
>
>helps in detecting loop closures. can fail easily.

1. Compute SIFT $\rightarrow$ quantize into a BoW histogram, weighted [[NLP 5|TF-IDF]] style.
2. Compute a similarity score (dot-product) between every pair of frames' histograms
3. Smooth + [[ai for robotics 1|NMS]] + dilate the resulting score matrix to pick candidate loop-closure pairs

* For this last step, actually run [[ai for robotics 3|SIFT]] + [[laser scanning 14|RANSAC]] from step 1 and if more than 25 inliers correspondences are found, accept it as a real loop closure.
	* They say 25 is more on the conservative side, yielding high precision, with low recall. False loop closures are much more damaging to bundle adjustment than missed ones, so they’d rather miss some real loops than accept a wrong one. This only works because their capture protocol specifically asks users to walk past the same spots multiple times, so near-identical frames exist to be matched.

**Joint 2D+3D Bundle Adjustment**

Essentially it's a standard [[RPCN 15|Bundle Adjustment]], but with both the 2D reprojection error and a 3D point-to-point error term (since depth allows us to directly compare them).

**Depth map improvement**

Interesting trick they used. The raw depth maps are usually noisy, with many holes. To fill the holes, `Indoor segmentation and support inference from rgbd images (2012)` use cross-bilateral filtering, which produces a visually pleasing depth map, but it introduces many artifacts. 

* it only has the current frame’s data to work with, so it has to guess/smooth over gaps using neighboring pixels in that same image

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sun3d4.png" style="max-width: 50%; height: auto;">
</div>

>[!NOTE] Truncated Signed Distance Function (TSDF)
>Instead, they improve the depth map using a Truncated Signed Distance Function (TSDF) to voxelize the space, accumulating the depth map from nearby frames (e.g. 40 closest frames) using the camera poses obtained above. Finally, they use ray casting to get a reliable depth map for each frame.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/sun3d3.png" style="max-width: 100%; height: auto;"> </div>
>
>* Introduced in `Kinect-fusion: Real-time dense surface mapping and tracking. In ISMAR, 2011`

**Generalized Bundle Adjustment**

So with the simulator they create, they annotate objects which makes it easier across frames to complete the whole picture. For example, if the same object instance appears twice in different locations, it signals that the camera pose estimation is incorrect.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sun3d5.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sun3d6.png" style="max-width: 50%; height: auto;">
</div>
