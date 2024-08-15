---
title: C++ Basics
draft: false
tags:
  - "#notes"
---

One of my short-term goals is learning C++ as well as possible. I used it in my [[Bachelors]] and I want to actually understand this programming language.

For this, I am using as reference the *C++ Primer*.

### Arithmetic Types

![[../static/notes/cpp_arith_types.png]]

The arithmetic types are divided into two categories: integral types (which include character and boolean types) and floating-point types. 

![[../static/notes/cpp_machine_level_repr.png]]
The floating-point types represent single-, double-, and extended-precision values. The standard specifies a minimum number of significant digits. Most compilers provide more precision than the specified minimum. Typically, floats are represented in one word (32 bits), doubles in two words (64 bits), and long doubles in either three or four words (96 or 128 bits). The float and double types typically yield about 7 and 16 significant digits, respectively.

![[../static/notes/cpp_advice.png]]![[../static/notes/cpp_caution.png]]