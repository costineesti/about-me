---
title: Autoencoders
draft: false
tags:
date: 2025-11-17
---

Lecture 2 from my GenAI course.

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
* h is the latent space. Here we can use it to learn more about the information (extraction and probably compression or even manipulating this data e.g. features for classification)
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

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/autoencoder_1.png" style="max-width: 100%; height: auto;">
</div>

### Visualizing the latent space of an AE

<div class="encoder-section">
  <img src="../static/notes/autoencoders_1.png" style="width: 200px; margin-bottom: 10px;">
  <div class="encoder-text">
    <ul>
      <li>An AE maps the input samples to points into the latent space, building large mutually independent clusters (no relations between the 'neighbor' clusters)</li>
      <li>The mapping is optimized to reconstruct the input samples only.</li>
    </ul>
  </div>
</div>

### Problems

* When the hidden layer **h** has the same dimension as input **x**, the network can cheat by just copying the input. If the encoder/decoder are too large, they memorize training samples instead of learning meaningful patterns.

### Solution: Undercomplete Autoencoders

>[!summary] Undercomplete AutoEncoders
>* The hidden layer **h** is deliberately smaller than the input **x** (|h| << |x|). This forces the network to compress the input, learning only the most important features for the training distribution.
>* **Main Application**: Dimensionality Reduction

<div class="encoder-section">
  <img src="../static/notes/undercomplete_ae.png" style="width: 200px; margin-bottom: 10px;">
  <div class="encoder-text">
    <ul>
      <li><b>Benefits</b>: Prevents trivial identity learning, creates useful compressed representations,</li>
      <li><b>Limitation</b>: The learned features are optimized for the training distribution and may not generalize to diverse inputs,</li>
      <li>The encoder and decoder must have limited capacity. If they're too powerful (even with a 1D bottleneck), the decoder can still memorize by mapping each training example to a unique integer index, defeating the purpose of compression.</li>
    </ul>
  </div>
</div>

# Denoising AutoEncoders (DAE)

* Trained to remove noise from the image. DAEs are trained to take a (partially) corrupted input and recover the original undistorted input.
* We take the input(*x*), we corrupt it with noise(*x'*) and it becomes the input for the encoder. Train by minimizing the MSE loss between original and reconstructed samples.
* DAE learns features that catch important structures in the input distribution of the training data.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/dae.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/dae_ex.png" style="max-width: 100%; height: auto;">
</div>

# Variational AutoEncoders

* Based on variational inference theory
* Enforces the learning of a **regularized latent space** (with a probabilistic twist)
* Does not encode inputs as points, but as a distribution over the latent space.
	* **The latent code is sampled from the learned distribution**
	* **The decoder reconstructs the sampled distribution points**

The mean and standard deviation are now in high dimensional space (variance is the covariance matrix and the mean is also a matrix).

* E\[$logp_g (x \mid z)$\] is the entropy loss.
* $D_{KL}$ is a measure of difference between distributions.
* Aim is to **reconstruct** the input accurately and **enforcing a known distribution to the latent space**

$$\mathcal{L}_{ELBO}(x,f,g) = E[\log p_g(x|z)] - D_{KL}(q_f(z|x)||p(z))$$

Sampling does not flow back (Backpropagation through randomness is not possible). That's why we have to do a ==reparametrization trick==: Separate the randomness from the learnable (and differentiable) parameters $z = \mu + \sigma \cdot \epsilon$, where $\epsilon \approx N(0,1)$, instead of $z ~ N(\mu_{f(x)}, \sigma^2_{f(x)})$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/VAE.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/VAE_ex.png" style="max-width: 100%; height: auto;">
</div>

### VAE vs AE: latent space

* In the **AE latent space**, the clusters are not correlated in any way. It's just a visualization.
* In the **VAE latent space**, the clusters are correlated through the prior. The KL divergence term pushes all encodings toward $N(0,1)$, which:
	* centers all clusters around the origin
	* Keeps variance controlled
	* Forces the network to use the latent space efficiently
	* Creates **semantic relationships** -- similar digits tend to be closer because they share similar distributions that get pulled toward the same region of the prior. For example, digits ==4== and ==9== will always sit close to each other when semantic relationships matters.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vaevsae.png" style="max-width: 100%; height: auto;">
</div>

### Generation with VAE

* The latent space is encoded as a (Gaussian) distribution.
* Sampling a latent variable ($z$ from $N(\mu, \sigma)$) and let the decoder generate (reconstruct) an image. VAE produces recognizable digits while AE generates blurry/unclear outputs when sampling randomly.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vaevsae_digits.png" style="max-width: 100%; height: auto;">
</div>

#### Latent Space Arithmetic

* **Interpolation**: Encode two samples (e.g. digit '2' and '4'), compute $z_1$ and $z_2$, then interpolate: $z = z_1 + \alpha \cdot \triangle$ where $\triangle = z_2 - z_1$ and $\alpha \in [0,1]$.
* This results in smooth morphing between digits (2 $\rightarrow$ 4) for VAE. In the AE case, we have abrupt jumps with artifacts -- the irregular latent space means intermediate points don't decode meaningfully.

#### Attribute Manipulation

1. Compute mean latent vectors for each attribute cluster
2. Calculate attribute direction vectors in latent space
3. Add/subtract these vectors to/from an encoded image

Some examples include prompts like "make blonde" or "add glasses" which add or substract the respective vector.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vae_attribmanip.png" style="max-width: 100%; height: auto;">
</div>

# Generative Adversarial Networks (GANS)

<div class="encoder-section">
  <img src="../static/notes/GANs.png" style="width: 200px; margin-bottom: 10px;">
  <div class="encoder-text">
    <ul>
      <li>GANs are generative models based on game theory,</li>
      <li>A generator network G generates fake samples,</li>
      <li>A discriminator network D discriminates between real samples and fake generated samples.</li>
    </ul>
  </div>
</div>

### Adversarial Training 

$$\mathcal{L}_{GAN}(D,G) = \mathbb{E}_x[\log D(x)] + \mathbb{E}_z[\log(1 - D(G(z)))]$$ $$G^* = \arg\min_G \max_D \mathcal{L}(D,G)$$

* The two networks compete in a $minimax$ game:
* **G minimizes**: Makes $D(G(z)) \rightarrow 1$, fooling the discriminator
* **D maximizes**: Correctly identifying real ($\log D(x) \rightarrow 0$) and fake ($\log (1-D(G(z))) \rightarrow 0$)

### Conditional GANS

>[!summary] Conditional GANs
> * Learning a generator G to reconstruct meaningful samples only from noise **z** can cause **mode collapse**(G generates few samples only, D is in a local minimum). Mode collapse means that the training of the network is stuck. 
> * The **solution** implies conditioning: Both G and D receive an additional input **c** (condition) such as a class label, text description, or another image. This guides generation toward specific outputs. 

The loss function stays the same but we take *c* into consideration.

* Generator: $G(z,c)$ -- takes noise $z$ and condition $c$
* Discriminator: $D(x,c)$ -- evaluates if $x$ is real given condition $c$.

$$\mathcal{L}_{cGAN}(D,G) = \mathbb{E}_{c,x}[\log D(c,x)] + \mathbb{E}_{c,z}[\log(1 - D(c,G(z)))]$$

One condition for cGANs in computer vision: ALLIGNMENT (or PAIRED) (the objects are always in the same place). cGANs excel at paired image translation tasks.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cGANs.png" style="max-width: 100%; height: auto;">
</div>

### Cycle GANS

* Cycle GANs perform **unpaired image-to-image translation**: given two unpaired image sets (domains) *X* and *Y*, learn a mapping function between the two domains that transforms images from *X* into images from *Y* (and vice versa).
* Based on the concept of cycle consistency.
* Paired training samples are difficult to obtain (and scarce).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cycle_GANs.png" style="max-width: 100%; height: auto;">
</div>


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