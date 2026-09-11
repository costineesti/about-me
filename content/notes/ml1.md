---
title: ML Preliminaries
draft: false
tags:
date: 2026-09-10
---

# Linear Algebra

Let **bold** lower case letters denote *vectors* and **bold** upper case letters denote matrices.

Machine learning algorithms apply operations on vectors. If we express $\mathbf{v} = 3\mathbf{x} + \mathbf{y}$, then we can express it as a column vector in pattern recognition:

$$
\mathbf{v} = \begin{bmatrix} 3 \\ 1 \end{bmatrix}
$$

* **each dimension** represents a **extracted feature**
* the "points" that represent objects are the head (tip, endpoint) of a **feature vector**.

The length or 2-norm of a vector is denoted $\mid x \mid$:

$$
\begin{aligned}
|\mathbf{x}| &= \sqrt{\sum_{i=1}^{n} x_i^2} \\
&= \sqrt{x_1^2 + x_2^2 + \dots + x_n^2}
\end{aligned}
$$

* more generally, the *p*-norm of a vector is given by:

$$
|\mathbf{x}|_p = \sqrt[p]{\sum_{i=1}^{n} x_i^p}
$$

see [[inner product]].

**Eigenvectors & Eigenvalues**

>[!summary] We call **e** an eigenvector and $\lambda$ the corresponding eigenvalue of matrix **A** if:
>
>$$
>\mathbf{Ae} = \lambda \mathbf{e}
>$$

# Probability Theory

The axioms of probabilities are 

*  if $\models \phi$, then $p(\phi) = 1$ 
	* i.e. if the even $\phi$ is guaranteed to be true in all possible states of the world, then its probability is 1.
* if $\neg(\phi \land \psi)$, then $p(\phi \lor \psi) = p(\phi) + p(\psi)$ 
	* $\neg(\phi \land \psi)$ i.e. "not ( $\phi$ and $\psi$ )", meaning $\phi$ and $\psi$ are mutually exclusive (**cannot both happen at once**)
	* $p(\phi \lor \psi)$ i.e. probability of $\phi$ or $\psi$.
	* In plain words: If two events cannot happen at the same time, the probability of either happening is simply the sum of their individual probabilities (the sum rule / finite additivity).

Some consequences of these axioms: 

- $0 \leqslant p(X) \leqslant 1$ -- i.e. all probabilities must fall within 0 and 1.
- If our events are mutually exclusive and include all possible outcomes, they sum up to 1 
- In our case: 

$$ 
p(B = r) = 0.4 \text{ and } p(B = b) = 0.6 
$$ 

$$ 
\sum_i p(B = i) = 1 
$$

* the entailment symbol $\models \phi$ is a **tautology** (a statement that is necessarily and always true).
* NOT ($\neg$), AND ($\land$), OR ($\lor$)

**The Sum Rule (marginalization)**

$$
p(X=x_i​,Y=y_j​)=\frac{n_{ij}}{N}
$$

This is just the fraction of total events where both $X=x_i$​ and $Y=y_j$​ happened at the same time. 

$c_i$ denotes the sum of all occurences for this event: $c_i = \sum_j n_{ij}$. If we only care about the probability of $X = x_{i}$ regardless of what $Y$ is doing, I sum the entire $i^{th}$ column.​​

Dividing that column sum by the total N gives the second equation, the **marginal probability**:

$$
p(X = x_i) = \frac{c_i}{N} = \sum_j{\frac{n_{ij}}{N}} = \sum_j{p(X=x_i, Y=y_j)}
$$

To get the probability of one variable alone, sum out (marginalize) all possible values of the other variable. In other words, whenever you have the joint probability of two variables happening together, $p(X,Y)$, but you only care about $X$, you collapse or "erase" $Y$ by adding up the probabilities across every possible value $Y$ could take.

>[!example] Let's say we have a table tracking people by **Hair color** ($X$) and **Eye color** ($Y$)
>
>The cell for $(\text{Brown hair, Blue eyes})$ gives the joint probability $p(\text{Brown hair, Blue eyes})$. If you simply want the overall probability of someone having **Brown Hair** regardless of eye color, you add up:
>
>$$
>p(\text{Brown hair, Blue eyes}) + p(\text{Brown hair, Brown Eyes}) + \dots
>$$
>
>Because we summed over all options for eye color, eye color disappears from the final result, leaving us with just $p(\text{Brown Hair})$. That process of summing away an unwanted variable is called **marginalization**.

**The Product Rule**

> To find the chance that both things happen, find the chance that $X$ happens first, then multiply by the chance that $Y$ happens given that $X$ already occurred.

$$
p(X = x_i, Y = y_j) = p(Y = y_j \mid X = x_i) \cdot p(X = x_i)
$$

**Applying the two rules**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml3.png" style="max-width: 100%; height: auto;">
</div>

* $B$ is the box chosen (red or blue), with prior probabilities of 0.4 and 0.6 respectively.
* $F$ is the fruit/item picked ($g$ for green, orange for the other).
* In the red box: 2 green out of 8 total items $\rightarrow p(F=g \mid B=r)=\frac{2}{8}​=0.25$
* In the blue box: 3 green out of 4 total items $\rightarrow p(F=g \mid B=b)=\frac{3}{4}​=0.75$

We now want to estimate $p(F=g)$, i.e. the overall chance of picking a green object, regardless of which box it came from, which makes it a **marginalization problem**.

Because the color of the fruit depends on which box I pick from, I cannot evaluate F in isolation. The full chain of reasoning works in three steps:

1. First, by the **Sum Rule**, I expand the marginal probability into the sum of all joint scenarios

$$
p(F=g) = p(F=g, B=r) + p(F=g, B=b)
$$

2. Second, by the **Product Rule**, I break each joint event into a sequence: the chance of choosing that box, multiplied by the chance of drawing green once I look inside that specific box:

$$
\begin{aligned}
p(F=g, B=r) &= p(F=g, B=r) \cdot p(B=r) \\
p(F=g, B=b) &= p(F=g, B=b) \cdot p(B=b)
\end{aligned}
$$

3. Plug in the counts from above. It was also given that $p(B=r)=0.4$ and $p(B =b) = 0.6$.

$$
\begin{aligned}
p(F=g) &= p(F=g, B=r) + p(F=g, B=b) \\
&= p(F=g, B=r) \cdot p(B=r) + p(F=g, B=b) \cdot p(B=b) \\
&= 0.25 \cdot 0.4 + 0.75 \cdot 0.6 \\
&= 0.55
\end{aligned}
$$

See [[PDF|Probability Density Function]], [[Gaussian distribution]].

> Note that if during some calculus, I get $p(x)>1$, I should ask whether it's a density or a probability.

**Computing Weighted Averages and Expectations**

Imagine we toss a coin, and for every head I get one cent, for every tail i get 2 cents. After 10 throws, how many cents do I expect to have?

First, we have a function $f(C)$ which encodes how many cents we get for every toss:

$$
f(C=h)=1, \quad f(C=t)=2
$$

It's a fair coin 50/50:

$$
p(C=h)=1/2, \quad p(C=t)=1/2
$$

By definition, the expectation is:

$$
\mathbb{E}[f(C)] = \sum_{C\in\{h,t\}} p(C)f(C) = 1/2 \cdot 1 + 1/2 \cdot 2 = 1.5
$$

So after 10 throws, I expect to have $10 \cdot 1.5 = 15$ cents.

We can use probability densities to estimate weighted averages of functions.

>[!summary] The average value of function $f(x)$ under the distribution $p(x)$ is called **expectation** of $f(x)$, and it is denoted by $\mathbb{E}[f(x)]$ and it's given by:
>
>$$
>\mathbb{E}[f(x)] = \int p(x)f(x) dx
>$$

>[!summary] The **variance** is defined as the expectation of $f(x) = (x-\mathbb{E}[\mathbf{x}])^2$:
>
>$$
>\text{var}[\mathbf{x}] = \mathbb{E}[(\mathbf{x}-\mathbb{E}[\mathbf{x}])^2]
>$$
>
>where the expectation is the mean value of $f(x)$, $\mu$.
>
>So by using the integral from above, where $f(x) = (x-\mu)^2$, this definition is equivalent with:
>
>$$ 
>\begin{aligned} \text{var}[x] &= \mathbb{E}[x^2] - 2\mu \mathbb{E}[x] + \mu^2 \\ &= \mathbb{E}[x^2] - 2\mu(\mu) + \mu^2 \\ &= \mathbb{E}[x^2] - 2\mu^2 + \mu^2 \\ &= \mathbb{E}[x^2] - \mu^2 \end{aligned} 
>$$
>
>Substituting $\mu = \mathbb{E}[x]$ back in yields: 
>
>$$ 
>\text{var}[x] = \mathbb{E}[x^2] - (\mathbb{E}[x])^2 
>$$
>
>* it is an indication of how much variability there is in x around its mean value. 
>
>In short: **Variance is the mean of the squares minus the square of the mean.**

**Bayes' Rule**

Recall Bayes' Theorem:

$$
\underbrace{P(hypothesis|evidence)}_{\text{Posterior probability}} = \frac{\overbrace{P(hypothesis)}^{\text{Prior}} \cdot \overbrace{P(evidence|hypothesis)}^{\text{Likelihood}}}{\underbrace{P(evidence)}_{\text{Marginal likelihood}}}
$$

It's easy to reach this form. From above, using the **product rule**:

$$
p(X,Y) = p(X \mid Y) \cdot p(Y) = p(Y \mid X) \cdot p(X)
$$

Thus,

$$
p(X \mid Y) = \frac{p(Y \mid X) \cdot p(X)}{p(Y)}
$$

The denominator can be expressed using the sum and product rules as:

$$
p(Y) = \sum_X p(Y,X) = \sum_X p(Y \mid X) \cdot p(X)
$$

If we only have two outcomes, the hypothesis is either true ($X$) or false ($\neg X$) -- the denominator simply adds up the two ways this evidence could ever exist:

$$
p(Y) = p(Y \mid X) \cdot p(X) + p(Y \mid \neg X) \cdot p(\neg X)
$$

> This is also known as the **Law of Total Probability**

---

some notes to myself

We recaped 1) joint probability and 2) conditional probability

The joint I always use the same equation: the probability that one of them happens (either x or y) times the probability that the other one happened, given the first already happened)

$$
p(X,Y) = p(X \mid Y) \cdot p(Y) = p(Y \mid X) \cdot p(X)
$$

The conditional can be derived exactly from above, actually:

$$
p(X \mid Y) = \frac{p(X,Y)}{p(Y)}
$$

For this I don't need Bayes' Rule.

In the real world, however, I observe the evidence and want to infer the hidden cause (hypothesis/parameter), but my model or known data only tells me how causes produce evidence ($p(\text{evidence} \mid \text{cause})$). So I need to reason backwards, and that's where Bayes' Rule comes in.

> Bayes' Rule is literally just the inversion tool for when you only know how things run forward.

