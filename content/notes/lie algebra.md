---
title: Lie Algebra
draft: false
tags:
date: 2025-12-01
---
 
Related to [[rodrigues|Rodrigues' Rotation Formula]]. Also we covered this in [[RPCN 4|Mechanization]]

> A major motivation for using Lie algebra is to do optimization.

So basically we want to represent certain operations like matrices or exponentials in different ways (like [[rot derivative|Rotation Matrix Time Derivative]])

### Group

A group is an algebraic structure of one set plus one operator. We denote the set as $A$ and the operation as $\cdot$, then the group can be denoted as $G = (A, \cdot)$. We say $G$ is a group if the operation satisfies the following conditions ("well-defined operations"):

1. **Closure:**  
   $\forall a_1, a_2 \in A,\; a_1 \cdot a_2 \in A$

2. **Combination (Associativity):**  
   $\forall a_1, a_2, a_3 \in A,\; (a_1 \cdot a_2) \cdot a_3 = a_1 \cdot (a_2 \cdot a_3)$

3. **Unit element:**  
   $\exists a_0 \in A,\; \text{s.t. } \forall a \in A,\; a_0 \cdot a = a \cdot a_0 = a$

4. **Inverse element:**  
   $\forall a \in A,\; \exists a^{-1} \in A,\; \text{s.t. } a \cdot a^{-1} = a_0$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/lie1.png" style="max-width: 100%; height: auto;">
</div>
