---
title: Hidden Markov Models for PoS tagging and NER
draft: false
tags:
date: 2025-09-14
---
 
# Parts of Speech

Parts of speech are a way to divide words into categories: verbs are actions (“running”, “eating”, “thinking”, …), nouns are stuff (things, people, abstract concepts such as “eternity”), adjectives are qualities (“good”, “tall”, “white”, “loyal”), etc.

So the question is: How can the computer automatically annotate the PoS tags for a sentence?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/posexample.png" style="max-width: 100%; height: auto;">
</div>

# Markov Chains

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/markovchains.png" style="max-width: 100%; height: auto;">
</div>

* Probability of starting from rain: 0.4
* Probability of starting from snow: 0.3
* Probability of starting from sunny: 0.3

>[!question] Probability of the sequence *rain snow sunny rain rain?*
>$0.4 \cdot 0.1 \cdot 0.4 \cdot 0.3 \cdot 0.45 = 0,00216$

### Background

**Markov Assumption**: $P(q_i = a \mid q_1 \ldots q_{i-1}) = P(q_i = a \mid q_{i-1})$

$P(\text{rain} \mid \text{snow sunshine rain snow snow}) = P(\text{rain} \mid \text{snow})$

This expresses that the probability of the the next state is dependent only on the previous state, not on the entire history.

Let:

* $Q = q_1,q_2,q_3 ... q_n$ be a set of $N$ states
* $A = a_{11},a_{12} ... a_{n1} ... a_{nn}$ be a transition probability matrix with each $a_{ij}$ representing the probability of moving from state $i$ to state $j$. $\sum_{j=1}^{n}{a_{ij}} = 1$
* $\pi = \pi_1, \pi_2, ... \pi_n$ be an initial probability distribution over states. $\pi_i$ is the probability that the Markov Chain will start from state $i$. Also, $\sum_{i=1}^{n}{\pi_{i}} = 1$

>[!question] What if we are in a room with no windows and we cannot look at the weather outside, but we can feel the temperature?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/markovprob.png" style="max-width: 100%; height: auto;">
</div>

### Hidden Markov Models

$$
\text{tag}_1^n = \arg\max_{\text{tag}_1^n} \, P(\text{word}_1^n \mid \text{tag}_1^n) \, P(\text{tag}_1^n)
$$

This expression finds the most likely tag sequence $\text{tag}_1^n$ given a word sequence $\text{word}_1^n$.

P of a tag is **only** dependent on previous tag: $P(\text{tag}_1^n) \approx \prod P(\text{tag}_i \mid \text{tag}_{i-1})$

P of seeing a word is **only** dependent its PoS tag, not on previous words or PoS tags: $P(\text{word}_1^n \mid \text{tag}_1^n) \approx \prod P(\text{word}_i \mid \text{tag}_i)$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hiddenmarkovmodel.png" style="max-width: 100%; height: auto;">
</div>

- $C(\text{NN}, \text{dog})$ means “the number of times the word _dog_ was tagged as _NN_ (noun)” in the corpus.
- $C(\text{DT}, \text{NN})$ means “the number of times the tag _NN_ follows the tag _DT_ (determiner)” in the corpus.
- $C(\text{NN})$ means “the total number of times the tag _NN_ appears” in the corpus.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/examplehiddenmarkovmodel.png" style="max-width: 100%; height: auto;">
</div>

For the first, we take the initial probability of $DT = 0.5$ and $P(\text{tomorrow} \mid \text{DT})=0.1$. For the second, we see on the graph that $P(NN \mid DT)=0.8$ and $P(is \mid NN)=0$ and so on.

# Viterbi Algorithm

The Viterbi algorithm is a dynamic programming algorithm for finding the most likely sequence of hidden states in a Hidden Markov Model (HMM). 

| Tag | Obs1 *(tomorrow)*       | Obs2 *(is)*              | Obs3 *(another)*          | Obs4 *(day)*                |
| --- | ----------------------- | ------------------------ | ------------------------- | --------------------------- |
| NN  | $\textcolor{red}{0.16}$ | 0.0048                   | 0.00384                   | $\textcolor{red}{0.000245}$ |
| VB  | 0                       | $\textcolor{red}{0.096}$ | 0.0015                    | 0.000037                    |
| DT  | 0.05                    | 0.0016                   | $\textcolor{red}{0.0082}$ | 0.000101                    |

To compute the first column:

* $P(NN \mid \text{initial probs}) \cdot P(\text{tomorrow} \mid NN) = 0.4 \cdot 0.4 = 0.16$
* $P(VB \mid \text{initial probs}) \cdot P(\text{tomorrow} \mid VB) = 0.1 \cdot 0 = 0$
* $P(DT \mid \text{initial probs}) \cdot P(\text{tomorrow} \mid DT) = 0.5 \cdot 0.1 = 0.05$

>[!abstract] To compute the following columns:
>
>* **We don’t assume the previous tag**.
>* We calculate the **probability of each possible path** from the previous column
>* We **pick the one with the highest score** → this is the Viterbi step

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/viterbialg.png" style="max-width: 100%; height: auto;">
</div>

To compute the first value on the second column:

| Previous Tag | $P(\text{prev tag} \mid column)$ | $P(\text{curr tag} \rightarrow NN)$ | $P(is \mid NN)$ | P("is"                        |
| ------------ | -------------------------------- | ----------------------------------- | --------------- | ----------------------------- |
| NN           | 0.16                             | 0.3                                 | 0.1             | 0.16 × 0.3 × 0.1 = **0.0048** |
| VB           | 0                                | 0.4                                 | 0.1             | 0 × 0.4 × 0.1 = 0             |
| DT           | 0.05                             | 0.8                                 | 0.1             | 0.05 × 0.8 × 0.1 = 0.004      |

# How to decide if we're good at PoS tagging?

We need a measure of performance.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/measureofperf.png" style="max-width: 100%; height: auto;">
</div>

Ideas:

* Use techniques to deal with words that did not appear in the training corpus
* Use techniques that take into account the *next* words too
* Improve the annotation

# Named Entity Recognition (NER)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/NER.png" style="max-width: 100%; height: auto;">
</div>

* NER is more useful than POS tagging in many tasks (sentiment analysis towards a company or person, question answering, information extraction, …)
* However, it is a harder task than POS tagging, as in POS tagging, entities can be ambiguous:
	* <span style="color:green">[PER Washington] </span> was born into slavery on the farm of James Burroughs.
	* <span style="color:cyan">[ORG Washington] </span> went up 2 games to 1 in the four-game series.
	* Blair arrived in <span style="color:red">[LOC Washington] </span> for what may well be his last state visit.
	* In June, <span style="color:orange">[GPE Washington] </span> passed a primary seatbelt law.

* In POS tagging, each words get one tag. In NER, we need to **find** and **segment** the entities

### HMM for NER

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/HMMNER.png" style="max-width: 100%; height: auto;">
</div>

While HMM has been used for NER, it is not the most popular candidate; Conditional Random Fields and other models are better suited for the task.
### When is NER useful?

* classifying user intentions (e.g. when speaking to Siri/Alexa/Google Assistant: “add a meeting with <span style="color:green">Lorenzo</span> at <span style="color:cyan">15:45</span> at the <span style="color:red">Starbucks</span>”)
* detecting mentions of a product/company online, before extracting opinions and doing sentiment analysis on them
* and more ...

# How to decide if we're good at NER

$$
\begin{aligned}
\text{recall}    &= \frac{\text{correctly found entities}}{\text{all entities in text}}     = \frac{1}{3} = 33\% \\\\
\text{precision} &= \frac{\text{correctly found entities}}{\text{all found entities}}        = \frac{1}{2} = 50\%
\end{aligned}
$$

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/NERexampl.png" style="max-width: 100%; height: auto;">
</div>

We summarize these in one number, the F1 score, by taking their harmonic mean:

$$
F_1 = 2 \cdot \frac{\text{precision} \cdot \text{recall}}{\text{precision} + \text{recall}} = 2 \cdot \frac{\frac{1}{2} \cdot \frac{1}{3}}{\frac{1}{2} + \frac{1}{3}} = 0.4 = 40\%
$$

F1 score for state-of-the-art NER is ~94% on news (but only ~50% on social media)

