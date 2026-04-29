---
title: Classification (rename)
draft: false
tags:
date: 2026-04-22
---


NMS removes the low probability predictions (you see which bboxes overlap, and then select the one with the highest score).

# Two Stage Detectors

**Faster R-CNN**

It's a two-step classification. 1st stage would be having a image and applying convolutional layers on that => feature maps. 2nd step is a Region Proposal Network (we focus on regions with objects, not empty spaces) => proposals. Based on the proposals, we crop out the background and then train our classifier to classify the object. Q: how to unify such features and make the Region Proposal Network take another image of a different size and run the classifier on that.

How to get the proposals: the CNN extracts the features from the input image. nowadays they use pyramids archiecture (that's how they detect even small objects, they are able to adapt).  The idea: a small network slides over a conv. feature map that is the output by the last conv. layer.

ROI (Region of Interest) is a proposed region from the original image, multiple regions. For **ROI pooling**, we approximate the new values by integers (Always round down) i.e. quantization of coordinates on the feature map. However, we lose a bunch of data (the dark blue rectangle from the slide), yet we gain new data (the small green rectange).

A smarter solution though: **ROI align**: divide the original ROI into 9 equal size boxes and applying bilinear interpolation inside every one of them. This way, we don't need to find narrow or expand the ROI, and use the float values directly. 

reminder of max pooling: If you have multiple values in a 2x2 grid, then you take the largest one and discard the others. So the slide where I see 4 dots in each rectangle, I always select the highest value and store it in the final 3x3 ROIAlign result.

ROI Align is better usually per Prof's words.

# One stage Detectors

Of course, YOLO. It uses a single CNN network for both classification and localizing the object using bounding boxes. The input image is divided into $3 \times 3$ grid cells.

Formulating the process:

* If Y is $1 \times 8$ vector for 3 classes
	* $100 \times 100 \times 3$ => $3 \times 3 \times 8$
	* Corresponding to 9 cell results.
		* Make sure you understand that slide

>[!question] What if a gird cell wants to detect multiple objects?
>We can extend Y with the two anchor boxes => Y will be $1 \times 16$.

> Understand the idea with K-means based anchor boxes ?

# Fundamentals of Object Tracking

Understand the metrics.

Siamese Networks: 

Matching data for association:

* Mahalanobis Distance (motion similarity) -- you know it. revise it. make a page for it.
* Cosine Distance (appearance similarity)
* Hungarian Algorithm (we use this one in the assignment)

For MOT, I see some Deep SORT algorithm using Mahalanobis. I see some Kalman Filter for object detection? Sort these out.

In Track Management, we want to know whether the object appears constantly during consecutive frames.

As a problem definition, given:

* Detections: $D = \{d_1, d_2, \dots , d_m\}$
* Tracks: $T=\{t_1, t_2, \dots , t_n\}$
* Minimize cost matrix $C$ where $c_{ij}$ is the cost for assigning $d_j$ to $t_j$.

Assigning new detections to existing tracks by finding the best possible matches while minimizing a cost metric.

* IoU distance, e.g. L\_IoU = 1 - IoU
* Mahalanobis distance
* Appearance similarity.

The **Hungarian Assignment** solves the optimization problem of assigning each track a detection.

1. Subtract minimum entry from each row
2. same for the columns
3. draw minimum lines to cover zeros. All zeros.
4. create additional zeros by taking minimum entry not covered by lines and subtracting it from all uncovered entries (see the encircled 2). Then you repeat? Validate this.

>[!question]  What do we do if we have more detection than tracks or vice-versa?
>We insert dummy entries. After the assignment, **matches with dummy tracks will be unassigned detections and vice-versa**.

