---
title: Constituency Parsing
draft: false
tags:
date: 2025-10-05
---
 
Parsing is the process of taking a string and a grammar and returning a parse tree for that string according to that grammar. 

Parsing strategies:

* Top down
	* Start with the top of the tree and expand the active node with all possible rules of the context-free grammar
* Bottom-up
	* Start at the bottom: the word /part of speech pairs given in the lexicon

# Cocke Kasami Younger (CKY) Parsing

>[!summary] CYK Parsing
>* Bottom-up parsing
>* Systematically fill in a table with solutions to the subproblems (so Dynamic Programming too)
>* First, we need to make sure the CFG is in a specific format: **CNF**

### Chomsky Normal Form (CNF)

>[!summary] CNF
>* CNF grammars are at most binary branching
>	* Max. 2 symbols on the right-hand side of any rule (so, not VP →V NP NP)
>* No mixing of non-terminals and terminals (= words!) on the right-hand side
>* No “unit productions”: rules that have one non-terminal on the right-hand side (VP → V)

Any CFG can be rewritten into Chomsky-Normal Form automatically.

### From Non-CNF to CNF Form: HOW?

* We introduce a new dummy non-terminals into the grammar so that A $\rightarrow$ B C D turns into:
	* A $\rightarrow$ X D
	* X $\rightarrow$ B C
* Unit productions: A $\rightarrow$ B and B $\rightarrow$ word turns into A $\rightarrow$ word

Where symbol X doesn’t occur anywhere else in the grammar.

>[!danger] Note to self: continue from slide 29

