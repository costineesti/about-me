---
title: N-grams Language Model and Text Classification
draft: false
tags:
date: 2025-09-07
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