---
title: Particle Filtering
draft: true
tags:
date: 2026-03-29
---
 
So I need to finish my notes on the [[optimal estimation 7|Particle Filter]]. The process is the exact same as in the [[optimal estimation 10|EKF]] application.

Sections 4.4 and 9.3.3 from the book.

>[!summary] Two differences from the prior exercise
>
>1. The intended heading $\phi_0(i)$ is now **time variant** and given at any moment in time. The equation also stays the same, but $\phi_0$ is not constant anymore. It translates directly in the control input ($u$) vector changing every iteration.
>2. We now assume at time $i=0$ a position variance of $\sigma_{\xi_{\mathbf{x}}} = \sigma_{\xi_y} = 100m$ instead of $10000m$

# Context

Apparently, the struggle shifts to expressing how consistent is the Particle Filter and how to measure it. So what we want is a equivalent to the NIS, but for the Particle Filter. 

The idea is as follows:

Suppose that, using all previous measurements $Z(i-1)$ up to time $i-1$, the probability density of the state $\mathbf{x}(i)$ is $p(\mathbf{x}(i) \mid Z(i-1))$. Then, the probability of $z(i)$ is:

$$
\begin{align}
p\big(z(i) \mid Z(i-1)\big) &= \int_\mathbf{x} p\bigg(z(i), \mathbf{x}(i) \mid Z(i-1)\bigg)d\mathbf{x}\\
&= \int_\mathbf{x} p\bigg(z(i) \mid \mathbf{x}(i)\bigg) p \bigg(\mathbf{x}(i) \mid Z(i-1)\bigg)d\mathbf{x}
\end{align}
$$

Which makes total sense, looking at it?

* $p\big(z(i) \mid \mathbf{x}(i)\big)$ is simply the model of the sensory system.
* $p \big(\mathbf{x}(i) \mid Z(i-1)\big)$ is represented by the predicted samples.

> The filter is consistent only if the sequence of observed measurement $z(i)$ obeys the statistics prescribed by the sequence of densities $p\big(z(i) \mid Z(i-1)\big)$.

So the problem will be tackled by treating each scalar measurement separately => for each individual measurement element $z_n(i)$, we consider the hypothetical probability density $p_n(z,i) = p(z_n(i) \mid Z(i-1))$, i.e. the pdf of $z_n(i)$ given all previous measurements.

The cumulative distribution of $z_n(i)$ is then:

$$
F_n(z,i) = \int_\infty^z p_n(\zeta, i)d\zeta
$$

We now denote $u_n(i) \overset{\mathrm{def}}{=} F_n\big(z_n(i)\mid i\big)$ as **test variables** for each measurement element. It can be proven that **if the particle filter behaves consistently, then the variables $u_n(i)$ are uniformly distributed between 0 and 1**.

>[!summary] The consistency check boils down to testing whether the set $u_n(i)$ indeed has such a uniform distribution.
>
>* In literature, the statistical test of whether a set of variables has a given distribution function is called a `goodness-of-fit` test.
>* Algorithm 9.1 in the book

However, we'll just use plots of the test variables to assess the consistency.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex7_oeds1.png" alt="example 1 from the book" width="350" height="300"> </div> <div> <img src="../static/notes/ex7_oeds2.png" alt="example 2 from the book" width="350" height="300"> </div> </div>

Another variable of interest is the number of particles. This variable can be used to see whether the normalized weight factors are evenly distributed.

$$
K_\text{eff}(i) = \frac{1}{\sum_{k=1}^K\big(w_\text{norm}^{(k)}(i)\big)^2}
$$

* $K_\text{eff}=1$ is an extreme case indicating that only one weight factor is nonzero.

---

# Questions

**1. Implement the Particle Filter. Using the particles, calculate the MMSE estimate $\hat{\mathbf{x}}_\text{MMSE}(i) = \bar{\mathbf{x}}(i \mid i)$, and create a plot of the estimated path.**

Assuming a Gaussian Distribution, the weights are calculated as:

$$
w^{(k)} \propto \text{exp}\big(-\frac{1}{2} (z(i)-x^{(k)})^T C_v^{-1} (z(i)-x^{(k)}) \big)
$$

* it says proportional because normally there should be a constant multiplied with the exponential. But since the weights are going to be normalized anyway, we can ignore it.
	* To normalize, we simply divide by the sum of the weights vector.

A Monte Carlo simulation uses a set of random samples generated from a known distribution to estimate the expectation of any function of that distribution. The first step starts with drawing $K$ samples from the prior probability density $p(\mathbf{x}(0))$.

* The `mvnrnd` function in MATLAB takes care of this.

The update step looks pretty much similar to the EKF; the main difference consists in computing the normalized weights and performing the **Resampling by selection** process presented in Section 4.4.2. The purpose is to **delete samples with low weights**, and to retain multiple copies of samples with high weights (without it, the filter can degenerate).

* After computing the cumulative sum of the weights vector by utilizing the $w_\text{cum}^{(k)} = \sum_{j=1}^k w_\text{norm}^{(j)}$ equation (`cumsum` in MATLAB), I need to generate a random number $r$ uniformly distributed in $[0,1]$ and find the smallest $j$ such that $w_\text{cum}^{(j)} \geq r^{(k)}$ and **then reselect the particles from that index** $j$.
* For this part, I will simply search iteratively for j. I understand that using the golden rule is much more efficient, as the problem shifts to solving $w_\text{cum}^{(j)} - r =0$, but I want it to make sense to me.
	* My method would be $O(N^2)$, while my teacher's approach would decrease the complexity to $O(N \log(N))$. However, my number of particles will be only 1000, so it should not affect the performance that much. Just keep in mind for future purposes.
	* I used the teacher's method in the end :))

> After resampling, don't forget to reset the weights. It's basic intuition: I've **already used the weights** to decide how many times each particle is copied.

>[!NOTE] I observed that by passing $C_n$ in the `hmeas` function, I get a smoother plot. Apparently, the explanation is that the filter trusts the measurements less, and that's why.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds3.png" style="max-width: 100%; height: auto;">
</div>

It doesn't necessarily look wrong, but initially I expected a trajectory that resembled the [[optimal estimation 10|EKF]] more. Since I did not necessarily have the intuition to tell whether the trajectory is right or wrong, I fell back to comparing the intended thrust ($t_0$) and the estimated thrust ($7^{th}$ column of $\mathbf{x}_\text{MMSE}$) and the intended headings (fi0 array) with the estimated headings ($8^{th}$ column of $\mathbf{x}_\text{MMSE}$).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds4.png" style="max-width: 100%; height: auto;">
</div>

These comparisons would suggest that the filter successfully follows the input action vector, which confirms that the implementation is correct. Regarding the estimated thrust, the mean of the estimated vector is ~460N, which implies that the filter is actively trying to reach the intended 400N. The almost 1:1 comparison of the headings is, however, the final argument that the presented trajectory is indeed correct.

---

**2. Extend the code such that a covariance matrix is calculated at each measurement step. Plot the uncertainty regions.**

According to the Lectures, the covariance matrix is defined as 

$$
C_\mathbf{x} = \sum_{k=1}^{K} w^{(k)} \big(\mathbf{x}_s^{(k)}-\bar{\mathbf{x}}\big)\big(\mathbf{x}_s^{(k)}-\bar{\mathbf{x}}\big)^T
$$

My intuition tells me that I could discard the weights vector since I resample them to a unit distribution after the update, and the information would have already been saved in the current estimate anyways, since $\mathbf{x}_\text{MMSE}(k) = \mathbf{g}(\mathbf{x}_s^{(k)}) \cdot w^{(k)}$, i.e. particles * weights. So in the end, I can simply calculate $C_\mathbf{x} = \text{deviations} \cdot \text{deviations'} / \text{No\_particles}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds5.png" style="max-width: 100%; height: auto;">
</div>

---

**3. Extend the code such that the test variables $u_n(i_m)$ are calculated. Plot them and interpret the results.**

I provided context on the test variables above. According to Listing 9.10 from the book, I can simply adapt the calculations to what I have by counting how many predicted samples fall below the actual measurement, which directly approximates $F_n\big(z_n(i)\mid i\big)$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds6.png" style="max-width: 100%; height: auto;">
</div>

The plot reveals no obvious trends and consistency. In terms of heading, it seems like the values are more centered which would suggest the particles don't spread much in heading space between updates, which correlates with the earlier plot that showed the 1:1 characteristic. However, Bearing and Spped seem to uniformly distributed in $[0,1]$, with no visible bias. Moreover, all variables seem to be symmetric around the expected mean of 0.5, which is exactly what we hoped for.

In conclusion, this consistency check reveals that the particle filter is consistent for all three measurement channels, i.e. the filter's predicted probability densities $p\big(z(i) \mid Z(i-1)\big)$ correctly describe the actual distribution of measurements. It further translates into a good choice of the modeled noise $C_w, C_n$, unlike in the [[optimal estimation 10|EKF]] case.

---

**4. Calculate the effective number of particles after each measurement. Plot this variable and explain the results**

In the context I mentioned that this is another variable of interest since it reveals whether the normalized weight factors are evenly distributed.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds7.png" style="max-width: 100%; height: auto;">
</div>

The Figure above represents the constantly changing number of effective number of particles for an initial number of 1000 particles. It reveals a mean value of ~47 effective particles out of 1000. This translates to the particle weights being extremely uneven - only a small fraction of the particles are actually contributing to the estimate at each measurement update.

---

**5. Perform some experiments such that you are sure that you have a sufficient number of particles**

After running the script for different values of No\_particles, I got the following Table and Figure:

| Number of Particles | Mean Value of K_eff |
| ------------------- | ------------------- |
| 100                 | 5.9934              |
| 1000                | 47.6997             |
| 2000                | 93.5558             |
| 3000                | 134.8896            |
| 4000                | 187.6875            |
| 5000                | 230.3501            |
| 10000               | 463.9912            |

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex7_oeds8.png" style="max-width: 100%; height: auto;">
</div>

They reveal an obvious linear trend, with the mean staying around 4-5\% of N regardless of how many particles I use. Since adding more particles doesn't change this ratio, it could mean that the measurement is consistently informative enough, but that would be an educated guess.

The question asks how I am sure whether I have sufficient particles. I would argue the important aspect is for the posterior to be well represented. One area where I visibly see obvious changes is the representation of the uncertainty regions, which become more clear as $N$ increases.

For example, the Figure below is a comparison for $N=1000$ (left) and $N=5000$ (right)

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex7_oeds5.png" alt="example 1 from the book" width="350" height="300"> </div> <div> <img src="../static/notes/ex7_oeds9.png" alt="example 2 from the book" width="350" height="300"> </div> </div>

Since the right plot ($N=5000$) shows smoother ellipses and a more consistent path, particularly in the complex crossing regions near the center, I would consider that $N=5000$ gives a better posterior representation and has a reasonable amount of effective particles (~230).

---

**6. **