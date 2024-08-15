---
title: Pointers and References - Compound Types
draft: false
tags:
  - notes
---
 I hate these fuckers.
 
>[!NOTE] A compound type is a type that is defined in terms of another type. C++ has several compound types, two of which—references and pointers
>A reference defines an alternative name for an object. A reference type “refers to” another type. We define a reference type by writing a declarator of the form &d, where d is the name being declared:
>```cpp
  int ival = 1024;
  int &refVal = ival; // refVal refers to (is another name for) ival
  int &refVal2; // error: a reference must be initialized
  >```
  >
>A reference is not an object. Instead, a reference is just another name for an already existing object.
>There is no way to rebind a reference to refer to a different object. Because there is no way to rebind a reference, references must be initialized

```cpp
int ival = 42;
int &p = ival; // p holds the address of ival; p is a pointer to ival
std::cout << p << std::endl; // prints 42
std::cout << &p; // prints address
```

>[!tip] A pointer is a compound type that "points to" another type. Unlike a reference, a pointer is an object in its own right. Pointers can be assigned and copied; a single pointer can point to several different objects over its lifetime. Unlike a reference, a pointer need not be initialized at the time it is defined. Like other built-in types, pointers defined at block scope have undefined value if they are not initialized.

We define a pointer type by writing a declarator of the form *d, where d is the name being defined. The * must be repeated for each pointer variable:

```cpp
int *ip1, *ip2; // both ip1 and ip2 are pointers to int 
double dp, *dp2; // dp2 is a pointer to double; dp is a double
```
### Taking the Address of an Object

A pointer holds the address of another object. We get the address of an object by usin the address-of operator (the & operator):

```cpp
int ival = 42; 
int *p = &ival; // p holds the address of ival; p is a pointer to ival
```

The types of the pointer and the object to which it points must match:

```cpp
double dval;
double *pd = &dval; // ok: initializer is the address of a double
double *pd2 = pd; // ok: initializer is a pointer to double 
int *pi = pd; // error: types of pi and pd differ 
pi = &dval; // error: assigning the address of a double to a pointer to int
```

### Using a Pointer to Access an Object

When a pointer points to an object, we can use the dereference operator (the * operator) to access that object:
```cpp
int ival = 42; 
int *p = &ival; // p holds the address of ival; p is a pointer to ival 
cout << *p; // * yields the object to which p points; prints 42
```

Dereferencing a pointer yields the object to which the pointer points. We can assign to that object by assigning to the result of the dereference:
```cpp
*p = 0; // * yields the object; we assign a new value to ival through p 
cout << *p; // prints 0
```

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_pointers_ref_keyconcepts.png" style="max-width: 100%; height: auto;">
</div>
### Pointers to pointers

A pointer is an object in memory, so like any object it has an address. Therefore, we can store the address of a pointer in another pointer. We indicate each pointer level by its own *. That is, we write ** for a pointer to a pointer, *** for a pointer to a pointer to a pointer, and so on. (fucking hell, I got a 4/10 in the programming class because of these fuckers :D)

```cpp
int ival = 1024; 
int *pi = &ival; // pi points to an int 
int **ppi = &pi // ppi points to a pointer to an int
```

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cpp_pointer2pointer.png" style="max-width: 100%; height: auto;">
</div>

### References to pointers

Surely I will never use these. I just know it.

A reference is not an object. Hence, we may not have a pointer to a reference. However, because a pointer is an object, we can define a reference to a pointer:

```cpp
int i = 42;
int *p; // p is a pointer to int
int *&r = p; // r is a reference to the pointer p
r = &i; // r refers to a pointer; assigning &i to r makes p point to i
// actually the thing above is pretty cool
*r = 0; // deferencing r yields i, the object to which p points; changes i to 0
```

>[!hint] It can be easier to understand complicated pointer or reference declarations if you read them from right to left.
