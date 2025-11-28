---
title: Negative Log Likelihood
draft: false
tags:
date: 2025-11-28
---
 
[[likelihood function|Likelihood]] is just a [[jointprob|Join Probability]] of the data given model parameters $\theta$, but viewed as a function of $\theta$, i.e. $L(\theta)$

One way to do [[MLE|Maximum Likelihood Estimation]] is to minimize the negative log likelihood.

That is $\max_{\theta} E_{x \sim p_{data}} [\log{p_{\theta}(x)}] = \min_{\theta} - E_{x \sim p_{data}} [\log{p_{\theta}(x)}]$

**Log Likelihood** 

It makes the math much easier: $\log(abc) = \log a + \log b + \log c$

We do this because $a \cdot b \cdot c$ might be an extremely small number, so we perform addition instead.

**Log-likelihood (Average)**: $\log \mathcal{L}(\theta) = \frac{1}{n} \sum_{i=1}^n \log p(x_i \mid \theta) = E_{x \sim p_{data}} [\log{p(x \mid \theta)}]$

**Negative log-likelihood (Average)**: $-\log \mathcal{L}(\theta) = -\frac{1}{n} \sum_{i=1}^n \log p(x_i \mid \theta) = -E_{x \sim p_{data}} [\log{p(x \mid \theta)}]$

