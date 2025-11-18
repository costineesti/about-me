---
title: Budgets, money & decision-making
draft: false
tags:
date: 2025-10-29
---
 
Lecture 7 from my [[Systems Engineering]] class.

# Uncertainty and Margins

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/margins.png" style="max-width: 100%; height: auto;">
</div>

* The margins are not repeated or assumed: be explicit.

* Complex budgets arise because of:
	1. error
	2. bandwidth
	3. range
	4. time

* Life-cycle costs:
	* development costs
	* production goods
	* operational goods
	* decommissioning goods

# Project Management Triangle

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pm_triangle.png" style="max-width: 100%; height: auto;">
</div>

>[!quote] Good, fast, cheap. Choose two.

# Who gets to make the decisions?

>[!summary] RASCI
>* Responsible (does the work to complete the task)
>* Accountable (reviews and approves the task)
>* Supportive (helps complete the task)
>* Consulted (provides input)
>* Informed (kept in the loop)

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/rasci.png" style="max-width: 100%; height: auto;">
</div>

In short, the one with more responsibility makes the decisions. The PM usually has more power, but the SE has more influence.

>[!question] What is the difference between accountable and responsible?
>* Your head will roll vs. you must make it happen

>[!summary] Steps
>1. Define the question
>2. Get the options
>3. Evaluate
>4. Choose & Record
>5. Monitor implementation & outcome

### Pugh Method

**Idea**: Comparing options on (weighted) criteria to select the best.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pugh_1.png" style="max-width: 100%; height: auto;">
</div>

* Others include
	* Decision Tree
	* Belief decision matrix
	* Minimax / Maximin

>[!NOTE] From Claude AI
>* Decision trees: best for analyzing decisions that unfold over time where each choice leads to different branches of possibilities
>* Pugh for comparative design evaluation. Good for engineering design selection where you need to systematically evaluate how different options stack up against each other on various attributes. Less focused on risk, more on relative performance.
>* Decisional balance sheets for multi-stakeholder qualitative decisions. Useful for complex decisions with social, ethical, or organizational implications where you want to weigh pros and cons across different dimensions
>* Maximin: for each option, you look at the worst-case scenario, then choose the option whose worst case is the best among all worst cases
>* Minimax: this is used when you're risk-averse but focused on avoiding the worst possible _regret_ rather than the worst outcome (how badly you'd feel if you made the wrong choice)
>* Belief decision matrix: this helps when dealing with uncertainty but you have some basis for estimating likelihoods, unlike minimax/maximin which assume complete uncertainty

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pugh_2.png" style="max-width: 100%; height: auto;">
</div>

In the example above; at first glance most people would incline towards electric motors. But the sheet analysis (together with Pugh) makes it clear that hydraulics is actually better for the budget, constraints and overall attributes that we have / need.

>[!question] What is <u>scope creep</u>?
>* Slowly making the system bigger/more complex than the initial plan.

>[!question] Which step of the decision-making process can be done via design space exploration?
>2. Getting the options

