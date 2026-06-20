---
title: Beyond attention-based methods
draft: false
tags:
date: 2026-06-20
---
 
>[!question] What if we express Linear Attention as a time-dependent process?
>concept covered in [[foundation models 4|Efficient FoMos]]. it's a discrete recurrence.
>
>$$
>S_t = S_{t-1} + k_j^\top v_j
>$$

I see it revisited the [[changeofvar|Change-of-Variable Formula (Jacobian Matrix)]] concept from [[genai3|Normalizing Flows]]. Basically we can represent the current attention to an ODE which relates functions and its derivatives to a single independent variable.

$$
S_t - S_{t-1} = \frac{dS}{dt}
$$

* I believe $S$ should be $\mathbf{x}$ from the following state-space formulation?

>[!NOTE] Linear State-Space Layer (LSSL)
>
>$$
>\dot{\mathbf{x}}(t) = A \mathbf{x}(t) + B u(t)
>$$
>
>* $u$ is the continuous input at time $t$
>* $B$ controls how input enters -- **Input Matrix**. 
>	* $B \in \mathbb{R}^{|N| \times |M|}$ ($N$ states $\times$ $M$ inputs)
>* $\mathbf{x}$ is the continuous evolving state at time $t$
>* $A$ controls how the state is updated -- **State/System Matrix**. 
>	* $A \in \mathbb{R}^{|N| \times |N|}$ ($N$ states $\times$ $N$ states)
>
>$$
>y(t) = C \mathbf{x}(t) + D u(t)
>$$
>
>* $C$ determines which combinations of the states make up the measured outputs -- **Output Matrix**
>	* $C \in \mathbb{R}^{|P| \times |N|}$ ($P$ outputs $\times$ $N$ states)
>* D directly maps the external inputs to the outputs without passing through the system states -- **Feedthrough/Feedforward Marix**
>	* $D \in \mathbb{R}^{|P| \times |M|}$ ($P$ outputs $\times$ $M$ inputs)
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fomo10_1.png" style="max-width: 100%; height: auto;"> </div>

1. **LSSLs are recurrent**: if a discrete step-size $\Delta t$ is specified, the LSSL can be discretized into a linear recurrence using standard techniques, and simulated during inference as a stateful recurrent model with constant memory and computation per time step.
2. **LSSLs are convolutional**: the linear time-invariant systems defined by the equations above are known to be explicitly representable as a continuous convolution. Moreover, the discrete-time version can be parallelized during training using convolutions.
3. **LSSLs are continuous-time**: the LSSL itself is a differential equation. As such, it can perform unique applications of continuous-time models, such as simulating continuous processes, handling missing data, and adapting to different timescales.

However, **in real world our inputs are sampled data, not continuous observations**. We need to integrate our discrete signals.

>[!summary] ZOH converts discrete inputs to a continuous signal (staircase). 
>The idea is basically saving the value of the lower bound.
>
>* $a \leq t < b \rightarrow u(t) = u(a)$, and $a$ and $b$ are samples at timesteps $T, 2T, 3T, \dots$
>* this implies however constant values in inter-sample periods
>* points can be represented with delays $e^{A \Delta}$
>	* $A$ is learnable
>	* $\Delta$ is our step size between $t$ and $t+1$
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fomo10_2.png" style="max-width: 100%; height: auto;"> </div>

We denote $\bar{A}=e^{A \Delta}$ and $\bar{B} = A^{-1} e^{(A \Delta)-1}B$. So the new state space becomes

$$
\mathbf{h}_t = \bar{A} \mathbf{h}_{t-1} + \bar{B} u_t
$$

with $y_t = C \mathbf{h}_t$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fomo10_3.png" style="max-width: 100%; height: auto;">
</div>

However, by expanding $y$ according to `Efficiently Modeling Long Sequences with Structured State Spaces`, we get the next formulation:

$$
y_t = C \bar{A}^t \bar{B} x_0 + C \bar{A}^{t-1} \bar{B} x_1 + \dots + C \bar{A} \bar{B} x_{t-1} + C \bar{B}x_t
$$

State updates are primarily influenced by $\bar{A}$:

* $\bar{A} > 1$
	* $\bar{A}^t >> \bar{A}$ grows large over sequence $t$ -- bias towards start
* $\bar{A} < 1$
	* $\bar{A}^t << \bar{A}$ grows small over sequence $t$ -- forgetting
* $\bar{A} = 1$
	* $\bar{A}^t = \bar{A}$ no selectivity

> $\bar{A}$ should decay in a *structured* way based on the input

>[!summary] HiPPO -- High-order Polynomial Projection Operations
>
>Different $f(t)$ polynomials capture different details -- Legendre polynomials
>
>* $f(t)$ w/ $N=1$ => $P_0(t)$ -- flat which captures the mean
>* $f(t)$ w/ $N=2$ => $P_1(t)$ -- linear captures the slope
>* $f(t)$ w/ $N=3$ => $P_2(t)$ -- quadratic captures the curve
>* $f(t)$ w/ $N=4$ => $P_3(t)$ -- cubic captures assymetry
>
><div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fomo10_4.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fomo10_5.png" alt="flow 2" width="350" height="300"> </div> </div>
>
>So we rewrite $f(t)$ as:
>
>$$
>f(t) \approx c_0P_0(t) + c_1P_1(t) + \dots + c_{N-1}P_{N-1}(t) +c_NP_N(t)
>$$
>
>where the coefficients $c_0, c_1, \dots c_N$ capture how much of each polynomial's shape is present in the signal.
>
>* Low-order coefficients ($c_0, c_1, \dots$) capture the big picture (long-range)
>* High-order coefficients capture fine details (short-range)
>* $[c_0, c_1, \dots, c_{N-1}]$ are updated as new inputs arrive

$$ 
\bar{A}_{nk} = \begin{cases} -(2n+1)^{1/2}(2k+1)^{1/2} & \text{when } n > k \text{ (below diagonal)} \\ -(n + 1) & \text{when } n = k \text{ (on the diagonal)} \\ 0 & \text{when } n < k \text{ (above diagonal)} \end{cases} 
$$

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fomo10_6.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fomo10_7.png" alt="flow 2" width="350" height="300"> </div> </div>

When we revisit $y_t = C \bar{A}^t \bar{B} x_0 + C \bar{A}^{t-1} \bar{B} x_1 + \dots + C \bar{A} \bar{B} x_{t-1} + C \bar{B}x_t$, we see a multitude of consecutive matrix multiplications that are input independent. **We can precompute them** by defining

>[!NOTE] Structured State Space Sequence Models (S4)
>
>* $K=\left( C\bar{B}, C\bar{A}\bar{B}, \dots, C\bar{A}^{t-1}\bar{B}, C\bar{A}^t\bar{B} \right)$
>* $X = \left( x_0, x_1, \dots, x_{t-1}, x_t \right)$
>* Therefore, $Y = K^\top X$ is a convolution kernel => parallelizable training
>* $y_t = C \mathbf{h}_t$ is a recurrent process => efficient inference.

Currently there's no selectivity over which states to remember? That's where `Mamba: Linear-Time Sequence Modeling with Selective State Spaces` introduced **selectivity**. 

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fomo10_8.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fomo10_9.png" alt="flow 2" width="350" height="300"> </div> </div>

The left graph demonstrates Mamba's superiority in inference throughput compared to standard [[transformers]] of comparable sizes. As the batch size increases, standard [[transformers]] quickly run out of memory because the memory required for their KV cache grows significantly. Mamba uses a constant-size hidden state instead of a growing cache, allowing it to process much larger batch sizes rapidly without memory exhaustion.

The second graph highlights Mamba's computational efficiency with long sequences. It compares the execution time of Mamba's core scan operation against standard attention mechanisms as sequence length increases. Standard FlashAttention-2 scales quadratically, meaning processing time explodes for long texts. The authors' custom hardware-optimized scan operation scales linearly, allowing Mamba to handle massive context windows of up to 512k tokens significantly faster and without the out-of-memory errors that limit other methods.

|                   | SSMs(S6)            | SSMs(S4)                                                            | Transformers                     |
| ----------------- | ------------------- | ------------------------------------------------------------------- | -------------------------------- |
| **speed**         | $O(L)$ linear       | $O(L \log L)$                                                       | $O(L^2)$ quadratic               |
| **memory**        | $O(L)$ linear       | $O(L)$ linear                                                       | $O(L^2)$ quadratic               |
| **context-aware** | **Yes** (selective) | **No** -- all tokens are processed equally with fixed _A_, _B_, _C_ | **Yes** -- softmax over _Q_, _K_ |

Still need to understand how they go from S4 to S6 and the selective attention process.