---
title: Iterative Closest Point (ICP)
draft: false
tags:
date: 2025-12-09
---

From **Indoor 3D: Overview on Scanning** **and Reconstruction Methods**, chapter 3.5.2.

Process

1. Take two scans of 2D/3D point cloud
2. Compute the center of mass and shift the point clouds on top of each other

We want to find the transformation *(R,t)* between model set $\hat M$ and data set $\hat D$. The problem is cast as a least squares minimization problem, so that we want to minimize the cost function

$$
\min E(R,t) = \frac{1}{N} \sum_{i=1}^N \mid m_i - (R d_i + t) \mid^2
$$

where for each point $m_i \in M \subset \hat M$ there is a closest point $d_i \in D \subset \hat D$.

Computation of the closest point is the most computationally expensive step in ICP. Therefore, we don't loop over all points in d to find a closest point for $m_i O(n^2)$, but we search with **optimized k-trees**, $O(N \log(N))$.

**Normalize w.r.t. the center of mass of each point cloud**:

$$
c_m = \frac{1}{N} \sum_{i=1}^N m_i
$$

$$
c_d = \frac{1}{N} \sum_{i=1}^N d_i
$$

Then we can rewrite the cost function as:

$$
\min E(R,t) = \frac{1}{N} \sum_{i=1}^N \mid m'_i - R d'_i - (t-c_m + R c_d) \mid^2
$$

where

* $m_i = m'_i - c_m$
* $d_i = d'_i - c_d$
* we denote $\tilde t = t-c_m + R c_d$

After we rearrange the terms, we get

$$
\min E(R,t) = \frac{1}{N}\sum_{i=1}^{N}|m'_i - Rd'_i|^2 - 2\frac{1}{N}\tilde{t} \cdot \sum_{i=1}^{N}(m'_i - Rd'_i) + \frac{1}{N}\sum_{i=1}^{N}\tilde{t}^2
$$

where we divided the rotation and translation!

* We want to minimize this: $\frac{1}{N}\sum_{i=1}^{N}|m'_i - Rd'_i|^2$
* The second term $2\frac{1}{N}\tilde{t} \cdot \sum_{i=1}^{N}(m'_i - Rd'_i) = 0$ since all values refer to centroid.
* The third term $\frac{1}{N}\sum_{i=1}^{N}\tilde{t}^2$ has its minimum when $\tilde t = 0$ or $t = c_m - R c_d$

Therefore, the algorithm needs to only minimize the first term, i.e.

$$
\min E(R,t) \sim \frac{1}{N}\sum_{i=1}^{N}|m'_i - Rd'_i|^2
$$

The optimal solution is calculated by matrix factorization, $R = VU^T$ using [[Singular Value Decomposition|SVD (Singular Value Decomposition)]].

We consider the $3 \times 3$ cross correlation matrix $\mathbf{H} = \mathbf{U}\mathbf{\Lambda}\mathbf{V}^T$

$$
\mathbf{H} = \sum_{i=1}^{N}\mathbf{m}_i'^T\mathbf{d}_i' = \begin{pmatrix} S_{xx} & S_{xy} & S_{xz} \\ S_{yx} & S_{yy} & S_{yz} \\ S_{zx} & S_{zy} & S_{zz} \end{pmatrix}
$$

where 

* $S_{xx} = \sum_{i=1}^{N} m'_{x,i}d'_{x,i}$, 
* $S_{xy} = \sum_{i=1}^{N} m'_{x,i}d'_{y,i}$, 
* $S_{xz} = \sum_{i=1}^{N} m'_{x,i}d'_{z,i},$
* $\dots$

contain the information of the 3D points in a stacked form




