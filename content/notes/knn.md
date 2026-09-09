---
title: K-Nearest Neighbors (KNN)
draft: false
tags:
date: 2026-09-09
---

kNN classifies a test point x by finding its k closest points in the training set and letting them vote on the label. There is no “training” stage: kNN is a **non-parametric** lazy learner that just memorizes the dataset.

With kNN, when we want to produce an output y for a new test input x, we find the k-nearest neighbours to x in the training data X, and the neighbours “vote” on the label of x. Majority wins for classification; for regression, average the labels.

>[!tip] $k$ controls smoothness: $k=1$ gives a jagged boundary that memorizes noise, large $k$ smooths everything toward the majority class.

$k$ and the distance metric are **hyperparameters**: choices about the algorithm itself, not learned from data. The right way to choose them is:

* split into **train/validation/test**
* tune on validation
* evaluate **once** on test
* for small datasets, use k-fold cross-validation.

# Distance Metrics

**L1 (Manhattan) distance**, coordinate-dependent (changes if you rotate axes): $d_1(I_1, I_2) = \sum_p \mid I_1^p - I_2^p \mid$

**L2 (Euclidean) distance**, rotation-invariant: $d_2(I_1, I_2) = \sqrt{\sum_p(I_1^p-I_2^p)^2}$

The choice of L1 vs L2 reshapes decision boundaries: L1 boundaries align with the coordinate axes, L2 boundaries don’t. Pick L1 when individual feature dimensions have semantic meaning (then axis-aligned splits are natural).

>[!example] Example: if your features are (age, income, years of education), each dimension is a distinct, meaningful quantity. An axis-aligned split like "age difference > 5" is interpretable on its own, independent of the other dimensions. L1 treats each dimension separately and sums the absolute differences, so it fits this kind of data well.
>
>Contrast with raw image pixels: no single pixel has meaning on its own — meaning only emerges from patterns across many pixels together. There, rotating/mixing coordinates doesn't break anything conceptually, so the rotation-invariant L2 is more natural.

# Practical Recipe

1. Preprocess your data: normalize features to zero mean and unit variance
2. For high-dimensional data, reduce dimensionality first with [[principal_component_analysis|PCA]]
3. Sweep $k$ (odd values to avoid ties) and distance types ($\mathscr{l_1}$, $\mathscr{l_2}$, $\mathscr{l_\infty}$​) on validation or via cross-validation.
4. Lock in hyperparameters, then report test accuracy once