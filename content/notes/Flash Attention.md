---
title: Flash Attention
draft: false
tags:
date: 2026-06-22
---

Source: [paper]([https://stevengong.co/research-papers/FlashAttention-Fast-and-MemoryEfficient-Exact-Attention-with-IOAwareness](https://stevengong.co/research-papers/FlashAttention-Fast-and-MemoryEfficient-Exact-Attention-with-IOAwareness)), [Steven](https://stevengong.co/research-papers/FlashAttention-Fast-and-MemoryEfficient-Exact-Attention-with-IOAwareness).

FlashAttention is a memory-efficient exact-attention algorithm that fuses the whole attention computation into a single tiled CUDA kernel, avoiding ever materializing the full $N\times N$ attention matrix.

> It's not a different attention mechanism! It's the same *softmax* attention, just computed without ever materializing the $N \times N$ attention matrix in slow DRAM (tiling + recursive stable-softmax trick).

The naive implementation from [[transformers]] computes $S=QK^T$ of shape $N \times N$, writes it to DRAM, reads it back to softmax, writes again, reads to multiply with $V$. Covered in [[foundation models 4|Efficient FoMos]]. For long contexts this is both memory-quadratic and bandwidth-bound.

**The process**

1. Load blocks of $Q, K, V$ **from DRAM to SRAM** one tile at a time
2. Compute the tile’s partial attention **in SRAM**
3. Use an **online softmax** that updates the running normalizer as new tiles arrive, so a global pass isn’t needed

Net effect: **O(N) memory** instead of $O(N^2)$, plus 2-4$\times$ wall-clock speedup on long sequences.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_4.png" style="max-width: 100%; height: auto;">
</div>