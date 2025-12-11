---
title: Loop Closure
date: 2025-09-11
draft: false
tags:
---
 
<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/bachelors/loop_closure.png" style="max-width: 100%; height: auto;">
</div>

You need loop closure to correct for the error when you do [[RPCN 6|SLAM]].

In practice, when a loop is detected, what this is doing under the hood is merely adding an edge to the Pose Graph.

There are multiple solutions:

* Identical positions (e.g. $x_6 = x_1$)
* Scan matching (similarity)
* Features -- not practical in real systems because it works in $O(N^2)$



