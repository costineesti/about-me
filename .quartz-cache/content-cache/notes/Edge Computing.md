---
title: Edge Computing
date: 2025-04-10
draft: false
tags:
  - robotics
  - perception
  - notes
---
 
A friend introduced me to [Axelera.ai](https://axelera.ai): a Netherlands-based startup specializing in the development of high-performance, energy-efficient artificial intelligence (AI) hardware and software solutions, particularly for edge computing applications.

>[!question] So what exactly is edge computing?
>From ChatGPT: Edge computing is a distributed computing paradigm that brings computation and data storage closer to the location where data is generated. This approach reduces latency, enhances processing speeds, and decreases bandwidth usage by minimizing the need to transmit data to centralized servers. It’s particularly beneficial for applications requiring real-time data processing, such as Internet of Things (IoT) devices, autonomous vehicles, and industrial automation.

My main domain of interest is computer vision. And so, I am very curious how I could accelerate such tasks. Source: [this blog](https://xailient.com/blog/what-is-edge-computer-vision-and-how-does-it-work/)

>[!question] What is Edge Computer Vision?
>* So we covered the fact that Edge Computing is basically moving computational processes much closer to the data source.
>* Computer Vision is basically detecting different objects/features in a picture or video stream.
>* To me, it really comes down to `real-time decision-making`.

From what I understand, it looks like it means running those algorithms (let's say object detection) directly on the devices (camera for example) rather than relying on cloud-based processing. This way, you're not affected by poor network connection or latency. Also, it's as close to real-time as possible.

Final conclusion: Embedded with AI - that's where the future is headed :)