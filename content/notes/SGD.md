---
title: Stochastic Gradient Descent (SGD)
draft: false
tags:
date: 2026-10-16
---

Stochastic Gradient Descent samples the gradient. See [very useful implementation](https://github.com/ilguyi/optimizers.numpy).

>[!summary] SGD
>
>* SGD randomly selects a subset of training data
>* Gradient depends only on selected subset
>
>Helps avoid getting stuck in local minimum.

**Learn in Batches: batch vs mini-batch optimization**

>[!summary] Batch
>
> The entire dataset is used to compute the gradient and update the model’s parameters in one single iteration.
> 
> 1. Can be slower due to the need to process the entire dataset at once
> 2. Requires more memory since all data must be loaded simultaneously.
> 3. Tends to converge smoothly but may get stuck in local minima.

>[!summary] Mini-Batch
>
>Divides the dataset into smaller subsets called mini-batches. The model’s parameters are updated after processing each mini-batch.
>
>1. Faster training as it allows for more frequent updates.
>2. More efficient memory usage since only a portion of the data is processed at a time.
>3. Often leads to better generalization due to the noise introduced by using subsets of data, which can help escape local minima.

**Problems with vanilla SGD**

1. **Poor conditioning** — when the loss changes quickly along one direction and slowly along another (high-condition-number Hessian), SGD jitters along the steep axis and crawls along the shallow one.
2. **Local minima and saddle points** — at saddle points the gradient is zero, so vanilla SGD stalls. Saddle points are _much more common than local minima in high dimensions_ — a critical point in $\mathbb{R}^d$ is a local min only if all $d$ Hessian eigenvalues have the same sign, which is exponentially unlikely. (Dauphin et al. 2014)
3. **Noisy gradients** — minibatches give a stochastic estimate of the true gradient. Trajectories meander even on convex losses.

All three are addressed by adding **velocity** (momentum) and/or **per-parameter learning rates** (RMSProp, Adam)
