---
title: "Capita Selecta: Selective Token Aggregation with VGGT"
draft: false
tags:
date: 2026-11-25
---

My Capita Selecta project at [[twente|Twente]], as a warm-up for [[Visual Place Recognition|VPR]]. It builds on a UT master thesis (Ruumpol, 2026) that put a small *geometry head* on top of a frozen [[DINO|DINOv2]] backbone and trained it on MegaDepth without any pose labels.

>[!question] Can [[VGGT]]'s depth confidence tell DINOv2 which patches matter for a place, and does a geometry head learn better geometry from that cleaner input?

Short answer, after one long day on the cluster: VGGT does point at the right patches, but DINOv2 already knows them. And the head doesn't learn real geometry from *any* input.

# The starting point

The reference pipeline encodes each image once into **one global vector** (the CLS token, 384-d) and trains two MLPs on top:

* **Projection head** $384 \rightarrow 512 \rightarrow 384$, L2-normalised. Its output is the retrieval descriptor.
* **Pose head** $[\hat f_a ; \hat f_b]$ (768) $\rightarrow 512 \rightarrow 256 \rightarrow 6$: a relative rotation $r$ (axis-angle) and translation $t$ between two cameras.

There are no pose labels. The only signal is **transitivity** on triplets $(a, b, c)$:

$$
(R_{ab}, t_{ab}) \circ (R_{bc}, t_{bc}) = (R_{ab}R_{bc},\; R_{ab}t_{bc} + t_{ab}) \overset{!}{=} (R_{ac}, t_{ac})
$$

plus a symmetry term ($T_{ba} = T_{ab}^{-1}$), a variance floor (std of predictions $\geq 0.1$) and an anchor/diversity term, because transitivity alone collapses to "no motion".

>[!question] My worry from the start: is "don't collapse" the same as "be correct"?
>Transitivity has infinitely many solutions. Three of the four loss terms only push away from degenerate solutions. None of them says *which* rotation is right. That's exactly what we ended up measuring below.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_baseline.png" style="max-width: 100%; height: auto;">
</div>

# The idea

The CLS token summarises the *whole* image: sky, people, cars. VGGT's depth head gives a confidence per pixel, $c = 1 + e^{\text{logit}} \geq 1$. It's high on facades and low on sky (see my [[CoMe|Co-Me]] notes for the same idea used for token merging). Both models use $14 \times 14$ patches, so after average-pooling the confidence, each DINOv2 patch token $T_i$ gets one confidence $c_i$.

* Raw confidences aren't comparable between images, so I use the **rank within the image**, $r_i \in [0, 1]$.

>[!summary] Method 1: fixed filter, $f = \sum w_i x_i$
>Keep the top $(1-\tau)$ of patches by rank, weight them by rank, pool:
>
>$$
>w_i \propto r_i \cdot \mathbb{1}[r_i \geq \tau], \qquad f = s \cdot \frac{\sum_i w_i \hat T_i}{\lVert \sum_i w_i \hat T_i \rVert}
>$$
>
>$s = 48$ is the average length of the reference CLS vectors, so the head sees inputs of the usual size.
>
>**Controls**: the same weights on *random* patches; the plain mean of all patches; CLS at 518 px.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_method1.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] Method 2: let a network decide, $f = \varphi([x, d])$
>A small MLP scores every patch from its token *and* its confidence rank. A softmax turns the scores into weights:
>
>$$
>s_i = a_\theta([\hat T_i ; \rho_i]), \qquad w_i = \frac{e^{s_i}}{\sum_j e^{s_j}}, \qquad f = s \cdot \text{normalize}\Big(\sum_i w_i \hat T_i\Big)
>$$
>
>* $a_\theta: 385 \rightarrow 64 \rightarrow 1$, trained **together** with the projection and pose heads, using the same loss.
>* The last layer starts at zero: at step 0 all weights are equal, i.e. the plain mean. Anything else is learned.
>* Three versions of $\rho_i$: the real rank, the rank **shuffled** within the image, or **zero**. If VGGT helps, *real* should win.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_method2.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Why shuffled ranks and not just zero?
>Shuffled keeps *exactly* the same numbers (same distribution, same scale) but breaks the link to *where* they are in the image. If real ≈ shuffled, the network isn't using the spatial information, only the extra input. Zero tells what the pooler learns from the tokens alone.

# Data and training

* **Triplets**: the original JSONs weren't available, so I rebuilt them from the MegaDepth COLMAP poses: rotation 120–179°, the farthest 10% by distance, 2000 triplets per scene, 80/20 split.
	* Our statistics for scene 0015 match the thesis' Table I **to every printed digit**. So that table describes one scene, and the distance is $\lVert t_i - t_j \rVert$ on COLMAP's world-to-camera translations, not camera positions.
* 8 scenes, **12,800 training triplets** and 3,200 held-out ones with known poses.
* Only the small networks are trained (DINOv2 and VGGT frozen). Adam $10^{-4}$, batch 512, 100 epochs, 3 seeds per setting. The heads train on CPU in ~4 min; Method 2 needs a GPU because all ~13.5 M patch tokens (10 GB) live in GPU memory.

>[!note] How I checked "does it learn geometry?"
>On held-out pairs, compared with the COLMAP poses (never seen in training):
>* **Spearman $\rho$** between predicted and true rotation angle: does the head at least *order* pairs correctly?
>* computed **within each scene**: COLMAP's scale differs per scene, so a correlation over all scenes also rewards an input that just recognises *which* scene it is.
>* a **no-head baseline**: the same $\rho$ using only $1 - \cos(f_a, f_b)$ of the inputs. Zero training.

# What came out

**Retrieval without any head** (ROxford5k, Hard mAP): CLS 518 **0.47**, CLS 224 0.43, Method 1 0.25, mean of patches 0.12, random patches 0.11.

* The VGGT filter clearly beats random patches (significant at every $\tau$), so the confidence *is* meaningful.
* But averaging patch tokens is a much weaker descriptor than CLS. It isn't the normalisation (raw vs normalised differ by ≤ 0.002). DINOv2's patch tokens are trained for local tasks; CLS is the token trained to summarise.

>[!question] Then what if VGGT only removes patches and CLS still does the summarising?
>Tried that: drop the least confident patches before DINOv2's blocks and keep its CLS. Dropping 25% costs nothing, more hurts, and **VGGT-chosen masks are not better than random ones**. CLS already ignores the sky by itself.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_maskcls.png" style="max-width: 100%; height: auto;">
</div>

**The head on top** (5 inputs × 3 seeds):

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_geometry_head_vs_similarity.png" style="max-width: 100%; height: auto;">
</div>

* **No rotation is learned beyond similarity.** For every input, plain $1-\cos$ of the inputs orders pairs by true rotation *better* than the trained head (e.g. 0.23 vs 0.16 for CLS 224).
* **Consistent, not correct.** The cycle $a \rightarrow b \rightarrow c$ vs $a \rightarrow c$ closes to ~0.25° on new triplets, yet the angle error is never better than always guessing the median. Each head has a **ceiling** (≈104°, ≈92°, ≈40°) and a pile of predictions near 0°. It squeezes rotations into a range where they're easy to keep consistent.
* **The head hurts retrieval** for every input (CLS 224: 0.43 → 0.23), and the input ranking stays the same.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_retrieval_head_vs_nohead.png" style="max-width: 100%; height: auto;">
</div>

>[!danger] A trap I almost fell into
>With all scenes pooled, Method 1 looked **2.5× better** than the mean for rotation (0.15 vs 0.06). Within each scene the difference is **zero** (0.13 vs 0.13). The descriptor was separating *scenes*, not judging rotation. Always split by group before trusting a correlation.

**Method 2**: real ≈ shuffled ≈ zero on geometry, retrieval, and even the training loss.

* At lr $10^{-4}$ the pooler barely moves from the mean. With the pooler at $10^{-3}$ it really moves (it uses ~45% of the patches, cosine with the mean ~0.8), and real vs zero are *still* the same.
* Both versions end up putting ~40–47% of their weight on the 25% most confident patches. **Without being told the confidence**, the loss pushes the pooler towards the patches VGGT is confident about. The information is already in DINOv2's tokens.

>[!question] Does this mean the reference model looks at the sky?
>Partly, yes, and it's visible here too. With a head trained on the *structure-filtered* input, the sky becomes the **most** similar region after projection (last column). The projection doesn't preserve "where to look"; filtering the input doesn't fix that.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_patches_q00_hard.png" style="max-width: 100%; height: auto;">
</div>

>[!question] My thoughts
>* Method 1 on this image keeps the **shadowed lower facade on the right** and drops both towers. That's exactly the drawback I suspected in the prototype: VGGT is confident about *close* structure, not about the landmark.
>* So is VGGT useless here?
>	* Not useless, **redundant**. It beats random selection when patches are averaged, but DINOv2 already encodes the same information: CLS ignores those patches, and a learned pooler finds them on its own.
>* Is the problem the input or the objective?
>	* The objective. If the head can't beat raw cosine similarity on rotation for *any* input, no input change can show a benefit. ==The losses prevent collapse, but nothing points to the correct pose.==
>* Then where should VGGT go?
>	* As a **teacher**, not a filter: pseudo-labels for relative rotation, gated by VGGT's own confidence (supervised where VGGT is sure, transitivity where it isn't). MegaDepth even has real poses for a small supervised warm-up.
>	* Or use its aggregated tokens / pose outputs instead of only the confidence.

==Next: discuss with Nicola which of these to focus on. One topic only.==

>[!summary] Related
>* [[Visual Place Recognition]], [[VGGT]], [[DINO]], [[CoMe|Co-Me]], [[SALAD]], [[ViT]], [[foundation models]]
