---
title: GoPro Livestream
draft: false
tags:
  - SeaClear
---
 
#### Mission: Adding timestamps to GoPro footage and using it in ROS.

Sources: [This response on official community support](https://community.gopro.com/s/question/0D53b00008BtdkiCAB/date-time-stamp?language=en_US), [another community question](https://community.gopro.com/s/question/0D53b00008HOPq7CAH/how-do-i-add-timestamp-to-hero-10-videos?language=en_US), [adding overlay](https://gopro.github.io/labs/control/overlays/), [firmware update](https://gopro.github.io/labs/install/)

Update Firmware tutorial: https://github.com/gopro/labs/tree/master/docs/install

>[!NOTE] Add an Overlay to Video
>link: https://gopro.github.io/labs/control/overlays/
>Here I can overlay HH:MM:SSaa on the real-time footage.

>[!CAUTION] UTC Date And Time
>link: https://gopro.github.io/gpmf-parser/
>PRO: There is a field in the metadata that could give the time format in ms.
>Look into **[gopro-telemetry](https://gopro.github.io/OpenGoPro/python_sdk/index.html#summary) (Python)** or **[gpmf-parser](https://gopro.github.io/gpmf-parser/) (C library)**.
>CON: Only in postprocessing can I access this data.
