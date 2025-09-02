---
title: Systems Engineering
draft: false
tags: 
date: 2025-09-03
---
# Course Intro

Systems Engineering is a compulsory course I have to pursue in my Robotics Master's at Twente. It's taught by dr. ir. Geert Folkertsma. I really like it because I feel it goes in depth into how anyone who wants to be in a management position (who calls the shots) should think.

Reference material: Applied Systems Engineering book - ISBN 978-1-921138-13-3

>[!quote] Systems Engineering is....
>
>a transdisciplinary and integrative approach to enable the successful realisation, use and  
retirement of engineered systems, using systems principles and concepts, and scientific,  
technological and management methods.

Basically, it aims to prevent errors from failures arising from complexity, (mis)communication and (mis)understanding and people that do it would argue it's something that you learn by doing.

For example, a question that could be asked during this course is:

>[!question] What is the difference in the life cycle of an EUV lithography machine by ASML, and an electric car by Lightyear? considering design, production and use?
>
>Low-volume vs. high-volume sales, so non-recurring engineering costs have to be earned back (amortised) over 20 machines vs. 2000 cars.

>[!abstract] The life of a system
>1. **Idea** - Guide dogs are difficult to train. Can't we make a robotic replacement?
>
>2. **Design** - A white cane with vision and wheels that can steer the person in the right direction
>
>3. **Production** - Cost should be less than $10.000
>
>4. **Use** - Hardware should last > 5 yrs; regular software updates for new functionalities
>
>5. **Retirement** - Recycling??

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/linearvscircularlifecycle.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Questions we should ask about the system
>* What are the needs?
>
>* Who is going to use it?
>
>* Who else has an interest on the system?
>
>* What are the constraints of the system?
>
>* What is the business case?
>
>* When is the system good enough?

And so we divide it in 4 phases:
1. Pre-acquisition - why do they want this?
2. Acquisition - in this phase the systems engineer is the most active, but they will focus on the whole lifecycle.
3. Utilisation - how does the operation work?
4. Retirement - what happens at the end?

Then—
1. Conceptual design: what? 
2. Preliminary design: how? 
3. Detailed design: how to keep everything aligned? 
4. Production: integration plan, verification.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/acqphase.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/leftshift.png" style="max-width: 100%; height: auto;">
</div>

Left shift is making early design choices with the later phases in mind, hoping to prevent integration issues, by identifying potential issues early on and making changes when that is still easy and cheap.

# V-model

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vmodel.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vmodel_geert.png" style="max-width: 100%; height: auto;">
</div>

So my professor thinks we should always, **ALWAYS** look at the big picture. It's not a process, but a model.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/vmodel_mapping.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Some Systems Engineering experts have defined the 'extended V-model’. How does this correspond to the V-model and lifecycle as used in this course?
>
>This suggests that the V-model is a process, which it is not. In this course, we consider the utilisation and retirement as lifecycle phases, which may impact the design or lead to requirements, which have their own place in the normal V-**model**.
# Summary

>[!abstract] Summary
>**System life cycle** - to consider the whole life of the system, from conception to retirement
>
>**Systems Engineering process** - to break up the design, top-down, to improve the chance of a working system.
>
>**V-model** - a way to talk about the hierarchy of the system and its design.

