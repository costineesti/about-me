---
title: Bootstrap Aggregation (Bagging)
draft: false
tags:
date: 2026-10-08
---

Take repeated **bootstrap samples** from training set $D$. Train many copies of a high-variance base learner (like decision trees) on resampled datasets and average their predictions to reduce variance.

>[!summary] Bootstrap sampling
>Given set $D$ containing $N$ training examples, create $D'$ by drawing $N$ examples at random **with replacement** from $D$.
>
>i.e. Averaging $B$ predictors trained on **independent** datasets of size $N$ reduces variance by a factor of $B$. We don’t have $B$ independent datasets, so we cheat and resample _with replacement_ from the one we have. Not truly independent, but works well in practice.

Example: from $\{X_1, X_2, X_3, X_4, X_5\}$:

* $D_1 = \{X_3, X_4, X_1, X_1, X_4\}$
* $D_2 = \{X_5, X_5, X_3, X_1, X_2\}$
* $\vdots$

Each bootstrap sample contains $\sim (1-1/e) \approx 63\%$ of the unique original points. The remaining $37\%$ "out-of-bag" points give you a free held-out set per tree: you can evaluate tree $j$ on the points it never saw. 

Since the samples aren't independent, the variance doesn't literally drop by $B$, but empirically it still drops substantially.

**Algorithm**

1. Bootstrap-sample $B$ datasets $D_1, \dots, D_B$ of size $N$
2. Train a classifier $\hat{f}^{(j)}$ on each $D_j$
3. Aggregate:

	* **Regression**: $\hat{f}(x) = \frac{1}{B} \sum_j \hat{f}^{(j)}(x)$
	* **Classification**: $\hat{f}(x) = \text{majority vote of } \hat{f}^{(j)}(x)$
