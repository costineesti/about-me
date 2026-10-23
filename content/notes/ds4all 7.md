---
title: DS Project -- yet to name
draft: false
tags:
date: 2026-10-23
---

**General rules:**

* Open challenge: deep scope and focus
	* Make it clear what the scope is
* Apply at least one primary topic from [[ds4all|Data Science]].
	* Data exploration
	* Data preparation, cleaning, feature extraction specific to modalities
	* Deal with issues: missing data, feature selection, class imbalance, etc.
	* Develop a predictive model (e.g. classifier)
	* Evaluate the model (data sets, metrics, comparison between methods)
* Show critical attitude towards data & results. Show domain & data understanding in cleaning as well as interpretating results, drawing conclusions & recommending
	* Anticipate questions, provide some interesting insights.
	* Recommendations should be **actionable**
		* What do you recommend target audience to do given this outcome?
		* Tie it back to the beginning
	* Usually there are trade-offs: **benefit vs. cost, computation power, computation time**
	* Draw clear conclusions.
* Go beyond what you have learned in the topics (VAE from [[genai|GenAI]])

**Presentation**: 

* 10 min presentation + 2 min questions
* Audience: 'upper management', lower data literacy
	* i.e. don't go too much into detail, you will lose them.
	* What does this audience want/need to know?
	* How to explain to people without much DS knowledge?
	* How to convince people with data?
		* What data/results will help make my point?

**Sell the story**: set-up -> conflict -> resolution

Bing, Bang, Bongo approach for the key messages:

**Bing**: Tell your audience what you’re going to tell them

**Bang**: Then you tell it to them

**Bongo**: Then you summarize what you just told them

**Visually**: aesthetic, consider making baselines grey, highlight the start and end if it's the case, bar charts, 

1. Remove chart border
2. Remove grid lines
3. Remove data markers
4. Clean up axis labels
5. Label data directly
6. Leverage consistent color

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_33.png" style="max-width: 100%; height: auto;">
</div>

What I would like to do: Use the [CIFAR-10](https://cave.cs.toronto.edu/kriz/cifar.html) dataset. Make it clear that images can be expensive for computation since they amount to a lot (take the size, resolution, etc.). Sell this story. Come with one of the architectures applied in my project in GenAI and see how I can come up with a much more efficient way of doing things. I still need to decide what I want to predict -- most likely the class.

CIFAR-10 consists of 60k 32x32 colored images in 10 classes, with 6k images per class. There are 50000 training images and 10000 test images

* The classes are mutually exclusive.
	* i.e. no leakage

The archive contains the files data_batch_1, data_batch_2, ..., data_batch_5, as well as test_batch.

Loaded in this way, each of the batch files contains a dictionary with the following elements:

- **data** -- a 10000x3072 numpy array of uint8s. Each row of the array stores a 32x32 colour image. The first 1024 entries contain the red channel values, the next 1024 the green, and the final 1024 the blue (RGB format). The image is stored in row-major order, so that the first 32 entries of the array are the red channel values of the first row of the image.
- **labels** -- a list of 10000 numbers in the range 0-9. The number at index _i_ indicates the label of the _i_th image in the array **data**.

The dataset contains another file, called batches.meta. It too contains a Python dictionary object. It has the following entries:

- **label_names** -- a 10-element list which gives meaningful names to the numeric labels in the **labels** array described above. For example, label_names[0] == "airplane", label_names[1] == "automobile", etc.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ds4all_34.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] reminder to myself to include 2-3 examples in the presentation as well. Always assume they know nothing about the topic.

