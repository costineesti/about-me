---
title: Visual Place Recognition
draft: false
tags:
date: 2026-11-20
---

VPR is the core topic of my Master's thesis, written during my internship at Universum3D after the first year at [[twente|Twente]]. I got to it from the loop-closure side of [[RPCN 6|SLAM]] and [[ai for robotics 3|Deep Learning SfM, SLAM, and VO]]: you can only close a loop if you first recognise that you have been somewhere before.

> [!question] What is VPR?
> Given a **query image**, find the images in a large **reference database** that show the same place, using only visual cues. It's framed as image retrieval:
> 
> 1. **Backbone**: a pre-trained network (CNN, [[ViT]], [[DINO|DINOv2]]) extracts dense local features.
> 2. **Aggregation**: the features are pooled into one compact **global descriptor** per image (NetVLAD, GeM, MixVPR, [[SALAD]], [[BoQ]]).
> 3. **Retrieval**: nearest-neighbour search over descriptors gives the top-$k$ candidates.
> 4. **Re-ranking** _(optional)_: local feature matching + geometric verification on the top-$k$ to reject false positives.

The hard part is that the same place can look very different (day/night, seasons, viewpoint, occlusions), while different places can look almost identical. The second case is called **perceptual aliasing**, e.g. repetitive corridors, which is exactly where [[SUN3D|SUN3DSfM]]'s bag-of-words loop closure fails.

> [!example] Applications
> 
> - **Loop closure** in SLAM/SfM: detect revisits to correct accumulated drift ([[SUN3D|SUN3DSfM]], [[Fine-To-Coarse Global Registration of RGB-D Scans]]).
> - **Image pair selection** for large-scale SfM: match only the top-$k$ retrieved images instead of all $O(N^2)$ pairs.
> - **Relocalization**: recover the pose after tracking loss (the kidnapped robot problem), or localize in GPS-denied environments.
> - **Coarse-to-fine visual localization**: VPR picks candidate images, then local matching + PnP gives the 6-DoF pose.
> - **Map merging**: link sessions recorded at different times into one map.

> [!summary] Related Topics
> 
> - **Aggregation**: [[SALAD]], [[BoQ]]
> - **Backbones / Foundation Models**: [[DINO]], [[CLIP]], [[ViT]], [[VGGT]], [[CoMe|Co-Me]]
> - **Loop closure & global registration**: [[SUN3D|SUN3DSfM]], [[Fine-To-Coarse Global Registration of RGB-D Scans]], [[Halber PhD|Pipeline for Indoor Scene Reconstruction and Understanding]], [[Manhattan Frame]]
> - **Background**: [[RPCN 6|SLAM]], [[RPCN 15|Bundle Adjustment]], [[ai for robotics 5|Deep Feature Matching]]

