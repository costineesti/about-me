---
title: Fine-To-Coarse Global Registration of RGB-D Scans
draft: false
tags:
date: 2026-11-19
---

[paper](https://openaccess.thecvf.com/content_cvpr_2017/papers/Halber_Fine-To-Coarse_Global_Registration_CVPR_2017_paper.pdf)

From 2017. This paper aims at RGB-D scanning of indoor environments.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fine1.png" style="max-width: 50%; height: auto;">
</div>

>[!summary] Summary of the method
>It's a global registration algorithm that refines an initial set of camera poses by iteratively detecting and enforcing geometric constraints within gradually growing subsets of the trajectory.
>
>In other words, registering long RGB-D sequences (hand-held camera, $10^4+$ frames, multi-rooms) into one globally consistent 3D model. Standard pipelines (frame-to-frame tracking + loop closure) drifts and fails on large scenes, producing warped/overlapping rooms.

During each iteration, closest point and geometric constraints (parallelism, perpendicularity, etc.) are detected and enforced only within “windows” of neighboring RGB-D frames. The windows start small and increase in time (doubles every iteration).

* it enables detection of longer-range correspondences and large-scale geometric structures, leveraging the improved trajectory provided by previous iterations.
* continues until a single window includes the entire scan and a global refinement can be done robustly

>[!note] Intuition
>you can't detect a long-range constraint (e.g. far-apart parallel walls) correctly until the geometry leading up to it is already roughly right. The growing window lets the correctness propagate.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fine2.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Would VPR be a good application for detecting the loop closures in this case, I wonder
>
>Xiao et al.’s Sun3DSfm apparently did this already. Give them a read. Also global BA.
>
>The paper explicitly notes it _fails_ on their corridor sequence due to repetitive/self-similar geometry -- which is the key risk to be aware of.

I see they do not initialize the algorithm in any way. They simply rely on the E-M strategy to provide good results. Actually, in the preprocessing step it explains what they do -- but it's pretty much what I said.

* **E-step**: detecting a set of viable constraints
* **M-step**: continuously solving for the camera poses that best satisfy the constraints

>[!danger] They assume planar structure relationships (parallelism, orthogonality) $\Rightarrow$ it won't work on round walls.
>Pretty standard in the NL for example. They use old buildings which have rounds walls and so this method simply cannot be applied on those cases.
>
>**GlobFit** (Li et al.) fits and relates multiple primitive types (planes, cylinders, spheres) rather than assuming everything is a plane.

They do feature correspondence between the closest compatible features (like in [[ICP]]). 

# Algorithm

* Let $I[k]$ be a RGB-D image from a set of $n$ images
* Let $T[k]$ represent the position and orientation of the camera for $I[k]$
* Let $F$ be the features from all images in $I$
* Let $B$ be the base planar regions from all images in $I$
* Let $P_i$ be the coplanar base planar regions for a iteration $i$
* Let $L$ be the set of local, pairwise alignment transformations
* Let $C_i$ be the feature correspondence constraints for a iteration $i$
* Let $S_i$ be the structural model constraints $S_i$ for a iteration $i$
* Let $H_i$ and $G_i$ be the geometrical constraints

Extract $F$ and $B$. Then estimate $L$ and concatenate these local transformations to form an initial guess for global transformations $T_0$. In each iteration $i$, they refine $T_i$ by first detecting both $C_i$ and $S_i$ based on detected clusters of $P_i$ and $H_i$ and $G_i$ between them. Then optimize the global transformations for the next iteration $T_{i+1}$ by minimizing an error function encoding penalties for the detected constraints. Then finish by doubling the size of the window for next iteration, $l_{i+1} = 2l_i$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fine3.png" style="max-width: 50%; height: auto;">
</div>

**Preprocessing**

For **feature detection** they found planar patches and linear edges along creases and contours in depth images to be more robust. 

* per pixel, every $5^{th}$ frame

Once $F$ is created, define a feature from image $I[k]$ at iteration $i$ as $F_i[k][j] = \{T_i[k](p_j), T_i[k](\vec{n}_j), T_i[k](\vec{d}_j)\}$ where $p_j$, $\vec{n}_j$ and $\vec{d}_j$ respectively denote the feature's position, normal (for planar patches) and direction (for linear edges) in the camera space.

To create $B$, they used aglomerative hierarchical clustering, where clusters of nearly co-planar features are repeatedly merged based on the compatibilities of their positions and normals. Once $B$ is created, define a proxy from image $I[k]$ at iteration $i$ as $B_i[k][j] = \{T_i[k](p_j), T_i[k](\vec{n}_j)\}$ where $p_j$ is the centroid of inlier features, and $\vec{n}_j$ is the fitted normal.

To estimate $L$, the goal is to create local alignment transformations that can be used later in the optimization to preserve the local shape of the estimated camera trajectory. Apparently they detect [[ai for robotics 3|SIFT]] features in consecutive images, prune out ones without valid (missing or high) depth values, and then use [[laser scanning 14|RANSAC]] on backprojected [[ai for robotics 3|SIFT]] keypoints to search for the rigid transformations $L[k]$ aligning as many of these keypoints as possible.

* Then, the initial camera-to-world transformations $T_0$ is extracted by simply concatenating the estimated local transformations $L(T_0[0]=I_{4 \times 4}; T_0[k]=L[k-1]T_0[k-1]; k \in [1,n])$.
	* These are locally accurate, not globally consistent.

**Fine-to-Coarse Refinement**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fine4.png" style="max-width: 50%; height: auto;">
</div>

They model the **co-planarity constraints** by clustering the transformed base proxies $B_i$ into representative cluster proxies $P_i[j] = \{p_j, \vec{n}_j\}$.

* this is the actual *wall* in the Figure above, i.e. the green bars.

Then two constraints types in $H_i$ (no geometry yet, only bookkeeping):

1. **feature-to-proxy**: each tiny raw feature must lie on its base proxy’s plane (basic “this point belongs to this small patch” check)
2. **proxy-to-proxy**: each base proxy (from one frame) must lie on its cluster proxy’s plane (the “this frame’s patch is part of the big wall” check).

**Intuition**: early on, frames aren’t well aligned yet, so you can only trust _small, local_ groupings (base proxies within one frame). As iterations progress and frames get better aligned, base proxies from far-apart frames start agreeing well enough to be merged into one big cluster proxy -- which is why, in the Figure above, the green bars only become full-length walls in **late**iterations; early on they’d just be disconnected small patches.

**Creating Geometrical Relationship Constraints**

For every pair of cluster proxies $\{P_i[a], P_i[b]\}$ that are close enough along the trajectory (within $2l_i$), they look at the angle between their two normals:

* $\theta \approx 0 \rightarrow$ parallel 
* $\theta \approx 90 \rightarrow$ orthogonal
* $\theta \approx 180 \rightarrow$ antiparallel

>[!tip] Key trick
>It's a soft weighting, not a hard labeling
>
>each relationship gets a weight (via a Gaussian centered on the ideal angle, e.g. $\exp(-\theta^2 / 2 \sigma^2$) for parallel), not a binary *yes/no*.
>
>So:
>
>* Two walls already very close to perpendicular get a **high** orthogonality weight $\rightarrow$ the optimizer pulls them strongly toward exactly $90^\circ$
>* Two walls at a weird in-between angle (e.g. $70^\circ$) get a **low** weight for every relationship type $\rightarrow$ barely influence the optimization at all

**Creating Feature Correspondence Constraints** $C_i$

For every pair of frames within the same sliding window, it looks for **closest compatible features** between them -- same idea as [[ICP]]’s nearest-point matching, but restricted to features of the same type (a planar feature only matches another planar feature, an edge only matches an edge) and within a distance/angle tolerance.

The tolerance isn’t fixed -- it depends on how far apart the two frames are _along the trajectory_:

- **Far-apart frames** (first time they’re considered, at `0.5·l_i` distance) $\rightarrow$ loose thresholds ($0.5m, 30^\circ$), since their relative alignment is still rough.
- **Adjacent/close frames** $\rightarrow$ tight thresholds ($0.2m, 20^\circ$), since by now they should already be well-aligned from earlier iterations.

**Intuition**: So the algorithm trusts close frames to be nearly correct, and is more forgiving of error for distant frames it’s only just starting to relate

**Subsampling:** since this could generate a huge number of matches, they cap the total correspondence count at `50n` ($n$ = number of frames) for performance.

# Optimization

The total error function is a weighted sum of terms penalizing each their own aspect:

| Term  | Penalizes                                                                                  | Comes from                                                   |
| ----- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `E_H` | features/proxies not lying flat on their parent plane                                      | coplanarity constraints                                      |
| `E_G` | proxy pairs deviating from their parallel/orthogonal/antiparallel relationship             | geometric relationship constraints                           |
| `E_C` | matched point pairs not landing in the same 3D location                                    | feature correspondences                                      |
| `E_L` | the pose of a frame drifting too far from its originally-estimated local alignment ($T_0$) | preprocessing step                                           |
| `E_I` | poses changing too much between consecutive iterations                                     | pure regularization, keeps the solve stable/well-constrained |

>[!summary] Summary
>each iteration solves one combined least-squares problem that simultaneously keeps points flush with their planes, keeps wall-pairs at the right relative angle, keeps matched points together, and keeps the solution close to what was already known -- then repeats at double the scale.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fine5.png" style="max-width: 50%; height: auto;">
</div>

