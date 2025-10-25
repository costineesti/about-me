---
title: Notes for the Computer Vision Exam
draft: false
tags:
---
 
Notes for my Image Processing and Computer Vision exam at Twente.

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

