---
title: Practical Data Mining
draft: false
tags:
date: 2026-09-09
---

Practical attached to [[ds4all 4|Data Mining]].

# K-Nearest Neighbors -- Exercise 1

| Obs | $X_1$ | $X_2$ | $X_3$ | $Y$   |
| --- | ----- | ----- | ----- | ----- |
| 1   | 0     | 3     | 0     | Red   |
| 2   | 2     | 3     | 0     | Red   |
| 3   | 0     | 3     | 3     | Red   |
| 4   | 0     | 3     | 2     | Green |
| 5   | -1    | 3     | 1     | Green |
| 6   | 1     | 1     | 1     | Red   |

> Training data: 6 observations, 3 predictors ($X_1, X_2, X_3$), qualitative response $Y$.

**a. Euclidean distances to (0,0,0)**

$$d = \sqrt{X_1^2+X_2^2+X_3^2}$$

| Obs | Distance                             |
| --- | ------------------------------------ |
| 1   | $\sqrt{0+9+0}=3$                     |
| 2   | $\sqrt{4+9+0}=\sqrt{13}\approx3.606$ |
| 3   | $\sqrt{0+9+9}=\sqrt{18}\approx4.243$ |
| 4   | $\sqrt{0+9+4}=\sqrt{13}\approx3.606$ |
| 5   | $\sqrt{1+9+1}=\sqrt{11}\approx3.317$ |
| 6   | $\sqrt{1+1+1}=\sqrt{3}\approx1.732$  |

Since (0,0,0) lies in the origin, the values from the table above are the exact euclidean distances we are searching for. 

---

**b. What is your prediction with K = 1? Why?**

For $K=1$, the closest match is **Obs 6** ($d\approx1.732$, $Y=$ Red), since it is the closest value to 1.

> **Prediction: Red**

---

**c. What is your prediction with K = 3? Why?**

For $K=3$, the three nearest neighbors are 

* **Obs 6 ($d \approx 1.732, Y=Red$)**, 
* **Obs 1 ($d=3, Y=Red$)**, 
* **Obs 5 ($d \approx 3.317, Y=Green$)** $\rightarrow$ majority vote = 2 Red, 1 Green.

> **Prediction: Red**

---

**d. If the Bayes decision boundary in this problem is highly non-linear, then would we expect the best value for K to be large or small? Why?**

>[!quote] k controls smoothness: k=1 gives a jagged boundary that memorizes noise, large k smooths everything toward the majority class.

> A highly non-linear boundary needs a **flexible** model to be captured.
> 
> - Small $K$ $\rightarrow$ low bias, high variance $\rightarrow$ follows the true boundary closely
> 
> - Large $K$ $\rightarrow$ smooths over the non-linearity $\rightarrow$ high bias
>
> **Best K: small.**

---

# Exercise 2 -- Naive Bayes classifier

A retailer wants to distinguish between customers younger than 35 and those older than 35. The relevant attributes, determined by domain knowledge, are denoted by $A$ and $B$ for convenience. The values for $A$ are $a_1, a_2$ and $a_3$. The values for $B$ are $b_1$ and $b_2$.

The retailer wants to use Data Mining techniques to classify the customers in the class **Young, denoted by Y, and Old, denoted by O**.

**Data (counts):**

| A     | B     | Y   | O   |
| ----- | ----- | --- | --- |
| $a_1$ | $b_1$ | 4   | 10  |
| $a_2$ | $b_1$ | 6   | 2   |
| $a_3$ | $b_1$ | 8   | 6   |
| $a_1$ | $b_2$ | 2   | 8   |
| $a_2$ | $b_2$ | 6   | 2   |

Totals: $N_Y = 26$, $N_O = 28$ => $N=54$

**a. No information about the customer. How will this new customer be classified based on the above data, and explain why?**

Only the **prior** can be used: 

* $P(Y)=\frac{26}{54}\approx0.481$
* $P(O)= \frac{28}{54}\approx0.519$

> The new customer will be **classified as Old** (higher prior probability, since $O>Y$ in the data).

---

**b. Standard (non-Naive) Bayes for $A=a_3, B=b_2$. Is it possible to apply the standard (non-Naive) Bayes to classify this new customer?**

Standard Bayes needs the **joint** probability $P(A=a3, B=b2 \mid C)$ directly from the data.

$$P(C \mid A=a3, B=b2) = \frac{P(A=a3, B=b2 \mid C)\cdot P(C)}{P(A=a3, B=b2)}$$

To compute this directly, standard Bayes needs the **joint likelihood**:

$$P(A=a3, B=b2 \mid C) = \frac{\text{count}(A=a3, B=b2, C)}{\text{count}(C)}$$

But the table has no row for $(a_3, b_2)$ — that combination was never recorded, so $\text{count}(A=a3, B=b2, C)$ is unknown for both $C=Y$ and $C=O$. The numerator can't be estimated, so $P(C\mid a3,b2)$ can't be computed this way.

> Therefore, we can't apply standard Bayes to classify this customer.

---

**c. Naive Bayes for a customer with  $A=a_3, B=b_2$.**

The standard approach goes like this:

$$
P(C \mid A, B) = \frac{P(A,B\mid C)\cdot P(C)}{P(A,B)}
$$

Naive Bayes assumes that the conditional probabilities of each class are individual of each other, so we only need the **marginals** per class (sum over the other attribute), i.e. $A$ and $B$ are conditionally independent given $C$.

$$
P(A,B\mid C) = P(A\mid C)\cdot P(B\mid C)
$$

Therefore:

$$
P(C \mid A=a_3, B=b_2) = \frac{P(C)\cdot P(A=a_3\mid C)\cdot P(B=b_2\mid C)}{P(A=a_3, B=b_2)}
$$

Since the denominator is the same for both classes, we only need to **compare the** **numerators**:

$$
\text{score}(C) = P(C)\cdot P(A=a3\mid C)\cdot P(B=b2\mid C)
$$

**Priors** (from totals $N_Y=26$, $N_O=28$, $N=54$): 

$$
P(Y) = \frac{N_Y}{N} = \frac{26}{54}, \qquad P(O) = \frac{N_O}{N} = \frac{28}{54}
$$

**Class-conditional likelihoods** (marginalize each attribute over the other, within each class): 

$$
P(A=a_3\mid Y) = \frac{\text{count}(a_3, Y)}{N_Y} = \frac{8}{26}, \qquad P(A=a_3\mid O) = \frac{\text{count}(a_3, O)}{N_O} = \frac{6}{28}
$$

$$
P(B=b_2\mid Y) = \frac{\text{count}(b_2, Y)}{N_Y} = \frac{2+6}{26}=\frac{8}{26}, \qquad P(B=b_2\mid O) = \frac{\text{count}(b_2, O)}{N_O} = \frac{8+2}{28}=\frac{10}{28}
$$

**Plug in:** 

$$
\text{score}(Y) = \frac{26}{54}\cdot\frac{8}{26}\cdot\frac{8}{26} = \frac{16}{351}\approx0.0456
$$

$$
\text{score}(O) = \frac{28}{54}\cdot\frac{6}{28}\cdot\frac{10}{28} = \frac{5}{126}\approx0.0397
$$

> **Classify as Young**, since $P(Y\mid a_3,b_2) > P(O\mid a_3,b_2)$.

> Complete with the denominator calculation!!! She wants to see probabilities, not scores.

---

# Exercise 3 -- Decision Tree

We consider the same dataset from the previous question. Now we use decision trees.

**a. What is the classification error rate for attribute $A$?**

The classification error rate is used to predict the majority class while counting the minority class as *misclassified*. To find the classification error rate for attribute $A$, I must aggregate the class counts for each distinct value of $A$ and sum the minority class instances (the errors).

* $a_1$: 6 instances of $Y$, 18 instances of $O$, making the **majority prediction** $O$ with 6 errors
* $a_2$: 12 instances of $Y$, 4 instances of $O$, making the **majority prediction** $Y$ with 4 errors
* $a_3$: 8 instances of $Y$, 6 instances of $O$, making the **majority prediction** $Y$ with 6 errors

The total number of misclassified instances is 16(6+6+4). The total number of instances across the entire dataset is 54. The classification error rate for attribute A is $\frac{16}{54} \approx 29.63\%$

---

**b. What is the classification error rate for attribute $B$?

* $b_1$: 18 instances of $Y$, 18 instances of $O$. Since it's a tie, either gives 18 errors.
* $b_2$: 8 instances of $Y$, 10 instances of $O$, making the **majority prediction** $O$ with 8 errors.

The total number of misclassified instances is 26. Out of the 54 total instances in the dataset, the classification error rate for attribute B is $\frac{26}{54} \approx 48.15\%$

---

**c. What will be the splitting attribute in the top (root) of the Decision Tree if one uses the classification error rate?**

The splitting attribute at the root of the Decision Tree will be attribute $A$.

When using the classification error rate as the splitting criterion, **the algorithm selects the attribute that minimizes the overall error.** Since splitting on attribute A results in a lower classification error rate ($29.63\%$) compared to attribute B ($48.15\%$), attribute A provides the better split.

---

**d. What is the Gini index for attribute $A$?**

The gini index is used to measure node purity in decision trees. A node is considered pure if it contains one class.

$$
gini(t) = 1 - \sum_j[P(j \mid t)]^2
$$

* where $P(j \mid t)$ is the relative frequency of class $j$ at node $t$.
* $gini(t) = 0$ means it's perfectly pure (all samples in one class)
* $>>$ $gini(t)$ means more mixed classes.

So we consider the counts from earlier:

* $a_1 (6Y, 18O)$ => 24 instances
* $a_2 (12Y, 4O)$ => 16 instances
* $a_3 (8Y, 6O)$ => 14 instances

$$
gini(a_1) = 1 - [P(Y \mid a_1)]^2 - [P(O \mid a_1)]^2 = 1 - \left(\frac{6}{24}\right)^2 - \left(\frac{18}{24}\right)^2 = 0.375
$$

$$
gini(a_2) = 1 - [P(Y \mid a_2)]^2 - [P(O \mid a_2)]^2 = 1 - \left(\frac{12}{16}\right)^2 - \left(\frac{4}{16}\right)^2 = 0.375
$$

$$
gini(a_3) = 1 - [P(Y \mid a_3)]^2 - [P(O \mid a_3)]^2 = 1 - \left(\frac{8}{14}\right)^2 - \left(\frac{6}{14}\right)^2 \approx 0.490
$$

The overall Gini index for attribute $A$ is the weighted sum of these impurities: $\frac{24}{54} \cdot 0.375 + \frac{16}{54} \cdot 0.375 + \frac{14}{54} \cdot 0.490 \approx 0.4048$

---

**e. What is the Gini index for attribute $B$?**

Again, we consider the counts from earlier:

* $b_1 (18Y, 18O)$ => 36 instances
* $b_2 (8Y, 10O)$ => 18 instances

$$
gini(b_1) = 1 - [P(Y \mid b_1)]^2 - [P(O \mid b_1)]^2 = 1 - \left(\frac{18}{36}\right)^2 - \left(\frac{18}{36}\right)^2 = 0.5
$$

$$
gini(b_2) = 1 - [P(Y \mid b_2)]^2 - [P(O \mid b_2)]^2 = 1 - \left(\frac{8}{18}\right)^2 - \left(\frac{10}{18}\right)^2 \approx 0.494
$$

The overall Gini index for attribute $A$ is the weighted sum of these impurities: $\frac{36}{54} \cdot 0.5 + \frac{18}{54} \cdot 0.494 \approx 0.498$

---

**f. What will be the splitting attribute in the top (root) of the Decision Tree if one uses the Gini index?**

The splitting attribute at the root of the Decision Tree will be attribute $A$.

When using the Gini index, the goal is to select the attribute that minimizes the impurity of the resulting nodes. Since the overall Gini index for attribute $A$ ($\approx 0.405$) is lower than the Gini index for attribute $B$ ($\approx 0.498$), splitting on attribute A results in purer subsets.

---

**g. Construct the full Decision Tree, using the error rate as a heuristic. What is the overall classification error rate on the above dataset?**

Question c. answers this question: The splitting attribute at the root of the Decision Tree will be attribute $A$ since attribute A results in a lower classification error rate ($29.63\%$) compared to attribute B ($48.15\%$). 

> Therefore, the overall classification error rate will be $29.63\%$

![[Pasted image 20260909154538.png]]

> complete with B.

---

**h. Is this classification error rate an optimistic or pessimistic estimate of the error rate on unseen new data? Explain your answer.**

Considering that $29.63\%$ is the training error, I would consider it optimistic. However, we split the decision tree on the same dataset that we "trained" it on, which of course it resulted in a very simple 3-leaves tree. 

I expect for the classifier to perform worse on new unseen data, as the current model is heavily biased towards the training data from above.

For this reason, I would much rather use the Gini index in this case since it's more sensitive to changes in a node's class distribution. Error rate only tracks the majority class, so it's "blind" to improvements in the minority class's proportion.