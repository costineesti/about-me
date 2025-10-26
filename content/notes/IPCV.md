---
title: Image Processing and Computer Vision
draft: false
tags:
date: 2025-10-25
---
 
Notes for my Image Processing and Computer Vision exam at the [[twente|University of Twente]]. It's also a good summary of the lectures. I didn't feel like making separate pages for each subject. They also serve as exam notes.

Most of the terms I have already used in:

* [[seaclear|SeaClear]] 
* [[Bachelors|Bachelors Thesis]]  
* [[barcode detection and decoding|Barcode Detection and Decoding]] and others on [GitHub](https://github.com/costineesti/ComputerVision).

# Lecture 2

## Intensity Transformations

* Some function that takes as input the old pixel value and gives the new one.
* Mostly used for image enhancement

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intensity_transforms.png" style="max-width: 100%; height: auto;">
</div>

* Image inverting or negative: showing white structures on large black backgrounds.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intensity_inverse.png" style="max-width: 100%; height: auto;">
</div>

### Histograms

As the teacher explained it, it's basically a frequency vector of the intensity of vectors, divided by the total number of pixels.

* A histogram consists of bins $b_i$, with $i \in \{0, 1, 2, ..., L\}$
* $N(b_i)$ = $\frac{No_{pixels}}{voxels}$ for which $f(x) = b_i$
* $N$ is the total number of pixels. Then $P(b_i) = \frac{N(b_i)}{N}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/histogram.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/histograms.png" style="max-width: 100%; height: auto;">
</div>

### Gamma transformations

* $>=1$ means darker images
* $<1$ means brighter images

## Color Spaces

* RGB (Red, Green, Blue)
* HSV (Hue, Saturation, Value)
* HSL (Hue, Saturation, Lightness)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HSV_map.png" style="max-width: 100%; height: auto;">
</div>

* Hue is the color of the image
* Saturation is the pureness of the Hue
* Value is the strength of the Hue

## Image Filtering

>[!summary] Image Filtering
>* in spatial domain, filtering is a mathematical operation on a grid of numbers (**smoothing, sharpening**)
>* in frequency domain, filtering is a way of modifying the frequencies of images (**denoising, sampling, compression**)
>* in templates and image pyramids, filtering is a way to match a template to the image (**detection**)

* Translating an image or multiplying/adding with a constant leaves the semantic context intact

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/linsys_int.png" style="max-width: 100%; height: auto;">
</div>

### Intensity versus Point Spread Functions (PSF)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/psf_example_1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/psf_example.png" style="max-width: 100%; height: auto;">
</div>

## Convolution

* 2D: $g(x,y) = f(x,y) * h(x,y)$

### Convolution Theorem

* Convolution in space domain is equivalent to multiplication frequency domain

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/conv_th.png" style="max-width: 100%; height: auto;">
</div>

* After convolution, the resulting size is reduced $(n-k+1)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/conv_size.png" style="max-width: 100%; height: auto;">
</div>

### Image Restoration

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/img_restor.png" style="max-width: 100%; height: auto;">
</div>

* Limit $\frac{1}{H(u,v)}$ to avoid 0 in the denominator!

### Moving Average

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/moving_avg.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/moving_avg_1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/moving_avg_2.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/moving_avg_3.png" style="max-width: 100%; height: auto;">
</div>

What this specific filter does:

* It smoothens the image
* It calculates the average in a $3 \times 3$ neighborhood 

>[!question] So if the kernel was $-\frac{1}{9}$
>
>The rule would be: Output = -(sum of 9 neighboring pixels) / 9 = -average
>
>* The result would be the inverse of the above one. So bright regions become darker and dark regions become brighter.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/negated_kernel.png" style="max-width: 100%; height: auto;">
</div>

### Some rules of thumb for each operation

>[!summary] A kernel does
>
>* Darkening -- sum of all elements < 1
>* Brightening -- sum of all elements > 1
>* Smoothing -- positive weights distributed
>* Sharpening -- when the center value is large and positive, the surrounding values are negative and the sum == 1.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/kernels.png" style="max-width: 100%; height: auto;">
</div>

### Gaussian Filter

* Smoothing
* Denoising

>[!summary] Key Parameters
>1. $\sigma$ (sigma/variance): controls blur strength (extent of smoothing)
>	* **Small** $\sigma$ (e.g. 2) = sharp, concentrated, less blur
>	* **Large** $\sigma$ (e.g. 5) = wide, spread-out, more blur
>
>2. Kernel size: must be large enough to capture the Gaussian shape
>	* **Too small**: truncates the Gaussian bell curve

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ksize.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sigmasize.png" style="max-width: 100%; height: auto;">
</div>

## Non-linear Filters

### Median Filter

* A median filter operates over a window by selecting the median intensity in the window
* Good for salt-and-pepper noise
* Robustness to outliers (in comparison with Gaussian)
* Edge-preserving (in comparison with Gaussian)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/MedianFilt.png" style="max-width: 100%; height: auto;">
</div>

## Correlation vs Convolution

* In convolution, we flip the kernel
* A <u>convolution</u> is an integral that expresses the amount of overlap of one function as it is shifted over another function. (filtering operation)
* <u>Correlation</u> compares the similarity of two sets of data. Correlation computes a measure of similarity of two input signals as they are shifted by one another. The correlation result reaches a maximum at the time when the two signals match best (measure of relatedness of two signals)

## Template Matching

* It's done through *Normalized cross-correlation*

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/template_match.png" style="max-width: 100%; height: auto;">
</div>

* Matching depends on
	* scale,
	* orientation,
	* general appearance

# Lecture 3 -- Fourier Transform and Convolution

## Fourier Transform

>[!summary] Fourier Theory
>Any function that periodically repeats itself can be expressed as a sum of sines and cosines of different frequencies each multiplied by a different coefficient – a Fourier series.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fourier_theory.png" style="max-width: 100%; height: auto;">
</div>

### Important parameters

* Frequency: $sin(kx) \rightarrow k$
* Amplitude: $A \cdot sin(kx) \rightarrow A$
* Phase: $A \cdot sin(kx + \theta_0) \rightarrow \theta_0$
* Orientation: $I(r) = A \cdot sin(k.r + \theta_0)$

### Spectrum

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FFT.png" style="max-width: 100%; height: auto;">
</div>

### Fourier Uncertainty Principle

>[!summary] Narrow in Space $\rightarrow$ Wide in Frequency
> * **Spatial Domain:** The function is a **narrow spike**. This means the signal is highly localized in space (it exists intensely at one small spot, around (0,0), and is zero almost everywhere else).
> * **Frequency Domain:** The resulting function is **wide and spread out**. To create such a sharp, sudden spike in the spatial domain, you need to combine many different frequencies (both low and high). This "wide-band" combination of frequencies results in a wide, spread-out plot in the frequency domain.

>[!summary] Wide in Space $\rightarrow$ Narrow in Frequency
>* **Spatial Domain:** The function is a **wide, broad hill**. This means the signal is _delocalized_ (spread out) in space. It changes very smoothly and gradually.
>* **Frequency Domain:** The resulting function is a **narrow spike**. Because the spatial function is so smooth and changes slowly, it is composed almost entirely of low frequencies. It doesn't need high frequencies (which create sharp changes). This "narrow-band" signal is highly localized around the zero-frequency (DC) component, resulting in a narrow spike.

So, in short:

* To localize a signal in space (make it narrow), you must delocalize it in frequency (make it wide).
* To localize a signal in frequency (make it narrow), you must delocalize it in space (make it wide).
* You can't have a function that is "narrow" in both the spatial and frequency domains simultaneously.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/FUP.png" style="max-width: 100%; height: auto;">
</div>

## Convolution Theorem

* Convolution in space domain is equivalent to multiplication frequency domain.
* Multiplication in space domain is equivalent to convolution in frequency domain

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/conv_theorem.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/DFT_IP.png" style="max-width: 100%; height: auto;">
</div>

### Gaussian Low-Pass Filter

* Used to connect broken text

### Gaussian High-Pass Filter

* Image restoration


# Lecture 4 -- Morphological Operations

* Morphological Operations are based on set theory (inclusion, union, difference, etc.)

## Neighborhoods and Adjacents

* two pixels $a$ and $b$ are:
	* 4-connected if $b \in N_4(a)$
	* 8-connected if $b \in N_8(a)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/adjacency.png" style="max-width: 100%; height: auto;">
</div>

* Two pixels $a$ and $b$ are connected in region A if a path exists between $a$ and $b$ entirely contained in $A$.

* The connected components of $A$ are the subsets of $A$ in which:
	* all pixels are connected in $A$,
	* all pixels in $A$ not belonging to the subset are not connected to that subset.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/conn_comp1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/conn_comp2.png" style="max-width: 100%; height: auto;">
</div>

## Erosion

>[!summary] Erosion
>* Enlarges holes,
>* Breaks thin parts,
>* shrinks objects
>* is not commutative
>* Match completely
>* $A \ominus B$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/erosion1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/erosion2.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/erosion3.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/erosion4.png" style="max-width: 100%; height: auto;">
</div>

## Dilation

>[!summary] Dilation
>* Filling of holes of certain shape and size
>* Match at least one element
>* $A \oplus B$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/dilation1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/dilation2.png" style="max-width: 100%; height: auto;">
</div>

## Opening

* $A \cdot B = (A \ominus B) \oplus B$
* **erosion, then dilation**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/opening1.png" style="max-width: 100%; height: auto;">
</div>

## Hit or Miss

* Find location of one shape among a set of shapes ”template matching”
* Shape recognition

## Boundary Extraction

* We can simply do $A - (A \ominus B)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/boundaryextract.png" style="max-width: 100%; height: auto;">
</div>

# Lecture 5: Scale Space, Image Derivative and Edge Detection

* By changing the zoom-in/out ratio, we can see the different levels of information from the image.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/einstein_marilyn.png" style="max-width: 100%; height: auto;">
</div>

## Scale Space Theory: Convolution with Gaussian

* The PSF of the operation is a Gaussian:
	* $h(x, y, \sigma^2) = \frac{1}{2\pi\sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$
	* scale is parametrized by $\sigma^2$

### Properties of Convolution

1. **Commutativity**: $f(x,y) * h(x,y) = h(x,y) * f(x,y)$
2. **Associativity**: $(f(x,y)∗h(x,y))∗g(x,y)=f(x,y)∗(h(x,y)∗g(x,y))$

### Properties of Gaussian Functions

1. **Separability property**: The Gaussian is the only PSF that satisfies
	* $h(x,y,a)∗h(x,y,b)≡h(x,y,a+b)$
	* This means convolving with two Gaussians sequentially is equivalent to convolving with a single Gaussian whose variance is the sum.

2. **Fourier transform property**:
	* Spatial domain: $h(x,y,σ^2)=\frac{1}{2 \pi \sigma^2}exp⁡(− \frac{x^2+y^2}{2\sigma^2})$
	* Frequency domain: $H(u,v,\sigma^2)=exp⁡(−2 \pi^2 \sigma^2(u^2+v^2))$

3. Convolution in Fourier Domain:
	* $h(x,y, \sigma_1^2​)∗h(x,y, \sigma_2^2​) = h(x,y, \sigma_1^2​ + \sigma_2^2​)$
	* The only PSF that satisfies this is a Gaussian

### An increase of scale

* blurs the image,
* gives rise to less structure,
* decreases noise

### Scale space applications: SIFT

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/SIFT_l5.png" style="max-width: 100%; height: auto;">
</div>

**Key applications of scale space**:

* Edge and blob detection,
* Feature extraction (e.g., SIFT, SURF),
* Object recognition and tracking.

## Gaussian Convolution, Image Derivative

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/2d_gauss.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/2d_gauss2.png" style="max-width: 100%; height: auto;">
</div>

### Gradient Vector

* Is in the direction of change in intensity (perpendicular to the contour lines),
* Towards the direction of the higher intensity.

#### First Derivatives

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/1st_derivatives.png" style="max-width: 100%; height: auto;">
</div>

* Gradient Magnitude: $\sqrt{f_x^2 + f_y^2}$
* Gradient Argument: $arctan(\frac{f_y}{f_x})$
* ==First derivative in x direction is == convolution with derivative of Gaussian== $f_x(\sigma)=f*h_x(\sigma)$
* ==Same for second derivative in y direction== $f_{yy}(\sigma)=f*h_{yy}(\sigma)$

#### Second Derivatives

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/2nd_derivatives.png" style="max-width: 100%; height: auto;">
</div>

### Laplacian

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/laplacian_l5.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/toate.png" style="max-width: 100%; height: auto;">
</div>

* $\triangle f(\sigma) = f * \triangle h(\sigma)$
* $\triangle h(\sigma) = h_{xx}(\sigma) + h_{yy}(\sigma)$
* Laplacian **Zero-Crossing**: all locations where $\triangle f(\sigma)$ are zero
* $\triangle f(x,y,\sigma) = LoG(x,y,\sigma) * f(x,y)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/behavior_params.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/gradVslapl.png" style="max-width: 100%; height: auto;">
</div>

## 1D Edge Detection

$f(x) = \epsilon \cdot step(x-x_0) + noise(x)$

* $\epsilon = 0$ no edge
* $\epsilon = 1$ edge

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/1d_edgedetect.png" style="max-width: 100%; height: auto;">
</div>

## 2D Edge Detection

* An edge is a place of rapid change in the image intensity function

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/2d_edge1.png" style="max-width: 100%; height: auto;">
</div>

* Affected by noise

### Derivative Theorem of Convolution

* $\frac{d}{dx}(f*g) = f * \frac{d}{dx} g$
* $f$ is the image
* $g$ is the convolution kernel

To calculate image derivative:

1. You do the corresponding derivative on the convolution kernel (= Gaussian)
2. You used the result of (1) to do the convolution with your image

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/2d_edge2.png" style="max-width: 100%; height: auto;">
</div>

* As $\sigma$ increases,
	* more pixels are involved in average
	* image is more blurred
	* noise is more effectively suppressed

### Edge Detectors

>[!summary] Steps
>1. Compute derivatives in x and y directions
>2. Find gradient magnitude
>3. Threshold gradient magnitude => edges

>[!question] How does Sobel differ from Prewitt?
>* Adds **extra weight** (2) to the central row/column.
>* introduces a **smoothing effect** (weighted average), making Sobel **less sensitive to noise** than Prewitt.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sobel1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sobel2.png" style="max-width: 100%; height: auto;">
</div>

### Finding Zero Crossings

* Slope of zero-crossing of $L(x,y)$ which is the result of $LoG$ convolution.
	* $slope = \sqrt{(\frac{dL}{dx})^2+(\frac{dL}{dy})^2}$
* To mark an edge
	* compute slope of zero-crossing
	* Apply a threshold to slope

### Canny Edge Detector

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/edgedetect.png" style="max-width: 100%; height: auto;">
</div>

### Non-Maximum Suppresion (NMS)

>[!summary] NMS
>* We wish to mark points along the curve where the magnitude is largest. We can do this by looking for a maximum along a slice normal to the curve (non-maximum suppression)
>* These points should form a curve. There are then two algorithmic issues: at which point is the maximum, and where is the next one?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/NMS_l5.png" style="max-width: 100%; height: auto;">
</div>


* Suppress the pixels in $|∇S|$ which are not local maximum.
* $x’$ and $x’’$ are the neighbors of $x$ along normal direction to an edge.

$$
M(x,y) = \begin{cases}
|\nabla S|(x,y) & \text{if } |\nabla S|(x,y) > |\nabla S|(x',y') \\
& \text{and } |\nabla S|(x,y) > |\nabla S|(x'',y'') \\
0 & \text{otherwise}
\end{cases}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/NMS2_l5.png" style="max-width: 100%; height: auto;">
</div>

### Hysteresis Thresholding

>[!summary]
>* Use two different thresholds to define strong edges and weak edges.
>* Weak edges are accepted only if they are connected to at least one strong edge element.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hyst.png" style="max-width: 100%; height: auto;">
</div>

# Lecture 6: Geometric Transformations

## Linear Transformations

* Scaling, rotation and reflection can be combined as a 2D linear transformation
* Preserve shapes

>[!NOTE] Linear transformations are combinations of
>* Scale,
>* Rotation,
>* Shear,
>* Mirror

>[!NOTE] Properties of Linear Transformations
>* Origin maps to origin (not in translation)
>* Straight lines map to straight lines
>* Parallel lines remain parallel
>* Ratios are preserved

### Shearing

* changes object shape

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/shearing_1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/shearing_2.png" style="max-width: 100%; height: auto;">
</div>

### Homogenous Coordinates

>[!summary] Homogenous Coordinates
>
>* Add an extra dimension to coordinates: $(x, y) \Rightarrow \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$ which allows for perspective projections and other projective transformations to be treated as linear transformations that can be represented by matrice.
>* Used to simplify and combine transformations like translation, rotation, and scaling into single matrix multiplications

### Affine Transformations

* any transformation with last row $[0, 0, 1]$ we call an affine transformation

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/basic_affine_transf.png" style="max-width: 100%; height: auto;">
</div>

* Affine transformations are combinations of
	* Linear Transformations
	* Translations

>[!NOTE] Properties of affine transformations
>* <u>Origin does not necessarily map to origin</u>
>* Lines map to lines
>* Parallel lines remain parallel
>*  Ratios are preserved

### Projective Transformations (Warping)

>[!NOTE] Properties of projective transformations
>* <u>Origin does not necessarily map to origin</u>
>* Lines map to lines
>* <u>Parallel lines do not necessarily remain parallel</u>
>* <u>Ratios are not preserved</u>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/projective_transf.png" style="max-width: 100%; height: auto;">
</div>

## Mapping

### Forward Mapping

* From source image $\rightarrow$ destination image
* Not every destination pixel is guaranteed to be hit by some source pixel. As a result, some pixels in the destination image **remain empty**, creating **gaps or holes**.
* Source and destination images may not be the same size
* Output locations may not be integer values

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/forward_mapping.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/forward_mapping2.png" style="max-width: 100%; height: auto;">
</div>

### Backward Mapping

* From destination image $\rightarrow$ source image
* No gaps (through inverse mapping). To assign intensity values to these locations, we need to use some form of intensity *interpolation*

### Interpolation Methods

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/interp_method.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/average_method.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/bilinear_method.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/bicubic_method.png" style="max-width: 100%; height: auto;">
</div>


# Lecture 7: Camera Model and Calibration

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/camera_coord_sys.png" style="max-width: 100%; height: auto;">
</div>

## Homogenous Coordinates in 2D

* Homography: a projective transformation
* Undoing a perspective distortion in an image
* transformed lines are still lines
* lines that share a common vanishing point keep on sharing a vanishing point
* distances are not preserved
* angles are not preserved

### World to Camera coordinates

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/W2C_Coord.png" style="max-width: 100%; height: auto;">
</div>

## Perspective Projection of a camera

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/PerspectiveProj.png" style="max-width: 100%; height: auto;">
</div>

## Intrinsic Camera Model

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intrinsicCam.png" style="max-width: 100%; height: auto;">
</div>

* $r,c$ are pixel coordinates, we want to calculate them
* $p_x$, $p_y$ are principal point = image center
* $d_x, d_y$ are distances between pixels (focal distance)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intr1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/intr2.png" style="max-width: 100%; height: auto;">
</div>

* $f_x, f_y$ are the focal length
* $c_x, c_y$ are the principal point
* $s$ is the skew efficient
* These parameters map 3D camera coordinates to 2D image coordinates.

As a summary

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/summary_cam.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/summary_cam2.png" style="max-width: 100%; height: auto;">
</div>

## Distortion

>[!summary] Radial Distortion
>* parameters $k_1, k_2, k_3$
>* This type of distortion usually occur due unequal bending of light. The light ray gets displaced radially inward or outward from its ideal location before hitting the image sensor.
>* The rays bend more near the edges of the lens than the rays near the centre of the lens. 
>* Due to radial distortion straight lines in real world appear to be curved in the image.
>* **Barrel distortion**(negative radial displacement), **Pincushion distortion**(positive radial displacement)

>[!summary] Tangential Distortion
>* parameters $p_1, p_2$
>* This usually occurs when image screen or sensor is at an angle w.r.t the lens. Thus the image seem to be tilted and stretched.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/tang_dist.png" style="max-width: 100%; height: auto;">
</div>

Type of distortions

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/distortions.png" style="max-width: 100%; height: auto;">
</div>

# Lecture 8: Template matching & line detection

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/templ_match.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] Mind these
>* position
>* size
>* orientation
>* background
>* contrast

The template is an iconic archetype of the object that we are looking for.

>[!summary] Template Matching
>Can we find locations in the image where locally the image "looks like" the archetype? -- We need to define what "looks like" is.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/templ_match1.png" style="max-width: 100%; height: auto;">
</div>

### Matching Criterion: SSD (Sum of squared differences)

* **type of distortion**: unknown shifted position (𝑝𝑝, 𝑞𝑞)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/SSD.png" style="max-width: 100%; height: auto;">
</div>

### NCC (Normalized Cross Correlation)

* **type of distortion**: unknown amplitude: 𝐴𝐴

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/NCC.png" style="max-width: 100%; height: auto;">
</div>

* Normalization solution: 
	* estimate from bg
	* neutralize bg by subtraction (Normalize background in observe image and background in template image)

### Line Detection

**β = direction across line element**

* Idea: **try normalization wrt orientation** -- this will be very computationally expensive (correlation with line templates)
	* estimate locally the orientation of the line: β
	* rotate the template over an angle of –β
	* apply **locally** template matching

* Solution: 2nd directional derivative in direction β (eigenvalues of Hessian matrix)
	* 𝛽𝛽 corresponds to the dominant eigenvector 𝐯𝐯 of the Hessian matrix
	* The maximized $f_{ββ}(x, y)$ equals the eigenvalue of the Hessian matrix

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/line_detect.png" style="max-width: 100%; height: auto;">
</div>

# Lecture 9: Detection and tracking of interest points

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/features_l9.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] Applications
>* motion analysis
>* range imaging
>* object detection and parameter estimation
>* point cloud

## Harris Corner Detection

### Harris' first improvement

* Make the function less noise−sensitive by averaging over a neighborhood
* New term with average window
* $E(p,q)$ defines and ellipsoid. Its contour lines are ellipses in the $(p,q)$ plane
* The shape of the ellipsoid is determined by $\lambda_1$ and $\lambda_2$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/harris1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/harris2.png" style="max-width: 100%; height: auto;">
</div>

### Harris' second improvement

* A point is an interest point iff $E(p,q)$ is fast increasing for any combination of $p,q$. That is, the ellipsoid must be peaked.
* Therefore, both $\lambda_1$ and $\lambda_2$ must be large.

>[!NOTE] Harris criterion for an interest point
> $\lambda_1 \lambda_2 - 0.04(\lambda_1+\lambda_2)^2 > threshold$

>[!NOTE] Shi−Tomasi ciriterion for an interest point (1994)
>$min(\lambda_1, \lambda_2) > threshold$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/harris3.png" style="max-width: 100%; height: auto;">
</div>

### Harris' third improvement

* Use a Gaussian weight function (less noise-sensitive): $w(n,m) = \exp(-\frac{n^2+m^2}{2 \sigma^2})$

## Lucas-Kanade: Point Tracking

>[!summary] Tracking
>* Given two or more images of a scene, find the points in the second and next images that corresponds to the set of interest points in the first image

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LK1.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] Optical Flow $\neq$ Motion Field
>* Optical flow = appearance model
>* Motion field = physical world

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LK2.png" style="max-width: 100%; height: auto;">
</div>

For the example above, think about how the lines go up as the result of the rotating pole inside.

### Optical Flow

* Constant brightness assumption: if the intensity of a pixel stays the same over a duration $t$, then it's derivative is 0 and thus stationary (?)
* $v(\mathbf{x},t)$ is the apparent 2D motion (= optical flow) of the image at position $\mathbf{x}$ and time $t$.
* $\mathbf{x} = (x,y)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LK3.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LK4.png" style="max-width: 100%; height: auto;">
</div>

* Minimization of $E(v,t)$:
	* equating partial derivatives to zero
	* solving for $v(t)$
	* The two eigenvalues of M must be large

#### Discrete time

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LK5.png" style="max-width: 100%; height: auto;">
</div>

* We minimize SSD with respect to d: $\frac{dSSD(d)}{dd} = 0$

# Lecture 10: Key point detection and matching

## SIFT (Scale Invariant Feature Transform)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sift1.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] Keypoints in SIFT
>* set of point features defined in an image
>* each key point is attributed with:
>	* the local orientation
>	* the scale
>	* a descriptor (used to identify the local neighbourhood)
>* useful properties:
>	* invariant to image translation, rotation and scaling
>	* invariant to contrast and brightness
>	* partially invariant to the 3D camera viewpoint
>	* distinctive
>	* stable
>	* noise insensitive

* zooming the image by a factor $a$: 
	* does **not change the location** of a keypoint
	* changes the scale of a keypoint by a factor $1/a$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sift2.png" style="max-width: 100%; height: auto;">
</div>

## Laplacian of a Guassian (Inverted Sombrero)

$LoG(x,y,\sigma) = \Delta gauss(x,y,\sigma) = \frac{x^2 + y^2 - 2\sigma^2}{2\pi\sigma^6} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/log.png" style="max-width: 100%; height: auto;">
</div>

### Detection of candidate keypoints

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/log2.png" style="max-width: 100%; height: auto;">
</div>

### Efficient implementation of the LoG

* approximation of LoG by differences of Gauss (DoG): $LoG(x,y,\sigma) = \triangle gauss(x,y,\sigma)$
* cascade of Gaussians

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/dog.png" style="max-width: 100%; height: auto;">
</div>

Representations for matched keypoints are done through
	* adjacency matrix
	* bipartite graphs
	* table of edges
	* table of pointers
	* distance table

>[!NOTE] Applications
>* image stitching
>* stereo rectification
>* landmark detection and matching for visual SLAM
>* object recognition

# Lecture 11: 3D Vision. Binocular Vision

* Dense stereo
	* reconstruction of 3D surface models of objects

* Sparse stereo
	* 3D information on a small number of points:
		* finding the 3D positions of the points from multiple images
		* finding the 3D pose of a camera relative to the points
		* finding the pose of the camera relative to another camera
		* visual SLAM: finding both the poses of cameras and the 3D positions of points

## Triangulation

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/triangulation.png" style="max-width: 100%; height: auto;">
</div>

Key relations:
	* Triangulation (base line, two rays)
	* Correspondence: representation of 3D point: $X^1 = R_2^1 X^2 + t_2^1$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/triangulation2.png" style="max-width: 100%; height: auto;">
</div>

### Epipolar Geometry

* How to find corresponding pixels?
* How to reconstruct the 3D position of object?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/epipolar.png" style="max-width: 100%; height: auto;">
</div>

* Epipolar constraint expressed with **Essential Matrix**: $X_2^T E X_1 = 0$
* E is the Essential Matrix: $E = R_1^2[t_2^1]_x$

* Epipolar constraint in pixel coordinates: **fundamental matrix**
	* $^1\underline{\mathbf{p}} = K_1 X^1$
	* $^2\underline{\mathbf{p}} = K_2 X^2$
		* Substitution in  $X_2^T E X_1=0$ yields: $^2\underline{\mathbf{p}}^{\top} \mathbf{K}_2^{-\top} \mathbf{E} \mathbf{K}_1^{-1}{}^1\underline{\mathbf{p}} = 0$
	* define $F = \mathbf{K}_2^{-\top} \mathbf{E} \mathbf{K}_1^{-1}$ then:
		* Epipolar constraint in pixel coordinates:
			* $^2\underline{\mathbf{p}}^{\top} F ^1\underline{\mathbf{p}} = 0$
			* $F$ is the fundamental matrix

## Rectification

* geometrical transformation of the images such that the epipoles are moved to infinity in the row-direction.
* simplifies the correspondence problem to a simple 1-D search along rows.
* needs calibration matrices **K1** and **K2**, and fundamental matrix **F**

>[!NOTE] Rectification Steps
>1. determine the rotation axis and rotation angle between camera 1 and camera 2
>2. rotate camera 1 around this axis over half of the angle in counterclockwise direction
>3. rotate camera 2 around this axis over half of the angle in the other direction
>4. determine the direction between x-axis of the cameras with respect to the baseline vector
>5. using this direction, rotate the cameras such that their x-axis are aligned with the baseline vector
>6. Equalize the calibration matrices of both cameras $K1 == K2$

## Disparity: difference of the seen pixels in two images

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/disparity.png" style="max-width: 100%; height: auto;">
</div>

* Here we can see disparity and depth are inverse proportional
* Disparity is proportional to Baseline

# Lecture 12: 1D signals and Depth Maps

1D Signals are very often seen in reality

* Earthquake
* Audio
* Temperature
* Bioelectrical Signal
* ...

## Monocular Depth Estimation

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/depthmaps.png" style="max-width: 100%; height: auto;">
</div>

* Key Challenge: Scale Ambiguity
	* With only one image, absolute meters are unknown $\rightarrow$ models often predict relative depth that needs a later scale/shift alignment.

### How does the human eye judge near vs. far?

* Occlusion: if one object blocks another, it’s closer.
* Relative / known size: the same object looks smaller when farther; familiar objects act as rulers.
* Linear perspective: parallel lines converge toward a vanishing point.
* Texture & contrast gradients: textures get denser and lower-contrast with distance (aerial haze).
* Lighting & shadows: shadow position/shape reveals spatial layout.
* Depth of field: in-focus plane is sharp; foreground/background blur more.
* Motion parallax: when you move, nearer objects shift faster across your view.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/yolo.png" style="max-width: 100%; height: auto;">
</div>

