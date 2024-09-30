---
title: Principal Component Analysis
draft: false
tags:
  - notes
---

Sources: [1](https://www.geeksforgeeks.org/principal-component-analysis-pca/), [2](https://youtu.be/FD4DeN81ODY?si=8Y1l_sGXPK-Oh6p7)

`Principal Component Analysis (PCA)` is used to reduce the dimensionality of a data set by finding a new set of variables, smaller than the original set of variables, while retaining most of the sample's information, and useful for the regression and classification of data. So basically, compression while keeping the substance.

There are steps in order to achieve PCA:

1) Standardization: Ensuring that each variable has a mean of 0 and a standard deviation of 1.
	
	$$ Z = \frac{X-\mu}{\sigma} $$
	
Here, 
* $\mu$ is the mean of independent features,
* $\sigma$ is the [[Gaussian distribution|standard deviation]] of independent features.

2) Covariance Matrix Computation

To find the [[covariance]] we can use the formula:


$$ cov(x1,x2) = \frac{\sum_{i=1}^{n}{(x1_i-\bar{x1})(x2_i-\bar{x2})}}{n-1} $$


3) Compute the Eigenvalues($\lambda$) and Eigenvectors($X$) of covariance matrix to identify principal components


$$ (A-\lambda I)X = 0 $$

, where $A-\lambda I$ needs to be a singular matrix (i.e. non-invertible), so:


$$ |A-\lambda I| = 0 $$

Therefore, we can find the eigenvalues $\lambda$ by using the equation:


$$ AX = \lambda X $$
