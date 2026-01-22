---
title: NeRF - Neural Radiance Fiels
draft: false
tags:
date: 2026-01-22
---

Original [paper](https://arxiv.org/abs/2003.08934). How [NVIDIA](https://developer.nvidia.com/blog/getting-started-with-nvidia-instant-nerfs/) does it. Notes taken from the [[twente|UTwente]] slides.

Learn [ray-tracing](https://pbr-book.org/3ed-2018/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm). Like actually; this is the core of this method. I can definitely see it applied in gaming. fucking mega. [Ray-Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html).

[PyTorch Implementation](https://papers-100-lines.medium.com/neural-radiance-fields-nerf-tutorial-in-100-lines-of-pytorch-code-365ef2a1013). [Official Implementation Github](https://github.com/bmild/nerf).

[Explanatory Video from Google (MIT) -- the actual authors themselves. Fucking mega.](https://www.youtube.com/watch?v=HfJpQCBTqZs).

The concept itself sounds awesome. Let's see how it looks on paper. Also, Steven pointed out how this must have been a catalyst of all the fly-through videos we see today.

>[!summary] NERF
>* Generating rays from camera poses
>* Using an MLP to predict color and density for each point in space
>* Rendering novel views of a scene with differentiable volumetric rendering
>* **Apply** NeRF techniques for 3D reconstruction tasks.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/nerf2.png" style="max-width: 100%; height: auto;"> </div>
>

**Rendering**

>[!quote] Rendering is the process of generating a photorealistic or non-photorealistic image from input data such as 3D models
>* **Forward rendering** means taking a scene defined with geometry, materials, cameras, and lights, and generating an image.
>* **Inverse rendering** starts from the rendered image, compares it to some form of ground truth image, and updates the parameters of the scene elements with the loss that compares the images.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/nerf1.png" style="max-width: 100%; height: auto;"> </div>
>

# Volumetric Rendering

### Radiance

Radiance is some amount of light (differential energy) that you can see per unit area, with a solid angle and wavelength $L(\mathbf{x}, \mathbf{w}, \lambda)$.

* $(\mathbf{x}, \mathbf{w}, \lambda) \rightarrow$ (position, direction, wavelength)

Radiance along an unblocked ray is constant (energy conservation). The “Light Field” is the radiance for every possible ray. I still don't understand what this all means..

**Novel View Synthesis**:

Input of NeRF is 5D data

- input is a single continuous **5D** coordinate 
	- **spatial location** $\begin{pmatrix}x,y,z\end{pmatrix}$ 
	- and **viewing direction** ($\theta$, $\phi$)
	- We can **omit** the **wavelength** in the inputs. We only need 5 parameters.
- output is the volume density and view-dependent emitted radiance at that spatial location.
	- **Volume density** represents how much "stuff" is at a specific 3D point ($x,y,z$). If the density is high, the point is likely part of a solid object; if it is zero, the point is empty space.
	- **Radiance** is simply the color and brightness of the light emitted from a specific point ($x,y,z$) in a specific direction ($\theta,\phi$).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/nerf3.png" style="max-width: 100%; height: auto;">
</div> 

Now that we have the color and density (r,g,b,$\sigma$), we calculate the color of every camera ray using:

$$C(\mathbf{r}) = \int_{t_n}^{t_f} T(t)\sigma(\mathbf{r}(t))\mathbf{c}(\mathbf{r}(t))dt \text{, where}$$

$$
T(t) = \exp\left(-\int_{t_n}^{t} \sigma(\mathbf{r}(s))ds\right) \text{, i.e. probability that the ray didn’t hit any particles earlier in} [0,t]
$$

**explaining the integral**: as a camera ray travels through the "cloud", it collects **color** (**c**) from every point. However, that color is weighted by the **density** ($\sigma$) at that spot and the **transmittance** (T). 

* Transmittance is essentially "how much light can still reach the camera from this point without being blocked by objects in front of it". If the ray hits a high-density wall, the transmittance for anything behind that wall drops to zero.
	* No hits before $t$ is equal to integral over density up until $t$.
* Volumetric Density $\sigma(t)dt$ is the probability that the ray stops in a small interval around $t$.
* If a ray traveling through the scene hits a particle at $t$, we return this radiance/color $c(t)$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/cloud1.png" alt="cloud1" width="350" height="300"> </div> <div> <img src="../static/notes/cloud2.png" alt="cloud2" width="350" height="300"> </div> </div>

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/cloud3.png" alt="cloud3" width="350" height="300"> </div> <div> <img src="../static/notes/cloud4.png" alt="cloud4" width="350" height="300"> </div> </div>

**Absorption** = something that doesn't let light get through

**Scattering** = like a glass that splits the light in different direction

**Emission** = Something related to energy that produces light?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/nerf4.png" style="max-width: 100%; height: auto;">
</div> 

# Volumetric Formulation for NeRF

$T'(t) = T(t) \cdot \sigma(t)$ is the probability density function (PDF) that represents the probability that **a ray stops** at $t$.

Expected color along a ray is a convex combination of colors $C = \int_0^\infty T(t) \cdot \sigma(t) \cdot c(t) dt$. By now I should be able to understand what each of those terms represent. 

To implement NeRF in practice, we can't solve an infinite integral on a computer. Instead, we **discretize** the ray into $N$ segments to numerically estimate the accumulated color.

$$
\hat{C}(\mathbf{r}) = \sum_{i=1}^{n} T_i \alpha_i \mathbf{c}_i \text{ the weights ensure that points hidden behind solid objects do not contribute}
$$

$$
\text{where } T_i = \prod_{j=1}^{i-1} (1 - \alpha_j) \text{ i.e. how much "energy" the ray has left}
$$

$$
\text{and } \alpha_i = 1 - \exp(-\sigma_i \delta_i) \text{ i.e. probability that a ray stops within a specific segment i}
$$

>[!note] Computing the color for a set of rays through the pixels of an image yields a rendered image.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/nerf5.png" style="max-width: 100%; height: auto;">
</div> 

# Neural Networks as representations

Basically, slap a coordinate-based MLP to give us the (r,g,b) for each ($x,y$). Instead of saving colors in a grid, you train a neural network to behave like a lookup table: you give it a coordinate, and it "remembers" the color and density at that spot.

>[!quote] The Spectral Bias Problem
> A standard neural network has a natural "Spectral Bias," which means it is biased toward learning smooth, low-frequency functions first. When you try to train a basic MLP to represent an image or a 3D scene directly from raw coordinates (x,y,z), the results are always blurry. The network can easily learn the general "blobs" of color but struggles to learn sharp edges, fine textures, or small details. This is why the "Naive Approach" fails
> 
> <div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/nerf6.png" style="max-width: 100%; height: auto;"> </div>
> 
> <div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/nerf7.png" style="max-width: 100%; height: auto;"> </div>
> 

The solution in this case is to make use of the positional encoding concept from [[transformers]](the sin and cos functions with exponentially increasing frequencies) to map the low-dimensional input coordinates into a much higher-dimensional space before they enter the network. The lower frequencies ($\sin(\pi v)$) help the network understand the overall shape, while the higher frequencies ($\sin(2L − 1 \pi v)$) provide the "hooks" necessary for the network to anchor sharp details and complex textures. This is such a nice application of this concept..

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/nerf8.png" style="max-width: 100%; height: auto;">
</div> 

>[!note] Up until now, NeRF = volume rendering + coordinate-based network

>[!note] Including the ray direction in the input to the MLP allows for capturing and rendering view-dependent effects (e.g., shiny surfaces)

So we're going to store the values along the ray, and put it all together. The loss function is your classical MSE.

Safe to say that when I'm using lots of pictures; I don't really master the concept. But this concept is so vast and includes so many terms like SfM, ray tracing, ray marching, etc. It's very advanced stuff.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/nerf9.png" alt="9" width="350" height="300"> </div> <div> <img src="../static/notes/nerf10.png" alt="10" width="350" height="300"> </div> </div>

>[!summary] A quick summary of NN representations in NeRF. From Gemini.
>
>1. **Ray Sampling:** For every pixel in a target image, a camera ray is cast into the scene.
>2. **Point Evaluation:** Multiple points along that ray are sampled. Each 3D point ($x,y,z$) and the viewing direction ($\theta$, $\phi$) are passed through the **Positional Encoding** and then the **MLP**.
>3. **Output Generation:** The MLP outputs the color ($c$) and density ($\sigma$) for each point.
>4. **Volume Rendering:** These values are integrated along the ray to calculate the final pixel color.
>5. **Loss Calculation:** The rendered color is compared against the **ground truth** using a squared error loss.
>6. **Optimization:** The network uses **gradient descent** to update its weights until it can accurately reproduce the scene from any of the input camera views.

# Notes from class

**Structure from Motion(SfM)**: SfM aims to reconstruct the 3D structure of a scene and the camera’s motion from a sequence of images. This is how they do the motion prediction.

The mathematics is not at the exam

