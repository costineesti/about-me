---
title: Machine Learning Paradigms
draft: false
tags:
date: 2026-05-30
---

>[!NOTE] ML Paradigms
>
>* **Supervised Learning** -- Learning from labeled data e.g. "deer", "dog", $\dots$
>	* **Classification**, **Regression** ("what's the hair density of this deer in hairs per sqm?"), **Object Detection**, **Semantic Segmentation**, **3D Reconstruction**, **SLAM**
>	* **Evaluation metrics** include: overall accuracy, precision-recall, IOU, RMSE
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod1_1.png" style="max-width: 100%; height: auto;"> </div>
>
>* **Unsupervised Learning** -- Learning patterns and structures from examples in the abscence of explicit supervision.
>	* **Data representation**, **Clustering**, **Dimensionality** **Reduction**, **Anomaly** **Detection**
>	* **Evaluation metrics** include: Silhouette score, Davies-Bouldin index, Reconstruction error, Anomaly score (e.g. distance from a centroid)
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod1_2.png" style="max-width: 100%; height: auto;"> </div>
>
>* **Semi-supervised Learning** -- harness both labeled and unlabeled data
>	* **Challenges**: cost and time requirements, labeling bias, scarcity of labels, dynamic nature of the data
>	* **Network intrusion detection**, **Medical image segmentation**
>	* **Techniques**: Pseudo-labeling, Consistency regularization, Self-training vs co-training
>
><div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/fmod1_3.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/fmod1_4.png" alt="flow 2" width="350" height="150"> </div> </div>
>
>* **Self-supervised Learning** -- generate supervisory signals from input data and designing pretext tasks.
>	* **Spatial or temporal relationships**, **data transformations** (i.e. generative modeling, image colorization), **Depth estimation from stereo images**
>	* **Techniques**: Generative ([[genai2|Autoencoders]]), Contrastive ([[CLIP]]), Adversarial ([[genai2|GANs]])
>	* **Techniques**: 
>		* **Value-based** (learn values)
>			* Implicit policy (e.g. $\epsilon$ greedy),
>		* **Policy-based** (no values)
>			* Learn policy
>		* **Actor Critic**
>			* learn values, learn policy
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod1_5.png" style="max-width: 100%; height: auto;"> </div>
>
>* **Reinforcement Learning** -- The main difference to the other methods is that this technique is **rather active than passive**, and the **interactions are often sequential**.
>	* Learning is **goal-oriented** with possibility to learn **without examples** of optimal behavior.
>	* Optimization of some **reward signal**, feedback is **evaluative** which represents goodness/preference rather than corectness.
>
>*Machine learning paradigms govern how learning algorithms learn from data and make predictions or decisions*
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/fmod1_7.png" style="max-width: 100%; height: auto;"> </div>
>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/fmod1_6.png" style="max-width: 100%; height: auto;">
</div>

Self-supervised learning is at the intersection of all three circles -- Supervised, Unsupervised, Reinforcement Learning.

* It borrows the **label structure** from supervised learning (but generates its own labels from the data)
* It learns **representations without human labels** like unsupervised learning
* It uses **feedback signals** to guide learning, similar to reinforcement learning (idk about this one)

>[!question] What is the difference between **validation** and **test** **sets**?
>
>The **validation set** is used to tune model parameters and prevent overfitting during the development phase, while the **test set** acts as an unbiased, final evaluation to measure how well your finalized model will perform on completely unseen data.



<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>