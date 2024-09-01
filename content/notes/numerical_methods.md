---
title: Numerical Elimination Methods
draft: false
tags:
  - notes
---

The information regarding these algorithms can be found in my [professor's teachings](https://lendek.net/teaching/OPT/indr.pdf) from the faculty. It was one of my favourite subjects to actually see how mathematics is applied in optimizations. She would give us extremely easy tests at the beginning of each course but you would only know to answer if you've actually been to her classes. She really knew how to make her class appealing.

>[!NOTE] Even though analytical methods are able to provide an exact minimum or maximum, their use can be cumbersome, in particular for nonlinear functions and constraints ( which is the case for my project ). This is why numerical methods are widely used.

Let's consider the function $f:[a,b] -> R$. Without loss of generality, let's assume that the function f has a unique minimum on $[a,b]$. The following methods find this minimum with a tolerance $\epsilon$ by eliminating parts of the interval in several steps.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/elim.png" style="max-width: 100%; height: auto;">
</div>

This is a function with a unique minimum on the interval $[-2,1]$. For the elimination, one has to define two, partly overlapping intervals. The function is evaluated in the endpoints of the intervals. Since there is a unique minimum, one of the intervals contains a point with smaller function value. This interval is retained, while the remaining part is eliminated.

There are two methods:
* Golden Section
* Fibonacci search

### Golden Section

<span style="color:grey">**Input:** </span>

- <span style="color:grey">Objective function \( $f(x)$ \) </span>
- <span style="color:grey">boundaries $a$ and $b$ </span>
- <span style="color:grey">tolerance $e$ </span>

<span style="color:red">**Output:** </span>

- <span style="color:red">Reduced interval $[a,b]$ </span>

### Steps:

1. 
   $$
   d = b-a
   $$

2. **while $b-a \geq \epsilon$ do**

3. 
   $$
   d \leftarrow 0.618 \times d
   $$

4. 
   $$
   x_1 \leftarrow b-d
   $$
5. 
   $$
   x_2 \leftarrow a+d
   $$
6. **if $f(x_1) \leq f(x_2)$ then**
7. 
   $$
   b \leftarrow x_2
   $$
8. **else** 
9. 
   $$
   a \leftarrow x_1
   $$
7. **end if**
8. **end while**



### Fibonacci Search

<span style="color:grey">**Input:** </span>

- <span style="color:grey">Objective function \( $f(x)$ \) </span>
- <span style="color:grey">boundaries $a$ and $b$ </span>
- <span style="color:grey">tolerance $e$ </span>

<span style="color:red">**Output:** </span>

- <span style="color:red">Reduced interval $[a,b]$ </span>

### Steps:

1. 
   $$
   F_1 =2, F_2 = 3
   $$
1. 
   $$
   n=2
   $$
2. **while $b-a \geq \epsilon$ do**

3. 
   $$
   d \leftarrow b-a
   $$

4. 
   $$
   x_1 \leftarrow b-d \frac{F_{n-1}}{F_n}
   $$
5. 
   $$
   x_2 \leftarrow a+d \frac{F_{n-1}}{F_n}
   $$
6. **if $f(x_1) \leq f(x_2)$ then**
7. 
   $$
   b \leftarrow x_2
   $$
8. **else** 
9. 
   $$
   a \leftarrow x_1
   $$
10. **end if**
9. 
   $$
   n \leftarrow n+1
   $$
9. 
   $$
   F_n \leftarrow F_{n-1} + F_{n-2}
   $$
1. **end while**
