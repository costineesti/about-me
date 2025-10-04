---
title: Vector Semantics and Embeddings
draft: false
tags:
date: 2025-10-04
---
 
This is Lecture 5 from my [[NLP|Natural Language Processing]] course.

# Transitioning to Word Meaning

>[!NOTE] So far:
>* n-grams $\rightarrow$ predict next word from sequence of tokens
>* Naive Bayes $\rightarrow$ classify using word counts/probabilities
>* POS/NER $\rightarrow$ assign symbolic categories to words
>
>Limitations:
>* Model knows dog $\neq$ cat, but not that they're similar
>* No notion of synonymy, antonymy, or relatedness

We want our models to understand that:
* buy, sell, pay are related through events (**similarity**)
* happy and sad are opposites (**relatedness**)
* coffee and cup co-occur in real life (**connotation**)

# Vector Semantics

It's used to define meaning by linguistic distribution: look at its neighbouring words or grammatical environments

>[!summary] Foundations
>* Words are represented as points (vectors) in some multi-dimensional space
>* Word vectors are generally called embeddings
>* Semantically similar words are mapped to nearby points, that is “are embedded nearby each other"
 >* A desirable property: proximity in the vector space $\rightarrow$  semantic similarity/relatedness

### Words as Vectors

#### Term-document matrix

Each document is represented as a count vector (a column) and each word is also a vector (a row)! The dimensionality depends on context

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/termdoc1.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/termdoc2.png" style="max-width: 100%; height: auto;">
</div>

#### Term-term matrix

In this case words are both rows and columns. Each cell records the number of times the row (target) word and the column (context) word co-occur in some context in some training corpus. The dimensionality is $|V| \times |V|$.

# Cosine for measuring similarity

>[!question] How do we calculate the similarity (or distance) between word vectors?
> Cosine similarity measures the similarity in the direction or orientation of the vectors, ignoring differences in their magnitude or scale.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cosinesim1.png" style="max-width: 100%; height: auto;">
</div>

$$
\textit{similarity}(\mathbf{v}, \mathbf{w}) = \cos(\theta) = \frac{\mathbf{v} \cdot \mathbf{w}}{\|\mathbf{v}\| \|\mathbf{w}\|} = \frac{\sum_{i}^{N} v_i w_i}{\sqrt{\sum_{i}^{N} v_i^2} \sqrt{\sum_{i}^{N} w_i^2}}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/cosinesim2.png" style="max-width: 100%; height: auto;">
</div>

# TF-IDF: Weighing terms in the vector

Raw frequency alone is not a reliable measure of association between words, as it can be skewed and lacks discrimination power.

We need to balance two important constraints:

* Words that frequently co-occur within a given context are more significant than those that only appear a few times.
* Co-occurrences with highly frequent words are less informative and should be down-weighted accordingly.

>[!NOTE] TF-IDF weighting
>* Term frequency $tf_{t,d}$
>		$tf_{t,d} = count(t,d)$ or $tf_{t,d} = log_{10}(count(t,d) + 1)$
>* Inverse document frequency $idf_t$
>		$idf_t = log_{10}N$, where $N$ is the total number of documents, and $df_t$ is the number $df_t$ of documents the term $t$ occurs in.
>* TF-IDF weight $w_{t,d} = tf_{t,d} \times idf_t$

Long and sparse vectors do not model synonyms. Sparse vectors may not capture the similarity between words that have either as neighbours (e.g. *car* and *automobile*).

Because of this reason, we define short and dense vectors.

# Short and Dense Vectors
## Latent Semantic Analysis (LSA)

>[!summary] Global co-occurrence count-based method
>* Based on statistics of how often some word co-occurs with its neighbour words in a large text corpus
>* Dimensionality reduction methods (SVD or Random Projection)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/LSASVD.png" style="max-width: 100%; height: auto;">
</div>

We keep the truncated matrix T as the word embeddings

Using the dense vectors for similarity computations:
* Typically gives better results (filter out noise)
* Faster

## Word2Vec

>[!summary] Local context predictive method
>* Instead of counting, train a classifier on a binary prediction task: is word $w1$ likely to show up near $w2$?
>* a simple task: binary classification instead of word prediction
>* a simple architecture: logistic regression instead of multilayer neural network
>* no need for human labels

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/word2vec.png" style="max-width: 100%; height: auto;">
</div>

### Word2Vec: Skip-gram(context representation: better coverage of rare words) + Negative sampling(training method: more intuitive)

>[!summary] The Skip-Gram classifier
>* Train a probabilistic classifier that, given
>	* a test target word t,
>	* its context window of L words $c_{1:L}$,
>
>assigns a probability based on how similar this context window is to the target word
>
>* This classifier gives a reasonably high probability estimate to all words that occur in the context
>	* Lower probabilities to noise words (negative examples)

>[!summary] Intuition
>1. Treat the target word and a neighbouring context word as positive examples.
>2. Randomly sample other words in the lexicon to get negative samples.
>3. Use logistic regression to train a classifier to distinguish those two cases.
>4. Use the regression weights as the embeddings.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/word2vec2.png" style="max-width: 100%; height: auto;">
</div>

The goal is to train a classifier, such that, given a $(t,c)$ pair, assigns the probability:

* $P(+ \mid t, c)$: the probability that c is a real context word of t
* $P(- \mid t, c) = 1 - P(+ \mid t, c)$: the probability that c is not a real context word of t

The probability for one context word

$$
P(+ \mid t, c) = \sigma(t \cdot c) = \frac{1}{1 + e^{-t \cdot c}}
$$

Assuming all L context words $c_{1:L}$ are independent

$$
P(+ \mid t, c_{1:L}) = \prod_{i=1}^{L} \sigma(t \cdot c_i)
$$
$$
\log P(+ \mid t, c_{1:L}) = \sum_{i=1}^{L} \log \sigma(t \cdot c_i)
$$

The sigmoid function turns the dot products into probabilities.

### Skip-gram Loss function

Consider one positive example $(t,c)$ with its $k$ noise words, $n1,...,nk$, the learning objective is to minimise this loss function $L_{CE}$:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/skipgram.png" style="max-width: 100%; height: auto;">
</div>

One step of gradient descent:

1. Shift the embedding of the target word *apricot* towards that of the real context word *jam*
2. Shift the embedding of the target word *apricot* away from that of the noise word *Tolstoy*

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/skipgram_graddesc.png" style="max-width: 100%; height: auto;">
</div>

As a result:

* Words that share many contexts get close to each other
* Contexts that share many words get close to each other
* Represent each target word as a d dimensional vector $\rightarrow W_{|V| \times d}$
* Represent each context word as a d dimensional vector $\rightarrow C_{|V| \times d}$

# Bias in word embeddings

Word embeddings can reflect gender, ethnicity, age, sexual orientation and other biases of the text used to train the model.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/wordembed.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] Here comes the riddle
>A man and his son get into a terrible car crash. The father dies, and the boy is badly injured. In the hospital, the surgeon looks at the patient and exclaims, “I cannot operate on this boy, he is my son!”

The idea from the riddle above is that our brains would usually associate *surgeon* with a *men* profession. The surgeon in this case is the mother.

