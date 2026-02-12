---
title: Robotic Systems as specific Cyber Physical Systems
draft: false
tags:
date: 2026-02-10
---

First part was basically an introduction to control engineering, where you use the sensors to sense the world and compute new inputs for the robot through closed-loop or open-loop architecture.

**Layers in Embedded Control Software**

In the sequence control, i can just provide the way points. I can put it in a loop

I can put the control loop in another loop.

So the ticker functions could just call an interrupt. 

The encoder keeps sending a signal. You cannot afford to lose a count from it. Then the loop control (low-level control) should use some kind of interrupt. This is in case I don't want to miss that event.

* HRT (Hard real-time)
* FRT (Firm real-time) -- "I can tolerate a few missed deadlines, but not any more than $k$"
* SRT (Soft real-time)

**Model-driven Software Engineering in Robotics**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/modeldriven.png" style="max-width: 100%; height: auto;">
</div>

### 5 concerns that you need to pay attention to when building your software

1. **Computation**
	1. What functionality is computed? i.e. the **Algorithm**
2. **Coordination**
	1. When must components change their behavior?
3. **Configuration**
	1. What parameters define the behavior of all components?
4. **Composition**
	1. How are configurations, computations, communications, and coordinations interacting?
5. **Communication**
	1. How are results of computations being communicated?

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/gac.png" style="max-width: 100%; height: auto;">
</div>

