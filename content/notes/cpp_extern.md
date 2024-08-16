---
title: Keyword extern
draft: false
tags:
  - notes
---
 Found this in the book and I thought I would note it somewhere.

>[!NOTE] To define a single instance of a const variable, we use the keyword *extern* on both it's definition and declaration(s). To share a const object among multiple files, you must define the variable as extern.

```cpp
// file_1.cc defines and initializes a const that is accessible to other files 
extern const int bufSize = fcn(); 
// file_1.h 
extern const int bufSize; // same bufSize as defined in file_1.cc
```

In this program, file_1.cc defines and initializes *bufSize*. Because this declaration includes an initializer, it is (as usual) a definition. However, because *bufSize* is a const, we must specify extern in order for *bufSize* to be used in other files.