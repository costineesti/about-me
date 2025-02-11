---
title: UVC Cameras
draft: false
tags:
  - SeaClear
---
 
sources: [1](https://www.e-consystems.com/blog/camera/technology/what-is-a-uvc-camera-what-are-the-different-types-of-uvc-cameras/)

I have to extract the timestamp from an ArduCam B0497 (USB 8.3 MP) for synchronization purposes inside [[SeaClear]]

### What is a UVC camera?

From ChatGPT: **UVCH / uvch264** is a term used to describe enhanced support for H.264 video streaming in UVC devices under Linux. While you can’t modify the camera’s internal clock or encoding in hardware, using uvch264 (or a similarly capable driver) ensures that the H.264 stream is handled optimally by your operating system.

UVC cameras (USB video class) are USB-powered devices that incorporate standard video streaming functionality and connect seamlessly with host machines (makes sense because of the USB which would mean no additional drivers). In my case, it's the latest version -- 1.5

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/uvc_blockdiag.png" style="max-width: 100%; height: auto;">
</div>

Need to check this for my ArduCam: https://docs.arducam.com/USB-Industrial-Camera/USB3.0-Camera-Shield-Plus/The-Guide-to-Hardware-Timestamp/#31-geting-the-current-timestamp-using-c

