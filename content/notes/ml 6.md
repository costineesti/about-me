---
title: Probabilistic Models
draft: false
tags:
date: 2026-10-27
---

# Parametric Models

Data types matter:

- **Numeric** — continuous (age, income) or discrete (counts)
	- Regression
- **Categorical** — a fixed set of labels (blood type, country)
	- Classification

We have two types of models:

**1. Discriminative Models**: learn a $p(C \mid x)$ directly.

* .e.g logistic regression: $p(C \mid x)=\sigma(x,w)$
* classification, segmentation, descriptors

**2. Generative Models**: learn the joint distribution of the data and target, and use Bayes’ rule

* Bayes' Rule: $\underbrace{p(\mathcal{C}\mid\mathbf{x})}_{\text{Posterior}}=\frac{\overbrace{p(\mathbf{x}\mid\mathcal{C})}^{\text{Likelihood}} \cdot \overbrace{p(\mathcal{C})}^{\text{Prior}} }{ \underbrace{p(\mathbf{x})}_{\text{Evidence}}}$

Go through [[Bernoulli Distribution]] before the reading the rest.

>[!question] What is the probability that you will have to wait exactly 5 minutes for your bus?
>zero.
>
>We cannot assign probabilities to values. Instead, we need to assign probabilities to value ranges. Here we reiterate the [[PDF|Probability Density Function]].
>
>Remember that [[PDF|PDF's]]
>
>* are non-negative everywhere, integrate to 1
>* can be interpreted as *relative* probabilities, but not as probabilities.
>* can be larger than 1.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml37.png" style="max-width: 100%; height: auto;"> </div>
>
>Something very interesting about the next example. The wider red distribution dominates the left extreme because its probability density function has higher variance. The narrow green distribution has a small variance, meaning its probability density drops to near zero very rapidly as you move away from its center. Because the green density decays so quickly on the far left, the wide, slowly decaying tail of the red distribution mathematically overtakes it, making the red class more probable at that extreme.
>
><div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml39.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml40.png" alt="flow 2" width="350" height="300"> </div> </div>

> Mathematically, the distribution with the larger variance will always decay slower and eventually dominate at both limits

>[!summary] Central Limit Theorem
>The sum of a sufficiently large number of independent, identically distributed (i.i.d.) variables with finite variance will have an approximately Gaussian distribution.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ml38.png" style="max-width: 50%; height: auto;"> </div>
>
>So in other words: take any distribution and randomly sample from it. Say if you sample at least 30 times, and you take the sum of those sampled values. Then repeat that process like 1000 times. If you plot the sums of those samples, it will follow a [[Gaussian distribution|Normal Distribution]].

# Non-Parametric Models

**Histogram Density Estimation**

Instead of assuming a single functional representation of the distribution, we can use the training data itself. If we try to evaluate the distribution of data without assuming a parametric form of the density, we can use histograms.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml41.png" style="max-width: 100%; height: auto;">
</div>

Disadvantages include:

* The bin positions and widths $\triangle$ affect the density estimate
* The number of bins grows exponentially with the number of dimensions of the data

**Kernel Density Estimation**

For this reason we introduce **Parzen Estimators** -- a technique that scales better with dimensionality.

* Consider a kernel function centered on each training data point $\mathbf{x}_n$
	* A common choice is the Gaussian where $h$ is the standard deviation of our Gaussian components and controls the smoothness of our estimate

$$
p(\mathbf{x}) = \frac{1}{N} \sum_{n=1}^N \frac{1}{(2\pi h^2)^{1/2}} \exp \left( -\frac{\|\mathbf{x} - \mathbf{x}_n\|^2}{2h^2} \right)
$$

$$
\overbrace{p(\mathbf{x})}^{\substack{\text{Probability density at} \\ \text{any location } \mathbf{x} \text{ in the space}}} = \underbrace{\frac{1}{N}}_{\text{Normalise to sum to one}} \overbrace{\sum_{n=1}^N}^{\substack{\text{Sum over all training} \\ \text{datapoints } \mathbf{x}_n}} \underbrace{\left[ \frac{1}{(2\pi h^2)^{1/2}} \exp \left( -\frac{\|\mathbf{x} - \mathbf{x}_n\|^2}{2h^2} \right) \right]}_{\text{Kernel function, integrates to 1}}
$$

* If this kernel is non-negative for all $\mathbf{x}$ and normalised, this gives a valid estimate of the data density.

Both methods require a hyperparameter to control the smoothness of the resulting density estimate. In histograms, this is the bin width $\triangle$. In Gaussian Parzen estimators, this is the kernel's standard deviation $h$. The final image demonstrates how sensitive the Parzen estimator is to this value

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml42.png" style="max-width: 100%; height: auto;">
</div>

- A very small standard deviation ($h=0.005$) produces an extremely jagged, spiky distribution that overfits to individual data points.
- A very large standard deviation ($h=0.2$) produces an overly smooth, flat distribution that fails to capture the local peaks of the true underlying function.
- An intermediate value ($h=0.07$) provides a balanced density estimate that closely aligns with the actual underlying distribution.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml43.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml44.png" alt="flow 2" width="350" height="300"> </div> </div>

* the left image visualizes the joint probabilities, calculated as $p(x,c) = p(x \mid c)p(c)$ for three classes. The glowing regions represent the kernel density estimates build directly around the training data. 
* the right image applies Bayes' Theorem to those kernel estimates to compute the posterior probability, $p(c \mid x)$ for each class at any given location. These hard boundaries represent the decision regions a classifier would use to categorize a new, unseen data point into the red, blue, or green class based on its coordinates.

For example, [[Nadaraya-Watson|The Nadaraya-Watson Model]] applies the concept of kernel density estimation to solve continuous regression problems, allowing us to predict a target variable $t$ based on an input $\mathbf{x}$.

>[!summary] Dual Representation
>
>Many standard linear, parametric models can be mathematically rewritten so that instead of evaluating individual features directly, they evaluate pairs of training data points using a kernel function $k(\mathbf{x}, \mathbf{x}')$. 
>
>We often apply a fixed mapping $\phi(\mathbf{x})$ to transform input data $\mathbf{x}$ into a new, higher-dimensional feature space to make it easier to classify or analyze. For models based on this mapping, the kernel function is defined mathematically as the scalar (dot) product of two transformed data points:
>
>$$
>k(\mathbf{x},\mathbf{x}') = \phi(\mathbf{x})^\top \phi(\mathbf{x}')
>$$
>
>Also known as **Kernel Substitution** or **Kernel Trick**: allows an algorithm to implicitly compute the relationship between data points in a massive, high-dimensional space without ever actually having to calculate the expensive $\phi(\mathbf{x})$ transformations explicitly. 
>
>* Because if an algorithm is structured so that the input vector $\mathbf{x}$ only ever appears inside scalar products, you can simply replace that standard product with a different kernel function.

# Expectation

The expectation of a variable (or function of that variable) is the value that the long-term average of the function converges to, as the variable $x$ is distributed according to $p(x)$.

$$
\mathbb{E}_{p(x)}[f(x)] = \int f(x)p(x)dx
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml46.png" style="max-width: 100%; height: auto;">
</div>

The objective is to minimize the probability of making a mistake. As shown in the Figure below, the total probability of a mistake is the sum of two scenarios: classifying a point as $C_2$ when it actually belongs to $C_1$ and vice-versa. Mathematically, this is expressed as integrals over the chosen decision regions:

$$
p(\text{mistake}) = \int_{\mathcal{R}_1} p(\mathbf{x}, \mathcal{C}_2) \, \mathrm{d}\mathbf{x} + \int_{\mathcal{R}_2} p(\mathbf{x}, \mathcal{C}_1) \, \mathrm{d}\mathbf{x}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml47.png" style="max-width: 100%; height: auto;">
</div>

A decision boundary at an arbitrary point $\hat{\mathbf{x}}$ divides the space into region $R_1$​ (everything to the left) and region $R_2$​(everything to the right). 

If we move the boundary $\hat{\mathbf{x}}$ to the optimal intersection point $\mathbf{x}_0$, the total shaded area (representing total errors) shrinks significantly. The red area disappears, leaving only a green region and a smaller blue region representing the unavoidable minimum overlap.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml48.png" style="max-width: 100%; height: auto;">
</div>

To minimize the total area of these mistakes, we must ensure that every single data point $\mathbf{x}$ is assigned to whichever class has the highest joint probability $p(\mathbf{x},C_k)$ at that specific location. Because the marginal probability $p(x)$ is constant across all classes at that location, this is mathematically identical to assigning the point to the class with the largest posterior probability $p(C_k \mid \mathbf{x})$. Therefore, the optimal decision boundary $\mathbf{x}_0$ always occurs exactly where the posterior probability curves cross.

Before going further, read [[optimal estimation 3|Fundamentals of parameter estimation - Part I]].

**Maximum Likelihood with Simplifying Assumptions**

We often lack data to train a model well by [[MLE]]. A standard Gaussian classification model with $c$ classes in $d$ dimensions requires calculating $cd^2$ parameters just for the covariance matrices, which naturally produces a complex, curved decision boundary.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml49.png" style="max-width: 100%; height: auto;">
</div>

To reduce the number of parameters without losing too much discriminating power, we can apply three levels of simplifying assumptions:

1. **Shared Covariance:** Assuming all classes share the identical covariance matrix ($\Sigma_1=\Sigma_2$​) reduces the parameter count to $d^2$. Because the distributions now have the exact same shape and orientation, the complex curve straightens into a linear decision boundary.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml50.png" style="max-width: 100%; height: auto;">
</div>

2. **Diagonal Covariance:** Assuming the covariance matrices are diagonal ($\Sigma_1 \leftarrow \text{diag}(\Sigma_1$)) means treating all input dimensions as statistically independent. This reduces the required parameters down to $cd$. Visually, the contour ellipses are forced to align strictly with the coordinate axes 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml51.png" style="max-width: 100%; height: auto;">
</div>

3. **Spherical Covariance:** The most extreme simplification assumes the covariance is a simple scalar multiple of the identity matrix ($\Sigma_1 = \sigma I$). This reduces the parameter count to just $c$. The distributions become perfect circles, meaning the classifier effectively just measures the straight-line distance from a new data point to each class center to make a decision.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ml52.png" style="max-width: 100%; height: auto;">
</div>

**Naive Bayes**: Because it only computes 1D probabilities and multiplies them, it scales linearly with the number of features, making it computationally fast. It performs surprisingly well in real-world practice, but if the features are actually highly correlated, the model will output overly confident probability scores.

* conditional independence does not equal marginal independence!

$$
p(x_1, \dots, x_n) = \sum_{\mathcal{C}} p(x_1 \mid \mathcal{C}) \cdots p(x_N \mid \mathcal{C}) p(\mathcal{C}) \textcolor{red}{\neq p(x_1) \cdots p(x_N)}
$$

**Maximum A Posteriori (MAP) Learning**

Earlier, [[MLE]] found the parameters that maximized the likelihood of the data. MAP learning flips this: it uses Bayes' rule to find the most likely _parameters_ ($\theta$), given the observed data ($\mathbf{x}$).

The denominator in Bayes' rule requires integrating over all possible parameter values, which is often mathematically impossible (intractable) to compute. However, because the denominator is just a normalizing constant, we can completely ignore it when trying to find the maximum value. The optimal parameters are found simply by maximizing the product of the likelihood $p(\mathbf{x} \mid \theta)$ and the prior $p(\theta)$.

$$
p(\boldsymbol{\theta} \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid \boldsymbol{\theta}) p(\boldsymbol{\theta})}{\int p(\mathbf{x}, \boldsymbol{\theta}) \, \mathrm{d}\boldsymbol{\theta}}
$$

$$
\arg\max_\theta \frac{p(\mathbf{x} \mid \theta) p(\theta)}{\int p(\mathbf{x}, \theta) \, \mathrm{d}\theta} = \arg\max_\theta p(\mathbf{x} \mid \theta) p(\theta)
$$

* In the left image, with only a handful of data points, the glowing distribution is massive and diffuse, indicating that the model is highly uncertain about the true parameters. 
* In the right image, as the sequence progresses and more data is collected, this posterior distribution rapidly shrinks and concentrates into a tiny, precise point exactly around the true parameter values.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml53.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml54.png" alt="flow 2" width="350" height="300"> </div> </div>

The primary takeaway is the behavior in the small-data regime. When data is extremely scarce, the standard point estimate (red dashed line) drastically overfits to those few points, outputting a peaked, overly confident distribution that misses the true green curve entirely. The Bayesian prediction (blue line) avoids this false confidence; it remains wide, flat, and cautious because it factors in the massive parameter uncertainty shown on the left. However, once you have abundant data, the parameter uncertainty vanishes, and the Bayesian curve, the point estimate, and the true distribution all safely converge into one.

page 89