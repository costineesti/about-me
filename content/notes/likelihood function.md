---
title: Likelihood Function
draft: false
tags:
date: 2025-11-28
---
 
I hate the fact that in Romania we weren't taught probabilities and statistics.

The likelihood function is the [[jointprob|Joint Probability]] of the observed data viewed as a **function of the parameters** of the chosen statistical model.

"Probability of what you see given your model"

$$
L(\theta) = P(x_1, x_2, \ldots, x_n \mid \theta) = \prod_{i=1}^{n} P(x_i \mid \theta) = \prod_{i=1}^{n} f(x_i \mid \theta)
$$

* where $f$ is the [[PDF|Probability Density Function]]

**Key idea for [[MLE]]**: Likelihood $= P(x \mid \theta)$

* $x$ is your data
* $\theta$ are your model parameters

>[!NOTE] Likelihood Function (Definition)
>If $\mathbf{X}_i \sim f(x_i, \theta), i = \overline{1,n}$, then 
>
>$L(\theta, x_{\overline{1:n}}) = P(X_1 = x_1, X_2 = x_2, ... , X_n = x_n) = \prod_{i=1}^n f(x_i, \theta)$

>[!summary] Probability VS Likelihood
>* Probability is assigning the probability of a data value given distribution, i.e. $P(data \mid distribution)$
>* Likelihood measures how well a distribution explains the data, i.e. $L(distribution \mid data) = P(data \mid distribution) \neq P(distribution \mid data)$,
>
>Probability treats data as variable, and likelihood treats parameters as variable

