---
title: Linear Discriminants
draft: false
tags:
date: 2026-09-18
---

# Linear Discriminants

See the easiest example: Two class classification

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml6.png" style="max-width: 100%; height: auto;">
</div>

* Get class labels as a function of the features: $\begin{cases}C_0 \text{, if y(x) > 0} \\ C_1 \text{, if y(x) < 0} \end{cases}$
* Discriminant: $y(x)=0$
* Linear classifier $\rightarrow$ $y(x)=0$ is a linear function of $x$.

$$
y(x) = w_0 + w^\top x
$$

From a geometric view, **the slope** is determined by $w$, offset from origin by $w_o$ i.e. $\frac{w_0}{||w||}$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml7.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml8.png" alt="flow 2" width="350" height="300"> </div> </div>

For convenience, fold the bias in $\tilde{w} = (w_0, w_1, \dots w_d)$ and $\tilde{x}^\top = (1, x_1, \dots x_D)$. So that $y(x) = \tilde{w}^\top \tilde{x}$. The hyperplane equation becomes $\tilde{w}^\top \tilde{x} = 0$. We use $w$ to denote $\tilde{w}$ from now on.

* Modify $x \rightarrow$ classify a new datapoint
* Modify $w \rightarrow$ change the discriminant

**Choosing a good classifier**

* Minimize misclassified training points
* Maximize separation of the most ambiguous points
* Maximize data probability

If we generalize to $K$ classes, simply combine multiple 2-class classifiers, and watch out for ambiguous regions. The result depends on the slope $|w_k|$, not just the decision itself.

* use $C=C_k <=> y_k(x) > y_j(x) \forall j \neq k \text{, where } y_k(x)=w_k^\top x + w_{k_0}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml9.png" style="max-width: 100%; height: auto;">
</div>

**Explanation**

The boundary between regions $R_k$ and $R_j$ is where $y_k(x) = y_j(x)$:

$$
(w_k-w_j)^\top x  + (w_{k_0} - w_{j_0}) = 0
$$

This is itself a hyperplane, with **normal vector** $w_k-w_j$. There we have it. The boundary's orientation depends on the *difference* of the two weight vectors, not on either one alone.

* The norm matters because each individual discriminant $y_k(x)=0$ doesn't move if we rescale $w_k \rightarrow \alpha w_k, w_{k_0} \rightarrow \alpha w_{k_0}$, but the *pairwise* boundary $y_k(x) = y_j(x)$ becomes $(\alpha w_k-w_j)^\top x  + (\alpha w_{k_0} - w_{j_0}) = 0$
	* As $\alpha$ changes, the normal $\alpha w_k - w_j$ rotates (unless perpendicular)

>[!example] Tiny numeric example (2D, 2 classes)
>
>We have $y_1(x) = x_1$, (i.e. $w_1=(1,0)$) and $y_2(x) = x_2$, (i.e. $w_2=(0,1)$)
>
>Boundary is at $x_1=x_2 \rightarrow$ the slope equals 1.
>
>Now scale $w_1$ by $\alpha=2$, so $y_1(x) = 2x_1$. The boundary now moves to $2x_1 = x_2 \rightarrow$ the slope equals 2.
>

# Linear Perceptron

Inspired by the brain: binary signal, multiple inputs $\rightarrow$ one output, fires if activation is high enough.

The activation is defined by a non-linear step function:

$$
f(x;w) = h(w^\top x) \text{, where } h(a) = \begin{cases}+1 \text{, if a>0} \\ -1 \text{ otherwise}\end{cases}
$$

The training dataset $\{x_n,t_n\}$ uses the target coding scheme:

$$
t_n = \begin{cases}+1 \text{, if } x_n \in C_1 \\ -1 \text{ otherwise}\end{cases}
$$

**Training via stochastic gradient descent**

Classification is correct if and only if:

$$
w^\top x_n t_n > 0
$$

The objective is to minimize the misclassification rate $E(w) = - \sum_{n \in \mathcal{M}} w^\top x_nt_n$, where $\mathcal{M} = \{x_i \mid w^\top x_i t_i \leq 0\}$ is the set of misclassified examples.

We simply update the weights by bgd (batch gradient descent):

$$
\begin{aligned}
w^{(i)} &= w^{(i-1)} - \eta \nabla_w E(w^{(i-1)})\\
&= w^{(i-1)} + \eta \sum_{n \in \mathcal{M}} x_n t_n\\
&\approx w^{(i-1)} + \eta \cdot x_n \cdot t_n \text{ for some n where } w^\top x_n t_n < 0
\end{aligned}
$$

> that's the "stochastic" part -- one misclassified example per update rather than the full batch. It reads as "whenever you hit one that's misclassified, nudge $w$ in the direction of $x_n t_n$ scaled by $\eta$. Repeat until no misclassifications remain."

>[!summary] Perceptron Convergence Theorem
>
>If the training set is linearly separable, the algorithm is guaranteed to find a solution in a finite number of steps.

**Problems with perceptrons**

* slow, doesn't generalize past 2 classes, no way to tell "not separable" from "slow to converge", not guaranteed to reduce error every step (the set of misclassified training examples changes at each weight update), solution depends on initial conditions.

**Gradient Descent flavors**

- **Batch**: sum over all data points
- **Stochastic**: approximate with one random point at a time -- fast, avoids bad local optima, handles redundancy; but noisy, messier stopping criterion
- **Minibatch**: sum over a subset

# Probabilistic Models

they can deal with missing data, include prior knowledge and uncertainty in our parameter values. Confidence comes as a prediction.

**Generative Probabilistic Models**

Learn the point $p(x,C)$, classify via [[ml1|Bayes' rule]]:

$$
p(\mathcal{C}_i|\mathbf{x}) = \frac{p(\mathbf{x}|\mathcal{C}_i)p(\mathcal{C}_i)}{\sum_k p(\mathbf{x}|\mathcal{C}_k)p(\mathcal{C}_k)}
$$

* it's optimal as long as the *true* distributions are learned correctly as $n \rightarrow \infty$.
* for certain distributions, the model results in linear classification.
	* an example would be normal distributions with shared covariances: $\sum_k = \sum_i$.

>[!NOTE] Demonstration
>
>The decision boundary between two classes $\mathcal{C}_k$ and $\mathcal{C}_j$ occurs where their posterior probabilities are equal: 
>
>$$ 
>p(\mathcal{C}_k|\mathbf{x}) = p(\mathcal{C}_j|\mathbf{x}) \iff \ln \frac{p(\mathbf{x}|\mathcal{C}_k)p(\mathcal{C}_k)}{p(\mathbf{x}|\mathcal{C}_j)p(\mathcal{C}_j)} = 0 
>$$ 
>
>For a multivariate Gaussian distribution with class mean $\boldsymbol{\mu}_k$, shared covariance matrix $\mathbf{\Sigma}_k = \mathbf{\Sigma}$, and input feature dimension $D$ (where $\mathbf{x} \in \mathbb{R}^D$): 
>
>$$ 
>p(\mathbf{x}|\mathcal{C}_k) = \frac{1}{(2\pi)^{D/2}|\mathbf{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x} - \boldsymbol{\mu}_k)^\top \mathbf{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}_k)\right) 
>$$ 
>
>Taking the logarithm: 
>$$ 
>\ln p(\mathbf{x}|\mathcal{C}_k) = -\frac{1}{2}\mathbf{x}^\top \mathbf{\Sigma}^{-1}\mathbf{x} + \boldsymbol{\mu}_k^\top \mathbf{\Sigma}^{-1}\mathbf{x} - \frac{1}{2}\boldsymbol{\mu}_k^\top \mathbf{\Sigma}^{-1}\boldsymbol{\mu}_k - \frac{1}{2}\ln|\mathbf{\Sigma}| - \frac{D}{2}\ln(2\pi) 
>$$ 
>
>Because all classes share the exact same covariance $\mathbf{\Sigma}$, the quadratic term $-\frac{1}{2}\mathbf{x}^\top \mathbf{\Sigma}^{-1}\mathbf{x}$ and the normalization constants $-\frac{1}{2}\ln|\mathbf{\Sigma}| - \frac{D}{2}\ln(2\pi)$ are identical.
>
>Subtracting the log-likelihoods cancels out the quadratic $\mathbf{x}^\top \mathbf{\Sigma}^{-1} \mathbf{x}$ component completely: 
>
>$$ \ln \frac{p(\mathbf{x}|\mathcal{C}_k)}{p(\mathbf{x}|\mathcal{C}_j)} = (\boldsymbol{\mu}_k - \boldsymbol{\mu}_j)^\top \mathbf{\Sigma}^{-1}\mathbf{x} - \frac{1}{2}\boldsymbol{\mu}_k^\top \mathbf{\Sigma}^{-1}\boldsymbol{\mu}_k + \frac{1}{2}\boldsymbol{\mu}_j^\top \mathbf{\Sigma}^{-1}\boldsymbol{\mu}_j 
>$$ 
>
>Setting the log-posterior ratio to zero yields a purely linear boundary $\mathbf{w}^\top \mathbf{x} + w_0 = 0$: 
>
>$$ 
>\mathbf{w} = \mathbf{\Sigma}^{-1}(\boldsymbol{\mu}_k - \boldsymbol{\mu}_j) 
>$$ 
>
>$$ w_0 = -\frac{1}{2}\boldsymbol{\mu}_k^\top \mathbf{\Sigma}^{-1}\boldsymbol{\mu}_k + \frac{1}{2}\boldsymbol{\mu}_j^\top \mathbf{\Sigma}^{-1}\boldsymbol{\mu}_j + \ln \frac{p(\mathcal{C}_k)}{p(\mathcal{C}_j)} 
>$$
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml10.png" style="max-width: 100%; height: auto;"> </div>

**Discriminative Probabilistic Models**

1. We directly optimize $p(C_k \mid x)$ instead of modelling $p(x,C)$. They model the posterior distribution $p(C_k \mid x)$ for a two-class problem as a sigmoid $\sigma(a) = \frac{1}{1+e^{-a}}$ (goes from 0 to 1, and at $a=0$, we go through 0.5).

$$
\begin{aligned}
p(\mathcal{C}_1|\mathbf{x}) &= \frac{p(\mathbf{x}|\mathcal{C}_1)p(\mathcal{C}_1)}{p(\mathbf{x}|\mathcal{C}_1)p(\mathcal{C}_1) + p(\mathbf{x}|\mathcal{C}_2)p(\mathcal{C}_2)} \\
&= \frac{1}{1 + \frac{p(\mathbf{x}|\mathcal{C}_2)p(\mathcal{C}_2)}{p(\mathbf{x}|\mathcal{C}_1)p(\mathcal{C}_1)}} \\
&= \sigma(a(\mathbf{x})) \quad \text{where } a(\mathbf{x}) = -\ln \frac{p(\mathbf{x}|\mathcal{C}_2)p(\mathcal{C}_2)}{p(\mathbf{x}|\mathcal{C}_1)p(\mathcal{C}_1)}
\end{aligned}
$$

2. For $K$ classes, the posterior is a softmax function: $p(C_k \mid x) = \frac{exp(a_k)}{\sum_j exp(a_j)}$:

To derive the $k$-class posterior, start with Bayes' theorem to find the probability of class $C_k$ given data $\mathbf{x}$:

$$p(C_k|\mathbf{x}) = \frac{p(\mathbf{x}|C_k)p(C_k)}{p(\mathbf{x})}$$

Expand the marginal probability in the denominator over all possible $j$ classes using the law of total probability:

$$p(C_k|\mathbf{x}) = \frac{p(\mathbf{x}|C_k)p(C_k)}{\sum_{j} p(\mathbf{x}|C_j)p(C_j)}$$

Define the activation $a_k$ as the natural logarithm of the joint probability:

$$a_k = \ln \{ p(\mathbf{x}|C_k) p(C_k) \}$$

Take the exponential of both sides to express the joint probability in terms of $a_k$:

$$\exp(a_k) = p(\mathbf{x}|C_k) p(C_k)$$

Substitute this exponential form into both the numerator and the sum in the denominator to yield the final softmax function for $k$ classes:

$$p(C_k|\mathbf{x}) = \frac{\exp(a_k)}{\sum_{j} \exp(a_j)}$$

> for 2 classes $\rightarrow$ sigmoid, for K-classes $\rightarrow$ softmax.

**Generative vs. Discriminative**

Generative models learn the distribution of the data:

* can sample/generate data
* optimal if known true distribution

Discriminative models directly optimize $p(C_k \mid x) = \sigma(a(x))$:

* **a** is linear in case of normal distributions with shared covariances
* more robust when true distributions are *unknown*
* requires more data.

**Logistic Regression**

We wrote the posterior probability of the class given a datapoint as:
  
$$
\begin{align*}

    p(c_1 \mid \mathbf{x}) &= \sigma(\mathbf{w} \cdot \mathbf{x}) \\

    p(c_2 \mid \mathbf{x}) &= 1 - p(c_1 \mid \mathbf{x})

\end{align*}
$$
  
The parameters of this model, $\mathbf{w}$, can be trained by conditional Maximum Likelihood:
  
$$
\begin{align*}

    \mathbf{w}^* &= \arg\max_{\mathbf{w}} \prod_i p(c_i \mid \mathbf{x}_i) \\

                 &= \arg\max_{\mathbf{w}} \prod_i \sigma(\mathbf{w} \cdot \mathbf{x}_i)^{y_i} \left(1 - \sigma(\mathbf{w} \cdot \mathbf{x}_i)\right)^{1 - y_i}

\end{align*}
$$

This is equivalent with minimizing the binary cross-entropy *loss*. Taken from [[NLP 6|Contextual Word Embeddings and Transformers]].

# Basic Functions

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml11.png" style="max-width: 100%; height: auto;">
</div>

Linear models might be restricted, but they are cheaper to train and less prone to overfitting due to their few adjustable parameters.

We keep the advantage of the classifiers and extend to non-linear problems by transforming the features:

$$
x \rightarrow \phi(x), \quad w^\top x \rightarrow w^\top \phi(x)
$$

> "Linear" here means *linear in parameters, not in data*.

The model is still calculating a simple weighted sum using the parameters w, which makes it mathematically a linear model that is easy to train and less prone to overfitting. However, instead of applying these weights to the raw data $x$, it applies them to the transformed features $\phi(x)$. This means the model is no longer linear with respect to the original input space, allowing it to capture complex, non-linear patterns while keeping the underlying parameter optimization simple.

>[!example] Gaussian basis functions reshape the feature space to make the classes separable
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml12.png" style="max-width: 100%; height: auto;"> </div>
>
>No single straight line can successfully split the two groups in the left image. By feeding this raw data through non-linear Gaussian basis functions centered at specific points like $\mu_1$​ and $\mu_2$​, the data is projected into an entirely new coordinate system defined by $\phi_1$​ and $\phi_2$​.
>
>This mathematical transformation warps the space so that the red dots cluster together at the top and the blue dots group at the bottom (right image). Once the data is reshaped into this new space, a standard linear classifier can easily draw a straight line to separate the classes.


# Regularization (dealing with overfitting)

The problems are:

1. more basis functions $\rightarrow$ more parameters $\rightarrow$ risk of overfitting
2. lacking the right basis functions $\rightarrow$ insufficiently flexible model (underfitting)

If we revisit the polynomial regression $y = w_0 +w_1x + w_2x^2 + \dots$ (rewrite $x$ as basis function) example where we try to fit the sin function $y=sin(2 \pi x)$ where the observations are corrupted by Gaussian noise and we minimize the error function:

$$
\hat{E}(w) = \frac{1}{2} \sum_{n=1}^N (y(x_n,w)-t_n)^2
$$

We observe that increasing the model complexity $M \rightarrow \infty$, we overfit the noise.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml13.png" style="max-width: 100%; height: auto;">
</div>

So we add a penalty term depending on the model. Typically, we want to penalize the larger parameters values.

$$
\hat{E}(\mathbf{w}) = \underbrace{\frac{1}{2} \sum_{n=1}^N (y(x_n,\mathbf{w})-t_n)^2}_{\text{Objective function}} + \underbrace{\frac{\lambda}{2}\|\mathbf{w}\|^2}_{\text{Penalty}}
$$

* $\lambda$ must be set independently, and it basically answers "how much do you trust the data?"

>[!NOTE] Notes about Regularization
>
>Leave $w_0$ out of the penalty term. Shifting the data should not affect the model's performance.
>
>Square penalty $w^\top w$ or $L_2$-**norm** leads to simple optimization and it's called *ridge regression* (stats), *weight decay* (NNs). It shrinks weights toward zero, spreading influence across correlated features instead of letting one spike.
>
>$$
>\arg \min_w ||A w - z||_2^2 + \lambda||w||_2^2
>$$
>
>Closed form: $\hat{w} = (A^\top A + \lambda I)^{-1} A^\top z$. Always invertible for $\lambda > 0$.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml14.png" style="max-width: 100%; height: auto;"> </div>
>
>$L_1$ **norm** $\sum_{i=1}^M |w_i|$ cannot be optimized in closed form and it leads to sparse solutions (some $w_i=0$).
>
>**Lasso**: penalize $l_1$ norm, prefers sparse solutions.
>
>$$
>\arg \min_w ||A w - z||_2^2 + \lambda||w||_1
>$$
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml15.png" style="max-width: 100%; height: auto;"> </div>
>
>The $l_1$ ball has corners on the axes. The squared-loss contours first touch it at a corner (with high probability), and a corner means some coordinates are exactly zero. That is why Lasso does feature selection while ridge does not.
>
>$L_q$ **norm** $\sum_{i=1}^M |w_i|^q$
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml16.png" style="max-width: 100%; height: auto;"> </div>

**How to read the figures**

- The axes are the two weights, $w_1$ and $w_2$. Every point in the plane is one possible model.
- The **ellipses** are iso-lines of the error: all points on one ellipse fit the data equally well. The center, $\hat{w}$, is the unregularized best fit. Further out means a worse fit.
- The **circle/diamond/star** is an iso-line of the penalty: all weight vectors with the same penalty. The penalty is smallest at the origin (all weights zero).
- $w^*$ is the regularized solution. You want the lowest error (the smallest ellipse) while staying within your penalty budget (inside the shape). That happens where the growing ellipse first touches the penalty shape.

So regularization is a tug-of-war: the error pulls you toward $\hat{w}$, and the penalty pulls you toward the origin. $w^*$ is the compromise.

|q|Shape|Effect|
|---|---|---|
|2|circle|shrinks all weights smoothly, closed form|
|1|diamond|sparse, convex, no closed form|
|< 1|star|even sparser, non-convex (hard)|

>[!question] And the difference exactly between $L_1$ and $L_2$?
>
>The difference comes down to how the penalty treats small weights.
>
>$$
>\begin{aligned}
>L2&: \lambda \cdot \sum w_i^2 \\
>L1&: \lambda \cdot \sum |w_i|
>\end{aligned}
>$$
>
>**Gradient (the "pull" toward zero)**
>
> - L2: pull = $2 \lambda w$. It is proportional to the weight, so as w gets small, the pull fades. A weight gets close to zero but never quite reaches it.
> - L1: pull = $\lambda \cdot \text{sign}(w)$. It is a constant push regardless of how small $w$ is, so it can drive a weight all the way to exactly zero.
>
> **Geometry (the figures)**
>
> - L2: circle, no corners, so the solution lands at a generic point where all weights are nonzero.
> - L1: diamond, corners on the axes, so the solution often lands on a corner where some weights are exactly zero.
> 
> **Correlated features:** with two nearly identical features, $L_2$ splits the weight between them, while $L_1$ tends to pick one and zero the other.

