---
title: Decision Trees (CART)
draft: false
tags:
date: 2026-10-08
---

[Read Section 9.2 and Chapter 15 of Elements of Statistical Learning, 2017](https://hastie.su.domains/ElemStatLearn/)

A decision tree is a hierarchical classifier (or regressor) built by recursively splitting the feature space on one variable at a time. The representation for the CART model is a binary tree.

> The selection of which input variable to use and the specific split or cut-point is chosen using a **greedy algorithm** to minimize a cost function.

* Greedy Splitting $\rightarrow$ recursive binary splitting.
* At each node you try every question, keep the one with the most gain, and repeat until a stopping criterion

# CART

>[!summary] CART for Regression
>the cost function is the **sum squared error (SSE)** across all training samples that fall within the class.

>[!summary] CART for Classification
>The Gini index is an indication of how "pure" the leaf nodes are.

**Impurity**: chance of being incorrect if you randomly assign a label to an example in the set. Impurity measure examples:

* Entropy

$$
i(N) = - \sum_j p(j|N)\log_2 p(j|N)
$$

* Gini index

$$
i(n) = 1 - \sum_j [p(j|N)]^2
$$

* Misclassification error (fraction you'd get wrong if you guessed the majority):

$$
i(N) = 1 - \max_j p(j|N)
$$

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml17.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml18.png" alt="flow 2" width="350" height="300"> </div> </div>

See [[ds4all 3|Decision Tree Practical]] to understand how to pick the root node using the Gini index and how to compute the information gain.

# ID3

builds a decision tree for the given data in a top-down fashion. At each node of the tree, one property is tested based on **maximizing information gain** and **minimizing entropy**, and the results are used to split the object set.  This process is recursively done until the set in a given sub-tree is homogenous.

* greedy search. selects using the information gain criterion, and then never explores the possibility of alternate choices.
* it does not handle numeric attributes and missing values i.e. only handles categorical data.

$\text{Gain}(S,A)$ is a **information gain** of example set $S$ on attribute $A$.

$$
\begin{aligned}
\text{Gain}(s,a) &= \text{Entropy}(S) - \sum \frac{|Sv|}{|S|} \cdot \text{Entropy}(Sv) \\
\text{Entropy(S)} &= - \sum p(j) \log_2 p(j)
\end{aligned}
$$

* $p(j)$ is the proportion of $S$ belonging to class $j$
* $S$ is each value $v$ of all possible values of attribute $A$
* $Sv$ is the subset of $S$ for which attribute $A$ has value $v$
* $|Sv|$ is the number of elements in $Sv$, $|S|$ is the number of elements in $S$.

>[!example] IDE3 algorithm
>
>Suppose $S$ is a set of 14 examples in which one of the attributes is wind speed. The values of Wind and be `Weak` or `Strong`. 
>
>The classification of these 14 examples are 9 `YES` and 5 `NO`. 
>
>For attribute Wind, suppose there are 8 occurences of `Wind=Weak` and 6 occurences of `Wind=Strong`. 
>
>For `Wind=Weak`, 6 of the examples are `YES` and 2 are `NO`. For `Wind=Strong`, 3 are `YES` and 3 are `NO`.
>
>$$
>\begin{aligned}
>\text{Gain}(S, \text{Wind}) &= \text{Entropy}(S) - \frac{8}{14} \text{Entropy}(S_{weak}) - \frac{6}{14} \text{Entropy}(S_{strong})\\
>&= 0.940 - \frac{8}{14} \cdot 0.811 - \frac{6}{14} \cdot 1.00\\
>&= 0.048\\
>\\
>\text{Entropy}(S) &= -(9/14) \cdot \log_2(9/14) - (5/14)\cdot \log_2(5/14) = 0.940\\
>\text{Entropy}(S_{weak}) &= -(6/8) \cdot \log_2(6/8) -(2/8) \cdot \log_2(2/8) = 0.811\\
>\text{Entropy}(S_{strong}) &= -(3/6)\cdot \log_2(3/6) - (3/6) \cdot \log_2(3/6) = 1.00
>\end{aligned}
>$$

Continuous variables are turned into threshold questions like "$\geq 3$", which raises computational cost and overfitting risk. The idea is to reduce the tree complexity in order to improve generalization and prevent overfitting. [Read here](https://costinchitic.wiki/notes/ds4all-3#pruning-trees).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml19.png" style="max-width: 100%; height: auto;">
</div>

CART is always binary, while C4.5 can make a multiway split on a categorical attribute, with one branch per value. Also, the **gain ratio** is information gain divided by the "split information" (the entropy of how the split divides the data) -- it penalizes attributes with many distinct values.

# Ensemble methods

Improved NETFLIX' recommendation engine $10\%$ more accurate in 2006.

>[!NOTE] Bias-Variance trade-off
>
>* Complex model => low bias, high variance
>* Simple model => high bias, low variance
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ds4all_7.png" style="max-width: 100%; height: auto;"> </div>

We can reduce variance without increasing bias through averaging.

$$
Var(\bar{X}) = \frac{Var(X)}{N}
$$

>[!question] Where do multiple models come from? There's only one training set.
>
>[[Bagging|Bootstrap Aggregation (Bagging)]] -- reduce variance
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml20.png" style="max-width: 100%; height: auto;"> </div>
>
>[[Random Forest]]: at each node, best split is chosen from a random sample of $m$ attributes instead of all attributes.
>
>Boosting: combine several weak learners to form a stronger one. The main ones are adaptive boosting (Adaboost) or gradient boosting.

