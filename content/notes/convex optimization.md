---
title: Convex Optimization
draft: false
tags:
date: 2026-10-21
---
 
The curiosity came from [[ml 7|SVM]]. Explained nicely by [Steven](https://stevengong.co/notes/Convex-Optimization)

Convex Function: a real-valued function is called convex if the line segment between any two points on the graph of the function lies above the graph between the two points.

If you draw a line between any two points, it never dips below the graph itself

<div style="display: flex; justify-content: space-around;"> <div> <img src="../static/notes/ml34.png" alt="flow 1" width="350" height="300"> </div> <div> <img src="../static/notes/ml35.png" alt="flow 2" width="350" height="300"> </div> </div>

**Why that matters for optimization**: if a function is convex, it has **at most one** local minimum, and that local minimum is automatically the **global** minimum. There’s no way to get “stuck” somewhere worse, because there’s nowhere worse that looks like a minimum — the whole landscape slopes toward the single bottom.