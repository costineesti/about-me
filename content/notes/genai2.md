---
title: Generative AI Lecture 2
draft: false
tags:
---

Have to complete these and make them readable. These are just some notes from the lecture
# Encoder

* From high dimensions to low dimensions
* A function that encodes an input sample into a lower-dimensional code
	* Fully-connected
	* Convolutional
	* Sparse
	* ...

# Decoder

* From low dimensional space to higher dimensional space
	* Fully-connected
	* Convolutional
	* Sparse
	* ...

* Convolutional decoders perform transposed convolutions or upsampling and convolutions to reverse the downsampling of the decoder.

# Autoencoder

* f(x) is the encoding function
* g(h) is the decoding function
* h is the latent space. Here we can use it to learn more about the information (extraction and probably compression or even manipulating this data)
* the learning process is described as minimizing a loss function $L(x, g(f(h)))$

>[!question] What is the AUTOENCODER?
>* A neural network with the task of copying the input to the output (difference between x and g(f(h)) is 0)
>* Trained to minimize the dissimilarity between the original input sample(s) and the reconstructed output

it's a way to learn features in an unsupervised way.

### Visualizing the latent space of an AE

* An AE maps the input samples to points into the latent space, building large mutually independent clusters (no relations between the 'neighbor' clusters)

### Problems

* If *h* has the same dimension as *x*, the network copies the input to the code
* If *f* or *g* have too large capacity, the network memorizes the input samples

### Solution

>[!summary] Undercomplete AutoEncoders
>* *h* has lower dimension than *x* (works well for the training distribution),
>* *f* and *g* do not have too large capacity,
>* some information from *x* is discarded in *h*.

# Denoising AutoEncoders (DAE)

* Trained to remove noise from the image.
* We take the input(*x*), we corrupt it with noise(*x'*) and it becomes the input for the encoder.

# Variational AutoEncoders

* Based on variation inference theory
* Enforces the learning of a **regularized latent space** (with a probabilistic twist)
* Does not encode inputs as points, but as a distribution over the latent space.

The mean and standard deviation are now in high dimensional space (variance is the covariance matrix and the mean is also a matrix).

E\[$logp_g (x \mid z)$\] is the entropy loss.
$D_{KL}$ is a measure of difference between distributions
Sampling does not flow back (Backpropagation through randomness is not possible). That's why we have to do a reparametrization trick: Separate the randomness from the learnable (and differentiable) parameters $z = \mu + \sigma \cdot \epsilon$, where $\epsilon \approx N(0,1)$

### Generation

* sampling a latent variable and let the decoder generate (reconstruct) an image.
* Adding is simply bit by bit
* Some other methods are available (see the slides)

# Generative Adversarial Networks (GANS)

* GANs are generative models based on game theory
* A generator network G generates fake samples
* A discriminator network D discriminates between real samples and fake generated samples.

Adversarial Loss function (Cross entropy of fake images and the adversarial part where it's basically 1 - the Generator that provides input to the Discriminator).

### Conditional GANS

Mode collapse means that the training of the network is stuck. The solution implies generating samples conditioned by c (e.g. label, text, etc.) 

The loss function stays the same but we take *c* into consideration.

One condition for cGANs in computer vision: ALLIGNMENT (or PAIRED) (the objects are always in the same place).

### Cycle GANS

* Cycle GANs perform **unpaired image-to-image translation**. Given two unpaired image sets *X* and *Y*, learn a mapping function between the two domains that transforms images from *X* into images from *Y* (and vice versa).
* Based on the concept of cycle consistency