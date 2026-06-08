---
title: Depth Accuracy For Stereo Cameras
draft: false
tags:
date: 2026-01-27
---
 
Information from [[twente|UTwente]], part of my [[RPCN]] course. Most of these concepts are covered in the [[IPCV]] notes.

# Triangulation

We consider 2 cameras:

* with known intrinsics and each measured point defines a ray along which the object has been seen
* we know the orientation of the second camera relative to the first one.
* we observe the same point from both POVs. The line between the two projection centers is called the *Baseline* **B**.

>[!summary] Stereo rectification is the process where two images taken from different perspectives are mathematically warped onto a single common plane so that their image rows align.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/stereo_rect.png" style="max-width: 100%; height: auto;"> </div>

* In a "**standard**" stereo setup, two cameras are placed perfectly side-by-side. Their optical axes are parallel, and their horizontal axes (x-axes) are aligned. Because of this perfect alignment, a point in the real world will appear at the **exact same row** (y-coordinate) in both images.
* But in reality, you won't find this; almost never (with some small exception like room mapping). Once we know how the cameras are oriented relative to each other, we mathematically project both images onto a common virtual plane (the blue plane in the diagram). This virtual plane is parallel to the baseline. After this projection, the "tilted" images are transformed into "normal" images.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/stereo1.png" alt="stereo 1" width="350" height="300"> </div> <div> <img src="../static/notes/stereo2.png" alt="stereo 2" width="350" height="300"> </div> </div>

# Disparity

>[!summary] Assuming a pair of **stereo rectified** images, disparity **D** is the difference between the $x$ coordinates of two corresponding points in the **camera coordinate system** (2D).
>
>$D = x_1 - x_2$
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/disparity_new.png" style="max-width: 100%; height: auto;"> </div>

The depth **Z** increases with a decreasing disparity. The disparity becomes zero for points that are infinitely far away.

$$
Z = \frac{fB}{D}
$$

# Depth Accuracy

The accuracy of the estimated depth depends on the accuracy of the disparity measurement. How? We can look at the partial derivative

$$
D = \frac{Bf}{Z} => \frac{\partial D}{\partial Z} = - \frac{Bf}{Z^2} => \partial Z = - \frac{Z^2}{Bf} \partial D
$$

The above equation shows the effect of a small change in the disparity on the estimated depth. This relation also applies to the propagation of noise in the disparity. If the standard deviation of the disparity measurement is $\sigma_D$, the standard deviation of the depth estimate will be

$$
\sigma_Z = \frac{Z^2}{Bf} \sigma_D
$$

# Exercises

**Task 1**: guess the depth accuracy obtainable with an Arducam stereo camera, assuming a disparity accuracy $\sigma_D$ of 0.2 pixels, baseline **B** of 0.1m and object distance **Z** of 0.5m. 

Camera specs: Pixel size: 1.55 $\mu m$ x 1.55 $\mu m$, Focal length: 6mm.

**Step 1: Calculate focal length in pixels**

$$
f_{px} = \frac{f}{\text{pixel size}} = \frac{6mm}{0.00155mm/pixel} \approx 3871 px
$$

**Step2: Apply the formula from above**

$$
\sigma_Z = \frac{Z^2}{Bf} \sigma_D = \frac{0.5^2}{3871 \cdot 0.1} \cdot 0.2 \approx 0.000129 m = 0.129mm
$$

The depth accuracy with these specific camera specs is approximately 0.13mm at a distance of 0.5m.

**Task 2**: Assume a disparity accuracy $\sigma_D$ of 0.2 pixel. Estimate distance to a distant car where the Baseline **B** is 0.54m and object distance is 50m. Camera specs remain the same.

**Step 1: Same as before -- calculating the** $f_{px}$.

$$
f_{px} = \frac{f}{\text{pixel size}} = \frac{6mm}{0.00155mm/pixel} \approx 3871 px
$$

**Step 2: we use exactly the same formula**

$$
\sigma_Z = \frac{Z^2}{Bf} \sigma_D = \frac{50^2}{3871 \cdot 0.54} \cdot 0.2 \approx 0.239m
$$

So, even though we increased the Baseline, the massive increase in object distance causes the depth accuracy to drop from sub-millimeter precision to nearly 24 cm.

**Task 3**: Consider the depth accuracy equation above and suppose you can choose between two cameras. Both cameras have the same number of pixels and the same field of view (i.e. opening angle), but the CCD-chip of camera A is twice as large as the CCD-chip of camera B. Hence, camera A has larger pixels. Argue what effect this may have on the accuracy of depth perception.

So they both have the same resolution (no. of pixels), and same FOV. The formula takes the pixel size in consideration when computing $f_{px}$. Therefore, if $\text{pixel size}^A > \text{pixel size}^B$, then $f^A_{px} < f^B_{px}$ . This fact would lead to a higher value of depth accuracy for camera A, which actually means that it would have worse performance.


<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>