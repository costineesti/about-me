---
title: Pen and Paper Exercises SLAM
draft: false
tags:
date: 2026-01-25
---
 
From what I observed, the teachers simply want us to be able to derive some forms we are using in the algorithms. These either imply some partial derivatives, or simply substituting some variables for others.

# Closed-Form Scan Matching via Rotation-Translation Separation

**Context**

As in [[ICP]], we consider two lidar scans represented as corresponding 3D point sets

$$
\mathcal{D} = \{d_i\}_{i=1}^N \quad \mathcal{M} = \{m_i\}_{i=1}^N
$$

where we would like to align the data scan $d_i$ to its corresponding point in the model scan (reference) $m_i$. The rigid alignment problem seeks the transform

$$
m_i \approx Rd_i +t \quad R \in SO(3), \quad t\in R^3,
$$

that maximizes the least-squares cost

$$
E(R,t) = \sum_{i=1}^N|| m_i - (Rd_i + t) ||^2
$$

It is stated in the lecture notes that centering the point sets allows the translation to be removed from the minimization over $R$, leading to a closed-form solution for both $R$ and $t$.

**Exercises**

1. Show that the **optimal translation** satisfies

$$
t^* = c_m-Rc_d, \quad c_m=\frac{1}{N} \sum_{i=1}^Nm_i, \quad c_d = \frac{1}{N}\sum_{i=1}^Nd_i
$$

2. Substitute $t^*$ into $E(R,t)$ and show that the problem reduces to

$$
\min_{R \in SO(3)} \sum_{i=1}^N || m'_i - Rd'_i||^2, \quad m'_i = m_i-c_m, \quad d'_i = d_i-c_d
$$

3. Show that minimizing $\sum_i || m'_i - Rd'_i||^2$ is equivalent to maximizing

$$
trace(RH), \quad H = \sum_{i=1}^N d^{'}_im^{'T}_i
$$

**Solutions**

(a) We differentiate $E(R,t)$ w.r.t. time and set to zero.

$$
\frac{\partial E}{\partial t} = -2 \sum_i (m_i - Rd_i -t) = 0
$$

therefore, $Nt = \sum_i m_i - R \sum_i d_i$ $=>$ $t = \frac{1}{N} \sum_i m_i - \frac{1}{N} R \sum_i d_i$ $=>$ $t^{*} = c_m - Rc_d$

(b) Insert $t^{*}$ into the error term:

$$
m_i - Rd_i - t^{*} = (m_i-c_m) - R(d_i-c_d) = m'_i - Rd'_i
$$

Hence $E(R,t^{*}) = \sum_{i=1}^N || m'_i - Rd'_i||^2$

(c) Expand the squared norm:

$$
|| m'_i - Rd'_i||^2 = ||m'_i||^2 + ||Rd'_i||^2 - 2 \cdot ||m'_i|| \cdot R||d'_i||
$$

Apparently, if the angle $\theta$ between two vectors $a$ and $b$ is 0, then $||a|| \cdot ||b|| = a^Tb$. It's the case for $m'_i$ and $d'_i$. The rest is covered in [[ICP]], but the idea is that the first two terms do not depend on R since they refer to the centroid, and so we minimize only the cross-term.

Okk, I actually want to see why those two terms nullify.

First of all, $\sum_i ||m'_i||^2$ does not depend on R.

It's the second term I'm more interested in: $||Rd'_i||^2$. By definition of the Euclidean norm, $||x||^2 = x^Tx$. So, $||Rd'_i||^2$ = $(Rd_i)^T(Rd_i) = d_i^T R^T R d_i$. And here is the actual trick: since the Rotation matrix is orthogonal, then $R^TR = I$, so the final term itself does not depend on $R$. $||Rd'_i||^2 = d_i^T I d_i = d_i^T d_i = ||d_i||^2$

Then, since the first two terms are constants,

$$
arg \min_R E(R) \equiv arg \min_R (-2\sum_i Rd'_i m_i^{'T})
$$

Minimizing a negative quantity is the same as maximizing the positive one

$$
arg \min_R E(R) \equiv arg \max_R \sum_i Rd'_i m_i^{'T}
$$

$$
\sum_i m^{'T}_i d'_i = trace(R \sum_i d'_i m_i^{'T}) = trace(RH) \quad H=\sum_id_im_i^T
$$

Thus, minimizing E is equivalent to maximizing $trace(RH)$. I did mix the notation here and there, but the idea remains. I got lost in the transposes and everything.

This does not mean that rotation and translation are geometrically independent in $SE(3)$; rather, the particular structure of the Euclidean least-squares cost combined with centroid subtraction yields a decomposition that is valid only for this point-set alignment objective. This separation does not generalize to pose residuals in the logarithmic $SE(3)$ error used in [[RPCN 6|SLAM]].

---

# Deriving the Recursive Bayesian SLAM Update

**Context**

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

2. Show that the Bayes filter update translates into minimizing the Graph-SLAM least-squares objective:

$$
\arg \min_{y_{0:t}}
\Bigg[
\|y_0 - \bar{y}_0\|_{\Omega_0}^2
+ \sum_{\tau=1}^{t} \|y_\tau - g(u_\tau, y_{\tau-1})\|_{R_\tau^{-1}}^2
+ \sum_{\tau=1}^{t} \|z_\tau - h(y_\tau, c_\tau)\|_{Q_\tau^{-1}}^2
\Bigg].
$$

**Clarifications**

The process is mainly converting **probabilities** to **penalties**. The goal of Graph-SLAM is to find the most likely trajectory and map (the Maximum A Posteriori or MAP estimate) given all our sensor data and movements.

Some clarifications first, because I'm dumb as shit when it comes to mathematics.. I really need to pick up a probabilistics book :)

* $\eta$ is the normalization factor. Because the products and integrals on the right side of the equation often result in a number that is much smaller or larger than 1, we use $\eta$ to scale the result back into a valid probability distribution.
* $c_t$ is the respective landmark. Covered its usage in [[RPCN 6|SLAM]].
* $\propto$ is the "is proportional to"
* So we can frame it as 
	* "The **posterior probability** of the state $y$ at time $t$, given all measurements, controls, and landmarks from *zero* to $t$...
	* is **equal to** the normalizer $\eta$....
	* **times** the **likelihood** of the current measurement $z_t$ given the current state and landmark...
	* **times** the integral over the previous state $y_{t-1}$...
	* of the **motion model** (you see it takes $u_t$ in consideration)...
	* **multiplied by** the **previous posterior**.
	* don't judge me.

**Solutions**

**(a)**

We formulate the posterior at $t=1$ using the Bayes update rule. I remind myself that the measurement update is only dependent on the *current state* $y_1$ and the landmark association $c_1$. Same for the others (motion depends on *controls* and *current state*), etc.

$$
p(y_1 \mid y_0, z_1, u_1, c_1) \propto \underbrace{p(z_{1} | y_{1}, c_{1})}_{\text{Measurement Likelihood}} \cdot \underbrace{p(y_{1} | y_{0}, u_{1})}_{\text{Motion Model}} \cdot \underbrace{p(y_{0} | z_{0}, u_{0}, c_{0})}_{\text{Prior}}
$$

Thus, the explicit (unmarginalized) posterior is: (I guess we just generalize, because it's true for both cases?)

$$
p(y_{1}, y_{0} | z_{0:1}, u_{0:1}, c_{0:1}) \propto p(z_{1} | y_{1}, c_{1}) \cdot p(y_{1} | y_{0}, u_{1}) \cdot p(y_{0} | z_{0}, u_{0}, c_{0})
$$

**Step 2: Posterior at $t=2$** 

$$
p(y_2 \mid y_1, y_0, z_2, u_2, c_2) \propto p(z_2 \mid y_2,c_2) \cdot p(y_2 \mid y_1, u_2) \cdot p(y_1, y_0 \mid z_{0:1}, u_{0:1}, c_{0:1})
$$

By substituting the equation from before:

$$
p(y_2, y_1, y_0 \mid z_{0:2}, u_{0:2}, c_{0:2})
\;\propto\;
p(z_2 \mid y_2, c_2)\,
p(y_2 \mid y_1, u_2)\,
p(z_1 \mid y_1, c_1)\,
p(y_1 \mid y_0, u_1)\,
p(y_0 \mid z_0, u_0, c_0).
$$

And if we go one more step, we can see the **general pattern** for $t$.

$$
\begin{aligned}
p(y_{0:t} \mid z_{0:t}, u_{0:t}, c_{0:t}) \propto & \left[ \prod_{\tau=1}^{t} p(z_{\tau} \mid y_{\tau}, c_{\tau}) \right] \\
& \times \left[ \prod_{\tau=1}^{t} p(y_{\tau} \mid y_{\tau-1}, u_{\tau}) \right] p(y_0 \mid z_0, u_0, c_0).
\end{aligned}
$$

**(b)**

As discussed in [[RPCN 6|SLAM]], the MAP aims to maximize the current estimate

$$
arg \max_{y_{0:t}} p(y_{0:t} \mid z_{0:t}, u_{0:t}, c_{0:t})
$$

**Step 1**: To compute the errors, we need to go into **Log** space. It makes computations much easier. This is where we shift from maximizing the probability to minimizing the **cost/penalty**:

$$
	J(y_{0:t}) := -\log p(y_{0:t} \mid z_{0:t}, u_{0:t}, c_{0:t}) + \text{const}
$$

Using the factorization above:

$$
J(y_{0:t}) = - \sum_{\tau=1}^{t} \log p(z_{\tau} \mid y_{\tau}, c_{\tau}) - \sum_{\tau=1}^{t} \log p(y_{\tau} \mid y_{\tau-1}, u_{\tau}) - \log p(y_0 \mid z_0, u_0, c_0),
$$

**Step 2**: Assume Gaussian noise for motion and measurement models. This step helps us convert distances into likelihood $p(x) \propto exp \begin{pmatrix} - \frac{1}{2} ||\text{error}||^2_{\text{trust}} \end{pmatrix}$. And the inverse of the covariance matrix represents the information matrix -- trust.

$$
\begin{aligned}
p(y_{\tau} \mid y_{\tau-1}, u_{\tau}) & \propto \exp\left(-\frac{1}{2}\|r_{\tau}^{\text{motion}}\|_{R_{\tau}^{-1}}^2\right), & r_{\tau}^{\text{motion}} & := y_{\tau} - g(u_{\tau}, y_{\tau-1}), \\
p(z_{\tau} \mid y_{\tau}, c_{\tau}) & \propto \exp\left(-\frac{1}{2}\|r_{\tau}^{\text{meas}}\|_{Q_{\tau}^{-1}}^2\right), & r_{\tau}^{\text{meas}} & := z_{\tau} - h(y_{\tau}, c_{\tau}),
\end{aligned}
$$

and a Gaussian prior

$$
p(y_0 \mid z_0, u_0, c_0) \propto \exp\left(-\frac{1}{2}\|r_0^{\text{prior}}\|_{\Omega_0}^2\right), \quad r_0^{\text{prior}} := y_0 - \bar{y}_0.
$$

Reminder that $\|v\|_A^2 := v^\top A v$

**Step 3**: Substitute the Gaussian forms into $J(y_{0:t})$. Since natural logarithm is the inverse of the exponential function, they **cancel each other out**.

$$
\begin{aligned}
-\log p(y_{\tau} \mid y_{\tau-1}, u_{\tau}) & \doteq \frac{1}{2}\|r_{\tau}^{\text{motion}}\|_{R_{\tau}^{-1}}^2, & -\log p(z_{\tau} \mid y_{\tau}, c_{\tau}) & \doteq \frac{1}{2}\|r_{\tau}^{\text{meas}}\|_{Q_{\tau}^{-1}}^2, \\
-\log p(y_0 \mid z_0, u_0, c_0) & \doteq \frac{1}{2}\|r_0^{\text{prior}}\|_{\Omega_0}^2,
\end{aligned}
$$

We obtain

$$
\begin{aligned}
J(y_{0:t}) \doteq & \frac{1}{2}\|y_0 - \bar{y}_0\|_{\Omega_0}^2 \\
& + \sum_{\tau=1}^{t} \frac{1}{2}\|y_{\tau} - g(u_{\tau}, y_{\tau-1})\|_{R_{\tau}^{-1}}^2 \\
& + \sum_{\tau=1}^{t} \frac{1}{2}\|z_{\tau} - h(y_{\tau}, c_{\tau})\|_{Q_{\tau}^{-1}}^2.
\end{aligned}
$$

As we want to minimize these differences, we drop the $\frac{1}{2}$ term and we obtain what we were after

$$
\underset{y_{0:t}}{\arg \min} \left[ \|y_0 - \bar{y}_0\|_{\Omega_0}^2 + \sum_{\tau=1}^{t} \|y_{\tau} - g(u_{\tau}, y_{\tau-1})\|_{R_{\tau}^{-1}}^2 + \sum_{\tau=1}^{t} \|z_{\tau} - h(y_{\tau}, c_{\tau})\|_{Q_{\tau}^{-1}}^2 \right].
$$

