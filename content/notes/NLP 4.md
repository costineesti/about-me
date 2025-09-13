---
title: Sentiment Analysis and Naive Bayes
draft: false
tags:
date: 2025-09-13
---

Sentiment analysis is the automatic detection of the attitude towards an object.

The best examples are **movie reviews** (is it negative or positive)?

>[!quote] It's actually quite surprising that it took such a long time for Hollywood to assassinate, pardon me, remake this very interesting story based on the 1971 Stanford prison experiment. The problem with this remake is that, as in most things Hollywood, it's all about big name actors and big fights and nice camera angles.

# Naive Bayes

**Input**:

* A document _d_ (of which we want to know the class/sentiment)
* A set of classes $C= {c_1, c_2, … c_j}$ -- in our case $C = {+, -}$
* A training set of _m_ hand-labeled documents $(d_1, c_1), (d_2, c_2), … , (d_m, c_m)$

**Output**:

* a learned classifier $y:d \rightarrow c$

>[!abstract] So it works like this:
>* What we want to know: $P(+ \mid d) > P(- \mid d)$
>* Bayes' Rule: $P(x \mid y) = \frac{P(y \mid x) \, P(x)}{P(y)}$
>* $\rightarrow$ $P(+ \mid d) = \frac{P(d \mid +)\, P(+)}{P(d)}$
>* What we want to know: $P(d \mid +)\, P(+) > P(d \mid -)\, P(-)$
>
>where:
>* $P(d \mid +) =$ likelihood of the document
>* $P(+) =$ Prior probability of the + class
>* $P(f_1, f_2, f_3, \cdots, f_n \mid +) =$ Likelihood of the document, represented as set of features (words and their positions).

# Bag-of-word model

The idea behind the ‘bag-of-word’ is that word order does not matter for text classification. This is obviously not true in all cases… but it is a useful simplification, and the results are often “good enough” in practice. However, there are still too many parameters. To further simplify the problem, we assume that features are **mutually** **independent** (e.g. reading ‘great’ in a review does not aﬀect the likelihood of reading ‘fantastic’ later on in the same review).

# Naive Bayes training

$$
P(f_1, f_2, f_3, \cdots, f_n \mid +)P(+)
$$

### How can we find $P(f_i \mid +)$ and $P(+)$

$$ 
P(+) = \frac{N_+}{N_{doc}}
$$

$$
P(f_i \mid +) = \frac{C(w_i, +)}{\sum\limits_{w \in V} C(w, +)}
$$

How many times does $w_i$ appear, out of all words that appear in positive documents? **This is a Language Model*

**What we want to know:** $P(+) \prod P(f_i \mid +) > P(-) \prod P(f_i \mid -)$  

Is “a good movie” positive or negative?

* $P(+) \, P(a \mid +) \, P(good \mid +) \, P(movie \mid +) = 0.041$
* $P(-) \, P(a \mid -) \, P(good \mid -) \, P(movie \mid -) = 0.034$

>[!question] What happens we need to estimate $P(f_i \mid +)$ for a word we have never seen before in the training set (e.g. the title of a new movie)?
>
>We can solve this by “boosting” all counts, e.g. with Laplace smoothing. We redefine Count as “Count + 1”
>
>$$
>P(f_i \mid +) = \frac{C(w_i, +) + 1}{\sum\limits_{w \in V} C(w, +) + |V|}
>$$

### Practical Issues of Naive Bayes

Irony, and especially sarcasm, can be challenging (for every sentiment analysis algorithm, not just NB):

* “Battlefield Earth saves its scariest moment for the end: a virtual guarantee that there will be a sequel.”
* “Valentine's Day is being marketed as a Date Movie. I think it's more of a First-Date Movie. If your date likes it, do not date that person again. And if you like it, there may not be a second date.”

---

$P()$ of a **chain of observations** quickly becomes a tiny number: $P(+) \prod P(f_i \mid +)$

$$

\begin{aligned}
P(+) &= 0.38 \quad & P(a \mid +) &= 0.12 \quad & P(very \mid +) &= 0.02 \\\\
P(movie \mid +) &= 0.10 \quad & P(good \mid +) &= 0.08 \quad & P(not \mid +) &= 0.02
\end{aligned}

$$

$P($not a very good movie$) = 0.00000021888$

Most computer languages cannot represent tiny numbers accurately. In Python:

$$
1/10 == 0.10000000000000001 \rightarrow True
$$ 
***Solution***: move everything to log space, where the logarithm of a product is the sum of the individual logarithms: Now we are only **adding** numbers, so they become easier to represent.

$$
\log\left(P(+) \prod P(f_i \mid +)\right) = \log P(+) + \sum \log P(f_i \mid +)
$$

---

>[!question] Ignoring word order means ignoring negation (“Contrarily to my expectations, it was **not bad** at all”). How can we fix this?
>* Can be mitigated with preprocessing, by adding a prefix to words after negation, until punctuation (e.g. “NOT_”).
>* The pre-processed text becomes “it was not **NOT_bad** **NOT_at** **NOT_all**”.
>* We expect that $P(NOT\_bad \mid +) > P(bad \mid +)$

>[!question] What if we have **too little data** to train our classifier eﬀectively?
> * Estimate word similarity (next week’s lecture) between unknown word and words we know about. Then assign the same weight as most n similar known words.
> * Use external information from a sentiment dictionary
> * $P(\text{pos\_lexicon} \mid +)\, P(\text{neg\_lexicon} \mid +)$ from the sentiment dictionary

>[!question] If “horrible” and “awesome” are not in training, P(horrible) == P(awesome) == ?
>* Use external information from a sentiment dictionary

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/sentimentdict.png" style="max-width: 100%; height: auto;">
</div>

# Why use Naive Bayes?

* It is very fast to train, and **very** fast to classify
* Low storage requirement: you only need to store 2 numbers per word in your corpus
* Works well with limited amount of features
* Robust to stop words and irrelevant features
* It is easy to interpret why a certain review/post/mail/etc. has been classified the way it is (by checking the contribution of each feature).

