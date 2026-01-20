---
title: Mode Collapse
draft: false
tags:
date: 2026-01-20
---
 
Sources: [Neil Rhodes CS 152 NN--16 GANs: Mode Collapse](https://youtu.be/TLc6u8jwt7M?si=K9ehGzcScHZP5SJO), [Understanding GANs](https://youtu.be/RAa55G-oEuk?si=-lpTgi0pvpPdpp34).

Related to [[genai2|GANs]].

As a introduction, if you had a GAN, then you know it plays a maximin game

* the Generator takes random noise $z \sim p_z(z)$ and outputs a fake sample $G(z)$. The goal is to produce **fakes** that look real.
* The Discriminator takes a sample $x$ and outputs the probability that $x$ is real $D(x) \in [0,1]$. The goal is to **distinguish real data from fake data**.
* They are trained simultaneously and in opposition. It is called adversarial training.


$$
\mathcal{L}_{GAN}(D,G) = \mathbb{E}_x[\log D(x)] + \mathbb{E}_z[\log(1 - D(G(z)))]
$$
$$
G^* = \arg\min_G \max_D \mathcal{L}(D,G)
$$

* **G minimizes**: Makes $D(G(z)) \rightarrow 1$, fooling the discriminator
* **D maximizes**: Correctly identifying real ($\log D(x) \rightarrow 0$) and fake ($\log (1-D(G(z))) \rightarrow 0$)

# Mode Collapse

<div class="encoder-section">
  <img src="../static/notes/mode_collapse.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>Given Generator(G) and wide range of data z</li>
	      <ul>
	      <li>The Generator seems to only output one class or close to one class.</li>
	      <li>So, it's expressivity is rather limited. It chose to map every noise vector to the same point in data space.</li>
	      </ul>
	<li>The training process allows the mode collapse to occur.</li>
    </ul>
  </div>
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/mode_collapse_1.png" style="max-width: 100%; height: auto;">
</div>

### How to address this?

One technique is called **Minibatch Discrimination**. Basically, it gives the discriminator information about every sample in the batch as it evaluates each individual sample. This way, the discriminator can learn to detect that points are being generated when they all happen to be very close to one another.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/mode_collapse_2.png" style="max-width: 100%; height: auto;">
</div>

Another solution is [Wasserstein GANs](https://arxiv.org/pdf/1701.07875)(paper link).

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