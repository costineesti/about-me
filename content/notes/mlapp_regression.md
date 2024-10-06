---
title: Regression in Machine Learning
draft: false
tags:
  - notes
---
 
Regression is just like classification except the response variable is continuous.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/mlapp_regression.png" style="max-width: 100%; height: auto;">
</div>

>[!Note] Here are some examples of real-word regression problems.
>* Predict tomorrow's stock market price given current market conditions and other possible side information,
>* Predict age of a viewer watching a given video on youtube,
>* Predict the location in 3D space of a robot arm end effector, given control signals (torques) sent to its various motors,
>* Predict the amount of prostate specific antigen (PSA) in the body as a function of a number of different clinical measurements,
>* Predict the temperature at any location inside a building using weather data, time, door sensors, etc.

### Linear Regression

Widely used. This asserts that the response is a linear function of the inputs.

$$
y(\mathbf{x}) = \mathbf{w}^T \mathbf{x} + \epsilon = \sum_{j=1}^{D} w_j x_j + \epsilon
$$

,where:
* $\mathbf{w}^T \mathbf{x}$ represents the inner or **scalar product** between the input vector $\mathbf{x}$ and the model's **weight vector** $\mathbf{w}$, and $\epsilon$ is the **residual error** between our linear predictions and the true response.

We often assume that $\epsilon$ has a [[Gaussian distribution|Gaussian or normal distribution]]. So we can rewrite the model in the following form:

$$
p(y | \mathbf{x}, \boldsymbol{\theta}) = \mathcal{N}(y | \mu(\mathbf{x}), \sigma^2(\mathbf{x}))
$$

In the simplest case, we assume that $\mu$ is a linear function of $\mathbf{x}$, so $\mu = \mathbf{w}^T \mathbf{x}$, and that the noise is fixed, $\sigma^2(\mathbf{x}) = \sigma^2$. In this case, $\theta = (\mathbf{w}, \sigma^2)$ are the params of the model.

>[!tip] For example, suppose the input is 1 dimensional. We can represent the expected response as follows:
>
>$$ \mu(x) = w_0 + w_1 x = \mathbf{w}^T \mathbf{x} $$
>
>,where $w_0$ is the intercept or **bias** term, $w_1$ is the **slope**, and where we have defined the vector $\mathbf{x} = (1,x)$.