---
title: Untitled
draft: true
tags:
---

# Selective token aggregation with VGGT — what we did and what we found

Capita Selecta Robotics · Costin Chitic · supervisor dr. Nicola Strisciuglio · status 2026-11-25

---

## In short

- **The idea.** Janine's model starts from one DINOv2 vector per image (the CLS token). We tried to build that vector only from the parts of the image VGGT is confident about (buildings rather than sky), either with a fixed rule (Method 1) or with a small learned network (Method 2), and then train her head on it.

- **VGGT's confidence does point at useful patches**: keeping the confident patches is clearly better than keeping random ones. But averaging patches is a much weaker image descriptor than DINOv2's own CLS token, and when CLS does the aggregation, VGGT adds nothing — DINOv2 already ignores sky and ground by itself.

- **Janine's head does not learn real geometry, whatever we feed it.** On held-out image pairs its predicted rotations are perfectly self-consistent (A→B→C equals A→C) but not correct. Simply comparing the two input vectors (1 − cosine) predicts the true rotation *better* than the trained head.

- **Method 2 (learned pooling) gives the same result with real, shuffled or no confidence**, also when the pooler is allowed to move 10× faster. Even without any confidence input it learns to favour confident patches: that information is already inside the DINOv2 tokens.

- **takeaway:** the bottleneck is the training objective, not the input. Changing what goes into the
  head cannot show a benefit while the transitivity loss does not force real geometry.

---

## 1. Context (from my notes)

### 1.1 Janine's thesis in a few sentences
Janine asked whether a small "geometry head" on top of a *frozen* foundation model can make visual place recognition (VPR) more robust to large viewpoint changes, **without using ground-truth camera poses**.

- Each image is encoded once by a frozen backbone (DINOv2 ViT-S/14 or CLIP) into **one global vector** (384-d for DINOv2, the CLS token at 224×224).
- A **projection head** (MLP) maps that vector to a new one, the descriptor used for retrieval.
- A **pose head** (MLP) takes two projected vectors and predicts the relative motion between the two cameras: a rotation (3 numbers, axis-angle) and a translation (3 numbers).
- There are no pose labels. The only signal is **transitivity** on image triplets (a, b, c): going a→b and then b→c must give the same motion as going a→c directly.
- Training data: MegaDepth (tourist photos of landmarks with COLMAP reconstructions). Evaluation of retrieval:  ROxford5k (Easy / Medium / Hard).

### 1.2 Her loss, term by term
| term | what it asks | why it is there |
|---|---|---|
| transitivity | rotation and translation of a→b→c should match a→c | the actual self-supervised signal |
| symmetry (inverse) | b→a should be the inverse of a→b | consistency |
| variance floor | the spread of predicted rotations/translations in a batch must not drop below 0.1 | without it the model predicts "no motion" for everything, which satisfies transitivity trivially |
| anchor | predictions for different pairs in a batch should not all be the same (exp(−distance) between 64 predictions) | another anti-collapse term |
| (Z-variance, similarity preservation) | VICReg-style variance on the head's hidden layer; keep projected similarities close to the original ones | switched off in her final configuration (similarity preservation is her λ) |

### 1.3 What she concluded, and what I noticed
- Her conclusion: transitivity adds some geometric *consistency*, but the model cannot turn that into useful outputs; projection hurts retrieval unless the similarity-preservation term keeps it close to the original (ROxford Hard: original 0.444, projected λ=0 0.365, λ=5 0.422).

- My concerns going in:
  1. Transitivity alone cannot identify the true poses — infinitely many consistent solutions exist. Three of the five loss terms only say "don't collapse"; none says "this is the right direction".
  2. Predicting relative geometry from two *global* vectors is very hard; geometry lives in local correspondences.
  3. Her heatmaps showed the sky contributing a lot to similarity, which suggested removing uninformative regions.

### 1.4 What we agreed with Nicola
- One quarter, a small project: **focus on one question**. Look into VGGT first.
- The chosen direction: **selective token aggregation** — use VGGT's 3D depth head as a frozen filter that selects the DINOv2 patch tokens that matter, build the global vector from those, and feed it to Janine's head. Distillation (VGGT as teacher) stays an open question for the end.
- Two ways to inject the confidence: (1) multiply it in, f = Σ wᵢ·xᵢ (Method 1); (2) let a network combine tokens and confidence, f = φ([x, d]) (Method 2). The 1-D CNN variant was dropped.
- Goal: the head learns geometry; better retrieval would be a consequence.

### 1.5 My prototype (E00, Sep–Oct)
- VGGT's **depth confidence** (one value per pixel, = 1 + exp(logit), so always ≥ 1) is high on facades and low on sky, people and shop windows. Averaged over 14×14 patches it lines up exactly with DINOv2's patch grid.
- VGGT's **poses** were unreliable under large viewpoint change (71.8° error on one ShopFacade pair), so VGGT is used only as a filter.
- Known drawbacks: confidence also favours *close* structure (a gate rather than the distant towers); per-image ranks always drop the same share of patches, even from an image that is all building; sky is only partly removed.

---

## 2. What I built

- **Folder**: `src/vpr/` (our code), `src/transitivity/` (Janine's code, untouched), `jobs/` (cluster scripts),`experiments/E00…E03/` (one folder per experiment with a README) and `experiments/LOG.md` (one line each).
- **Cluster**: UT EEMCS HPC, Slurm. Python 3.13 venv with torch 2.10, DINOv2 and VGGT-1B weights stored locally.
- **Data**: ROxford5k (70 queries, 4,993 database images) and 8 MegaDepth scenes
  (0001 0005 0012 0015 0016 0020 0022 0023, reconstruction `manhattan/0`).

---

## 3. Methods

### 3.1 What we extract per image (once, then cached)
- The image is resized so the longer side is 518 px and both sides are multiples of 14 (native aspect ratio).
- **DINOv2 ViT-S/14** gives the CLS token (`cls518`) and one 384-d **patch token** Tᵢ per 14×14 patch (about 1,000 patches per image). Tokens are L2-normalised (T̂ᵢ).
- Janine's input is reproduced too: CLS at a squashed 224×224 (`cls224`).
- **VGGT-1B** (only the backbone and depth head) gives the depth confidence map, averaged over each 14×14 patch → cᵢ.
- **Rank** rᵢ ∈ \[0, 1\]: the percentile of cᵢ within its own image (0 = least confident patch, 1 = most).
  Ranks make images comparable because raw confidence values vary a lot between images.

### 3.2 Method 1 — fixed confidence-weighted pooling
- Drop every patch with rank below τ (τ = 0.25, 0.5, 0.75 → keep 75%, 50%, 25%).
- Weight the survivors by their rank, sum the unit tokens, normalise: **f = s · normalize(Σ wᵢ T̂ᵢ)**.
- s = 48.05, the average length of Janine's CLS vectors, so the head sees inputs of the usual size.
- Controls (same code, one thing changed):
  - `random_rank_τ`: the same weights given to **randomly chosen** patches (same number kept) → is it VGGT or just "fewer patches"?
  - `mean`: plain average of all patches → is it the filtering or the averaging?
  - `cls518` vs `cls224`: is it just the higher resolution?

### 3.3 Method 2 — learned attention pooling, φ([x, d])
- A small network a_θ looks at each patch's token *and* its confidence rank and gives it a score:
  **sᵢ = a_θ([T̂ᵢ ; rᵢ])**, with a_θ: 385 → 64 → ReLU → 1.
- Scores become weights with a softmax over the patches of the image: wᵢ = softmax(sᵢ), and
  **f = 48.05 · normalize(Σ wᵢ T̂ᵢ)**, which goes into Janine's head.
- The last layer starts at zero, so at the start every patch gets the same weight: each run **starts as the `mean` input** and any deviation is learned.
- Trained **together** with Janine's projection and pose heads, with her loss (gradients flow into a_θ).
- Three versions of the confidence input, same everything else:
  - `real`: the true ranks;
  - `shuffled`: the same ranks randomly permuted within each image (fixed per image) — same numbers, no link to the content;
  - `zero`: no confidence at all.
  If `real` beats `shuffled` and `zero`, VGGT's spatial information is what helps.

### 3.4 Janine's head and loss (used unchanged, imported from her code)
- Projection head 384 → 512 → ReLU → 384, then L2 normalisation. Pose head \[f_a; f_b\] (768) → 512 → 256 → 6.
- Her final configuration: transitivity + symmetry (weight 0.5) + variance floor (target 0.1, weight 5) + anchor; no Z-variance; no similarity preservation (λ = 0).
- Her quirks, replicated on purpose: `train()` calls the loss with its default weights regardless of its own arguments, and keeps the epoch with the lowest *training* loss (there is no validation).

### 3.5 Training data: rebuilding her triplets
- Her triplet files were not available, so I regenerated them from COLMAP poses following her thesis:
	  - **rotation pool**: image pairs whose relative rotation is 120–179°;
	  - **distance pool**: the farthest 10% of pairs by camera distance;
	  - **hard pool**: pairs in both;
	  - triplets are built around anchor images from these pools; 2,000 per scene, 80% train / 20% test, seed 42.
- **Check:** for scene 0015 with distance measured as ‖tᵢ − tⱼ‖ (the COLMAP translation vectors, which are *not* camera positions), our statistics match her Table I **to every printed digit** (134,932 / 294,881 / 9,241 pairs and all means/medians/maxima). So her Table I describes scene 0015 only, and we use exactly her recipe.
- Result: 8 scenes × 1,600 = **12,800 training triplets**, and 8 × 400 = 3,200 held-out test triplets (9,600 directed image pairs) with known true poses.

### 3.6 Training (everything below was trained on MegaDepth)

Only the small networks are trained; DINOv2 and VGGT stay frozen.

| | E02 (Janine's head on different inputs) | E03 (Method 2) |
|---|---|---|
| trained | projection + pose head | pooler a_θ + projection + pose head |
| inputs | cls224, cls518, mean, filter_rank_0.75, random_rank_0.75 | patch tokens + real / shuffled / zero ranks |
| runs | 5 inputs × 3 seeds = 15 | 3 modes × 3 seeds = 9, + real/zero × 3 seeds with pooler lr 1e-3 (E03b) |
| optimiser | Adam, lr 1e-4, no weight decay | same; pooler lr 1e-4 (ablation 1e-3) |
| schedule | batch 512, 100 epochs, early stop after 50 without gain, best training loss kept, gradient clip 1.0 | same |
| hardware | CPU node, ~4 min per run | one L40 GPU (all tokens on the GPU, 10.4 GB), ~4 min per run |

### 3.7 How we evaluate

**Retrieval (ROxford5k).** Rank the 4,993 database images by cosine similarity to each query and compute mAP for Easy / Medium / Hard (standard revisitop protocol). Differences are tested with a paired bootstrap over queries (is the 95% confidence interval away from zero?).

**Geometry (MegaDepth held-out triplets, against the COLMAP poses — never used in training).** For every test pair:
- **ρ_rot**: does the head *order* pairs correctly by true rotation angle? (Spearman correlation; 1 = perfect, 0 = none)
- **ρ_trans**: the same for predicted translation length vs true camera distance.
- **within scene**: the correlations are computed per scene and averaged. COLMAP's scale differs per scene, so a correlation over all scenes together also rewards an input that merely recognises *which scene* it is.
- **no-head baseline**: the same correlation using only 1 − cosine of the two input vectors. No training at all.
  A head that does not beat this has learned nothing beyond "these images look different".
- **angle error** vs a constant guess (always predicting the median angle), and **cycle error** (how far a→b→c is from a→c on test data, i.e. transitivity itself).

---

## 4. Results

### E01 — Retrieval without any head (does the input itself work?)

| input                    | Easy      | Medium    | Hard      |
| ------------------------ | --------- | --------- | --------- |
| Janine's reported DINOv2 | 0.818     | 0.694     | 0.444     |
| cls224 (ours, her input) | 0.828     | 0.685     | 0.433     |
| **cls518**               | **0.863** | **0.719** | **0.471** |
| Method 1, τ = 0.75       | 0.679     | 0.520     | 0.248     |
| mean of patches          | 0.510     | 0.381     | 0.122     |
| random patches, τ = 0.75 | 0.498     | 0.369     | 0.110     |

- Our evaluation reproduces Janine's numbers (within 0.011), so comparisons with her work are fair.
- Higher resolution with the native aspect ratio helps (cls518 > cls224, significant).
- **VGGT selects better patches than chance**: Method 1 beats random by +0.06 to +0.19 at every τ (significant).
- **But averaging patches loses badly to CLS** (Hard 0.25 vs 0.47), and mixing the two scores never beats CLS alone.

### E01b — Why does averaging lose, and does VGGT help CLS?

- Not because of normalising the tokens (raw vs normalised: difference ≤ 0.002). DINOv2's patch tokens are trained for local tasks; the CLS token is the one trained to summarise the image.
- **Masking patches before CLS**: removing the 25% least confident patches costs nothing (0.473 vs 0.471), more masking hurts, and **VGGT-chosen masks are no better than random masks**. CLS already ignores uninformative regions.

### E02 — Janine's head trained on five inputs (3 seeds each)

| input           | $\rho_{rot}$ within scene | no-head ρ (1−cos) | $\rho_{trans}$ within scene | no-head ρ (1−cos) | cycle error | ROxford Hard: no head → after head |
| --------------- | ------------------------- | ----------------- | --------------------------- | ----------------- | ----------- | ---------------------------------- |
| cls224          | 0.16                      | ==0.23==          | 0.19                        | 0.14              | 0.24°       | 0.43 → 0.23                        |
| cls518          | 0.19                      | ==0.25==          | 0.21                        | 0.11              | 0.33°       | 0.47 → 0.28                        |
| Method 1 filter | 0.13                      | ==0.18==          | 0.11                        | 0.09              | 0.24°       | 0.25 → 0.11                        |
| mean            | 0.13                      | ==0.17==          | 0.24                        | 0.12              | 0.25°       | 0.12 → 0.05                        |
| random          | 0.13                      | ==0.17==          | 0.24                        | 0.12              | 0.24°       | 0.11 → 0.06                        |

What this says, in words:
1. **No rotation is learned beyond similarity.** For every input, plain 1 − cosine of the inputs orders pairs by true rotation better than the trained head (bold column). The head's rotation is a blurred copy of "how different do the images look".
2. **Consistent but not correct.** The cycle error on new triplets is tiny (~0.25°): ==transitivity is satisfied. Yet the angle error is never better than always guessing the median angle (38.6°), and the predicted median angle jumps between 11° and 112° from one seed to another. Transitivity can be satisfied without true geometry.==
3. **A trap I caught:** with all scenes pooled, Method 1 looked 2.5× better than mean for rotation (0.15 vs 0.06); within each scene the difference disappears (0.13 vs 0.13). It was separating scenes, not judging rotation.
4. **Translation** shows a weak signal beyond similarity (head 0.11–0.24 vs no-head 0.09–0.14), smallest for Method 1.
5. **The head hurts retrieval for every input**, and the input ranking from E01 stays the same.

### E03 — Method 2, learned pooling (3 seeds each)

| confidence input | ρ_rot within scene | ρ_trans within scene | ROxford Hard after head | final training loss | pooler vs plain mean (cos) |
|---|---|---|---|---|---|
| real | 0.129 | 0.250 | 0.077 | 0.189–0.191 | 0.985–0.997 |
| shuffled | 0.128 | 0.250 | 0.081 | 0.186–0.210 | 0.981–0.986 |
| zero | 0.127 | 0.248 | 0.081 | 0.187–0.188 | 0.979–0.984 |

1. **Confidence makes no difference** — not in geometry, not in retrieval, not even in the training loss.
2. **The learned pooling stays almost a plain average** at this learning rate (cosine with the mean ≥ 0.98).
3. **It finds the confident patches anyway.** Without any confidence input (`zero`), the pooler still learns to favour patches VGGT is confident about (Spearman ≈ 0.4 between its weights and VGGT confidence). The information is already in the DINOv2 tokens — the same conclusion as E01b.
4. The planned `[mean ; f]` fusion experiment is not run: by the rule we set, f is too close to the mean.

### E03b — Same, with a 10× higher learning rate for the pooler

At learning rate 1e-4 the pooler hardly moved, so "no difference" could just mean "nothing happened". With the pooler at 1e-3 (head unchanged), real vs no confidence, 3 seeds each:

| confidence input | ρ_rot within scene (no-head) | ρ_trans within scene (no-head) | ROxford Hard after head | patches effectively used | pooler vs plain mean (cos) |
|---|---|---|---|---|---|
| real | 0.147 (0.193) | 0.274 (0.249) | 0.088 | ~45% | ~0.83 |
| zero | 0.140 (0.182) | 0.261 (0.244) | 0.095 | ~42% | ~0.82 |

1. **Now the pooler really moves**: it concentrates on less than half of the patches and its vector is clearly different from the plain mean.
2. **Still no benefit from confidence**: the differences are smaller than the spread between seeds, and the head still does not beat the cosine of its own input on rotation.
3. **Both versions put ~40–47% of their weight on the 25% most confident patches** (on MegaDepth). The training loss pushes the pooler towards the patches VGGT is confident about, *with or without* being told the confidence. VGGT's signal is redundant with what DINOv2's tokens already contain.

---

### 5.1 Janine's baseline
![baseline](experiments/figures/arch_baseline.png)
- **Patch similarity** (her Fig. style): for each patch of the query, its best match in a positive image. Raw DINOv2 tokens match on the building; after the projection head almost every patch looks equally similar.
- **Rotation**: the predicted angle grows a little with the true angle, but it is capped at about 104° and many pairs are predicted near 0°. The no-head cosine orders pairs better (ρ 0.23 vs 0.12).

### 5.2 Method 1 — fixed VGGT filter
![method 1](experiments/figures/arch_method1.png)
- VGGT is confident on the facade and not on the sky, as in E00. But the **top 25% is the shadowed lower facade
  on the right — the closest structure — while both towers are dropped**. This is exactly the drawback I noted in
  E00 ("confidence favours close structure rather than distant landmarks").
- Rotation: capped at about 92°, ρ 0.13 vs 0.18 without a head.

### 5.3 Method 2 — learned attention (pooler lr 1e-3)
![method 2](experiments/figures/arch_method2.png)
- The learned weights look **almost the same with and without the confidence input**: both down-weight the sky and
  concentrate on the lower part of the building. The network finds "confident" patches from the tokens alone.
- Rotation: all predictions stay **below ~40°**, whatever the true angle (up to 180°). The head satisfies
  transitivity with small rotations instead of learning the real ones.

### 5.4 Masked CLS (E01b)
![masked CLS](experiments/figures/arch_maskcls.png)
- Removing the 25% least confident patches before DINOv2 costs nothing; removing more hurts; VGGT masks are not
  better than random masks. DINOv2's CLS already ignores uninformative patches.

### 5.5 The key geometry figure: the head vs. no head at all
![geometry](experiments/figures/geometry_head_vs_similarity.png)
- Left three: predicted rotation angle of three trained heads against the true angle. Right: just 1 − cosine of the
  two input vectors, no training. The right panel has the clearest trend (ρ 0.23 vs 0.12–0.14).
- Each head has a **ceiling** (≈104°, ≈92°, ≈40°) and a pile of predictions near 0°: rotations are squeezed into a
  range where they are easy to keep consistent.

### 5.6 Retrieval: with and without the head
![retrieval](experiments/figures/retrieval_head_vs_nohead.png)
- Blue = the input descriptor alone, orange = after Janine's projection head (mean of 3 seeds, black bar = range).
  The head lowers retrieval for every input; CLS 518 stays best; Method 2 ends up between the patch mean and Method 1.

### 5.7 Side by side for one pair (Janine-style patch similarity, all methods)
![patches](experiments/figures/patches_q00_hard.png)
- Query and a hard positive. Note the last column: with the head trained on Method 1's input, the **sky becomes the
  most similar region after projection** — the same effect Janine reported for CLIP, even though the head's input
  was built from structure patches. Other pairs: `experiments/figures/patches_q{00,20,40,50}_{easy,hard}.png`.

---

## 6. What this means, and questions for Nicola

- **VGGT's confidence is meaningful but redundant.** It beats random selection when patches are averaged, but DINOv2 already knows which patches matter: its CLS ignores them, and a learned pooler finds them without help.
- **The transitivity setup cannot show a benefit of better inputs**, because the head does not learn real geometry from any input: its rotation predictions are self-consistent but no better than raw similarity. This supports the concern from my notes: the losses prevent collapse but nothing points to the *correct* poses.
- Possible next directions (to discuss — one focus only):

  1. **Change the objective**: a small amount of real pose supervision (MegaDepth has it), or VGGT pseudo-labels gated by VGGT's confidence, as in my notes ("supervised where VGGT is confident, self-supervised elsewhere").

  2. **Use VGGT differently**: its aggregated tokens or pose outputs instead of only its confidence.
