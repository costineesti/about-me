---
title: RPCN Exam Recap Exercises
draft: true
tags:
---
 
# ICP Problem

Separate the following optimization problem, where $R$ is the rotation matrix, $t$ is the translation vector, $m_i$ is the $i^{th}$ point in the model point cloud, $d_i$ is the closest matching point from the data point cloud. (Hint: center of mass)

Start from

$$
E(R,t) = \frac{1}{N} \sum_{i=1}^{N} \left| m_i - (R d_i + t) \right| ^2
$$

ok then. So the problem simply asks me to separate the optimization problem. I know from [[ICP]] that it should reduce to the variables regarding the center of rotation and $R$.

$$
c_m = \frac{1}{N} \sum_{i=1}^N m_i \quad c_d = \frac{1}{N} \sum_{i=1}^N d_i
$$

We optimize around this point. Therefore, we define two variables and substitute them in the original optimization problem:

$$
m'_i = m_i - c_m \quad d'_i = d_i - c_d
$$

$$
E(R,t) = \frac{1}{N} \sum_{i=1}^{N} \left| m'_i - (R d'_i + t) \right| ^2
$$

If I expand, I get

$$
\begin{align} E(R,t)

&= \frac{1}{N} \sum_{i=1}^{N} \left| m'_i + c_m - (R(d'_i + c_d) + t) \right|^2 \\

&= \frac{1}{N} \sum_{i=1}^{N} \left| (m'_i - Rd'_i) - (Rc_d - c_m + t) \right|^2\\

&= \frac{1}{N} \sum_{i=1}^{N} || m'_i - Rd'_i ||^2 - \frac{2}{N} \sum_{i=1}^{N} || (m'_i - Rd'_i)\cdot (Rc_d - c_m + t)|| + \frac{1}{N} \sum_{i=1}^{N} || (Rc_d - c_m + t) ||^2

\end{align}
$$

Now that we have the expanded optimization problem, I need to see if all terms require minimization. 

I want to look for the optimal $t$ to prove that the last term and the second reduce to 0.

$$
\begin{align}
\frac{\partial E}{\partial t} &= \frac{1}{N} \sum_{i=1}^{N} \frac{[t^2 + 2\cdot t\cdot Rd_i + (Rd_i)^2] +m_i^2 - 2m_i\cdot Rd_i -2m_i\cdot t}{\partial t} \\

&= \frac{1}{N} \sum_{i=1}^{N} [2t +2Rd_i - 2m_i] \\

&= \frac{-2}{N} \sum_{i=1}^{N} [m_i - Rd_i - t]
\end{align}
$$

We set it to 0, considering that we are at the center of the mass, we remind that $c_m = \frac{1}{N} \sum_{i=1}^N m_i \quad c_d = \frac{1}{N} \sum_{i=1}^N d_i$.

$$
\sum_{i=1}^{N} (m_i - Rd_i - t) = 0 => t^* = \sum_{i=1}^{N}(m_i-Rd_i) => t^* = c_m - Rc_d
$$

Therefore, the last and second term in the expansion above reduce to 0. The optimization problem reduces to 

$$
E(R,t) = \frac{1}{N} \sum_{i=1}^{N} || m'_i - Rd'_i ||^2
$$

Now, if I expand this one as well, we see exactly which term we need to minimize.

$$
min(E,R) = \frac{1}{N} \sum_{i=1}^{N} || m'_i - Rd'_i ||^2 = \frac{1}{N} \sum_{i=1}^{N} ||m'_i||^2 + \frac{1}{N} \sum_{i=1}^{N} ||Rd'_i||^2 - \frac{2}{N} \sum_{i=1}^{N} ||m'_i|| \cdot || Rd'_i ||
$$

Since $\sum_{i=1}^{N} ||m'_i||^2$ does not depend on R, it reduces to 0.

$\sum_{i=1}^{N} ||Rd'_i||^2$ also reduces since $||v||^2 = v^Tv$. Rotation Matrices are Orthogonal => $R^TR=I$. Therefore, this term does not depend on $R$.

This whole problem reduces to minimizing the cross-term $- \frac{2}{N} \sum_{i=1}^{N} ||m'_i|| \cdot || Rd'_i ||$.

$$
arg \min_R E(R) \equiv arg \min_R (-2\sum_i Rd'_i m_i^{'T})
$$

Minimizing a negative quantity is the same as maximizing the positive one.

$$
arg \min_R E(R) \equiv arg \max_R \sum_i Rd'_i m_i^{'T}
$$

---

# Deriving the Recursive Bayesian SLAM Update

Consider the SLAM state

$$
y_t = (x_t,m)
$$

* $x_t$ is the robot pose at time $t$,
* $m$ is the static map.

Assume the motion model $p(x_t \mid x_{t-1}, u_t)$, the measurement model $p(z_t \mid y_t, c_t)$, and the posterior at the previous timestep $p(y_{t-1} \mid z_{0:t-1}, u_{0:t-1}, c_{0:t-1})$.

We remember the proportional Bayesian update rule and the fact that in Markov processes, the current robot state $y_t$ depends only on the previous state $y_{t-1}$ and the current IMU data (or the control input) $u_t$, not on earlier states.

$$
p(x \mid z) \propto p(z \mid x)p(x)
$$

**Exercises**

1. Derive the **general recursive Bayes filter update** for [[RPCN 6|SLAM]]:

$$
p(y_t \mid z_{0:t}, u_{0:t}, c_{0:t})
= \eta \, p(z_t \mid y_t, c_t)
\int p(y_t \mid y_{t-1}, u_t)\,
p(y_{t-1} \mid z_{0:t-1}, u_{0:t-1}, c_{0:t-1})
\, dy_{t-1}.
$$

**Solution**

We'll go step-by-step. First, let's see for **step 1**: the posterior depends on the motion model, the measurement model and the prior.

$$
p(y_1 |y_0, z_1, u_1, c_1) \propto p(z_1|y_1,c_1) \cdot p(y_1|y_0,u_1) \cdot p(y_0|z_0,u_0,c_0)  
$$

Now apply conditional independence: $y_1$ only depends on recent observations, so:

$p(y_1 | y_0, z_{0:1}, u_{0:1}, c_{0:1}) = p(y_1 | y_0, z_1, u_1, c_1)$

Therefore,

$$
p(y_1 | y_0, z_{0:1}, u_{0:1}, c_{0:1}) \propto p(z_1|y_1,c_1) \cdot p(y_1|y_0,u_1) \cdot p(y_0|z_0,u_0,c_0)
$$

We now do the same for **step 2**. Try to understand based on the following: $p(y_1, y_0 | z_{0:1}, u_{0:1}, c_{0:1}) = p(y_1 | y_0, z_{0:1}, u_{0:1}, c_{0:1}) \cdot p(y_0 | z_{0:1}, u_{0:1}, c_{0:1})$

$$
p(y_2 |y_1, y_0, z_2, u_2, c_2) \propto p(z_2|y_2,c_2) \cdot p(y_2|y_1,u_2) \cdot p(y_1, y_0|z_{0:1},u_{0:1},c_{0:1})  
$$

So if we use the context we provided, we understand that the motion and measurement models look the same, and we take the prior from before in the \[\] parantheses!

$$
p(y_2, y_1, y_0|z_{0:2},u_{0:1},c_{0:1} \propto p(z_2|y_2,c_2) \cdot p(y_2|y_1|u_1) \cdot [p(z_2|y_2,c_2) \cdot p(y_2|y_1,u_2) \cdot p(y_1, y_0|z_{0:1},u_{0:1},c_{0:1})]
$$

For one more step, it will become obvious

$$
\begin{align}
p(y_3 |y_2, y_1, y_0, z_3, u_3, c_3) &\propto p(z_3|y_3,c_3) \cdot p(y_3|y_2,u_3) \cdot p(y_2, y_1, y_0|z_{0:2},u_{0:1},c_{0:1})
\end{align}
$$

$$
\begin{align}
p(y_3,y_2,y_1,y_0|z_{0:3},u_{0:3},c_{0:3}) &\propto p(z_3|y_3,c_3) \cdot p(y_3|y_2,u_3) \cdot \\
&\cdot p(z_2|y_2,c_2) \cdot p(y_2|y_1|u_1) \cdot \\
&\cdot p(z_1|y_1,c_1) \cdot p(y_1|y_0,u_1) \cdot p(y_0|z_0,u_0,c_0)\\
\end{align}
$$

And now we can generalize:

$$ 
\begin{align}
p(y_{0:t}|z_{0:t},u_{0:t},c_{0:t}) \propto &\prod_{\tau=1}^{t}p(z_\tau|y_\tau,c_\tau) \cdot \\
&\prod_{\tau=1}^{t}p(y_\tau|y_{\tau-1},u_\tau) \cdot \\
&p(y_0|z_0,u_0,c_0)
\end{align}
$$

I think I finally got it!!

---

2. Show that the Bayes filter update translates into minimizing the Graph-SLAM least-squares objective

$$
\arg \min_{y_{0:t}}
\Bigg[
\|y_0 - \bar{y}_0\|_{\Omega_0}^2
+ \sum_{\tau=1}^{t} \|y_\tau - g(u_\tau, y_{\tau-1})\|_{R_\tau^{-1}}^2
+ \sum_{\tau=1}^{t} \|z_\tau - h(y_\tau, c_\tau)\|_{Q_\tau^{-1}}^2
\Bigg].
$$

**Context**:

To compute the errors from the previous step, we need to go from probabilities to penalty/cost functions. We will apply $\log$ on $p(y_{0:t}|z_{0:t},u_{0:t},c_{0:t})$ and aim to minimize the cost.

The next step assumes Gaussian noise for the motion and measurement models. It helps us convert from distances into likelihood. The inverse of a covariance matrix represents the information matrix (or how much we can trust it).

For a multi-variate function, the probability density function looks like this:

$$
p(x) = \frac{1}{\sqrt{(2\pi)^n|\Sigma|}} \text{exp}(- \frac{1}{2}(x-\mu)^T\Sigma^T(x-\mu))
$$

We do not care about the front constant and only focus on the exponential part. Therefore:

$$
p(x) \propto \text{exp}(- \frac{1}{2}(x-\mu)^T\Sigma^T(x-\mu))
$$

As a small reminder, we denote $||v||^2_A := v^TAv$. I think it's obvious that what we have above is extremely similar and we could phrase it as:

$$
p(x) \propto \text{exp}(-\frac{1}{2} || \text{error} ||^2_{\text{trust}})
$$

Look at these:

$$
p(y_\tau|y_{\tau-1},u_\tau) \quad p(z_\tau|y_\tau,c_\tau)
$$

It says that at timestep $\tau$, the motion model depends only on the prior at $\tau-1$ and the action $u_\tau$. But we already modeled the estimate as $g(u_\tau, y_{\tau-1})$. Same thing for the measurement model, we defined it as $h(y_\tau, c_\tau)$. Therefore, we can talk about residuals as the difference between observations and estimates.

$$
r_\tau^{\text{motion}} := y_\tau - g(u_\tau, y_{\tau-1}) \quad r_\tau^{\text{meas}} := z_\tau - h(y_\tau, c_\tau)
$$

**Solution**:

So we go into $\log$ space. **Product becomes sum**. Also, we take negative $\log$ since we compute the **minimum cost** from a **maximum likelihood**.

$$
J(y_{0:t}) = -\sum_{\tau=1}^t\log\Bigg(p(z_\tau|y_\tau,c_\tau)\Bigg) - \sum_{\tau=1}^t\log\Bigg(p(y_\tau|y_{\tau-1},u_\tau)\Bigg) - \log\Bigg(p(y_0|z_0,u_0,c_0)\Bigg)
$$

Based on the context provided, we write

$$
\begin{align}
p(z_\tau|y_\tau,c_\tau) &\propto \text{exp}\Bigg(-\frac{1}{2} ||r_\tau^{\text{meas}}||^2_{Q^{-1}}\Bigg)\\
p(y_\tau|y_{\tau-1},u_\tau) &\propto \text{exp}\Bigg(-\frac{1}{2} ||r_\tau^{\text{motion}}||^2_{R^{-1}}\Bigg)\\
p(y_0|z_0,u_0,c_0) &\propto \text{exp}\Bigg(-\frac{1}{2}||r_0||^2_{\Omega_0}\Bigg)
\end{align}
$$

Of course, if we apply the logarithms to each of them, we get rid of the exponential functions. Also, don't get distracted by the $\Omega$ matrix, it's simply the inverse of the covariance for first state -- called the information matrix. The minus sign will cancel each other.

$$
J(y_{0:t}) = \frac{1}{2}||r_0||^2_{\Omega_0} + \frac{1}{2}\sum_{\tau=1}^t||r_\tau^{\text{motion}}||^2_{R^{-1}} + \frac{1}{2}\sum_{\tau=1}^t||r_\tau^{\text{meas}}||^2_{Q^{-1}}
$$

As the aim is to minimize, we drop the $\frac{1}{2}$ and q.e.d.

$$
\underset{y_{0:t}}{\arg \min} \left[ \|y_0 - \bar{y}_0\|_{\Omega_0}^2 + \sum_{\tau=1}^{t} \|y_{\tau} - g(u_{\tau}, y_{\tau-1})\|_{R_{\tau}^{-1}}^2 + \sum_{\tau=1}^{t} \|z_{\tau} - h(y_{\tau}, c_{\tau})\|_{Q_{\tau}^{-1}}^2 \right].
$$





