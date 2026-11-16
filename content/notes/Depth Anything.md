---
title: Depth Anything
draft: false
tags:
date: 2026-11-16
---

[source](https://depth-anything.github.io) It's been around since 2024.

Wouter from 3DUniversum told me most [[foundation models]] use this to predict depth. I knew about [[MiDaS]] already.

Depth Anything is the most capable Monocular Depth Estimation (MDE) foundation model. It's better than [[MiDaS]] v3.1.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/depth1.png" style="max-width: 100%; height: auto;">
</div>

> Look into ControlNet

Traditionally, depth datasets are created mainly by acquiring depth data from sensors, stereo matching, or [[ai for robotics 3|SfM]]. Which is costly. So they pay attention to large-scale unlabeled data -- since monocular pictures are everywhere on the internet. 

>[!quote] We can simply use a pre-trained MDE model to assign depth labels for unlabeled images, which only takes a feedforward step
>
>So they bypass the depth maps produced by LiDARs, and the computationally intensive stereo matching process. clever.
>
>In their preliminary attempts, directly combining labeled and pseudo labeled images failed to improve the baseline of solely using labeled images. To address this, they employed a student model with a more difficult optimization target when learning the pseudo labels. The student model is enforced to seek extra visual knowledge and learn robust representations.
>
>They maintain the rich semantic priors from [[DINO]]v2 with a simple feature alignment loss. It enhances the MDE performance and also yields a multi-task encoder for perception tasks. To be more specific, it's the encoder they initialize with DINO's pre-trained weights.

**Architecture**

A teacher model $T$ learns the labeled dataset $D^l = {(x_i, d_i)}_{i=1}^M$ and then utilize it to assign pseudo depth labels for $D^u$. Finally, they train a student model $S$ on the combination of the two sets. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/depth2.png" style="max-width: 100%; height: auto;">
</div>

Interesting, in practice they detect the `sky` region, and set its disparity to 0. Quite similar to what I'm doing with Nicola, but trusting [[VGGT]]'s depth head's attention to fall onto structure instead of structureless regions such as the sky.

The perturbations they include are:

1. strong color distortion i.e. color jittering, Gaussian blurring
2. strong spatial distortion through CutMix.

"Despite the simplicity, the two modifications make our large-scale unlabeled images significantly improve the baseline of labeled images"

Another interesting thing, they employ a **invariance** idea. Basically, *the depth of a region shouldn't depend on what's pasted next to it*. The model is forced to produce the same prediction for a patch whether it appears in its original image or spliced next to a totally different image.

* _"even though I’ve corrupted your usual contextual cues by gluing two scenes together, you must still produce per-region depth as if each region were seen in isolation (matching what the teacher saw on the clean original)"_

The **feature alignment loss** is basically a cosine distance between two feature vectors.

* frozen [[DINO]]v2 encoder `f'`
* student encoder `f`
* minimize $1 - \cos_{sim}(f, f')$, averaged over spatial positions

> One detail worth knowing: they don’t force exact alignment. They use a **tolerance margin** $\alpha$, so pixels where cosine similarity already exceeds $\alpha$ are excluded from the loss. The reasoning: DINOv2 features carry semantic info that isn’t all relevant to depth, so forcing perfect alignment everywhere could hurt depth-specific learning — they just want to keep the student “close enough” to retain useful semantic priors, not clone the teacher’s features exactly.

