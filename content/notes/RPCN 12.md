---
title: Cameras - Beyond RGB
draft: false
tags:
date: 2026-01-26
---
 
Notes from [[twente|UTwente]] slides. Focus on how cameras work.

**Electromagnetic Radiation (EM)**

EM radiation can be modeled in two ways:

1. by waves
2. by photons

A short wavelength implies high frequency \& high energy and vice-versa.

> Objects reflect($\rho$), absorb($\alpha$) and transmit($\tau$) a part of the radiation.

* Energy is conserved: $\varphi_0 = \varphi_r + \varphi_t + \varphi_a$. It applies at every wavelength ($\lambda$).
* The generic case is that all 3 effects add up to one: $\alpha + \tau + \rho = 1$.
* For an opaque object, we encounter $\alpha + \rho = 1$. Which means that light does not go through.

**Interactions of EM radiation with the Earth’s surface**

Kirchhoff's Law of thermal radiation states that in equilibrium absorptance and emisivity at each wavelength are equal

$$
\alpha(\lambda) = \epsilon(\lambda)
$$

$\rho, \alpha$ and $\tau$ will vary with wavelength and type of material.

Absorption of EM radiation leads to an increase in the object's temperature, while emission of EM radiation leads to a decrease in the object's temperature.

**Hyperspectral Imaging**

A hyperspectral scanner uses detectors for narrower bands which may be as narrow as 20 nm, or even less. While a standard camera captures three broad colors (red, green, and blue), a hyperspectral camera captures a full continuous spectrum for every single pixel in an image.

* **The principle**:  A narrow **slit** allows a thin line of light to pass. The light is then passed through a **diffraction grating** ("prism") and diffracted into different wavelengths. Then, the 2-dimensional detector (**CCD / CMOS**) perceive the **wavelength** ($\lambda$) as one dimension and the **position** along the slit as the second dimension.
	* Because the camera only sees one thin line at a time, it must move to capture a full picture. As the camera (or the object) moves forward, it captures line after line. By stacking these lines together, the system creates a **Hypercube**: a 3D data set where the first two dimensions are the physical image (width and height) and the third dimension is the chemical "fingerprint" or spectrum of every pixel. This allows scientists to identify materials based on their light signatures that are invisible to the human eye, such as detecting specific minerals in rocks or the hydration levels in crops.

**Thermal Imaging**

Unlike standard cameras that capture reflected visible light, thermal cameras detect the energy naturally emitted by any object with a temperature above absolute zero.

* **The principle**: these cameras operate in the **Long-Wave Infrared** range, typically $8-14 \mu m$. Normal glass is opaque to LWIR so special **thermal lenses** must be used. To ensure that the sensor only "sees" the scene and not its own heat, two methods are used:
	* **Cooled Sensors**: These are integrated with cryocoolers to lower the sensor's temperature to cryogenic levels, drastically reducing internal thermal noise and allowing for the detection of minute temperature differences.
	* **Uncooled Sensors**: These operate at ambient temperature and use internal correction algorithms to compensate for the sensor's own radiation.
* Thermal cameras have **low spatial resolution** -- because the wavelengths are larger, individual detector pixels must also be **larger** to capture enough energy to maintain a high signal-to-noise ratio.

Sensor costs increase with the number of spectral bands. 