---
title: N-grams Language Model and Text Classification
draft: false
tags:
date: 2025-09-13
---
 
This is a lecture from my Natural Language Processing Course at Twente. 

# Language Modelling

>[!NOTE] Language Modelling
>* is the task of predicting what words come next
>	* p(in | Please turn your homework) > p(the | Please turn your homework)
>
>* It also computes the probability of a sequence of words
>	* p(Please turn your homework in) > p(in Please homework turn your)
>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/google.png" style="max-width: 100%; height: auto;">
</div>

# Probabilities (very briefly)

Measure how likely an event is to occur or how likely a proposition is true. Probabilities of all possible alternatives add up to one

* Conditional probability: $p(a|b)$ -- the probability of $a$ given $b$
* Joint probability: $p(a,b)$ -- the probability of $a$ and $b$
	* if a,b are independent, then:
		* $p(a|b) = a$
		* $p(a,b) = p(a)p(b)$

### Chain rule of probability

$p(a,b) = p(a)p(b|a)$

# N-grams

please turn your homework ___

A **n-gram** is a chunk of n consecutive words.

* unigrams: “please”, “turn”, “your”, “homework”

* bigrams: “please turn”, “turn your”, “your homework”

* trigrams: “please turn your”, “turn your homework”

* 4-grams: “please turn your homework”

### Joint probability of words in a sentence

$$
p(w_1,w_2,w_3) \approx p(w_1| \langle s \rangle)p(w_2|w_1)p(w_3|w_2)
$$
or

$$
p(w_1,w_2,w_3) \approx p(w_1| \langle s \rangle, \langle s \rangle)p(w_2 \langle s \rangle,w_1)p(w_3|w_1,w_2)
$$

In general, we can approximate
$$
p(w_i \mid w_{1:i-1}) \approx p(w_i \mid w_{i-n+1:i-1})
$$

so that the probabilty of a sequence

$$
p(w_{1:n}) \approx \prod_{i=1}^{n} p(w_i \mid w_{i-n+1:i-1})
$$

### Maximum Likelihood Estimation

$$
p(w_i \mid w_{i-n+1:i-1}) = \frac{C(w_{i-n+1:i-1}, w_i)}{C(w_{i-n+1:i-1})}
$$

### Example

Given the following corpus of 3 sentences using the Maximum Likelihood Estimation

⟨s⟩ I am Sam ⟨/s⟩

⟨s⟩ Sam I am ⟨/s⟩

⟨s⟩ I do not like green eggs and ham ⟨/s⟩

$$

\begin{aligned}

p(\text{I} \mid \langle s \rangle) &= \frac{2}{3} = \textcolor{red}{0.67} \quad & p(\text{Sam} \mid \langle s \rangle) &= \frac{1}{3} = \textcolor{red}{0.33} \\\\

p(\text{am} \mid \text{I}) &= \frac{2}{3} = \textcolor{red}{0.67} \quad & p(\text{do} \mid \text{I}) &= \frac{1}{3} = \textcolor{red}{0.33} \\\\

p(\text{Sam} \mid \text{am}) &= \frac{1}{2} = \textcolor{red}{0.5} \quad & p(\langle /s \rangle \mid \text{Sam}) &= \frac{1}{2} = \textcolor{red}{0.5}

\end{aligned}

$$

And the probability of the sentence *I am Sam*:

$$
p(\langle s \rangle\ \text{I am Sam}\ \langle /s \rangle) =\ ?
$$

$$
\begin{aligned}

p(\langle s \rangle\ \text{I am Sam}\ \langle /s \rangle)

&= \textcolor{red}{p(\text{I} \mid \langle s \rangle)\ p(\text{am} \mid \text{I})\ p(\text{Sam} \mid \text{am})\ p(\langle /s \rangle \mid \text{Sam})} \\\\

&= \textcolor{red}{0.67 \times 0.67 \times 0.5 \times 0.5} \\\\

&= \textcolor{red}{0.11}

\end{aligned}
$$
### Breaking down why the examples give these values

In the first case, we compute the probability of starting a sentence with the word "I". In this case 2 out of 3 sentences start with it, therefore 0.67. Same for the second example.

In the second case, what is the probability of the word am following immediately after I? In 2 out of 3 cases we see this happenning, therefore 0.67 again. Same for the second example.

In the last 2 cases we only took the first 2 sentences into consideration. In the last example we are computing the probability of a sentence to finish with the word "Sam", therefore 0.5.

# Perplexity

What do those numbers in the example mean? How do we quantify? Where is the noise coming from?

The **perplexity** of a language model on a test set is the inverse probability of the test set, normalized by the number of words.

For set $W = w_1, \ldots, w_N$ : 

$$
PP(W) = p(w_1, \ldots, w_N)^{-\frac{1}{N}}
$$

$$
= \sqrt[N]{\frac{1}{\prod_{i=1}^{N} p(w_i \mid w_{i-n+1}^{i-1})}}
$$

* It decreases as model improves. REMEMBER to include sentence end-markers in the total count of word tokens $N$.
* It is only comparable for models with the same vocabulary.

# Out of Vocabulary Words

What about unknown words in the test set?

### Smoothing

if $p(w_{n-1},w_n) = 0$ at test $\rightarrow$ infinite perplexity on whole set. Zero probabilities make evaluation impossible.

Smoothing suggests:

* Slightly increase the probability of unseen instances
* Requires reducing the probability of seen instances
* Multiple approaches

### Laplace Smoothing

* Rough adjustment to MLE
* "add-one" smoothing

$$

p(w_i) = \frac{c_i}{N}

$$

$c_i = C(w_i)$, for brevity. How often $w_i$ occurs in the training data.

$N$ = number of words in the dataset.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/smoothing_1.png" style="max-width: 100%; height: auto;">
</div>


$$
p(w_i) = \frac{c_i + 1}{N + V}
$$


<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/smoothing_2.png" style="max-width: 100%; height: auto;">
</div>

* Define “adjusted counts” $c^*$ to keep denominator N (divide by N: probability)

$$
c^* = (c + 1) \cdot \frac{N}{N + V}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/smoothing_3.png" style="max-width: 100%; height: auto;">
</div>

* Define "relative discount":

$$
d_c = \frac{c^*}{c}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/smoothing_4.png" style="max-width: 100%; height: auto;">
</div>

* "add-k smoothing":

$$
p(w_i) = \frac{c_i + k}{N + kV}
$$

k = 0

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/k0.png" style="max-width: 100%; height: auto;">
</div>

k = 0.1

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/k01.png" style="max-width: 100%; height: auto;">
</div>

k = 1

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/k1.png" style="max-width: 100%; height: auto;">
</div>


# Backoff and Interpolation

As n increases, the number of possible n-grams increases exponentially. So the question is: can we use lower-order n-grams to estimate higher-order n-grams?

### Interpolation

* Mix the probability estimates from all the n-gram estimators (high to low until unigrams)
* Weighted average of different order n-gram probabilities:

$$

\hat{p}(w_n \mid w_{n-2}, w_{n-1}) =

\lambda_1 p(w_n \mid w_{n-2}, w_{n-1}) +

\lambda_2 p(w_n \mid w_{n-1}) +

\lambda_3 p(w_n)

$$

with $\sum \lambda_i = 1$.

*  n-gram-specific λ learnt on a held-out corpus.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/corpussplit.png" style="max-width: 100%; height: auto;">
</div>

### Stupid Backoff

* Recursively “back off” to a lower-order n-gram if we have zero evidence for a higher-order n-gram

**Problem**: for huge corpora (the web), it is hard to:

1. Store probabilities
2. Compute correct back-off weights

**Solution**: don’t compute probabilities and use a fixed weight

$$
S(w_i \mid w_{i-k+1:i-1}) =
\begin{cases}
\frac{C(w_{i-k+1:i})}{C(w_{i-k+2:i-1})} & \text{if } C(w_{i-k+1:i}) > 0 \\\\
\lambda S(w_i \mid w_{i-k+2:i-1}) & \text{otherwise}
\end{cases}
$$

# Text Classification

* **Binary**
	* Spam filter: spam or not spam
* **Multi-class**
	* Language identification: English, Thai, Italian, Chinese, Nepali,
	* Sentiment analysis: positive, negative or neutral
* **Multi-label**
	* Subject indexing
	* **Extreme Multi-label Text Classification** (XMTC) when there are thousands, or ten of thousands of candidate classes

### Classification Methods

Basically I would always choose supervised machine learning (Naive Bayes, Logistic Regression, Random Forest, etc.)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/supervised.png" style="max-width: 100%; height: auto;">
</div>

Normally a classifier expects a numerical input so what are the features? How do we identify features from text?

Types of textual features:

* Words: normalisation
* Characteristics of Words: captialisation (US vs us)
* Part-Of-Speech: nouns, verbs, etc
* Grammatical structure, sentence parsing
* Grouping similar words: {happy, merry}, numbers, dates
* n-grams: “ing,” “re”

### Binary Classification

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/binaryclass.png" style="max-width: 100%; height: auto;">
</div>

F1 measure:

$$
F_1 = \frac{2PR}{P + R}
$$

### Multi-class Classification

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/multiclass.png" style="max-width: 100%; height: auto;">
</div>

Confusion matrix for a three-class categorization task, showing for each pair of classes (c1,c2), how many documents from c1 were (in)correctly assigned to c2.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/multiclassexample.png" style="max-width: 100%; height: auto;">
</div>

precision $= \frac{tp}{tp+fp}$

* macro average precision $= \frac{.42+.52+.86}{3} = .60$
* micro average precision $= \frac{8+60+200}{(8+11)+(60+55)+(200+33)} = .73$

Always check whether your classes are balanced!

# Practical issues

Let's say I want to build a text classifier for real, but what should I do? Depending on the training data:

* no training data $\rightarrow$ manually written rules
* very little data $\rightarrow$ Naive Bayes
* reasonable amount of data $\rightarrow$ any clever classifier
* huge amount of data $\rightarrow$ high accuracy at high cost, simple method or deep NN