---
title: Abstract Syntax Tree
draft: false
tags:
  - "#notes"
---
 
### How does the compiler make sense of my code?

The information is gathered from this [link](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ast.png" style="max-width: 100%; height: auto;">
</div>

During my implementation of the [[Shunting yard algorithm]], I used `tokens` to split the function expression into *operators, numbers, functions, etc.*.

The steps involved in the picture above are:
* The source code is first split into smaller chunks called `tokens`.
* The tokens are then parsed into a tree called the syntax tree by the `parser`.

For example, this is how I declared the tokens inside my `token.hpp`:

```cpp
enum TokenType { NUMBER, VARIABLE, OPERATOR, FUNCTION, LEFT_PARAN, RIGHT_PARAN};
struct TokenData{
	TokenType type;
	std::string value;
	TokenData(TokenType t, const std::string &expr): type(t), value(expr) {}
};
```

>[!NOTE] An `Abstract Syntax Tree` is an intermediate representation of source code as a tree structure.
>One case of this is the `Binary Tree` which is simply a tree where a node can not have more than 2 children. In this case, the nodes would be `operators` and the leaves would be `operands`.

So I will:
* Parse the RPN (Reverse Polish Notation) into a tree structure where each node represents an operation (add, multiply, sin, cos..),
* Traverse the AST and apply differentiation rules recursively,
* Simplify the result,
* Evaluate the Derivative.
