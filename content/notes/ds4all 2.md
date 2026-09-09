---
title: Data Mining - Naive Bayes Approach
draft: false
tags:
date: 2026-09-08
---

Topic from [[ds4all|Data Science]].

Data mining is about discovering patterns or more general information in large data sets using methods from artificial intelligence, machine learning, statistics, and database systems.

A **bayesian approach** uses a probabilistic model including **prior knowledge**. Another assumption is that the naive approach assumes that the conditional probabilities are individual of each other.

>[!example] Will this person buy a computer?
> | Age | Income | Student | Credit rating | Buys Computer |
> |---|---|---|---|---|
> | ≤30 | high | no | fair | no |
> | ≤30 | high | no | excellent | no |
> | 31-40 | high | no | fair | yes |
> | >40 | medium | no | fair | yes |
> | >40 | low | yes | fair | yes |
> | >40 | low | yes | excellent | no |
> | 31-40 | low | yes | excellent | yes |
> | ≤30 | medium | no | fair | no |
> | ≤30 | low | yes | fair | yes |
> | >40 | medium | yes | fair | yes |
> | ≤30 | medium | yes | excellent | yes |
> | 31-40 | medium | no | excellent | yes |
> | 31-40 | high | yes | fair | yes |
> | >40 | medium | no | excellent | no |
> | ≤30 | medium | yes | fair | ?? |

* We have 14 people. At the bottom we know the characteristics, but not if they will buy a computer. We consider this table the training data. In this training data, only 9 people bought a computer, and we can divide them all into the 4 categories shown: age, income, student, credit rating

**Age**

| Age | Yes | No | Total |
|---|---|---|---|
| ≤30 | 2 | 3 | 5 |
| 31-40 | 4 | 0 | 4 |
| >40 | 3 | 2 | 5 |
| Total | 9 | 5 | 14 |

**Income**

| Income | Yes | No | Total |
|---|---|---|---|
| high | 2 | 2 | 4 |
| medium | 4 | 2 | 6 |
| low | 3 | 1 | 4 |
| Total | 9 | 5 | 14 |

**Student**

| Student | Yes | No | Total |
|---|---|---|---|
| No | 3 | 4 | 7 |
| Yes | 6 | 1 | 7 |
| Total | 9 | 5 | 14 |

**Credit Rating**

| Credit Rating | Yes | No  | Total |
| ------------- | --- | --- | ----- |
| fair          | 6   | 2   | 8     |
| excellent     | 3   | 3   | 6     |
| Total         | 9   | 5   | 14    |

Recall Bayes' Theorem:

$$
\underbrace{P(hypothesis|evidence)}_{\text{Posterior probability}} = \frac{\overbrace{P(hypothesis)}^{\text{Prior}} \cdot \overbrace{P(evidence|hypothesis)}^{\text{Likelihood}}}{\underbrace{P(evidence)}_{\text{Marginal likelihood}}}
$$

So we have to compute:

$$
P(+ \mid \leq 30,med,stu,fair) = \frac{P(+) \cdot P(\leq 30, med, stu, fair \mid +)}{P(\leq 30, med, stu, fair)}
$$

* We know $P(+) = \frac{9}{14}$
* Applying the Naive Bayes approach, predictors are **conditionally independent given the class**: $P(\leq 30,med,stu,fair \mid +) = P(\leq 30 \mid +) \cdot P(med \mid +) \cdot P(stu \mid +) \cdot P(fair \mid +) = \frac{2}{9} \cdot \frac{4}{9} \cdot \frac{6}{9} \cdot \frac{6}{9} = 0.0439$
* The denominator, i.e. the total probability of observing this combination of characteristics, is calculated using the law of total probability:

$$
P(B) = P(A)P(B \mid A) + P(notA)P(B \mid notA)
$$

* Denominator $P(\leq 30, med, stu, fair)$ equals to: $P(+)P(\leq 30, med, stu, fair \mid +) + P(-)P(\leq 30, med, stu, fair \mid -) = \frac{9}{14} \cdot \frac{2}{9} \cdot \frac{4}{9} \cdot \frac{6}{9} \cdot \frac{6}{9} + \frac{5}{14} \cdot \frac{3}{5} \cdot \frac{2}{5} \cdot \frac{1}{5} \cdot \frac{2}{5} = 0.0351$

Thus:

$$
P(+ \mid \leq 30, med, stu, fair) = \frac{\frac{9}{14} \cdot 0.0439}{0.0351} = 0.805 > 0.5 \Rightarrow Prediction: \textbf{Buys Computer = Yes}
$$

