---
title: Fundamentals of parameter estimation - Part III
draft: true
tags:
date: 2026-03-09
---
 
This is the continuation to [[optimal estimation 5|Fundamentals of parameter estimation - Part II]]. Exercise 3/8 from my [[optimal estimation]] course. The focus is on **random vectors and unbiased linear MMSE estimation**.

At the end of this exercise I should understand insights about the concept of covariance matrices and about unbiased linear MMSE estimation.

# Context

**Prior knowledge**

I have a ship. The parameter vector to estimate is the position vector of that ship $\mathbf{x} = [x \quad y]^T$. The prior knowledge, obtained via dead reckoning, is captured as a prior expectation $\mu_{\mathbf{x}}$ and a covariance matrix which expresses the prior uncertainty that we have about the position $C_{\mathbf{x}}$. 

**Measurement**

In order to increase the accuracy, the navigator of the ship measures the direction $\varphi$ of a beacon, e.g. lighthouse, relative to the ship as in the Figure below.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds1.png" style="max-width: 100%; height: auto;">
</div>

The beacon has a known reference position $\mathbf{x}_0$. The line of sight is defined by the position of the beacon and by the measured direction $\theta$. The compass reading gives $\theta = \varphi + \triangle \theta$. The following equation defines the line of sight in the $(\xi, \eta)$ plane:

$$
x_0 \sin\theta - y_0 \cos\theta = \xi \sin\theta - \eta \cos\theta
$$

**The measurement model**

The relation between the ship's true position $\mathbf{x} = (x,y)$ and the true bearing $\varphi$ is:

$$
x_0 \sin \varphi - y_0 \cos \varphi = x \sin \varphi - y \cos \varphi
$$

or, by substituting $\varphi = \theta - \triangle \theta$

$$
x_0 \sin(\theta - \Delta\theta) - y_0 \cos(\theta - \Delta\theta)

=

x \sin(\theta - \Delta\theta) - y \cos(\theta - \Delta\theta)
$$

The relation between the ship's true position $\mathbf{x}$ and the observed direction $\theta$ is nonlinear. To get a linear approximation, we apply a truncated Taylor series expansion to the sine and cosine functions:

$$
\sin(\theta - \Delta\theta) \approx \sin\theta - \Delta\theta \cos\theta
$$

$$
\cos(\theta - \Delta\theta) \approx \cos\theta + \Delta\theta \sin\theta
$$

$$
\Downarrow \text{after some rearrangements}
$$

$$
x_0 \sin\theta - y_0 \cos\theta \approx x \sin\theta - y \cos\theta + \Delta\theta \left((x_0 - x)\cos\theta + (y_0 - y)\sin\theta \right)
$$

Since $\theta \approx \varphi$, the factor $(x_0 - x)\cos\theta + (y_0 - y)\sin\theta$ almost equals $(x_0 - x)\cos\varphi + (y_0 - y)\sin\varphi$. The latter equals the distance $d$ between beacon and ship. Therefore:

$$
x_0 \sin\theta - y_0 \cos\theta

\approx

x \sin\theta - y \cos\theta + d\,\Delta\theta
$$

This can be written in the form $z = H\mathbf{x} + v$ with the following definitions $\begin{cases}z = x_0 \sin\theta - y_0 \cos\theta \\ H = [\sin\theta \;\; -\cos\theta] \\ v = d\,\Delta\theta \end{cases}$

The distance $d$ is unknown, but can be estimated from prior knowledge $\mu_{\mathbf{x}}$ of the ship's position and the position of the beacon: $d \approx ||\mathbf{x}_0 - \mu_{\mathbf{x}}||$. Assuming the measurement of the bearing has an uncertainty of $\sigma_{\Delta \theta}$, the standard deviation of $v$ is $\sigma_v = d \sigma_{\Delta \theta}$ \[radians\].

# The Case

> Physical units are Nautical miles (Nm).

### Uncertainty regions and principal axes

For normal distributions $p(\mathbf{x}) = \frac{1}{\sqrt{(2\pi)^N |C_x|}} \exp\left(-\frac{(\mathbf{x}-\mu_x)^T C_x^{-1} (\mathbf{x}-\mu_x)}{2} \right)$, the equation for the contour simplifies to: $(\mathbf{x}-\mu_x)^T C_x^{-1} (\mathbf{x}-\mu_x) = k^2 \text{ with } k = 1,2,3$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds2.png" style="max-width: 100%; height: auto;">
</div>

The eigenvectors and eigenvalues are solutions of $C_x \mathbf{v} = \lambda \mathbf{v}$ and the corresponding scaling factors are $a_m = \sqrt{\lambda_m}$

---

**First topic**: Determine the eigenvalues and eigenvectors of $C_{\mathbf{x}}$ and draw the associated uncertainty region. 

**1.1 Generate a set of points on a circle with unit radius. The centre of the circle is positioned at the origin**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds3.png" style="max-width: 100%; height: auto;">
</div>

**1.2 Scale the $x$ and $y$ coordinates of these points in accordance with the scaling factors $a_0$ and $a_1$. The resulting points form an ellipse with the right shape, but not with the right orientation and position.**

So based on the Figure 5 above, I need to extract the $a_0$ and $a_1$ scaling factors of the ellipse defined by $C_\mathbf{x}$. The corresponding scaling factors are $a_m = \sqrt{\lambda_m}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds4.png" style="max-width: 100%; height: auto;">
</div>

**1.3 Rotate the set of points in accordance with the direction of the principal axes. The eigenvector-matrix is a rotation matrix.**

This is really just a no-brainer, since the eigenvector-matrix is in itself the Rotation Matrix I need to apply.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds5.png" style="max-width: 100%; height: auto;">
</div>

**1.4+1.5 Shift the whole set to the position determined by $\mu_{\mathbf{x}}$. Plot the curve defined by the resulting set of points.**

Again, I simply add to each axis the values from $\mu_{\mathbf{x}}$.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds6.png" style="max-width: 100%; height: auto;">
</div>

---

**Second topic**: Add the line of sight to the Figure. From the context, the uncertainty of the measured bearing is the standard deviation $\sigma_{\Delta \theta}$. The range $[\theta - \sigma_{\Delta \theta}, \theta + \sigma_{\Delta \theta}]$ defines an uncertainty region in the shape of a 2D cone. Visualize this cone in the graph by adding two dashed lines.

The line of sight is a line starting from the beacon position $\mathbf{x}_0$ going in the direction of the measured bearing $\theta$. So I must simply apply the equation:

$$
y_{\text{los}}-y_0 = m(x_{\text{los}}-x_0)
$$

where $m = \tan(\theta)$. 

For the upper and lower bounds of the LoS (the 2D cone), I can simply reapply the formula like this:

$$
y = y_0 + \tan(\theta \pm \sigma_{\Delta \theta})(x-x_0)
$$

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex3_oeds7.png" alt="compass reading" width="350" height="300"> </div> <div> <img src="../static/notes/ex3_oeds8.png" alt="true bearing" width="350" height="300"> </div> </div>

In the Figure above, in the left plot, the lines do not intersect the uncertainty region if I consider the compass reading of $\theta=35$. This would indicate that the prior position estimate and the compass measurement are pointing at slightly different locations (so the reading of the compass is off). To see what the true bearing should be, I applied $atan2$ between the bearing and the prior estimate, and I get the result of $\sim 41.63$ degrees. In this case, the line of sight would pass straight through the ship's position in the right plot.

---

**Third topic**: The linearized measurement function replaces the cone by a bar (i.e. two parallel lines). The width of this bar is $2 \sigma_v$. Calculate it and show the results.

According to the document, $\sigma_v = d \sigma_{\Delta \theta}$, where $d = || x_0 - \mu_x ||$ is the euclidean distance between the bearing and the prior position estimate. According to the calculations, the initial width of the bar is $\sim 4.2033 Nm$.

Although $\theta$ is the **real measurement**, I can use $z$ as a **derived measurement** instead. 

$$
z = \mathbf{x_0} \sin(\theta) - \mathbf{y_0} \cos(\theta)
$$

>[!question] Okk, but what is $z$? What does it represent?
>
>While the actual physical measurement is the bearing angle $\theta$, its relationship to the ship's position is non-linear. To make this usable for linear estimation, the measurement model is linearized using a Taylor series expansion. This process groups the known variables—the beacon's position $(x_0, y_0)$ and the measured angle $\theta$ - into a single known scalar value $z$.
>
>* Geometrically, **the absolute value of z represents the shortest, perpendicular distance from the origin (0, 0) to the measured line of sight**. Because it is a signed value, the positive or negative sign simply indicates which side of the origin the line falls on.

> Basically, the true relationship is non-linear and I linearize it through the standard linear format $z=Hx+v$. I will need it in the unbiased linear MMSE estimator.

The linearized bar consists of two parallel lines defined by

$$
x \sin(\theta) - y \cos(\theta) = z \pm \sigma_v
$$

After rearranging, I get $y=x \tan(\theta) - \frac{z \pm \sigma_v}{\cos(\theta)}$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds9.png" style="max-width: 100%; height: auto;">
</div>

According to the plot, the results do make sense, since the cone and the bar are approximately equal in width near the ship's position (they actually overlap, since the dashed line of the cone is no longer visible), which is where the linearization is valid. Further away from that, the approximation becomes less accurate.

---

**Fourth topic**: Determine the derived measurement $z$, the measurement matrix $H$, and the Kalman Gain matrix. The covariance matrix of the measurement noise is $C_v = \sigma_v^2$. Next, calculate the unbiased linear MMSE estimate of the position and the corresponding (error) covariance matrix.

For the first part, I already had to compute the derived measurement $z$ in the last question, and its value is $z \sim -24.5576$ which makes sense. The minus sign signals that the side on which the shortest perpendicular falls on the line of sight is to the left of the origin. The actual distance would be $z = 24.5576Nm$.

Since $H = [\sin \theta \quad - \cos \theta]$, the actual values of the measurement matrix would be $H=[0.5736, -0.8192]$. It maps the 2D position to the scalar measurement.

The Kalman Gain $K=C_{\mathbf{x}} H^T \begin{pmatrix} HC_{\mathbf{x}}H^T + C_v \end{pmatrix}^{-1}$ (taken from eq. 3.33 from the book) weights how much to trust the measurement versus the prior knowledge. The actual values are $K \approx [0.419, -0.8625]$.

The updated estimate $\mu_{\text{post}} = \hat{\mathbf{x}}_{\text{ulMMSE}}(z) = \mu_{\mathbf{x}} + K(z-H \mu_{\mathbf{x}})$ depends mostly on the **innovation** $z-H \mu_{\mathbf{x}}$. The Kalman Gain transforms the innovation into a **correction term** that represents the knowledge that we have gained from the measurements.

> When you invert a covariance matrix, you get the information matrix. Just a reminder.

The updated covariance $C_e = \begin{pmatrix} C_{\mathbf{x}}^{-1} + H^TC_V^{-1}H \end{pmatrix}^{-1}$ (taken from eq 3.44 from the book) represents the reduced uncertainty after incorporating the measurement. The actual values are $C_e \approx \begin{bmatrix} 10.4122 \quad 5.0316 \\ 5.0316 \quad 8.174 \end{bmatrix}$.

---

**Fifth topic**: Draw the uncertainty region of the estimate. That is, plot the posterior mean and covariance matrix.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ex3_oeds10.png" style="max-width: 100%; height: auto;">
</div>

Now, based on the updated information, the ship's updated uncertainty region falls within the designated bounds of the line of sight. An interesting idea is that the bearing measurement only constrains the position perpendicular to the line of sight. Along the line of sight, distance remains uncertain, so the ellipse stretches in that direction (the red uncertainty region). Visibly, the Kalman gain K determined how much weight to give the measurement versus the prior. Since $\sigma_v$ was relatively small, the measurement was trusted and the uncertainty collapsed significantly in the perpendicular direction. Due to the innovation being nonzero, meaning the prior mean was not on the line of sight, the estimate got pulled onto it.

---

**Sixth topic**: Repeat questions 2 to 4 a number of times, but with varying values of $\sigma_{\Delta \theta}$ and explain what you see.

The term $\sigma_{\Delta \theta}$ directly influences the width of the linearized bar width and the covariance matrix of the measurement noise. Therefore, if the bearing uncertainty increases, then the update would take the measurement less into consideration, since the Kalman Gain has it in the denominator and the updated covariance matrix computes the error term based on its inverse. 

However, since the uncertainty increases, that also increases the change of the initial guess to fall more and more within the linearized bar width. The updated position $\mu_\text{post}$ is more than likely to fall within the bounds, but the uncertainty also increases. This suggests that the lower the bearing uncertainty, the better and more accurate will the updates be, and a narrower space for uncertainty.

* An interesting observations is that as $\sigma_{\Delta \theta} \rightarrow \infty$, the posterior converges towards the prior. That happens because $K \rightarrow 0$ and $C_{\mathbf{x}\_\text{post}} \rightarrow C_{\mathbf{x}}$, meaning the measurement holds no value and no influence to the update.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex3_oeds13.png" alt="compass reading" width="350" height="300"> </div> <div> <img src="../static/notes/ex3_oeds14.png" alt="true bearing" width="350" height="300"> </div> </div>

* As $\sigma_{\Delta \theta} \rightarrow 0$, there is no real uncertainty region, because it would mean we would trust the measurement completely and the posterior ellipse collapses onto the line of sight.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex3_oeds11.png" alt="compass reading" width="350" height="300"> </div> <div> <img src="../static/notes/ex3_oeds12.png" alt="true bearing" width="350" height="300"> </div> </div>

---

**Seventh topic**: Repeat question 2 up to 4 a number of times, but with varying $C_{\mathbf{x}}$ by $\alpha$.

* If $\alpha$ increases, that means a larger prior uncertainty, which leads the Kalman Filter to trust the measurement much more. While the posterior will be placed inside the bar width, the uncertainty region grows bigger, which still translates to possible errors.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex3_oeds15.png" alt="compass reading" width="350" height="300"> </div> <div> <img src="../static/notes/ex3_oeds16.png" alt="true bearing" width="350" height="300"> </div> </div>

* As $\alpha$ decreases, that translates into trusting the prior more. Therefore, the posterior will incline towards $\mu_{\mathbf{x}}$ and not $\mu_{\text{post}}$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ex3_oeds17.png" alt="compass reading" width="350" height="300"> </div> <div> <img src="../static/notes/ex3_oeds18.png" alt="true bearing" width="350" height="300"> </div> </div>

