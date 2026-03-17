---
title: RELBot
draft: false
tags:
date: 2026-03-17
---
 
The robot which we need to use in my [[asdfr|Advanced Software Development for Robotics]] course.

<div class="encoder-section">
  <img src="../static/notes/relbot1.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li>differential-drive robot with two high-quality electromotors</li>
      <li>high-precision encoders on the motor axes</li>
      <li>right-handed orientation</li>
    </ul>
  </div>
</div>

# Structure of the RELBot

The brain is a Raspberry Pi 4B which presents a RTOS (XRF2, Xenomai 4 real-time operating system extension). It is only one core which can run real-time threads. It's usually core 1/3 (starting from 0). On the other 3 cores, we usually run ROS2 nodes (non RT). I guess it's only capable of firm real-time?

| **Relevant Parameter**  | **Symbol** | **Value** | **Unit**         |
| ----------------------- | ---------- | --------- | ---------------- |
| Mass                    | $m$        | 1.35      | kg               |
| Wheel diameter          | $d$        | 0.101     | m                |
| Gear ratio              | $n$        | 15.58 : 1 |                  |
| Motor Constant          | $K_m$      | 39        | rad/s /V         |
| Encoder                 |            | 1024      | counts per turn  |
| Encoder                 |            | 4         | pulses per count |
| Supply voltage (motors) | $V_{cc}$   | 12        | V                |

**CPS Structure**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/relbot2.png" style="max-width: 100%; height: auto;">
</div>

**Software Overview**

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/relbot3.png" style="max-width: 100%; height: auto;">
</div>

> I guess both are self-explanatory.

# Connection

ssh -X \<id\>@\<addr\>

# Interfacing

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/relbot4.png" style="max-width: 100%; height: auto;">
</div>

> If needed later, add the parameters and I/O from the manual. Also how to manipulate them.

# Firm Real-Time using 20-sim and XRF2

The **firm real-time** software realizes **the control laws, firm real-time safety, and drivers** to/from the mechatronics parts, in order to control the mechatronics of the RELBot. So the simulator replaces that mechatronics part.

>[!quote] Always use the RELBot Adapter node, as that node checks the validity of the steering signals.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/relbot5.png" style="max-width: 100%; height: auto;">
</div>


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