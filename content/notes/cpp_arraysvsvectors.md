---
title: C++ Arrays vs Vectors
draft: false
tags:
  - notes
---
 

>[!tip] If you don’t know exactly how many elements you need, use a vector.
>An array is a data structure that is similar to the library vector type but offers a different trade-off between performance and flexibility. Like a vector, an array is a container of unnamed objects of a single type that we access by position. Unlike a vector, arrays have fixed size; we cannot add elements to an array. Because arrays have fixed size, they sometimes offer better run-time performance for specialized applications. However, that run-time advantage comes at the cost of lost flexibility

### Character Arrays Are Special

```cpp
char a3[] = "C++"; // null terminator added automatically
const char a4[6] = "Daniel"; // error: no space for the null!
```

### No copy or assignment

>[!warning] Some compilers allow array assignment as a compiler extension. It is usually a good idea to avoid using nonstandard features. Programs that use such features, will not work with a different compiler.
>We cannot initialize an array as a copy of another array, nor is it legal to assign one array to another

```cpp
int a[] = {0, 1, 2}; // array of three ints
int a2[] = a; // error: cannot initialize one array with another 
a2 = a; // error: cannot assign one array to another
```

### Understanding Complicated Array Declarations

God damn!

```cpp
int *ptrs[10]; // ptrs is an array of ten pointers to int 
int &refs[10] = /* ? */; // error: no arrays of references 
int (*Parray)[10] = &arr; // Parray points to an array of ten ints 
int (&arrRef)[10] = arr; // arrRef refers to an array of ten ints
int *(&arry)[10] = ptrs; // arry is a reference to an array of ten pointers
```

>[!tip] It can be easier to understand array declarations by starting with the array’s name and reading them from the inside out.
>		int *(&arry)[10] = ptrs;
>Reading this declaration from the inside out, we see that arry is a reference. Looking right, we see that the object to which arry refers is an array of size 10. Looking left, we see that the element type is pointer to int. Thus, arry is a reference to an array of ten pointers.



