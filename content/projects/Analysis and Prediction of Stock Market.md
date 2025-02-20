---
title: Analysis and Prediction of Stock Market
draft: false
tags:
  - ML
---

Code: [ML101](https://github.com/costineesti/ML101)
## Introduction

I am very passionate about stock movement, being a beginner investor myself, and my motivation was to make a Machine Learning application that could **analyze** current stock prices and **predict** their future.

This project includes:

- Loading and fetching stock prices from a `.txt` file into a database using **MySQL**.

- Division of the stock into specific quarters and viewing their trend through **[[mlapp_regression]]** (rising or falling).

- Implementation of **[[principal_component_analysis]]** from scratch for full comprehension of the subject.

- Applying an advanced Machine Learning algorithm to predict future stock prices -- **[[LSTM]]**.


## Data Set

The dataset used for this implementation was acquired from Yahoo Finance using `yfinance` in Python. I used MySQL to store the information (timeseries), and the code from class `Database_Injection` can be called at any time to update the stocks with their latest updates. The time span is from 1990 to the present day. The main stocks I tested my algorithms on were **AMZN, TSLA, PLTR, BTC-USD**, and **AAPL**.


The data was transferred into 7 columns:

```sql

INSERT INTO stocks (ticker, date, open_price, high_price, low_price, close_price, volume)

```


## Preprocessing the Data

For the methods to work, the data had to be normalized (for some reason, standardization would introduce nonlinearities). The date was converted into numerical input and subtracted with the minimum value.



```math

x_{normalized} = rac{x - x_{min}}{x_{max} - x_{min}}

```

Where:

- \(x\): the original value of the variable,

- \(x_{min}\): the minimum value in the dataset for the variable,

- \(x_{max}\): the maximum value in the dataset for the variable,

- \(x_{normalized}\): the normalized value, scaled between 0 and 1.

  

For standardization:

```math

Z = rac{X - \mu}{\sigma}

```

Where:

- \(X\) is the original value,

- \(\mu\) is the mean of the data,

- \(\sigma\) is the standard deviation of the data,

- \(Z\) is the standardized value.

  

## Linear Regression

When there is only one independent feature, it is known as **Simple Linear Regression**, and when there are more than one feature, it is known as **Multiple Linear Regression**.


![Linear Regression](../static/notes/mlapp_regression.png)

  

Linear regression asserts that the response is a linear function of the inputs:

```math

y(x) = w^T x + \epsilon = \sum_{j=1}^{D} w_j x_j + \epsilon

```

Where:

- \(w^T x\) represents the inner or scalar product between the input vector \(x\) and the model's weight vector \(w\),

- \(\epsilon\) is the residual error between our linear predictions and the true response,

- \(y\) is the output or target variable (often the `close_price` column).

  

### Linear Regression through Gradient Descent

The algorithm optimizes the model’s weights \(w\) to minimize the **Mean Squared Error (MSE)** between the predicted values and the actual target values.

  

The key steps of the method are:

1. **Initialization:**

- The number of coefficients \(w\) is determined based on the number of features in \(X\).

- The coefficients are initialized to zero.

2. **Gradient Descent Loop:**

- Predict target values using current weights:

```math

predictions = X \cdot w

```

- Compute cost function (MSE):

```math

J = rac{1}{2m} \sum (predictions - y)^2

```

- Compute gradients and update weights:

```math

w = w - learning_rate \cdot gradients

```

1. **Output:**

- Return the final predictions and the loss history.

  

Comparison of my implementation with `sklearn`:

  

![Evaluation](../static/notes/resp_lr.png)

  

Loss function evolution over 700 iterations:

  

![Loss Evolution](../static/notes/lr_loss.png)

  

## Principal Component Analysis (PCA)

PCA is a statistical technique used to reduce the dimensionality of a dataset while preserving most of the information.

  

**Optimization problem:**

```math

\max \sum_i (x_i^T u)^2

```

  

**Steps to Perform PCA:**

2. **Standardization** - Ensures mean 0 and variance 1.

3. **Compute Covariance Matrix:**

```math

cov(x_1, x_2) = rac{\sum (Z_i - \mu)(Z_i - \mu)^T}{n-1}

```

4. **Compute Eigenvalues and Eigenvectors:**

```math

\det(A - \lambda I) = 0

```

  

93.47% of information was retained after removing Volume.

  

![PCA Bar Chart](../static/notes/barchart.png)

  

## Long Short-Term Memory (LSTM)

LSTM is a sequential NN that excels in capturing long-term dependencies and is ideal for sequence prediction tasks.

  

### LSTM Architecture

  

![LSTM](../static/notes/lstm_architecture.png)

  

- **Forget Gate:**

```math

F_t = \sigma(W_f Z_t + b_f)

```

- **Candidate Gate:**

```math

C_t = anh(W_c Z_t + b_c)

```

- **Input Gate:**

```math

I_t = \sigma(W_i Z_t + b_i)

```

- **Output Gate:**

```math

O_t = \sigma(W_o Z_t + b_o)

```

  

### Back Propagation

Neural networks compute gradients and update weights using backpropagation.

  

![Back Propagation](../static/notes/backprop.png)

  

**Testing and Training:**

  

![Training](../static/notes/train.png)

  

**Predicting Future Prices:**

  

![Prediction](../static/notes/predict.png)