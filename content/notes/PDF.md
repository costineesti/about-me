---
title: Probability Density Function
draft: false
tags:
date: 2025-11-28
---
 
I hate the fact that in Romania we weren't taught probabilities and statistics.

>[!NOTE]
>For a continuous random variable with PDF $f$, we have $P(a \leq x \leq b) = \int_a^b f(x)dx$

In probability, a PDF is a function whole value at any given point in the sample space can be interpreted as the relative [[likelihood function|likelihood]] that the value of the random variable would be equal to that sample

These functions help model out the distribution of a particular variable, such as the age at which humans die, the height of a population, or suppose bacteria of a certain species typically live 4 to 6 hours. Then you can create a PDF.

For example, [[Gaussian distribution|Normal Distribution]] has probability density $f(x) = \frac{1}{\sqrt{w\pi}} e^{-x^2/2}$

For a PDF $f(x)$, we need to satisfy the condition $\int f(x)dx = 1$.