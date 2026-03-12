---
title: Point Cloud Classification
draft: false
tags:
date: 2026-03-12
---
 
What kind of label could we have? 

* stop sign
* person
* wall
* buildings, etc

Could M be just a matrix with size $N \times 7$, where $N$ is the number of points?

> No, cuz the matrix encoding discards ... see the slides

How to include all the dimensions in the analysis? Apparently Deep Learning

So we are looking for a function $M$ that outputs the class for point $p_i \in P$. Typically, it also depends on its neighborhood $N(p_i)$ => $M(p_i, N(i)) = class$. How do I select the neighborhood? See the slides or research. I think I can do it with kNN.

# Turning features into classes

Through affine transformations (linear). $y_1 = A_1x + b_1$, $y_2 = A_2x + b_2$, ...

**But linearity fails on non-linearity separable data.** So we can just use $ReLU(x) = \max(0,x)$. I know from [[pointnet|PointNet]] that the $\max$ function is symmetrical. It's important to keep the invariant property.

You can stack ReLU functions to create a really complex approx function. Insert the slide with the triangle. Apparently, it's a norm?

# How to sample the neighborhood of a point?

Computational Efficiency is still a problem. The neighborhood selection can be done with the ball query idea from [[pointnet|PointNet]]. What's the fastest way to downsample down to K points? Apparently it'a combination of random sampling and attention mechanism. See "RandLA-Net: Efficient semantic segmentation of large-scale point clouds".

There's a drawback. What if you have 90\% of ground in your point cloud? That's what the attentive pooling is solving.

**Receptive Field**: all the data that was used to compute the features aggregations. With each layer, the receptive field grows. Research this concept more :)

# READ THAT PAPER! Results are quite insane

Current models are only based on transformers.

See the possible exam questions.