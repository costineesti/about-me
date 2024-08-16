---
title: C++ Preprocessor
draft: false
tags:
  - notes
---

>[!NOTE] Whenever a header is updated, the source files that use that header must be recompiled to get the new or changed declarations.

The most common technique for making it safe to include a header multiple times relies on the *preprocessor*. The preprocessoor - which C++ inherits from C - is a program that runs before the compiler and changes the source text of our programs. Our programs already rely on one preprocessor facility, *#include*. 

When the preprocessor sees a *#include*, it replaces it with the contents of the specified header.

C++ programs also use the preprocessor to define *header guards*. Header guards rely on preprocessor variables (defined or not defined). The *#define* directive takes a name and defines that name as a preprocessor variable. There are two other directives that test whether a given preprocessor variable has or has not been defined: *#ifdef* is true if the variable has been defined, and *#ifndef* is true if the variable has *not* been defined.

```cpp
#ifndef SALES_DATA_H 
#define SALES_DATA_H 
#include <string>
struct Sales_data { 
std::string bookNo; 
unsigned units_sold = 0; 
double revenue = 0.0; 
}; 
#endif
```

The first time Sales_data.h is included, the *#ifndef* test will succeed. The preprocessor will process the lines following *#ifndef* up to the *#endif*. As a result, the preprocessor variable SALES_DATA_H will be defined and the contents of Sales_data.h will be copied into our program. If we include Sales_data.h later on in the same file, the *#ifndef* directive will be false. The lines between it and the *#endif* directive will be ignored.

>[!warning] Preprocessor variable names do not respect C++ scoping rules

>[!hint] Headers should have guards, even if they aren’t (yet) included by another header. Header guards are trivial to write, and by habitually defining them you don’t need to decide whether they are needed.

