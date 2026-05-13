---
title: Efficient FoMos
draft: false
tags:
date: 2026-05-12
---

Basically how Torch does it in the background. Optimizing the operations.

Alex first gave the example of transistor grids with 1000 nanometers $\times$ each square represents a 20 nanometer transistor. He also went on base-2 representation of numbers. With the `Sign | Exponent | Significand` and the precisions.

The IEEE standard is half precision float (16 bits) (1 | 5 | 10). We can represent values in the range of $\pm 65k$.

**Brain** half precision float: Preserve 32-bit dynamic range reduce fraction/significand precision. So you can dynamically assign different number of bits to exponent and significand. We can represent more numbers, but with smaller precision. (1 | 8 | 7).

With Torch, it's better to use **Brain half precision float**.

**Hardware Improvements**

Here he started with the parallelism from NVIDIA Streaming Multiprocessors (SMs) where each cell is a computational unit in itself. I.e. the GPU.

L1 cache (i.e., on-chip SRAM) -- responsible for fast (low memory) computations

L2 cache -- shared memory accessible by all SMs - higher latency due to physically away from compute units.

DRAM (High Bandwidth Memory) not on the GPU die. Separate silicone connected with wires to the GPU die. This is basically the memory slots we have.

**Attention in these terms**:

* Read $Q,K$ from DRAM
	* Write $S=QK^T$ back to DRAM
* Read $S$ to DRAM
	* Compute $A=softmax(S)$
	* Write it back to DRAM
* Read $A,V$ from DRAM
	* $O=AB$
	* Write O back to DRAM

Which is not very efficient, no? Because it's sequential. That's why we use L1 to parallelize it. But they are very small, only some kB. So we must optimize the process.

**TILING**

Let's say we have 2 matrices and we want to do the dot product. In total we have $O(N^3)$ complexity. Tiling is about selecting smaller segments and computing those. See the slides, it's quite smart.

The complexity now decreases to $O(N^3/B)$ since we load $B \times B$ blocks from memory.

So for before, $S$ and $O$ will be computed with tiling, but for $A$ we will need the sum of the individual row.

$exp$ is not numerically stable in binary floating point. The fix is stable softmax, which is removing the max of $S$ from the row sequence. You scale the values to the negative, the max will be 0, and by applying the exponential, we scale into a much smaller range than before. He lost me at $m_i$ and $m_N$. It's about optimizing the second loop of $d$. Finally it comes down to a recursive formulation. Apparently you can also include the computation of $O=AV$ in these loops. 

There is also flash attention which I see that it gets the job done in only one loop $O(n)$.

**KV caching** is storing the keys and values in the cache memory. Required memory:

$2 \times KV_{dim} \times Precision \times Num.Heads \times Nm. Layers \times Seq.Len$. This is where experts make the difference. They understand these things when designing neural networks. For the entire formula, the one thing we can control easily is the number of heads, i.e. Multi-Query Attention (MQA) which means use only one head for the keys and the values (validate this).

With MHA we might need 4MB for KV cache, and with MQA we need only 31kB (128 $\times$ reduction).

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

State matrix $S_t = \sum_{j<t} k_j^T v_j = S_{t-1} + k_j^Tv_j$. Again, recursion. Insert the slide he has on the computations. Again, smart. `This is Linear Attention which replaces Softmax Attention.`

But linearity includes challenges. There's no real parallelism possible since each state comes as keys and values come along. There's also a lot of cost in updating the states (high I/O costs for state updates).

**Chunk-wise parallelism**: instead of computing every single state, we can just compute individual steps. The first chunk could go from S0 to S3 and compute the instant $k_j^Tv_j$ in parallel. We can just do a vector multiplication in this case $S_3 = K_{0:3}^T \times V_{0:3}$. Hopefully it makes sense. And then we go from 3 to 6 and so on.

Next he talks about moving the key vector close to the value vector through $\hat{v} = kS$ and then compute the loss function with SDG update at t. See delta update rule for linear attention, that's how he formulates it.

**RMSNorm**

look again over this and understand the concept which constrains to a unit sphere.

See OLMoE to understand the experts explanation he gave. From 2024 (GPT 3.5 nano) everything is a mixture of experts.