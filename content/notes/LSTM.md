---
title: Long Short-Term Memory
draft: false
tags:
  - "#notes"
---
 
Sources: [this incredibly annoying guy on youtube](https://youtu.be/YCzL96nL7j0?si=WIbLinUE3Lz7D2JD) and [explanation](https://www.analyticsvidhya.com/blog/2021/03/introduction-to-long-short-term-memory-lstm/)

>[!NOTE] What is LSTM?
> It is a sequential [[NN]] (type of [[RNN]]) that allows information to persist over long periods of time. It is a good solution to [[RNN]] which would either explode or vanish in the [[Gradient Descent]] phase. What I mean by that is that a weight to any power, be it either `0.5` or `2` would either get super close to 0 or to $\infty$
> It excels in capturing long-term dependencies (like remembering the chapter 1 from a book) and is ideal for sequence predictions tasks.

This algorithm uses 2 paths in order to predict the future state of some input (one for the long-term memory and one for the short-term).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LSTM.png" style="max-width: 100%; height: auto;">
</div>

Although the guy on youtube is terribly annoying, he has some pretty good explanations and figures. So I will explain based on those figures.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LSTM_architecture.png" style="max-width: 100%; height: auto;">
</div>

* The functions with <span style="color:blue">**BLUE** </span> are called `Sigmoid Activation Functions` which transform any input into an output between [0, 1], $f(x) = \frac{e^x}{e^x + 1}$.
* The functions with <span style="color:red">**RED** </span> are called `Tanh Activations Functions` which transform any input into an output between [-1, 1], $f(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$.
* The <span style="color:green">**GREEN line** </span> is called the `CELL STATE` and represent the **Long-Term Memory**. It is modified by a multiplication and an addition without any weights. That allows the memories to not explode or vanish.
* The <span style="color:pink">**PINK line** </span> represents the `Short-Term Memories` and have weights attached to them.
* The weight right before the functions are called `Bias`

Again, this guy has some really, really good visuals to explain all this.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LSTM_example.png" style="max-width: 100%; height: auto;">
</div>

This first stage is usually called the `Forget Gate`.

The next 2 blocks create a `Potential Memory` and denote how much of it contributes to the Long-Term Memory. This stage is usually called the `Input Gate`.

The final 2 blocks represent the output of the LSTM and this stage is called the `Output Gate`.