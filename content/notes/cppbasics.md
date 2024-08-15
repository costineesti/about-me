---
title: C++ Basics
draft: false
tags:
  - "#notes"
---

One of my short-term goals is learning C++ as well as possible. I used it in my [[Bachelors]] and I want to actually understand this programming language.

For this, I am using as reference the *C++ Primer*.

### Arithmetic Types

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_arith_types.png" style="max-width: 100%; height: auto;">
</div>

The arithmetic types are divided into two categories: integral types (which include character and boolean types) and floating-point types. 

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_machine_level_repr.png" style="max-width: 100%; height: auto;">
</div>

The floating-point types represent single-, double-, and extended-precision values. The standard specifies a minimum number of significant digits. Most compilers provide more precision than the specified minimum. Typically, floats are represented in one word (32 bits), doubles in two words (64 bits), and long doubles in either three or four words (96 or 128 bits). The float and double types typically yield about 7 and 16 significant digits, respectively.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_advice.png" style="max-width: 100%; height: auto;">
</div>
<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_caution.png" style="max-width: 100%; height: auto;">
</div>