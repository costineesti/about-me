---
title: Random Forest
draft: false
tags:
date: 2026-10-08
---

 A random forest is [[Bagging|Bagging]] applied to [[ml 3|Decision trees]] with extra feature-subsampling at each split.

>[!question] Why subsample features if bagging already randomizes data?
>
>Pure bagging can leave one very informative feature dominating every tree, so the bootstrapped trees stay highly correlated. Random feature subsets at each split decorrelate them further.

**Algorithm**

1. For $b=1 \text{ to } B$ bootstrap-sample datasets $D_1, \dots, D_B$ of size $N$
2. Grow a random-forest tree $T_b$ by recursively **repeating the following steps for each terminal node of the tree** until the minimum node size is reached

	* look at a random subsample of $m \ll d$ features and pick the best among those
		* Typical choice: $m = \sqrt{d}$
	* Split the node into two daughter nodes

3. Generate the ensemble of trees $\{T_b\}^B_1$.
4. Aggregate the individual results:

	* **Regression** (average across all trees): $\hat{f}_{rf}^B(x) = \frac{1}{B} \sum_{b=1}^B T_b(x)$
	* **Classification** (majority vote of the class predictions): $\hat{C}_{rf}^B(x) = \text{majority vote of } \{\hat{C}_b\}^B_{b=1}$

Standard decision tree: at each split, look at all $d$ features and pick the best.