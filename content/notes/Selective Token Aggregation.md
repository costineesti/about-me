---
title: Selective Token Aggregation with VGGT
draft: false
tags:
date: 2026-11-27
---

My Capita Selecta project at [[twente|Twente]], as a warm-up for [[Visual Place Recognition|VPR]]. It builds on a UT master thesis (Ruumpol, 2026) that put a small *geometry head* on top of a frozen [[DINO|DINOv2]] backbone and trained it on MegaDepth without any pose labels. Supervised by Nicola, who is also my thesis supervisor.

>[!question] Can [[VGGT]]'s depth confidence tell DINOv2 which patches matter for a place, and does a geometry head learn better geometry from that cleaner input?
>
>Short answer: VGGT does point at the right patches, but DINOv2 already knows them. And the head doesn't learn real geometry from *any* input.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/capita_retrieval_head_vs_nohead.png" style="max-width: 100%; height: auto;"> </div>

# The starting point

The reference pipeline encodes each image once into **one global vector** (the CLS token, 384-d) and trains two MLPs on top:

* **Projection head** $384 \rightarrow 512 \rightarrow 384$, L2-normalised. Its output is the retrieval descriptor.
* **Pose head** $[\hat f_a ; \hat f_b]$ (768) $\rightarrow 512 \rightarrow 256 \rightarrow 6$: a relative rotation $r$ (axis-angle) and translation $t$ between two cameras.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_janine_arch.png" style="max-width: 100%; height: auto;">
</div>

There are no pose labels. The only signal is **transitivity** on triplets $(a, b, c)$:

$$
(R_{ab}, t_{ab}) \circ (R_{bc}, t_{bc}) = (R_{ab}R_{bc},\; R_{ab}t_{bc} + t_{ab}) \overset{!}{=} (R_{ac}, t_{ac})
$$

plus a symmetry term ($T_{ba} = T_{ab}^{-1}$), a variance floor (std of predictions $\geq 0.1$) and an anchor/diversity term, because transitivity alone collapses to "no motion".

>[!question] My worry from the start: is "don't collapse" the same as "be correct" ??
>
>$$
>\mathcal{L}_\text{total} = \mathcal{L}_\text{trans} + \mathcal{L}_\text{sym} + \mathcal{L}_\text{var} + \mathcal{L}_\text{anchor}
>$$
>
>Transitivity has infinitely many solutions. Three of the four loss terms only push away from degenerate solutions. None of them says *which* rotation is right. That's exactly what we ended up measuring below.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/capita_arch_baseline.png" style="max-width: 100%; height: auto;"> </div>

The spearman correlation plot on the right:

* Sort the 9,600 pairs by their true rotation (the x-value).
* Cut them into 12 groups of about 800 pairs each: the 800 smallest rotations, the next 800, and so on.
* For each group, draw one dot. Its x is the group's median true angle and its y is the group's median prediction.

$\rho$ only checks ordering -- rank all pairs by true angle, rank them again by the model's output, and correlate the two rankings. 

* 1 means a larger true rotation always gets a larger prediction.
* 0 means no relation at all.
* −1 means the order is reversed

The blue dots are simply rotations on testing pairs, and we can see for instance that the model is capped at 100 degrees, for some reason.

The last panel has no head at all, just $1-\cos$ of the two CLS vectors.

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
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/capita_notes.png" style="max-width: 100%; height: auto;"> </div>
>
>$s = 48$ is the average length of the reference CLS vectors, so the head sees inputs of the usual size.
>
>* basically, since I am L2 normalizing everything the variance term in the loss function might go nuts since Janine's head expected an input of a specific size. This way, I'm multiplying $s$ to the weighted sum such that the pre-trained head sees familiar ranges of inputs.
>
>**Controls**: the same weights on *random* patches; the plain mean of all patches; CLS at 518 px.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_method1.png" style="max-width: 100%; height: auto;">
</div>

> A key takeaway is that VGGT tends to what exactly is closest, and not exactly on structure. It simply falls onto that structure in the image because it's confident in the depth it sees. But see the image below for a corner case which shows that VGGT is actually looking for what's closest and most confident of.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_arch_method1_2.png" style="max-width: 100%; height: auto;">
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

This case is even worse. The predictor is capped at 40 degrees and simply predicts 20 on average. Which is basically always selecting the mean of your range.

>[!question] Why shuffled ranks and not just zero?
>Shuffled keeps *exactly* the same numbers (same distribution, same scale) but breaks the link to *where* they are in the image. If real ≈ shuffled, the network isn't using the spatial information, only the extra input. Zero tells what the pooler learns from the tokens alone.

# Data and training

* **Triplets**: the original JSONs weren't available, so I rebuilt them from the MegaDepth COLMAP poses: rotation $120–179^\circ$, the farthest 10% by distance, 2000 triplets per scene, 80/20 split.
	* Our statistics for scene 0015 match the thesis' Table I **to every printed digit**. So that table describes one scene, and the distance is $\lVert t_i - t_j \rVert$ on COLMAP's world-to-camera translations, not camera positions.
* 8 scenes, **12,800 training triplets** and 3,200 held-out ones with known poses.
* Only the small networks are trained (DINOv2 and VGGT frozen). Adam $10^{-4}$, batch 512, 100 epochs, 3 seeds per setting. The heads train on CPU in ~4 min; Method 2 needs a GPU because all ~13.5 M patch tokens (10 GB) live in GPU memory.

> After talking to Nicola, we reduced the rotation to maximum $45^\circ$, since any more between two scenes doesn't really ensure much overlap. This was a bad design in Janine's thesis.

>[!note] How I checked "does it learn geometry?"
>On held-out pairs, compared with the COLMAP poses (never seen in training):
>* **Spearman $\rho$** between predicted and true rotation angle: does the head at least *order* pairs correctly?
>* computed **within each scene**: COLMAP's scale differs per scene, so a correlation over all scenes also rewards an input that just recognises *which* scene it is.
>* a **no-head baseline**: the same $\rho$ using only $1 - \cos(f_a, f_b)$ of the inputs. Zero training.

# What came out

**Retrieval without any head** (ROxford5k, mAP): 

| input                         | Easy      | Medium    | Hard      |
| ----------------------------- | --------- | --------- | --------- |
| Janine's reported DINOv2      | 0.818     | 0.694     | 0.444     |
| CLS224 (ours, her input)      | 0.828     | 0.685     | 0.433     |
| **CLS518**                    | **0.863** | **0.719** | **0.471** |
| Method 1, $\tau = 0.75$       | 0.679     | 0.520     | 0.248     |
| mean of patches               | 0.510     | 0.381     | 0.122     |
| random patches, $\tau = 0.75$ | 0.498     | 0.369     | 0.110     |

* The VGGT filter clearly beats random patches (significant at every $\tau$), so the confidence *is* meaningful.
* But averaging patch tokens is a much weaker descriptor than CLS. It isn't the normalisation (raw vs normalised differ by $\leq 0.002$). DINOv2's patch tokens are trained for local tasks; CLS is the token trained to summarise.

>[!question] Then what if VGGT only removes patches and CLS still does the summarising?
>Tried that: drop the least confident patches before DINOv2's blocks and keep its CLS. Dropping 25% costs nothing, more hurts, and **VGGT-chosen masks are not better than random ones**. CLS already ignores the sky by itself.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/capita_arch_maskcls.png" style="max-width: 100%; height: auto;"> </div>

**The head on top** (5 inputs × 3 seeds):

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_geometry_head_vs_similarity.png" style="max-width: 100%; height: auto;">
</div>

| input           | ρ_rot within scene | no-head ρ (1−cos) | ρ_trans within scene | no-head ρ (1−cos) | cycle error  | ROxford Hard: no head $\rightarrow$ after head |
| --------------- | ------------------ | ----------------- | -------------------- | ----------------- | ------------ | ---------------------------------------------- |
| cls224          | 0.16               | ==0.23==          | 0.19                 | 0.14              | 0.24$^\circ$ | 0.43 $\rightarrow$ 0.23                        |
| cls518          | 0.19               | ==0.25==          | 0.21                 | 0.11              | 0.33$^\circ$ | 0.47 $\rightarrow$ 0.28                        |
| Method 1 filter | 0.13               | ==0.18==          | 0.11                 | 0.09              | 0.24$^\circ$ | 0.25 $\rightarrow$ 0.11                        |
| mean            | 0.13               | ==0.17==          | 0.24                 | 0.12              | 0.25$^\circ$ | 0.12 $\rightarrow$ 0.05                        |
| random          | 0.13               | ==0.17==          | 0.24                 | 0.12              | 0.24$^\circ$ | 0.11 $\rightarrow$ 0.06                        |

* **No rotation is learned beyond similarity.** For every input, plain $1-\cos$ of the inputs orders pairs by true rotation *better* than the trained head (e.g. 0.23 vs 0.16 for CLS 224).
* **Consistent, not correct.** The cycle $a \rightarrow b \rightarrow c$ vs $a \rightarrow c$ closes to ~0.25$^\circ$ on new triplets, yet the angle error is never better than always guessing the median. Each head has a **ceiling** (≈104$^\circ$, ≈92$^\circ$, ≈40$^\circ$) and a pile of predictions near 0$^\circ$. It squeezes rotations into a range where they're easy to keep consistent.
* **The head hurts retrieval** for every input (CLS 224: 0.43 $\rightarrow$ 0.23), and the input ranking stays the same.

>[!danger] A trap I almost fell into
>With all scenes pooled, Method 1 looked $2.5 \times$ **better** than the mean for rotation (0.152 vs 0.064). Within each scene the difference is **zero** (0.13 vs 0.13). The descriptor was separating *scenes*, not judging rotation. Always split by group before trusting a correlation.
>
>| input           | $\rho_{rot}$ (all scenes pooled) | $\rho_{rot}$ within scene |
>| --------------- | --------------------------------------- | -------------------------------- |
>| Method 1 filter | 0.152                                   | 0.129                            |
>| mean            | 0.064                                   | 0.132                            |
>| random          | 0.060                                   | 0.129                            |
>
>**What "pooled" vs "within scene" means**
>* **Pooled:** put all 9,600 test pairs from the 8 scenes in one list, then compute one Spearman $\rho$.
>* **Within scene:** compute $\rho$ separately for each scene's ~1,200 pairs, then average the 8 values.

**Method 2**: real ≈ shuffled ≈ zero on geometry, retrieval, and even the training loss.

* At lr $10^{-4}$ the pooler barely moves from the mean. With the pooler at $10^{-3}$ it really moves (it uses ~$45\%$ of the patches, cosine with the mean ~0.8), and real vs zero are *still* the same.
* Both versions end up putting ~$40–47\%$ of their weight on the $25\%$ most confident patches. **Without being told the confidence**, the loss pushes the pooler towards the patches VGGT is confident about. The information is already in DINOv2's tokens.

>[!question] Does this mean the reference model looks at the sky?
>Partly, yes, and it's visible here too. With a head trained on the *structure-filtered* input, the sky becomes the **most** similar region after projection (last column). The projection doesn't preserve "where to look"; filtering the input doesn't fix that.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/capita_patches_q00_hard.png" style="max-width: 100%; height: auto;"> </div>

>[!info] My thoughts
>* Method 1 on this image keeps the **shadowed lower facade on the right** and drops both towers. That's exactly the drawback I suspected in the prototype: VGGT is confident about *close* structure, not about the landmark.
>* So is VGGT useless here?
>	* Not useless, **redundant**. It beats random selection when patches are averaged, but DINOv2 already encodes the same information: CLS ignores those patches, and a learned pooler finds them on its own.
>* Is the problem the input or the objective?
>	* The objective. If the head can't beat raw cosine similarity on rotation for *any* input, no input change can show a benefit. ==The losses prevent collapse, but nothing points to the correct pose.==
>* Then where should VGGT go?
>	* As a **teacher**, not a filter: pseudo-labels for relative rotation, gated by VGGT's own confidence (supervised where VGGT is sure, transitivity where it isn't). MegaDepth even has real poses for a small supervised warm-up.
>	* Or use its aggregated tokens / pose outputs instead of only the confidence.

==Next: discuss with Nicola which of these to focus on. One topic only.==

# Nicola's 45$^\circ$ test

Nicola's objection: the plots go up to 180$^\circ$, and two photos taken 180$^\circ$ apart can't show the same thing. So the head is asked to predict a pose it has **no way to see**.

He's right, and the data confirms it. Janine's pairs are either 120–179$^\circ$ apart or among the farthest 10% of camera pairs. In 6 of the 8 scenes, the median training pair shares **0** COLMAP 3D points: the two images have nothing in common. The held-out triplet doesn't save this either. Every pair inside the triplet (a–b, b–c, and the uncontrolled a–c) has the same problem.

>[!question] Does Janine limit the angle anywhere else?
>No. The only limit is in the data selection (`ROT_MIN=120, ROT_MAX=179` in her `dataset_from_zip.py`). The pose head outputs an unconstrained axis-angle, and nothing in the loss caps it.

**The test (E04):** change *only* the data. Every pair of a triplet, a–c included, must be within **0–45$^\circ$**. Model, loss, training, the 5 inputs × 3 seeds and Method 2 (real vs zero, pooler lr $10^{-3}$) all stay the same.

The overlap goes up, but not everywhere:

| scene | median rotation a–b | shared 3D points a–b (before: 120–179$^\circ$) |
| ----- | ------------------- | --------------------------------------- |
| 0001  | 21$^\circ$                 | 9 (0)                                   |
| 0005  | 21$^\circ$                 | 2 (0)                                   |
| 0012  | 24$^\circ$                 | 12 (3)                                  |
| 0015  | 19$^\circ$                 | 8 (0)                                   |
| 0016  | 22$^\circ$                 | 18 (0)                                  |
| 0020  | 14$^\circ$                 | 48 (0)                                  |
| 0022  | 20$^\circ$                 | 5 (5)                                   |
| 0023  | 22$^\circ$                 | 81 (6)                                  |

>[!info] Rotation ≠ overlap
>Two cameras can face the same direction from opposite ends of a square and see completely different facades. The 45$^\circ$ cap removes pairs that *face away* from each other, but not pairs that are *far apart*. That's why the large scenes (0005, 0015) still share very few points. I didn't add an overlap criterion on purpose: one change at a time, so the result can be attributed to it.

## Results

Held-out pairs, all within $45^\circ$ (9,600 pairs, true median angle $19.7^\circ$), mean of 3 seeds:

| head                                        | $\rho_{rot}$ within scene | full rotation error     | cycle error  |
| ------------------------------------------- | ------------------------- | ----------------------- | ------------ |
| trained on 0–45$^\circ$ (E04)               | 0.07–0.13                 | 40–49$^\circ$           | ~0.2$^\circ$ |
| trained on 120–179$^\circ$ (E02), same test | 0.13–0.18                 | 27–38$^\circ$           | ~0.2$^\circ$ |
| Method 2, real / zero confidence            | 0.08 / 0.08               | 34$^\circ$ / 33$^\circ$ | ~0.2$^\circ$ |
| **no head:** $1-\cos$ of the inputs         | ==0.27–0.30==             | –                       | –            |
| **always predict "no rotation"**            | –                         | ==19.7==$^\circ$        | –            |

Zooming in, it reads as:

| tested on the 0–45$^\circ$ pairs       | $\rho$ within scene | full error    |
| -------------------------------------- | ------------------- | ------------- |
| old heads (trained on 120–179$^\circ$) | 0.13–0.18           | 27–38$^\circ$ |
| new heads (trained on 0–45$^\circ$)    | 0.07–0.13           | 40–49$^\circ$ |

Per input (E04 heads):

| input           | $\rho_{rot}$ within scene | no-head $1-\cos$ | predicted median angle | full rotation error | ROxford Hard (E02 head) |
| --------------- | ------------------------- | ---------------- | ---------------------- | ------------------- | ----------------------- |
| cls224          | 0.07                      | ==0.27==         | 43$^\circ$                    | 49.0$^\circ$               | 0.200 (0.230)           |
| cls518          | 0.10                      | ==0.30==         | 32$^\circ$                    | 40.1$^\circ$               | 0.158 (0.279)           |
| Method 1 filter | 0.08                      | ==0.28==         | 44$^\circ$                    | 49.2$^\circ$               | 0.068 (0.112)           |
| mean            | 0.13                      | ==0.29==         | 40$^\circ$                    | 44.6$^\circ$               | 0.053 (0.052)           |
| random          | 0.12                      | ==0.28==         | 37$^\circ$                    | 41.9$^\circ$               | 0.053 (0.059)           |

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/capita_geometry_rot45.png" style="max-width: 100%; height: auto;">
</div>

* **Still no rotation beyond similarity**, now on pairs that *can* be matched. Plain $1-\cos$ is $2-4 \times$ better than the trained head at ordering pairs by rotation (compare first column with second column).
* **Worse than predicting nothing.** Every head's full rotation error ($33–49^\circ$) is above the $19.7^\circ$ of always saying "no rotation". Cycles still close to $~0.2^\circ$ -- consistent, not correct.
* **Narrow training data is worse than wide.** On the *same* $0–45^\circ$ test, the heads trained on $120–179^\circ$ beat the ones trained on $0–45^\circ$.
* **Method 2: real ≈ zero confidence again.** Retrieval after the head is equal to or lower than before.

>[!question] Why the predicted scale is arbitrary
>The heads predict a median of $32–44^\circ$ when the truth is $20^\circ$. Janine's loss only has a **variance floor**, $\text{ReLU}(0.1 - \text{std})$ per output dimension: the predictions must spread out *at least* this much, never how much. Transitivity holds just as well if every rotation is twice as large. So nothing in the loss fixes the scale, and the head picks one.

>[!question] Why 0–45$^\circ$ is the harder test
>Two "dumb" predictors that need no training, and their typical (median) error on each test set:
>
>**The median true angle explanation**: by computing `median_gt_angle = median(theta)`. Each test pair has a true rotation angle $\theta$ from COLMAP.
>
>* $120-179^\circ$ test set gives $54.4^\circ$
>* $0-45^\circ$ test set gives $19.7^\circ$
>
>| always predict…                       | 120–179$^\circ$ test | 0–45$^\circ$ test |
>| ------------------------------------- | ------------- | ---------- |
>| the median true angle (54.4$^\circ$ / 19.7$^\circ$) | 38.6$^\circ$         | **9.1$^\circ$**   |
>| "no rotation" (0$^\circ$)                    | 54.4$^\circ$         | **19.7$^\circ$**  |
>
>* "No rotation" is off by exactly the true angle, so its error is the median true angle.
>	* If you always answer $0^\circ$, the error on each pair is $\theta$ itself.
>* On 0–45$^\circ$, all true angles lie in a narrow range, so both dumb predictors are already close. Every rotation the head invents is measured against that small error.
>* The E04 heads are worse than both: their angle error is 24–31$^\circ$ (vs 9.1$^\circ$), and their full rotation error is 40–49$^\circ$ (vs 19.7$^\circ$). On the 120–179$^\circ$ test, the same weakness was hidden, because the dumb predictors were off by 39–54$^\circ$ too.
>
>**A head is only useful if it beats these lazy guesses! They are the bar.**
>
>|                                   | lazy guess                     | E02 heads, old test set (120–179$^\circ$) | E04 heads, new test set (0–45$^\circ$)      |
>| --------------------------------- | ------------------------------ | ----------------------------------------- | ------------------------------------------- |
>| angle error vs "say the median"   | 38.6$^\circ$ / 9.1$^\circ$     | 38–49$^\circ$ (about the bar)             | 24–31$^\circ$ (**3$\times$ worse** than 9.1$^\circ$)  |
>| full error vs "say 0$^\circ$"     | 54.4$^\circ$ / 19.7$^\circ$    | –                                         | 40–49$^\circ$ (**2$\times$ worse** than 19.7$^\circ$) |

>[!note] Why the cross-evaluation settles it
>Without testing the old (E02) heads on the same 0–45$^\circ$ pairs, a lower $\rho$ could be blamed on a harder test set. Same test, different training data, and the old heads win. So the data was not what held the head back.
>
>**For full clarity**: the heads were trained both on the $0-45^\circ$ triplets (E04) and on the old heads (E02, trained on $120-179^\circ$) and both were tested on the same $0-45^\circ$ test pairs.

>[!info] My thoughts
>* Was Nicola right that 180$^\circ$ pairs make no sense?
>	* Yes: they share no points. But removing them **doesn't help**. The head fails on observable pairs too.
>* So is it the data or the loss?
>	* ==The loss.== Transitivity, symmetry, the variance floor and the anchor term are all satisfied by *any* invented, self-consistent set of orientations. With nothing tying the prediction to the true pose or to its scale, more sensible data can't fix it.
>* What would fix it?
>	* Something that pins the scale and the direction: real (or VGGT-estimated) poses for at least some pairs, e.g. a short supervised warm-up on MegaDepth poses, then transitivity.
>	* Requiring a minimum number of shared 3D points per pair is the next data filter, but after this result I'd expect it to fail as well.

**Related**

* [[Visual Place Recognition]], [[VGGT]], [[DINO]], [[CoMe|Co-Me]], [[SALAD]], [[ViT]], [[foundation models]]
