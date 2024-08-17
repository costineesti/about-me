---
title: C++ const, auto and iterators
draft: false
tags:
  - notes
---

### Const

A `const` variable in C++ does not directly reduce memory usage, but it can have some performance benefits and can potentially lead to optimizations that may indirectly influence memory usage and access efficiency.

>[!hint] It can reduce memory access time because the compiler will use it's direct value instead of allocating a variable inside the memory for it.

### Auto

The `auto` keyword in C++ is used for type inference, meaning it allows the compiler to automatically deduce the type of a variable from its initializer. This can make code cleaner and reduce the need to explicitly specify types, especially when the type is long or complex.

```cpp
string s("some string"); 
if (s.begin() != s.end()) { // make sure s is not empty 
auto it = s.begin(); // it denotes the first character in s 
*it = toupper(*it); // make that character uppercase }
```

### Iter

`Iterators`  allow you to traverse, access, and manipulate elements within a container (like arrays, vectors, lists, etc.) in a consistent and abstract way, without needing to know the underlying details of the container's implementation.

**Basic Operations:**

- **Dereferencing (`*`):** Access the element that the iterator points to.
- **Increment (`++`)**: Move the iterator to the next element in the container.
- **Decrement (`--`)**: Move the iterator to the previous element (only for bidirectional iterators).
- **Comparison (`==`, `!=`)**: Check if two iterators are pointing to the same element or position.

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    // Using an iterator to traverse the vector
    std::vector<int>::iterator it;
    for (it = numbers.begin(); it != numbers.end(); ++it) {
        std::cout << *it << " "; // Dereference the iterator to access the value
    }
    std::cout << std::endl;

    return 0;
}
```

This will simply output `1 2 3 4 5`.

**Const Iterators:**

- A `const_iterator` is an iterator that points to a constant element, meaning you can read the value but cannot modify it.
```cpp
std::vector<int>::const_iterator it;
for (it = numbers.cbegin(); it != numbers.cend(); ++it) {
    std::cout << *it << " ";
}
```

**Reverse Iterators:**

- Reverse iterators allow you to iterate through a container in reverse order.
```cpp
std::vector<int>::reverse_iterator rit;
for (rit = numbers.rbegin(); rit != numbers.rend(); ++rit) {
    std::cout << *rit << " ";
}
```

**Using `auto` with Iterators:**

- You can use the `auto` keyword to avoid explicitly typing out the iterator type:
```cpp
for (auto it = numbers.begin(); it != numbers.end(); ++it) {
    std::cout << *it << " ";
}
```
