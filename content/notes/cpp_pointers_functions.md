---
title: C++ Pointers as function parameters
draft: false
tags:
  - notes
---

### Passing arguments by pointers

It's actually getting easier understanding these concepts.
```cpp
void reset(int *ip)
{
	*ip = 0; // changes the value of the object to which ip points
	ip = 0; // changes only the local copy of ip; the argument is unchanged
}
```

After a call to `reset`, the object to which the argument points will be 0, but the pointer argument itself is unchanged:

```cpp
int i = 42;
reset(&i); // changes i but not the address of i.
```

### Passing arguments by reference

Operations on a reference are actually operations on the object to which the reference refers.

```cpp
int n = 0, i = 42; 
int &r = n; // r is bound to n (i.e., r is another name for n) 
r = 42; // n is now 42 
r = i; // n now has the same value as i 
i = r; // i has the same value as n

void reset(int &i)
{
 i=0; // changes the value of the object to which i refers
}
```

### Using reference parameters to return additional information

A function can return only a single value. However, sometimes a function has more than one value to return. Reference parameters let us effectively return multiple results.

```cpp
// returns the index of the first occurrence of c in s 
// the reference parameter occurs counts how often c occurs 
string::size_type find_char(const string &s, char c, string::size_type &occurs) 
{ 
	auto ret = s.size(); // position of the first occurrence, if any 
	occurs = 0; // set the occurrence count parameter 
	for (decltype(ret) i = 0; i != s.size(); ++i) 
	{ 
		if (s[i] == c) 
		{ 
			if (ret == s.size()) 
				ret = i; // remember the first occurrence of c 
			++occurs; // increment the occurrence count 
		} 
	} 
	return ret; // count is returned implicitly in occurs 
	}
```

Here, this functions returns the the first occurrence of `c` inside `s` and it also saves the number of times this function is iterated through incrementing `occurs`. This way, we can get more information out of a function.

### Array Reference Parameters

```cpp
// ok : parameter is a reference to an array; the dimension is part of the type
void print(int (&arr)[10])
{
	for (auto elem : arr)
		std::cout << elem << std::endl;
}
```

>[!NOTE] The parantheses around &arr are necessary:
>```cpp
>f(int &arr[10]) // error: declares arr as an array of references
>f(int (&arr)[10]) // ok: arr is a reference to an array of ten ints
>```

### Passing a Multidimensional Array

In C++ there are no multidimensional arrays. Instead, there are array of arrays.

```cpp
// matrix points to the first element in an array whose elems are arrays of ten ints
void print(int (*matrix)[10], int rowSize) { /* .... */ }

// equivalent definition
void print(int matrix[][10], int rowSize) { /* ..... */ }
// declares matrix to be what looks like a two-dimensional array. In fact, the parameter is a pointer to an array of ten ints.
```

### Interesting difference

```cpp
int& get(int* arry, int index) { return arry[index]; }
int main() {
	int ia[10];
	for (int i = 0; i != 10; ++i)
		std::cout << (get(ia, i) = i) << std::endl;
}
```

What this does, it affects `ia` directly! If the header would be `int get (...)` , then it would only work with a local copy of it and not be able to change ia directly.
This I like.
