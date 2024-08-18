---
title: C++ Pointers and Multidimensional Arrays
draft: false
tags:
  - notes
---

Alright, so I already went through arrays and vectors and I think I have a pretty good understanding of them but I still want to note down some ideas from matrices.

Let's say we have a matrix ia\[3]\[4] that is initialized with the index of every element.
If I want to parse that matrix in order to print the values, I can do this:

```cpp
for(const auto &row : ia)
	for(auto col : row)
		std::cout << col << std::endl;
```

Of course, the base code would be:

```cpp
for(size_t i = 0; i != rowCnt; i++){
	for(size_t j = 0; j != colCnt; j++){
		std::cout << ia[i][j] << std::endl;
	}
}
```

### Pointers and Multidimensional Arrays

>[!NOTE] When you define a pointer to a multidimensional array, remember that a multidimensional array is really an array of arrays.

Because a multidimensional array is really an array of arrays, the pointer type to which the array converts is a pointer to the first inner array:

```cpp
int ia[3][4]; // array of size 3; each element is an array of ints of size 4
int (*p)[4] = ia; // p points to an array of four ints 
p = &ia[2]; // p now points to the last element in ia
```

>[!NOTE] The parantheses in this declaration are essential:
>
>```cpp
>int *ip[4]; // array of pointers to int
>int (*ip)[4]; // pointer to an array of four ints
>```
>

>[!warning] These are nice in terms of comparisons

```cpp
int ia[3][4] = { // three elements; each element is an array of size 4
		{0, 1, 2, 3}, // initializers for the row indexed by 0
		{4, 5, 6, 7}, // initializers for the row indexed by 1
		{8, 9, 10, 11} // initializers for the row indexed by 2
	};

	constexpr int rows = 3;
	constexpr int cols = 4;

	// 1. Range-based for loop
	for (int (&row)[4] : ia)
		for (int col : row)
			std::cout << col << " ";
	std::cout << std::endl;

	// 2. Regular for loop with subscripts
	for (int i = 0; i != rows; i++) {
		for (int j = 0; j != cols; j++) {
			std::cout << ia[i][j] << " ";
		}
	}
	std::cout << std::endl;

	// 3. Regular loop with pointers
	for (int (*row)[4] = std::begin(ia); row != std::end(ia); row++) {
		for (int *col = std::begin(*row); col != std::end(*row); col++) {
			std::cout << *col << " ";
		}
	}
	std::cout << std::endl;
```