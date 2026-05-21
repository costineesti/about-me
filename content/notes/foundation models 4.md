---
title: Efficient FoMos
draft: false
tags:
date: 2026-05-21
---

> Basically how Torch does it in the background. Optimizing the operations.

Alex first gave the example of transistor grids with 1000 nanometers $\times$ each square represents a 20 nanometer transistor. He also went on base-2 representation of numbers. With the `Sign | Exponent | Significand` and the precisions.

Single(32) / `Half`(16) / Double-point(64) precision float. **The IEEE standard is half precision float** (16 bits) (1 | 5 | 10). It allows values in the range of $\pm 65k$. However, it's still very far from single precision, so we use `Brain half`.

* **Negative numbers (two's complement)**: flip all digits and add +1 to the end

>[!summary] Brain half precision float
>
>Preserve 32-bit dynamic range, reduce fraction/significand precision. 
>
>So you can dynamically assign different number of bits to exponent and significand. We can represent more numbers, but with smaller precision. (1 | 8 | 7).
>
>With Torch, it's better to use **Brain half precision float**.

---

**Hardware Improvements**

Here he started with the parallelism from NVIDIA **Streaming Multiprocessors** (SMs) where each cell is a computational unit in itself. I.e. the GPU.

* **L1** cache (i.e., on-chip SRAM) -- responsible for fast (low memory) computations
* **L2** cache -- shared memory accessible by all SMs - higher latency due to physically away from compute units.

**DRAM** (High Bandwidth Memory) not on the GPU die. Separate silicone connected with wires to the GPU die. This is basically the memory slots we have.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_1.png" style="max-width: 100%; height: auto;">
</div>

**Attention in these terms**:

* Read $Q,K$ from DRAM
	* Write $S=QK^T$ back to DRAM
* Read $S$ to DRAM
	* Compute $A=softmax(S)$
	* Write it back to DRAM
* Read $A,V$ from DRAM
	* $O=AB$
	* Write O back to DRAM

**Which is not very efficient, no?** Because it's sequential. That's why we use L1 to parallelize it. But they are very small, only some kB. So we must optimize the process.

---

**TILING**

Let's say we have 2 matrices and we want to do the dot product. In total we have $O(N^3)$ complexity. Tiling is about selecting smaller segments and computing those. See the slides, it's quite smart.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_2.png" style="max-width: 100%; height: auto;">
</div>

The complexity now decreases to $O(N^3/B)$ since we load $B \times B$ blocks from memory.

So for before, $S$ and $O$ will be computed with tiling, but for $A$ we will need the sum of the individual row.

$exp$ is **not numerically stable in binary floating point**. The fix is stable softmax, which is removing the max of $S$ from the row sequence. You scale the values to the negative, the max will be 0, and by applying the exponential, we scale into a much smaller range than before. He lost me at $m_i$ and $m_N$. It's about optimizing the second loop of $d$. Finally it comes down to a recursive formulation. Apparently you can also include the computation of $O=AV$ in these loops. 

There is also flash attention which I see that it gets the job done in only one loop $O(n)$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fmod6_3.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fmod6_4.png" alt="flow 2" width="350" height="300"> </div> </div>

**KV caching** is storing the keys and values in the cache memory. Required memory: $2 \times KV_{dim} \times Precision \times Num.Heads \times Nm. Layers \times Seq.Len$. 

* $2 \times 128 \times 2 \text{bytes/head} \times 128 \text{heads} \times 61 \times 32768 = 131GB$

This is where experts make the difference. They understand these things when designing neural networks. For the entire formula, **the one thing we can control easily is the number of heads**, i.e. **Multi-Query Attention (MQA) which means use only one head for the keys and the values (validate this).**

* With MHA we might need 4MB for KV cache, 
* With MQA we need only 31kB (128 $\times$ reduction),
* With GQA we need 500kB.

>[!question] Can we find a better balance?
>
>yes. Use batches, i.e. **Group Query Attention (GQA)**. Very popular.

Try to understand the Multi-Head Latent Attention (MLA) where you break the process in two (compress and up-project everything).

$$
(MLA)d_c << D \times h \times KV(MHA)
$$

See the slide with the comparison between what each technique stores (kB, MB). With MLA it even works better than MHA (so this is the most efficient way of doing it).

>[!summary] MLA is the new norm, not MHA.
>It is both faster and better in results. Since 1-2 years.
>
>MLA requires 70kB KV cache per token.

---

**Softmax?**

Currently we know about $o_t = \sum_{j<t} \frac{exp(q_tk_j^\top)}{exp(q_tk_l^\top)}v_j$. We need to escape the $exp$ function i.e. converting to **linear attention**.

State matrix $S_t = \sum_{j<t} k_j^T v_j = S_{t-1} + k_j^Tv_j$. Again, recursion. Insert the slide he has on the computations. Again, smart. `This is Linear Attention which replaces Softmax Attention.`

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_5.png" style="max-width: 100%; height: auto;">
</div>

* **Softmax Attention**: 
	* Store KV in memory
	* $O(L)$ memory
* **Linear Attention**:
	* Store $S_t$ in memory
	* $O(1)$ memory (only update the state)

But linearity includes challenges. There's no real parallelism possible since each state comes as keys and values come along. There's also a lot of cost in updating the states (high I/O costs for state updates).

>[!summary] Chunk-wise parallelism
>
>instead of computing every single state, we can just compute individual steps. The first chunk could go from S0 to S3 and compute the instant $k_j^Tv_j$ in parallel. We can just do a vector multiplication in this case $S_3 = K_{0:3}^T \times V_{0:3}$. Hopefully it makes sense. And then we go from 3 to 6 and so on.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod6_6.png" style="max-width: 100%; height: auto;"> </div>

Next he talks about moving the key vector close to the value vector through $\hat{v} = kS$ and then compute the loss function with SDG update at t. See delta update rule for linear attention, that's how he formulates it.

$$
L_t(S) = -(k_tS)^\top \mathbf{v}_t \quad \quad \text{loss at t}
$$

$$
S_t = S_{t-1} - \beta_t \nabla L_t(S_{t-1}) \quad \quad \text{SDG update at t}
$$

$$
S_t = S_{t-1} + \beta_t k_t^\top \mathbf{v}_t
$$

$$
S_t = S_{t-1} + \beta_tk_t^\top (\mathbf{v}_t - k_tS_{t-1}) \quad \quad \text{Delta update rule}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_7.png" style="max-width: 100%; height: auto;">
</div>
---

**RMSNorm**

Attention captures token dependencies. However, it's not enough for retrieving factual information.

> I did not understand the Routing concept.

look again over this and understand the concept which constrains to a unit sphere.

See OLMoE to understand the experts explanation he gave. From 2024 (GPT 3.5 nano) onwards, everything is a mixture of experts.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod6_8.png" style="max-width: 100%; height: auto;">
</div>

$$
\text{Expert capacity} = \frac{\text{Total tokens in a batch}}{\text{Number of experts}} \times \text{Capacity factor}
$$

> **token overlflow**: tokens are dropped.


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