---
title: Autoencoders
draft: false
tags:
---

Have to complete these and make them readable. These are just some notes from the lecture
# Encoder

<div class="encoder-section">
  <img src="../static/notes/encoder.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>From high dimensions to low dimensions</li>
      <li>A function that encodes an input sample into a lower-dimensional code</li>
	      <ul>
	      <li>Fully-connected</li>
	      <li>Convolutional</li>
	      <li>Sparse</li>
	      </ul>
    </ul>
  </div>
</div>

# Decoder

<div class="encoder-section">
  <img src="../static/notes/decoder.png" style="width: 200px; margin-bottom: 10px;">
  <div class="encoder-text">
    <ul>
      <li>From low dimensional space to higher dimensional space</li>
      <li>A function that encodes an input sample into a higher-dimensional code</li>
	      <ul>
	      <li>Fully-connected</li>
	      <li>Convolutional</li>
	      <li>Sparse</li>
	      </ul>
		<li>Convolutional decoders perform transposed convolutions or upsampling and convolutions to reverse the downsampling of the decoder.</li>
    </ul>
  </div>
</div>

# Autoencoder

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/autoencoder.png" style="max-width: 100%; height: auto;">
</div>

* f(x) is the encoding function
* g(h) is the decoding function
* h is the latent space. Here we can use it to learn more about the information (extraction and probably compression or even manipulating this data)
* the learning process is described as minimizing a loss function $L(x, g(f(h)))$

<div class="encoder-section">
  <img src="../static/notes/autoencoders_1.png" style="width: 200px; margin-bottom: 10px;">
  <div class="encoder-text">
    <ul>
      <li>A neural network with the task of copying the input to the output (difference between x and g(f(h)) is 0)</li>
      <li>Trained to minimize the dissimilarity between the original input sample(s) and the reconstructed output</li>
	  <li>Convolutional decoders perform transposed convolutions or upsampling and convolutions to reverse the downsampling of the decoder.</li>
    </ul>
  </div>
</div>

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