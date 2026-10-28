---
title: Bernoulli Distribution
draft: false
tags:
date: 2026-10-27
---

 >[!summary] Bernoulli Distribution
 >is the probability mass function of a binary event $x \in {0,1}$:
 >
 >$$
 >p(x \mid \mu) = \mu^x (1 - \mu)^{1-x} = \begin{cases} \mu & \text{if } x = 1 \\ 1 - \mu & \text{otherwise} \end{cases}
 >$$
 >
 
Expectation and Variance

* $\mathbb{E}(X) = p$
* $\text{Var}(X) = p(1-p)$

>[!NOTE] Bernoulli Sequence
>Suppose we have a sequence of independent $X_i \sim \text{Ber}(p)$, then we call $X_1, X_2, \dots, X_n$ a Bernoulli process
>
>* essentially just a sequence of 0's and 1's.
>* i.e. $X \sim \text{Ber}(p)$ if $X$ takes values ${0,1}$ with $P(X=1)=p$

[[likelihood function|Likelihood]] and [[neg log likelihood|Log Likelihood]]

Per Bayes' Theorem, when you have a sequence of $N$ independent observations, the joint probability of seeing that specific sequence is the product of their individual probabilities. This is the likelihood function. Because multiplying many small probabilities causes numerical underflow and is difficult to differentiate, we take the natural logarithm. The log function converts the product $\prod$ into a sum $\sum$, resulting in the log-likelihood function $\mathcal{L}$.

$$
\begin{aligned}
\mathcal{L}(x_{1\dots N}; \mu) &= \log \prod_{n=1}^N \mu^{x_n} (1 - \mu)^{1-x_n} \\
&= \sum_{n=1}^N x_n \log \mu + (1 - x_n) \log(1 - \mu)
\end{aligned}
$$

[[MLE|Maximum Likelihood Estimator]]

The MLE for the parameter $\mu$ is found by maximizing the log-likelihood. The MLE answers a reverse question: given the data sequence we actually observed, what is the most optimal, probable value for the unknown parameter $\mu$? To find the maximum of the log-likelihood function, we take its first derivative with respect to $\mu$ and set it to zero.

$$
\begin{aligned}
\frac{\partial}{\partial \mu} \mathcal{L}(x_{1\dots N}; \mu) &= \frac{\partial}{\partial \mu} \sum_{n=1}^N x_n \log \mu + (1 - x_n) \log(1 - \mu) \\
0 &= \sum_{n=1}^N \frac{x_n}{\mu} - \frac{1 - x_n}{1 - \mu} = \sum_{n=1}^N \frac{x_n (1 - \mu) - (1 - x_n)\mu}{\mu(1 - \mu)} \\
0 &= \sum_{n=1}^N x_n - \mu \mathbf{x}_n - \mu + \mu x_n = \sum_{n=1}^N x_n - \mu \\
\boxed\mu &= \frac{\sum_{n=1}^N x_n}{N}
\end{aligned}
$$

This derivation formally proves that the most statistically sound estimate for the probability $\mu$ of a Bernoulli event is simply the empirical sample mean -- the total number of successes divided by the total number of trials.

**The Categorical Distribution**

The Bernouli distribution can be extended to multiple classes, rather than just a binary success or failure.

**One-of-K Encoding**: To mathematically handle multiple classes, an observation is represented as a vector $\mathbf{x}$ using one-of-K (or one-hot) encoding. If the observed class is $k$, then the $k$-th element of the vector is 1 ($\mathbf{x}_k=1$), and all other elements are 0 ($x_{j \neq k} = 0$).

The Probability Mass Function (i.e. probability of observing a specific vector $\mathbf{x}$) is defined as:

$$
p(\mathbf{x}) = \prod_{i=1}^K p_i^{x_i} \quad \text{where} \quad \sum_{i=1}^K p_i = 1
$$

* because of one-hot-encoding all exponents $x_i$​ are $0$ except for the single index where $x_k=1$

Just as the Bernoulli MLE yields the empirical sample mean for a single probability, the **MLE for the Categorical distribution** calculates the empirical probability for each class. The estimator sums the values of the $i$-th index across all $N$ independent observations. Since $x_i^{(n)}$ is $1$ only when class $i$ is observed, the numerator represents the absolute count of times class $i$ appeared in the dataset. Dividing this count by the total number of measurements $N$ gives the optimal parameter estimate $p_i$​ for that specific class.

$$
p_i = \frac{\sum_{n=1}^N x_i^{(n)}}{N}
$$

