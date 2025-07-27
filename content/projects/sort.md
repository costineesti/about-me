---
title: Simple Online and Real-Time Tracking
date: 2025-05-17
draft: false
tags:
  - SeaClear
  - perception
---

Sources: [this paper](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.researchgate.net/publication/307516256_Simple_online_and_realtime_tracking&ved=2ahUKEwjByvyP96WNAxUORfEDHTKkGqIQFnoECD4QAQ&usg=AOvVaw0-SPKfv0v9_k_cz0wvJ8K4) with [code attached](https://github.com/abewley/sort)

# Mission: Multiple Object Tracking (MOT)

According to [1], only detections from the previous and the current frame are presented to the tracker. Also, appearance features beyond the detection component are ignored in tracking and only the bounding box position and size are used for both motion estimation and data association. Furthermore, issues regarding short-term and long-term occlusion are also ignored, as they occur very rarely and their explicit treatment intro-duces undesirable complexity into the tracking framework.

They argue that incorporating complexity in the form of object re-identification adds significant overhead into the tracking framework – potentially limiting its use in realtime applications.

>[!note] Mentioned methods
>Convolutional Neural Network (CNN) based detector, 
>
>Kalman Filter and Hungarian method are employed to handle the motion prediction and data association components of the tracking problem respectively.

