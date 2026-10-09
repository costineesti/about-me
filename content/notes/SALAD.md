---
title: Sinkhorn Algorithm for Locally Aggregated Descriptors (SALAD)
draft: false
tags:
date: 2026-10-09
---

In the context of VPR, we want to match a query image against references from an extensive database, relying solely on visual cues. State-of-the-art pipelines focus on the aggregation of features extracted from a deep backbone, in order to form a global descriptor for each image.

>[!summary] SALAD
>It's a feature aggregation module. 
>
>They consider both feature-to-cluster and cluster-to-feature relations and introduce a '**dustbin**' cluster, designed to selectively discard features deemed non-informative.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/salad1.png" style="max-width: 100%; height: auto;"> </div>

> For my application regarding VPR, it could act as a filter against partial correspondences and task-irrelevant background regions (sky).

Since DINOv2 and [[VGGT]] both use $14\text{px}$ patch size, the confidence maps would align 1:1. The distribution will differ massively, however, since [[VGGT]]'s features encode structural constraints and spatial relationships rather than semantic meaning (DINO). However, I expect the resulting confidence maps to highlight structural correspondences rather than semantic objects.

[[CLIP]] ViT-B/16 uses $16\text{px}$ patches, so I would have to interpolate.

What I want is the optimal transport side of it. I don't care about the fine-tuned DINOv2 backbone.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/salad2.png" style="max-width: 100%; height: auto;">
</div>

**Reduce assignment priors**

In NetVLAD, a global descriptor is formed by assigning a set of features to a set of clusters $\{C_1, \dots, C_j, \dots C_m\}$. Then, NetVLAD computes a score matrix $S$ where each element is the cost of assigning a feature $i$ to a cluster $C_j$.

Priorly, $S$ was initialized with centroids derived from k-means. It accelerated training but it introduced bias and made the model more susceptible to local minima. SALAD learns each row $s_i$ from scratch with two fully connected layers initialized randomly:

$$
s_i = W_{s_2} (\sigma (W_{s_1}(t_i)+b_{s_1})) + b_{s_2}
$$

**Discard uninformative features**

Additionally they augment $S$ by adding a column $\bar{s}_{i,m+1}$ representing the feature-to-dustbin relation. This score is modeled with a single learnable parameter $z \in \mathbb{R}$:

$$
\bar{s}_{i,m+1} = z \mathbf{1}_n, \quad \mathbf{1}_n = [1, \dots , 1
]^\top
$$

**Optimal assignment**

NetVLAD computes a per-row softmax over $S$ to obtain the distribution of each feature's mass across the clusters. Since this approach overlooks the custer-to-feature relation, SALAD reformulates it as an optimal transport problem where the features' mass, $\mu = \mathbf{1}_n$, must be effectively distributed among the clusters or the dustbin, $\mathcal{k} = [1_m^\top, n-m]^\top$. 

They use the Sinkhorn Algorithm to obtain the assignment $\bar{P} \in \mathbb{R}^{n \times (m+1)}$ such that:

$$
\bar{\mathbf{P}} \mathbf{1}_{m+1} = \mu \quad \text{ and} \quad \bar{\mathbf{P}}^\top \mathbf{1}_{n} = \mathcal{k}
$$

Finally, they drop the dustbin column to obtain the assignment $\mathbf{P}$.

**Dimensionality reduction**

To manage the final descriptor size, they reduce the dimensionality of the tokens from $\mathbb{R}^d$ to $\mathbb{R}^l$. This is again achieved by processing the features through two fully connected layers which adjust the size of the feature vectors while retaining essential information from the task.

$$
\mathbf{f}_i = W_{f_2} (\sigma (W_{f_1}(t_i)+b_{f_1})) + b_{f_2}
$$

**Aggregation**

Differently from NetVLAD, they do not subtract the centroids to get the residuals, but directly aggregate the features with a summation, reducing the incorporated priors about the aggregation. It results in the following VLAD vector as a matrix $\mathbf{V} \in \mathbb{R}^{m \times l}$. Each element is computed as follows:

$$
V_{j,k} = \sum_{i=1}^n P_{i,k} \cdot f_{i,k}
$$

**Global token**

To include global information about the scene (which is not easily incorporated into local features), they also incorporate a scene descriptor $g$ framed exactly as other two fully connected layers:

$$
\mathbf{g} = W_{g_2} (\sigma (W_{g_1}(t_{n+1})+b_{g_1})) + b_{g_2}
$$

* $t_{n+1}$ is the global token from DINOv2. 

>[!question] What do I use for VGGT for $t_{n+1}$?

In the end they concatenate $\mathbf{g}$ with $\mathbf{V}$ flattened, followed by an L2 intra-normalization and an entire L2 normalization of this vector $=>$ final global descriptor.

