---
title: Time Series
draft: false
tags:
date: 2026-10-03
---

>[!summary] Time Series
>
>Observations of a variable collected over successive periods of time.

**Types** include **univariate** (one variable -- e.g. temperature) and **multivariate** (several variables -- e.g. stock open/close/high/low).

Here order matters. In classical statistics, observations are assumed independent. Shuffle the rows and nothing changes. In a time series, shuffling destroys the information.

Yesterday tells us something about today. This dependence is:

* a problem, because many standard methods assume independence;
* an opportunity, because dependence is what makes prediction possible.

# Time series patterns

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_17.png" style="max-width: 100%; height: auto;">
</div>

**Trend**: a long-term increase or decrease.

**Seasonality**: a pattern repeating at a fixed, known period (day, week, year)

* e.g. Christmas sales week or rental spikes during weekends

**Cycle**: rises and falls without a fixed period, usually lasting longer than 2 years.

* e.g. irregular multi-year epidemic waves

> Seasonality has a fixed period; cycles don't

**Time Series Decomposition: How to get trend and seasonality**

* Additive when the seasonal swings stay the same size

$$
\text{Value} = \text{Base level + Trend(T) + Seasonality(S) + Error(R)}
$$

* Multiplicative when they grow with the level.

$$
\text{Value} = \text{Base level} \times \text{Trend(T)} \times \text{Seasonality(S)} \times \text{Error(R)}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_18.png" style="max-width: 100%; height: auto;">
</div>

# Correlation

* relative strength of linear relationship
* unit-less
* ranges between $[-1,1]$

$$
r = \frac{\sum_{i=1}^n (x_i - \overline{x})(y_i - \overline{y})}{\sqrt{\sum_{i=1}^n (x_i - \overline{x})^2 \sum_{i=1}^n (y_i - \overline{y})^2}}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_19.png" style="max-width: 100%; height: auto;">
</div>

A high value near 1 or -1 means a strong relationship where points form a tight line, making it easy to accurately predict one variable based on the other. 

A low value near 0 means a weak relationship with widely scattered points, indicating the variables barely affect one another. 

A middle value around 0.5 or -0.5 shows a moderate relationship where a general trend exists, but the points are loose enough that predictions will have noticeable error. 

The positive or negative sign simply dictates whether that trend slopes upward or downward.

# Lag plot: correlating a series with its own past

> basically plot $y_t$ against $y_{t-1}$.

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ds4all_20.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ds4all_21.png" alt="flow 2" width="350" height="300"> </div> </div>

* random cloud: no dependence
* tight diagonal: strong autocorrelation
* ellipse: sinusoidal (periodic) behavior

# Autocorrelation

>[!summary] Autocorrelation
>it's the correlation between $y_t$ and its lagged value $y_{t-k}$.

$$
r_k = \frac{\sum_{t=k+1}^T (y_t - \overline{y})(y_{t-k} - \overline{y})}{\sum_{t=1}^T (y_t - \overline{y})^2}
$$

* $\bar{y}$ is the mean

It compares each value to a previous value that is exactly $k$ steps back. If the lag $k=1$, it compares each value to its immediate predecessor. If $k=2$, it compares each value to the one two steps before it.

The ACF (correlogram) plots $r_k$ against lag $k$.

* The dashed blue lines represent a 95% confidence threshold where correlations inside the lines (grey bars) might just be random noise, while those outside the lines (orange bars) indicate a statistically significant relationship.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_22.png" style="max-width: 100%; height: auto;">
</div>

* In the business sales data on the left, the ACF drops rapidly, showing strong positive correlation only for the first four weeks before fading into the grey zone. This indicates the sales data has short-term "memory" and lacks long-term repeating cycles
* the continuous glucose monitor data on the right produces a wavy ACF plot characteristic of cyclical or seasonal data. The positive peaks at lags 64 and 133 correspond to repeating intervals between meals, while the deep negative trough around lag 30 captures the inverse relationship between a high glucose peak and the subsequent post-meal dip 2.5 hours later.

>[!question] The slide explains how to identify trends and seasonal cycles in a time series using an autocorrelation plot?
>
>Data with a long-term **trend** will show large, positive autocorrelations for small lags that slowly decay as the lag increases.
>
>Data with **seasonal** patterns will show distinct peaks in the autocorrelation at regular multiples of that seasonal frequency
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ds4all_23.png" style="max-width: 100%; height: auto;"> </div>

# White noise

>[!summary] White Noise
>a series with no autocorrelation, mean zero and constant variance.
>
>i.e. "nothing left to learn" benchmark.

* in ACF terms, $95\%$ of spikes lie within $\pm \frac{2}{\sqrt{T}}$
	* $T$ is the series length.
	* i.e. the dashed blue lines
* many spikes outside the bands mean the series still has structure left.

> The goal of modelling is to capture all the structure so that only white noise remains. If model residuals are still autocorrelated, the model has missed something.

>[!question] What is a residual?
>The part of the data the model did not explain $e_t = y_t - \hat{y}_t$.
>
>Good residuals are uncorrelated (the ACF looks like white noise) and have mean zero (otherwise the forecasts are biased).
>
>Some nice to have's include (i) constant variance, (ii) approximately normal distribution, which is needed for prediction intervals.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ds4all_26.png" style="max-width: 100%; height: auto;"> </div>

**The random walk**

Today equals yesterday plus a random step: $y_t = y_{t-1} + \epsilon_t$. The spread grows over time, so the mean and variance are not stable. 

Think of a random walk as adding up $t$ independent random steps -- if the variance of a single step is $\sigma^2$, the total variance after $t$ steps equals $t \cdot \sigma^2$. The standard deviation is the square root of the total variance, resulting in $\sqrt(t) \cdot \sigma$. The envelope formula $\pm 2 \sqrt(t) \cdot \sigma$ simply represents a standard 95\% confidence interval, spanning roughly two standard deviations above and below the center to capture where the vast majority of random paths will fall.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_27.png" style="max-width: 100%; height: auto;">
</div>

* Stock prices are a classic example. In this case, the **naive forecast** is optimal.

# Forecasting methods

* **Average method**: the forecast of all future values are equal to the average 
	* (i.e. assign the mean of the data to the incoming observation)
* **Naïve method**: forecast is the last observed value
	* (i.e. assign the last value we have to the incoming observation)
* **Seasonal naïve method**: last observed value from the same season
	* predicts future values by simply copying the last observed value from the corresponding season
* **Drift method**: Naïve + average change in data

> Seasonal naïve captures the pattern; average and naïve miss it.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_24.png" style="max-width: 100%; height: auto;">
</div>

### Forecasting accuracy

$$
\begin{aligned}
MAE &= \frac{1}{T} \sum_{i=1}^T |y_i - \widehat{y}_i| \\
RMSE &= \sqrt{\frac{1}{T} \sum_{i=1}^T (y_i - \widehat{y}_i)^2}
\end{aligned}
$$

* Both are in the units of the data, so they are interpretable
* RMSE penalises large errors more
	* Use it when big misses are costly: a stock-out, or an unexpected surge in patients

# Cross validation

* Never shuffle a time series.
* Training data comes first; test data is the most recent part.
* Evaluate only on data the model has not seen.
* The test set should be at least as long as the horizon you want to forecast.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_25.png" style="max-width: 100%; height: auto;">
</div>

# Stationary and Non-Stationary Time Series

A stationary series has statistical properties (mean, variance, autocorrelation) that don't depend on when you observe it. An easy method would be to split the series into parts and compare the means, variances and ACFs. 

* The ACF drops quickly for a stationary series and decays slowly for a non-stationary one.

>[!summary] **Not stationary:**
>
> * series with a trend
> * series with seasonality
> * series with changing variance

>[!summary] **Stationary**:
>* white noise
>
>cycles without a fixed period can still be stationary (the lynx series)

>[!question] Which of these are stationary?
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/ds4all_28.png" style="max-width: 100%; height: auto;"> </div>
>
>**Stationary: (b), (d), (g)**
>
> - **(b):** The differenced series hovers around 0 with constant variance, and the one spike is an outlier rather than a trend. Differencing turned the non-stationary (a) into a stationary series.
> - **(d):** It has a constant mean and variance. The apparent seasonality is weak and irregular.
> - **(g) lynx:** The cycles are strong, but they have irregular periods (not a fixed seasonal length), so the series is stationary. Cyclic behavior with no predictable timing doesn't violate stationarity.
> 	- lynx = irregular boom-bust cycles around a stable average
>
>**Non-stationary:**
>
> - **(a):** Clear trend, and the level shifts.
> - **(c):** Mean changes over time, with a trend-like swing.
> - **(e):** Downward trend.
> - **(f):** The mean shifts over time, and the early drop around 1980 is a level change.
> - **(h):** Fixed-period seasonality (repeats every year), which makes it non-stationary.
> - **(i):** Upward trend, growing seasonal amplitude, and increasing variance.

To make a time series stationary 

* apply differencing -- it stabilizes the mean. Doesn't matter if first or seasonal differencing. 
* Log or $n^{th}$ root (Box-Cox) transforms stabilize the variance.
* Transformations can be combined, e.g. log first, then difference.

# Time Series Modelling

**AutoRegression ($AR(p)$)** -- regression with itself (it's a regression of the series on its own past values)

$$
\begin{aligned} y_t &= c + \phi_1 y_{t-1} + \phi_2 y_{t-2} + \dots + \phi_p y_{t-p} + \epsilon_t \\ &= c + \sum_{i=1}^p \phi_i y_{t-i} + \epsilon_t \end{aligned}
$$

* $p$ is the order
* $c$ is a constant
* $\phi_i$ are the parameters

For $AR(1)$ to be stationary, $-1 < \phi_1 < 1$. If $\phi_1$​ is exactly 1, the model turns into a random walk where the variance grows endlessly, and if its magnitude is greater than 1, the series will exponentially explode toward infinity.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_29.png" style="max-width: 100%; height: auto;">
</div>

A higher order allows the model to capture more complex, long-lasting patterns in the data, but it increases the risk of overfitting (high variance) by essentially memorizing random noise from too many past steps. A lower order keeps the model simple and mathematically stable, but it risks underfitting (high bias) by ignoring important historical context.

**Moving Average ($MA(q)$)** -- make decision based on previous errors instead of previous values.

$$
\begin{aligned} 
y_t &= c + \theta_1 \epsilon_{t-1} + \theta_2 \epsilon_{t-2} + \dots + \theta_q \epsilon_{t-q} + \epsilon_t \\ &= c + \sum_{i=1}^q \theta_i \epsilon_{t-i} + \epsilon_t 
\end{aligned}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_30.png" style="max-width: 100%; height: auto;">
</div>

> An MA(q) model is inherently stationary regardless of its parameters because it is mathematically just a finite sum of stable white noise.

**ARMA and ARIMA**

$ARMA(p, q)$: both pieces summed up

$$
y_t = c + \sum_{i=1}^p \phi_i y_{t-i} + \sum_{i=1}^q \theta_i \epsilon_{t-i} + \epsilon_t
$$

$ARIMA(p, d, q)$: an ARMA model on the series differenced $d$ times. ARMA assumes stationarity, so ARIMA first differences the series d times, then fits ARMA on the result (look back to images (a) and (b)).

Choosing $p$ and $q$:

- PACF cuts off after lag p $\rightarrow$ AR(p)
	- **"Cuts off after lag k"** means that on the ACF/PACF plot, the bars at lags 1 through $k$ are significant (stick out past the blue confidence band), and every bar after lag $k$ drops to roughly zero (stays inside the band).
- ACF cuts off after lag q $\rightarrow$ MA(q)
- Or grid search over $(p, q)$ and pick the lowest AICc

Link to benchmarks:

- $ARIMA(0,1,0)$ = random walk = naïve forecast (tomorrow = today). This is $\phi_1=1$.
- $ARIMA(0,1,0) + constant$ = drift forecast (naïve plus a steady trend)

| Model   | ACF                  | PACF                 |
| ------- | -------------------- | -------------------- |
| $AR(p)$ | decays gradually     | cuts off after lag p |
| $MA(q)$ | cuts off after lag q | decays gradually     |

page 36.