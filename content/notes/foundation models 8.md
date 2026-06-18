---
title: Self-Supervision Objectives for FoMo Pre-training
draft: false
tags:
date: 2026-06-18
---

This lecture covers 4 families of pretext tasks for self-supervised pre-training.

The **big picture** is that, instead of labels, we invent a *pretext task* that forces the network to learn useful representations from raw data alone, then transform those features to real downstream tasks.

invariance-based methods = apply a bunch of augmentations to the original image, and make sure the embeddings generated from those images are very similar (invariant to augmentations)

**Pretext task 1: Vision-language score -- CLIP $\rightarrow$ SigLIP $\rightarrow$ GLIP**

* [[CLIP]]: encode image and text in the same space. The similarity between two normalized vectors simply comes down to their cosine similarity, which is what CLIP maximizes. The ***temperature*** $\tau$ is a hyperparameter which helps with numerical stability (controls how peaked the softmax/exponential output is).
	* Dividing by a small $\tau \sim 0.07$, we get a sharper and more confident distribution, as small similarity differences get amplified into big probability differences
	* Dividing by a big $\tau$, we get a softer distribution; where differences get washed out.
	* So basically, scaled so gradient are informative rather than mushy. In [[DINO]], the teacher temperature is smaller so its output is sharper/more confident than the student's.

$$
L_{\text{CLIP}} = - \frac{1}{N} \bigg( \underbrace{\sum_i \ln \frac{e^{v_i \cdot w_i/ \tau}}{\sum_j e^{v_i \cdot w_j/ \tau}}}_{\text{Image-to-Text Loss}} + \underbrace{\sum_j \ln \frac{e^{v_j \cdot w_j/ \tau}}{\sum_i e^{v_i \cdot w_j/ \tau}}}_{\text{Text-to-Image Loss}} \bigg)
$$

* SigLIP: an improved version of [[CLIP]] which **introduces sigmoid-based contrastive loss** instead of the traditional softmax-based contrastive loss. This training loss eliminates the need for a global view of all pairwise similarities between images and texts within a batch. It transforms the problem into $N^2$ independent binary classifications. **Since we don't need to gather everything onto one device before computing the loss => much easier to scale to huge batch sizes across many GPUs** .Consequently, **it enables more efficient scaling to larger batch sizes while also delivering superior performance with smaller batch sizes**.
	* also introduces a learnable bias ($b$) to offset the huge negative-to-positive ratio. Because out of $N^2$ pairs per batch, only $N$ are positive. That's what $b$ is for -- a learned bias that shifts the decision threshold so the sigmoid isn't just trivially predicting *negative* for everything to minimize loss.
	* $z_{ij}$ is the ground-truth label.
	* TL;DR: **Cheaper, scales better.**

$$
L_{\text{SigLIP}} = - \frac{1}{N} \sum_i \sum_j \ln \frac{1}{1 + e^{z_{ij}(v_i w_j / \tau + b)}}, \quad z_{ij} = \begin{cases} 1 & \text{if } v_i \text{ and } w_j \text{ are paired} \\ -1 & \text{if } v_i \text{ and } w_j \text{ are not paired} \end{cases}
$$

* **GLIP (Grounded Language-Image Pre-training)**: unifies object detection and text-image grounding. It extends alignment from whole-image/whole-caption to **region** $\leftarrow \rightarrow$ **phrase** grounding 
	* compute a similarity matrix between **detected object regions** (O) and **text phrases** (P), add a localization loss on top of the classification loss.

$$
L_{\text{GLIP}} = \underbrace{L_{\text{cls}}}_{\text{Binary-Sigmoid Multi-Class Classification}} + \underbrace{L_{\text{loc}}}_{\text{Centerness Loss \& Edge Distances}}
$$

>[!summary] Phrase Grounding
>the process of mapping specific words or textual phrases to their representations within an image or video
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod8_1.png" style="max-width: 100%; height: auto;"> </div>

---

**Pretext task 2: Negative samples (Contrastive) -- SimCLR $\rightarrow$ MoCo**

* **SimCLR (Simple framework for Contrastive Learning of visual Representations)**: Two separate data augmentation operators ($t \sim \tau$ and $t' \sim \tau$) are applied to each data example to obtain two correlated views. A **base encoder network** $f(\cdot)$ and a **projection head** $g(\cdot)$ are trained to maximize agreement using a contrastive loss. After training we **throw away** $g$ and **use encoder** $f$ **and representation** $h$ for downstream tasks.
	* The **pipeline**: $x \xrightarrow{t \sim \mathcal{T}} \tilde{x}_i \xrightarrow{f(\cdot)} h_i \xrightarrow{g(\cdot)} z_i$ 
		* $\mathcal{T}$ is the augmentation distribution (random crop + color distortion + Gaussian blur + invert + flip .. etc. first three I think are crucial)
		* $z$ is where the contrastive loss is applied. Representation $z$ is trained to be invariant under augmentation — that collapses useful signal (e.g. color, orientation). $h$ sits one MLP away, so it keeps information that $z$ had to throw out. Linear eval on $h$ beats linear eval on $z$ consistently; SimCLR ablation table shows non-linear projection head $\sim 7$ points better than no head.
	* **Minibatch algorithm**: For a minibatch of $N$ images:
		* 1. Draw $t,t' \sim \mathcal{T}$, apply both to every image => $2N$ augmented views
		* 2. Encode with shared encoder + projection $\rightarrow$ $z \in \mathbb{R}^{2N \times D}$.
		* 3. Build affinity matrix $s_{i,j} = z_i^T z_j / (||z_i|| ||z_j||)$ -- **cosine similarity**, shape $2N \times 2N$. $B=N$.
		* 4. For each row $i$, the positive is at position $2k$ or $2k+1$ (partner view of the same source image); all other $2N-2$ entries are negative.
		* 5. **InfoNCE** per row: $l(i,j) = - \log \frac{\exp(s_{i,j}/\tau)}{\sum_{k \neq i} \exp(s_{i,k}/\tau)} = - \log \frac{e^{\text{sim}(\mathbf{z}_i, \mathbf{z}_j)/\tau}}{\sum_{k \in 2B} e^{\text{sim}(\mathbf{z}_i, \mathbf{z}_k)/\tau}}$
		* Total loss averages $l(2k, 2k+1) + l(2k+1, 2k)$ over all $N$ source images. Quality scales with number of negatives, which scales with batch size $B \rightarrow O(B^2)$ compute, which **makes it infeasible at scale**. That's where MoCo comes in.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fmod8_2.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fmod8_3.png" alt="flow 2" width="350" height="300"> </div> </div>

* **MoCo (Momentum Contrast for Unsupervised Visual Representation Learning)**: In SimCLR, to get lots of negatives you need a huge batch ($8k \rightarrow$ TPU pods). MoCo sidesteps this by **decoupling negative count from batch size**(key difference to SimCLR) by keeping a **momentum-updated** *key* encoder (EMA of the *query* encoder, no gradients), and a **queue** of past keys as negative dictionary => $O(B \times K)$ instead of $O(B^2)$. Only the *query* encoder gets backprop; the *key* encoder is updated via $\theta_k \leftarrow m \theta_k + (1-m) \theta_q$
	* **Queue mechanics**: Maintain a dictionary $\{k_0, k_1, k_2, \dots \}$ of size $K$ (e.g. 65536). Each iteration:
		* Encode curent minibatch's *key view* with the momentum encoder $\rightarrow$ enqueue.
		* Dequeue the oldest minibatch's keys
		* The queue acts as a large, slowly-evolving dictionary of negatives. No gradients flow into it.
	* **Momentum update**:
		* Let $\theta_q$ be the query-encoder params, $\theta_k$ key-encoder params: $\theta_k \leftarrow m \theta_k + (1-m) \theta_q, \quad m=0.999\theta_k$ changes **slowly** -- essential for queue consistency, because the keys in the queue were encoded by slightly older $\theta_k$ and a fast-moving key encoder would make them stale.
	* **MoCo v2 -- hybrid with SimCLR**: pulls SimCLR's two best ideas into MoCo's framework
		* **Non-linear MLP projection head** (SimCLR's $g(\cdot)$).
		* **Strong data augmentation** (+Gaussian blur).
	* **MoCo v3**: adapts MoCo to ViT backbones, studies training stability.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod8_5.png" style="max-width: 100%; height: auto;">
</div>

**MoCo vs SimCLR**

|                     | SimCLR                             | MoCo                                              |
| ------------------- | ---------------------------------- | ------------------------------------------------- |
| Source of negatives | other samples in current minibatch | **FIFO queue** of keys from many past minibatches |
| Key encoder         | shared with query encoder          | **momentum encoder** (no gradients)               |
| Gradient flows      | through both views                 | **only through the query**                        |
| Practical           | needs batch 8192 on TPU            | works at batch 256 on 8 V100s                     |

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod8_4.png" style="max-width: 100%; height: auto;">
</div>

**MoCo Pseudocode**

```python
for x in loader:
    x_q, x_k = aug(x), aug(x)
    q = f_q.forward(x_q)          # N x C
    k = f_k.forward(x_k).detach() # N x C, no grad through key
    
    l_pos = bmm(q.view(N,1,C), k.view(N,C,1))   # N x 1
    l_neg = mm(q.view(N,C), queue.view(C,K))    # N x K
    logits = cat([l_pos, l_neg], dim=1)          # N x (1+K)
    
    labels = zeros(N)                             # positive is at index 0
    loss = CrossEntropyLoss(logits / tau, labels) # InfoNCE
    
    loss.backward()
    update(f_q.params)
    
    f_k.params = m * f_k.params + (1 - m) * f_q.params  # momentum update
    enqueue(queue, k); dequeue(queue)

```

---

**Pretext task 3: Self distilation -- [[DINO]]**

* [[DINO]]: no negatives at all. Student and teacher share architecture. teacher = **EMA of the student**. Both produce a softmax distribution over $K$ *prototype* dimensions on different crops of the same image; student is trained to match the teacher's distribution (cross-entropy), **gradient only flows through the student**.
* here just complete with equations explanations and size of variables for pseudocode.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod8_6.png" style="max-width: 100%; height: auto;">
</div>

---

**Pretext task 4: Low-level targets -- MAE, BEiT, I-JEPA**

TL;DR: Split image into patches, mask most of them, encode the visible ones, try to recover what's missing.

* **MAE (Masked [[genai2|Autoencoders]])**: reconstruct raw pixels of masked patches, L2 loss $L_\text{MAE} = || \mathbf{x}_p - \hat{\mathbf{x}_p} ||_2$.
	* asymmetric encoder-decoder architecture. 
		* encoder operates only on the visible subset of patches
		* lightweight decoder that reconstructs the original image from the latent representation and mask tokens. Decoder is much lighter than encoder. After pre-training, throw the decoder away.
	* masking a high proportion of the input image (e.g. 75\%) yields a meaningful self-supervisory task.
	* i.e. split image $\mathbf{x}$ into patches $\mathbf{x}_p$ $\rightarrow$ select a random set of patches $\mathbf{x}'_p \sim \mathbf{x}_p$ $\rightarrow$ Linear Project: $proj_i = \mathbf{x}'_i \times w + b$ 
	* results are quite blurry, because it sort of learns the mean.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod8_7.png" style="max-width: 100%; height: auto;">
</div>

>[!question] How can masked autoencoding work so well without diffusion? -- Steven
>MAEs don’t need to generate an image pixel-by-pixel from pure noise (like diffusion).
>
>They start with a partially observed image: a small set of visible patches already gives a huge amount of structure (object shapes, colors, layout).
>
>The model’s job is to fill in the missing patches so the whole image is coherent — this is a much lower-entropy task than unconditional generation.

* **BEiT (BERT Pre-Training of Image Transformers)**: reconstruct a discretized visual token (codebook index) instead of raw pixels.
	* $L_\text{BEiT} = || proj_p - \hat{proj}_p ||_2$
* **I-JEPA (Image-based Joint-Embedding Predictive Architecture)**: don't reconstruct pixels/tokens at all -- predict the **embedding** of the masked patches, produced by an EMA target encoder, using a separate predictor network. 
	* pixel-level reconstruction wastes capacity on irrelevant low-level detail; **predicting in latent space is more efficient**. This is the bridge between "low-level targets" and "self-distillation" (it borrows the EMA-teacher trick from [[DINO]] but applies it to masked prediction). **JEPA never tries to reconstruct pixels, nor to model the full joint distribution of natural images. It only tries to predict representations of masked parts of the same image.**
	* context encoder $f(\cdot , \theta_c)$ encodes $z_c$ context latents
	* **EMA update**: $\theta_t \leftarrow m \theta_t + (1-m) \theta_c$
	* ”we leverage an asymmetric architecture between the x- and y-encoders to avoid representation collapse.”

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fmod8_9.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fmod8_10.png" alt="flow 2" width="350" height="300"> </div> </div>

$$
L_\text{MSE} = \frac{1}{|\mathcal{M}|} \sum_{i \in \mathcal{M}} || z_{p_i} - sg(z_{t_i}) ||_2^2
$$

* $z_{p_i}$ -- predicted latents for target $i$
* $z_{t_i}$ -- targets $i$. $sg()$ because targets should be fixed, so do not compute gradients.
* $\sum_{i \in \mathcal{M}}$ -- sum over all targets and predictions, $\mathcal{M}$ is target blocks.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod8_8.png" style="max-width: 100%; height: auto;">
</div>

Each architecture

>[!summary] Joint-embedding architecture
>* A big limitation is representation collapse.
>* Collapse-prevention based on architectural constraints leverage specific network design choices to avoid collapse, for example, by stopping the gradient flow in one of the joint-embedding branches, using a momentum encoder in one of the joint-embedding branches, or using an asymmetric prediction head

>[!summary] Generative architecture
>$x$ is a copy of $y$, but with some of the patches masked. $z$ corresponds to a set of mask and position tokens to specify to the decoder which image to reconstruct. [[representation learning|Representation learning]] is not an issue

>[!summary] JEPA
>In contrast to Joint-embedding architectures, JEPAs do not seek representations invariant to a set of hand-crafted data augmentations, but instead seek representations that are predictive of each other when conditioned on additional information $z$.
>
>* still suffer from representation collapse

