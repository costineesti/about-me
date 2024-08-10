---
title: Proportional-Derivative Control
draft: false
tags:
  - projects
---
 This [[control]] was mainly used in my bachelor's degree project in order to adjust the angle of the servomotor so that the ego was situating itself in the middle of the road.
 
 <div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../public/static/bev_err.png" style="max-width: 100%; height: auto;">
</div>

The proposed feedback loop is in the following picture:

 <div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../public/static/struct.png" style="max-width: 100%; height: auto;">
</div>

The [[Derivative]] term needed a [[Pass-Down Filter]] in order to make it implementable on a microcontroller because the derivative suggests the future (improper system). Of course, the pass-down filter adds a -20 [dB\dec] slope where the "s" term introduces a +20 [dB\dec] slope and as such getting a 0 [dB\dec] slope at the end.

 <div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../public/static/derivativ.png" style="max-width: 100%; height: auto;">
</div>

