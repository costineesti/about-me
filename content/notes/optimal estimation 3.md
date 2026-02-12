---
title: Fundamentals of parameter estimation
draft: true
tags:
date: 2026-02-11
---
 
The fist exercise out of eight that I have to solve in the [[optimal estimation]] course.

In this case, I need to use the **minimum risk (Bayes) estimators** from [[optimal estimation 2|The Estimation Paradigm (the static case)]] and also apply the knowledge from [[optimal estimation 1|Introduction to Optimal Estimation and Dynamics]].

# Context

### The measurement system

I need to estimate the depth of the water below a ship by using a *ultrasonic depth gauge* sensor. It is mounted on the bottom of the boat and presents a *transmitter* and a *receiver* which capture a tone burst transmitted downwards. 

> The principle is ToF (Time of Flight).

The ToF is proportional to the depth $x$. Let $c$ be the speed of sound in the water, then

$$
x = \frac{c}{2} \cdot ToF
$$

For clarity, we denote the **true depth** of the water with $x$ and the **noisy measurement** with $z$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex1_context.png" style="max-width: 100%; height: auto;">
</div>

However, the measurement can be disturbed by multiple factors:

* **Secondary echoes (Multipath Interference)**
	* The echo may reflect at the bottom of the boat causing a second echo that arrives at $t = 4x/c$. The second echo may cause a third echo, and so on. This makes the depth appear twice as deep ($2x$) than it actually is.
* **Electronic noise**
	* The measurement is contaminated by Gaussian noise with standard deviation $\sigma$. If we assume that $x$ is the real depth and $z$ is the result of our measurement, we can adopt the following **Gaussian mixture** model (**Likelihood Function**) for the conditional probability density of $z$

$$
p(z\mid x) = P_0 \frac{1}{\sigma \sqrt{2 \pi}}\text{exp}\bigg(-\frac{(z-x)^2}{2\sigma^2}\bigg) + P_1 \frac{1}{\sigma \sqrt{2 \pi}}\text{exp}\bigg(-\frac{(z-2x)^2}{2\sigma^2}\bigg)
$$

$P_1$ is the probability that the first echo is missed and replaced by the second echo. Obviously, $P_0$ is the probability that the first echo is correctly detected. $P_0 + P_1 = 1$.

> In simple words, electronic interference adds "*jitter*" to the measurement, represented by a standard deviation $\sigma$.

### Prior Knowledge (Ground-Truth)

Based on the information from a nautical map, the shipper has some prior knowledge about the depth. The map indicates an interval of possible depths. This interval is considered to be softly bounded. Such prior knowledge can be modeled with a [[optimal estimation 4|Generalized Normal Distribution]].

$$
p(x) = \frac{\beta}{2\alpha \Gamma\left(\frac{1}{\beta}\right)} \exp\left( - \left( \frac{|x - \mu|}{\alpha} \right)^{\beta} \right)
$$

> So, the captain gives the **Prior Distribution** $p(x)$. Instead of a standard bell curve, it uses a [[optimal estimation 4|Generalized Normal Distribution]], which allows for a "softly bounded" interval of likely depths using parameters $\alpha$ (**scale**), $\mu$ (**mean**), and $\beta$ (**shape**).

For example, if the depth interval is $[x_{min}, x_{max}]$, then $\mu = \frac{1}{2}(x_{min}+x_{max})$ and $\alpha = \frac{1}{2}(x_{max}-x_{min})$

# My case

For the current case, the following parameters are given:

* **sensor system** $p(z \mid x)$
	* $P_0 = 0.95$
	* $\sigma = 0.1$
* **prior knowledge** $p(x)$
	* $x_{min} = 1m$
	* $x_{max} = 3m$
	* $\beta = 20$

**First Question**: If we model $p(x)$ and $p(z \mid x)$ against $z$ for $x = 1.5m$ and $x=2m$, what do these PDFs model?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex1_result.png" style="max-width: 100%; height: auto;">
</div>

* The **prior** $p(x)$ shows my belief before even measuring. It's nearly uniform between $x_{min} =1m$ and $x_{max} = 3m$, meaning I consider all depth in that range roughly equally likely. Again, this one reflects the captain's knowledge based on the nautical map.
* The **Likelihood** $p(z \mid x)$ tells me what measurement I should expect given the two true depths (blue with $x=1.5m$ and red with $x=2m$). 
	* The blue PDF shows two peaks - one main peak at $z=1.5m$(correct echo, 95\% probable), and a small peak at $z=3m$(secondary echo at 2x, 5\% probable)
	* Same thing for the red PDF - main peak at $z=2m$ and small peak at $z=4m$.
* The peaks are sharp, showing the sensor is precise ($\sigma = 0.1m$).

>[!question] What happens if I modify $\sigma$? But $\beta$?
> **Modifying** $\sigma$:
> 
> * The peak location stays the same, but the PDFs are more spreaded. As $\sigma$ >>, the noise gets larger => the measurement is less precise
> * The **integral under each peak stays the same**
> * But the probability of getting a measurement _near_ a value changes. The **peak heights** change. 
> * With $\sigma=0.3$ (wider), there's higher probability of measuring $z=1.7m$ when $x=1.5m$. With $\sigma=0.05$(narrower), that probability is much lower.
> 
> **Modifying** $\beta$:
> 
> * Changes which depths are considered **more likely a priori**
> * As $\beta$ >>, I approach uniform distribution, meaning I assign all probabilities the same weight.
> * In my current case, $\beta=20$ is good for "depth is somewhere between 1-3m, no strong preference".
> 
> example for $\beta=5$ and $\sigma=0.3$
> <div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ex1_result_2.png" style="max-width: 100%; height: auto;"> </div>

**Second Question**: Compute the PDFs regarding $p(z)$ and $p(x \mid z)$. Now we model these against $x$ for $z=3.1m$ and for $z=4m$. What do they represent?

The **evidence** $p(z)$ is the total probability of observing a measurement $z$. It is calculated by **integrating** **the** **likelihood** over all possible true depths $x$.

$$
p(z) = \int_\infty^\infty p(z \mid x) p(x)dx
$$

The **posterior** $p(x \mid z)$ represent my **updated belief** about the true depth $x$ after seeing measurement $z$. Per Bayes' Theorem:p

$$
p(x \mid z) = \frac{p(z \mid x)p(x)}{p(z)} \propto p(z\mid x)p(x)
$$

