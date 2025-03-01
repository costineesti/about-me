---
title: Analysis and Prediction of Stock Market
draft: false
tags:
  - ML
  - projects
---

Code: [ML101](https://github.com/costineesti/ML101)
## Introduction

I am very passionate about stock movement, being a beginner investor myself, and my motivation was to make a Machine Learning application that could **analyze** current stock prices and **predict** their future.

>[!NOTE] This project includes:
>
>- Loading and fetching stock prices from a `.txt` file into a database using **MySQL**.
>
>- Division of the stock into specific quarters and viewing their trend through **[[mlapp_regression|Linear Regression]]** (rising or falling).
>
>- Implementation of **[[principal_component_analysis|Principal Component Analysis]]** from scratch for full comprehension of the subject.
>
>- Applying an advanced Machine Learning algorithm to predict future stock prices -- **[[LSTM|Long Short-Term Memory]]**.

## Data Set

The dataset used for this implementation was acquired from Yahoo Finance using `yfinance` in Python. I used MySQL to store the information (timeseries), and the code from class `Database_Injection` can be called at any time to update the stocks with their latest updates. The time span is from 1990 to the present day. The main stocks I tested my algorithms on were **AMZN, TSLA, PLTR, BTC-USD**, and **AAPL**.


The data was transferred into 7 columns:

```sql

INSERT INTO stocks (ticker, date, open_price, high_price, low_price, close_price, volume)

```


## Preprocessing the Data

For the methods to work, the data had to be normalized (for some reason, standardization would introduce nonlinearities). The date was converted into numerical input and subtracted with the minimum value.

$$
x_{normalized} = \frac{x - x_{min}}{x_{max} - x_{min}}
$$


Where:

- $x$: the original value of the variable,

- $x_{min}$: the minimum value in the dataset for the variable,

- $x_{max}$: the maximum value in the dataset for the variable,

- $x_{normalized}$: the normalized value, scaled between 0 and 1.

  

For standardization:

$$
Z = \frac{X - \mu}{\sigma}
$$

Where:

- $X$ is the original value,

- $\mu$ is the mean of the data,

- $\sigma$ is the standard deviation of the data,

- $Z$ is the standardized value.

  

## Linear Regression

When there is only one independent feature, it is known as **Simple Linear Regression**, and when there are more than one feature, it is known as **Multiple Linear Regression**.
  

Linear regression asserts that the response is a linear function of the inputs:

$$
y(x) = w^T x + \epsilon = \sum_{j=1}^{D} w_j x_j + \epsilon
$$

Where:

- $w^T x$ represents the inner or scalar product between the input vector $x$ and the model's weight vector $w$,

- $\epsilon$ is the residual error between our linear predictions and the true response,

- $y$ is the output or target variable (often the `close_price` column).

  

### Linear Regression through Gradient Descent

The algorithm optimizes the model’s weights $w$ to minimize the **Mean Squared Error (MSE)** between the predicted values and the actual target values.

  

The key steps of the method are:

1. **Initialization:**

- The number of coefficients $w$ is determined based on the number of features in $X$.

- The coefficients are initialized to zero.

2. **Gradient Descent Loop:**

- Predict target values using current weights:

$$
predictions = X \cdot w
$$

- Compute cost function (MSE):

$$
J = \frac{1}{2m} \sum (predictions - y)^2
$$

- Compute gradients and update weights:

$$
w = w - learning\_rate \cdot gradients
$$

3. **Output:**

- Return the final predictions and the loss history.

  

To confirm both methods, I compared them with the STAS Linear Regression implementation from `sklearn`:

  

![Evaluation](../static/notes/resp_lr.png)


			    Error of my custom implementation: 0.633773484916956
			    Error of STAS implementation: 0.6337734849169716

Loss function evolution over 700 iterations:

  

![Loss Evolution](../static/notes/lr_loss.png)

![LINREG2](../static/notes/linreg2.png)

![STAS](../static/notes/STAS.png)
  

## Principal Component Analysis (PCA)

PCA can be framed as an optimization problem, where the goal is to maximize the
amount of information captured by the projected data. For example, when projecting a
data point x onto a unit vector u, the resulting projection x′ has the magnitude:

$$
x' = (x^T u) u
$$

If $u^T u$ = 1 and $(x_i^Tu)^2$ represents the amount of information stored about the point $x_i$, the
optimization problem to solve is:


$$
\max \sum_i (x_i^T u)^2
$$

  

**Steps to Perform PCA:**

1. **Standardization** - Ensures mean 0 and variance 1.

2. **Compute Covariance Matrix:** The covariance matrix captures the linear relationship between the variables. It can be computed using the formula:

$$
cov(x_1, x_2) = \frac{\sum (Z_i - \mu)(Z_i - \mu)^T}{n-1}
$$

3. **Compute Eigenvalues and Eigenvectors:** 

$$
\det(A - \lambda I) = 0
$$

Solving this equation provides the eigenvalues λ , which are then used to compute the
eigenvectors. I computed them through [[QR Decomposition]] using the Householder
Method from scratch


By following these steps, PCA identifies the directions (principal components) that
maximize the variance in the data, thereby reducing its dimensionality while preserving
critical information – about 93.47%
  

![PCA Bar Chart](../static/notes/barchart.png)

![PCA Graph](../static/notes/PCA.png)

## Long Short-Term Memory (LSTM)

It is a sequential NN (type of RNN) that allows information to persist over long periods of time. It is a good solution to RNN which would either explode or vanish in the Gradient Descent phase. What I mean by that is that a weight to any power, be it either 0.5 or 2 would either get super close to 0 or to $\infty$. It excels in capturing long-term dependencies (like remembering the chapter 1 from a book) and is ideal for sequence predictions tasks.

### LSTM Forward Propagation Through Gates


- **Forget Gate:**

$$
F_t = \sigma(W_f Z_t + b_f)
$$

- **Candidate Gate:**

$$
C_t = anh(W_c Z_t + b_c)
$$

- **Input Gate:**

$$
I_t = \sigma(W_i Z_t + b_i)
$$

- **Output Gate:**

$$
O_t = \sigma(W_o Z_t + b_o)
$$

  
### Back Propagation

To learn and compute better weights and biases, the neural network does that through back propagation. It basically computes the partial derivatives (gradients) of the output from each gate to it's inputs. That way, it multiplies the results through the learning rate $\eta$ and updates the new set of parameters for the next prediction.

  

![Back Propagation](../static/notes/backprop.png)

  

**Testing and Training:** To test and train the network, I split the data in a $75\%$ training set and a $25\%$ validation set.

  

![Training](../static/notes/train.png)

  

**Predicting Future Prices:** I would also try and predict the future prices for a set number of days.

  

![Prediction](../static/notes/predict.png)