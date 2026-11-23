---
title: Hierarchical LiDAR Bundle Adjustment (HBA)
draft: false
tags:
date: 2026-11-23
---

[paper](https://ieeexplore.ieee.org/abstract/document/10024300), [code](https://github.com/hku-mars/HBA)

From 2023. This paper aims at making large-scale LiDAR maps **globally consistent** after odometry/SLAM.

>[!summary] HBA
>[[ai for robotics 3|Pose Graph Optimization (PGO)]] is fast, but it only optimizes poses, not the map consistency itself. After PGO the point cloud can still look "thick" or doubled (divergence). LiDAR [[RPCN 15|BA]] fixes this by directly optimizing the consistency of the map, but it is too expensive on large maps.
>
>* PGO minimizes the relative pose errors between two LiDAR frames. The relative pose estimation is assumed to follow Gaussian Distribution.
>
>HBA splits the huge BA problem into many hierarchical small BA problems arranged in a **pyramid** (bottom-up), then uses PGO (top-down) to propagate the result smoothly to every LiDAR pose.
>
>* With the hierarchical design, they solve multiple BA problems with a much smaller Hessian matrix size.
>* With the PGO, they smoothly and efficiently update the LiDAR poses.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/HBA1.png" style="max-width: 50%; height: auto;"> </div>

> One issue in the bottom-up process is that it neglects features co-visible across different local windows, which could lower the accuracy. To mitigate this issue, the top-down process constructs a pose graph from the top to the bottom layers and distributes the errors by pose graph optimization. The two process iterates until convergence.
> 
> * Since I'm working with many consecutive frames (which overlap heavily), I could account for that.

>[!question] Is it only a different approach to classic BA? But faster?
>
>Mostly yes, but it's an approximation of full LiDAR BA, not a new objective. Both minimise the same thing: point-to-plane consistency, with the planes solved in closed form. On MulRan DCC, HBA reaches the same RMSE as full BA in about 1/14 of the time (206 s vs 2897 s)

>[!note] Intuition
>Same concept as [[Fine-To-Coarse Global Registration of RGB-D Scans|fine-to-coarse]]: first make small chunks of the trajectory locally consistent, then treat each chunk as one rigid unit and align the chunks against each other.

>[!question] My thoughts
>* Relevance for my thesis (camera + LiDAR pipeline): I only get the RGB frame, and its depth image along with the confidence levels. The LiDAR is only in the FOV of the camera, which can be lower than half of usual LiDARs
>	* HBA's input matches this structure. They used $V=1m$ for a $14 \times 16 \times 8m$ factory. A room-scale floor with $5m$ depth range probably needs $\leq 1m$. 
>	* **Narrow FOV means degenerate windows**: Sliding along a wall and rotating about its normal are unobservable, so the window's Hessian is rank-defficient. My pipeline would avoid this with ARKit's trajectory prior. HBA misses this -- they only mention it as future work.
>* Would the relative transformation between two frames that's estimated by [[ICP]] already account for the PGO?
>	* No. ICP only feeds PGO. ICP(or local BA) produces the edges. PGO is the global solve that reconciles all edges, including loop edges that disagree with the odometry.
>* Can it run on indoor scans with few frames?
>	* With few frames, the hierarchy stops paying off. For small $N$, it can drop to plain BA or one local layer. Since I scan at 30-60 $Hz \Rightarrow$ thousands of frames, so probably in HBA's regime. 

# Algorithm

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA2.png" style="max-width: 100%; height: auto;">
</div>

**Input**: point cloud of each LiDAR scan + initial pose of each scan (e.g. from LiDAR odometry).

**Bottom-up: hierarchical local BA**

* Layer $0$ holds all the LiDAR scans.
* Split the scans into **overlapping windows** (window size $w=10$, stride $s=5$). Stride $<$ window keeps an overlap, so adjacent keyframes stay smooth.
* Run a local LiDAR BA inside each window ([[#LiDAR BA (BALM)]]) $\Rightarrow$ locally consistent poses.
* Merge the scans of a window into one **keyframe**, expressed in the frame of the first scan. Only the **plane-feature points** are kept: points that are not planar in a lower layer won't form a plane in an upper layer either.
* The keyframe pose is the optimized pose of the first scan of its window.
* The keyframes become the "scans" of the next layer. Repeat until the optimal layer number $l^*$ ($3$ for $N < 5\times10^3$ scans, $4$ above).

**Top layer: global BA**

* At the top there are few enough keyframes to run one [[RPCN 15|BA]] over all of them.

**Cost model**

$$
T_l = \frac{w^3}{n}\sum_{i=1}^{l-1}\frac{N}{s^i} + \left(\frac{N}{s^{l-1}}\right)^3
$$

Local BAs are cheap and parallel, only the top layer pays the cubic cost. Setting $\partial T_l / \partial l = 0$ gives the optimal $l^*$.

**Top-down: pose graph optimization**

* Why: local BA only sees features co-visible **inside** one window, it ignores features observed across different windows. The pose graph distributes these errors.
* Build one factor graph over the bottom-layer poses, with relative-pose factors coming from every layer.
* Each factor is weighted by an information matrix derived from the **Hessian** of the BA that produced it, so confident BA results pull harder.

For two consecutive nodes $T_j^i, T_{j+1}^i$ in layer $i$, with $T^{i*}_{j,j+1}$ the relative pose estimated by BA:

$$
e^i_{j,j+1} = \text{Log}\left( {T^{i*}_{j,j+1}}^{-1} \, {T^i_j}^{-1} T^i_{j+1} \right)^\vee
\qquad
c = {e^i_{j,j+1}}^T \, \Omega^i_{j,j+1} \, e^i_{j,j+1}
$$

Since a node in layer $i$ is exactly the first scan of its window in layer $i-1$, every factor can be written directly on bottom-layer poses $\Rightarrow$ one graph, solved with Levenberg-Marquardt (GTSAM).

Bottom-up and top-down **iterate until convergence**. The released code does one pass, you re-launch it for more.

>[!note] Ablations
>* **Direct assign** (copy the optimized upper-layer poses onto the lower layer instead of PGO): worse ATE and visible seams, since it ignores the relative constraints from overlapping windows.
>* **Reduced BA** (keep only the block-diagonal of the full Hessian): slower *and* less accurate than both original BA and HBA, the inaccurate Hessian slows convergence.

# LiDAR BA (BALM)

HBA builds on BALM / BALM2 from the same lab ([Efficient and Consistent Bundle Adjustment on Lidar Point Clouds](https://arxiv.org/abs/2209.08854)).

* The space is cut into voxels of size $V$. A voxel is recursively split (octree) until its points form a plane, i.e. $\frac{\lambda_3}{\lambda_1} < \theta$ (min/max eigenvalue ratio of the point covariance). This is **adaptive voxelization**.
* Paper settings: $\theta_{local}=0.05$ (strict), $\theta_{global}=0.1$ (loose), $V=4\text{m}$. Indoor factory: $V=1\text{m}$, park: $V=2\text{m}$.
* For a plane, the cost is the mean squared point-to-plane distance. The plane parameters can be solved in closed form, so they drop out of the optimization:

$$
\min_{\mathbf{n}, \mathbf{q}} \frac{1}{N}\sum_{k=1}^{N} \left(\mathbf{n}^T(\mathbf{p}_k - \mathbf{q})\right)^2 = \lambda_{\min}(\mathbf{A}),
\qquad
\mathbf{A} = \frac{1}{N}\sum_{k=1}^{N}(\mathbf{p}_k - \bar{\mathbf{p}})(\mathbf{p}_k - \bar{\mathbf{p}})^T
$$

* $\Rightarrow$ the only unknowns are the poses. Cost is the smallest eigenvalue of each plane's covariance.
* **Point cluster**: all points of a plane are summarized by $\left(\sum \mathbf{p}\mathbf{p}^T, \sum \mathbf{p}, N\right)$, so the solver never iterates over individual points.

>[!danger] Assumption: planes
>Same assumption as [[Fine-To-Coarse Global Registration of RGB-D Scans|fine-to-coarse]], features are planar voxels. Still, the paper shows improvements in unstructured scenes too (MulRan woods, a park), since small adaptive voxels find local planes almost everywhere.

# Results

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA3.png" style="max-width: 100%; height: auto;">
</div>

It associates by voxel (4 m outdoors, 1 m indoors, refined adaptively) rather than by nearest neighbour within 0.2 m and 0.25 rad. Drift of a few tens of centimetres can still fall into a shared voxel.

It closed the loops on KITTI from MULLS without loop closure, and it removed LIO-SAM's altitude divergence on MulRan DCC03. That covers smooth, accumulated drift.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA4.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA5.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA6.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HBA7.png" style="max-width: 100%; height: auto;">
</div>
