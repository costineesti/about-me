---
title: Vision-in-the-loop Architecture
draft: false
tags:
date: 2026-05-21
---
 
We need to perform Design-Space Exploration for a vision-in-the-loop setup which detects an object and keeps it in the middle of the frame. However, we need to take several topics into consideration:

* ARM on Raspberry Pi $vs$ ARM on DE10-Nano
* Lattice ICE40 $vs$ Cyclone 5
* Software $vs$ Hardware
* Integer $vs$ Floating point precision in the control loop
* Development time $vs$ performance
* Source quality (RAW / JPEG / $\dots$) $vs$ required processing power

>[!summary] The current questions we should have an answer to are:
>
>1. The communication at the software side can be handled in different ways (polling, interrupts, etc) and how does this influence the performance?
>2. Measure interesting details of the implementation (speed, overhead, resource usage, etc), which can be used later on.

