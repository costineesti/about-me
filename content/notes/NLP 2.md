---
title: Words and Tokens
draft: false
tags:
date: 2025-09-03
---
 
This is a lecture from my Natural Language Processing Course at Twente. 

# Tokenization

A token is usually a word instance. For tokenization in languages like English, we get pretty far by splitting on white spaces and punctuation. It can be done with simple regular expressions (regex).

For languages such as Chinese or Japanese (no white spaces between the characters) this approach doesn't work.

>[!NOTE] Corpus (plural: corpora)
>Computer-readable collection of text (or speech). It often involves making lists of words / counting words.

* The larger the corpus (more tokens N), the more word types we find (bigger vocabulary V).
* Ratio between N and V depends on
	* Text length
	* Language

### Example of Token/type ratio: Finnish vs English

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/finnishvsenglish.png" style="max-width: 100%; height: auto;">
</div>

Let's take the finnish word `kahvinjuojallekin`

`kahvi` + `n`+ `juo` + `ja` + `lle` + `kin` (coffee + of + drink + -er + for + also 'also for \[the\] coffee drinker’)


# Morphology

**Morphology** = study of word structure

Words consist of one or more morphemes (lower = low + er)

Each word consists of at least a stem (or root: is a word on it's own. for example, “drink”) and zero or more affixes (not a word on it's own: for example, “er”)

# Word formation: inflection

* Creates forms of the same word; word class does NOT change.
* The word forms share the same dictionary entry: **lemma**

Examples:
* plural forms of nouns: train / train==s==
* verb conjugation: work / work==s== / work==ed==

Inflection always applies to all (regular) words in a given word class (to all nouns, to all verbs, to all adjectives, etc.)

# Lemma / lemmatization

* **Lemma**: base form or dictionary entry of a word (the word’s stem)
* **Lemmatization**: doing morphological analysis of a word – breaking down the word into its morphemes – to determine its stem

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/morphological.png" style="max-width: 100%; height: auto;">
</div>

# Word formation: derivation

* Not always applicable to all words in a word class
* Meaning changes (beyond plural or tense) – different lemma!
* Word class can change (often but not always)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/derivation.png" style="max-width: 100%; height: auto;">
</div>

# Word formation: compounds

Stem + stem (+ stem (+ stem (+ stem …))), most frequently nouns

* Common in languages such as Dutch and German
* Can be applied recursively:
	* coffee table
	* coffee table book
	* coffee table book cover
	* coffee table book cover design

In English, compounds are often written with a space between them – ==this makes it tricky to identify them==

German example: Finanzdienstleistungsunternehmen

# Compound or derivation

>[!question] Psychotherapist
>a psycho and a therapist?

* -able, -ful(l), psycho-, under- are morphemes that function as ==suffixes== and have corresponding lexemes(=words)

# Summary

*  `Inflection`: word stem + affixes, <u>same</u> lemma: ==walk, walks, …==
*  `Derivation`: word stem + affixes, <u>different</u> lemma: ==walk, walker, …==
*  `Compounding`: combining multiple words: ==homework, sidewalk, … ==

Also:

*  `Cliticisation`: contraction; word plus clitic (shortened word): ==we’re, don’t, …==
