---
title: Static and dynamic libraries
draft: false
tags:
  - "#notes"
---
 
I want to use matplotlib in C++ and I came across this [documentation about static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/)

>[!NOTE] A *library* is a package of code that is meant to be reused by many programs. Typically, a C++ library comes in two pieces:
>1. A header file,
>2. A precompiled binary that contains the implementation of that functionality pre-compiled into machine language.

Libraries are precompiled for several reasons. First, since libraries rarely change, they do not need to be recompiled often. It would be a waste of time to recompile the library every time you wrote a program that used them. Second, because precompiled objects are in machine language, it prevents people from accessing or changing the source code, which is important to businesses or people who don’t want to make their source code available for intellectual property reasons.

There are two types of libraries:
* ==static==
* ==dynamic==

A **static library** (also known as an **archive**) consists of routines that are compiled and linked directly into your program. On Windows, static libraries have a `.lib` extension, whereas on Linux they typically have `.a` extension. Their main advantage is that you only need to distribute the executable in order for users to run your program.

A **dynamic library** (also called a **shared library**) consists of routines that are loaded into your application at run time. At compilation it remains a separate unit. On Windows, dynamic libraries typically have a `.dll` extension, whereas on Linux they have a `.so` extension. The main advantages are the fact that it saves space, as many programs share one copy and it's easy to be upgraded to a newer version without replacing the executables.

An **import library** is a library that automates the process of loading and using a dynamic library.