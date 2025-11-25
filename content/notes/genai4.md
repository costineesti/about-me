---
title: Flow Matching
draft: false
tags:
date: 2025-11-25
---
 
Lecture from the [[genai|GenAI Models and Robotic Applications]]. Related to [[genai3|Normalizing Flows]].

Generative Models $\in$ Flow Matching $\in$ Diffusion

# Velocity Fields and Continuous Normalizing Flows (CNF)

In NF, we had $\mathbf{x} = f(z)$ and $\mathbf{x} = f_K \circ f_{K-1} \circ ... \circ f_1(z)$. The transformations are independent.

Deblai: base probability density (to sample from)
Remblai: target probability density (images, videos).

### Time-Dependent Velocity Field

We have a trajectory from the noise to a realistic outpput $\phi_0(\mathbf{x}) = \mathbf{x}_0$ .... 

We can now consider the rate of displacement in time with help of derivatives.

The velocity is essentially a model that is given a input, parameter and timestep, it's able to approximate the velocity with a neural network.

We have a ordinary differential equation (ODE). 

>[!question] Which velocity fields are relevant?

How do we know that on the diagonal of the Jacobi we have the correspondent matches? Do we? I read that no. I think it helps us reduce from O(n^2) to O(n) by taking the trace.


# (Conditional) Flow Matching (CFM)

Most of them have CLIP as the condition(the label). They use the Euler approximation which gives those cartoonish effects in most generative models' output. So it's basically always sampling to an enormous database (400 million).

cfm training: x1 is the image in the database. x0 is the noise sample. c is the constraint from CLIP (text).

cfm inference: find a image in the database based on the constraint (c = labels(i)). It's x_t in the function on the slide conditional_flow_matching_iter().

reminder: velocity is the rate of change between random noise and the image from the database. 

# Diffusion

We are filtering out the noise.

# Mean Flow

e = noise
x = actual data

The bigger the step, much farther away we are from the actual image. I want to not be constrained by where I am. I want to start at *r* and stop at *t*. I'll take the average velocity accumulated. $\tau = t-r$ is the new timestep. It works best for bigger steps.

The loss function is as in FM, but they take the mean velocity. Understand the highlighted part from the paper (t=r). You mix the mean flow and the normal flow (In some steps you do one, in some you do the other).