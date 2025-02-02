---
title: Camera Calibration
draft: false
tags:
  - notes
  - robotics
  - perception
  - ros
  - SeaClear
---
 
Source: [ofc he's indian (:](https://youtu.be/MrKYawVvHzE?si=9rApZNVidjKgmf-9)

I have an Arducam B0497 (USB3 8.3MP) which I want to calibrate using a 7x9 checkerboard that I downloaded at www.calib.io. The size is 7x9 with a Checker Size of 20mm. Because the algorithm counts the interior vertex, the size parameter needs to be passed as 8x6.

* First, I had to check what video stream sources I have on Ubuntu through `ls \dev\video*`. It returned something like this:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/ls_video.png" style="max-width: 100%; height: auto;">
</div>

* Second, I call `v4l2-ctl --device=/dev/video6 --all` in the terminal to see what device it represents. For example, video 0 and 1 come from my iPhone's camera, video 2 and 3 come from my MacBook camera, etc.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/check_source.png" style="max-width: 100%; height: auto;">
</div>

* Third, I run `gst-launch-1.0 v4l2src device=/dev/video6 ! videoconvert ! autovideosink` to check the stream and quality.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/stream.png" style="max-width: 100%; height: auto;">
</div>

* Fourth, I go and modify video_device at `sudo nano /opt/ros/noetic/share/usb_cam/launch/usb_cam-test.launch` with `/dev/video6`.
* Fifth, I open 2 new terminals and I call `roslaunch usb_cam usb_cam-test.launch` and `rosrun camera_calibration cameracalibrator.py --size 8x6 --square 0.02 image:=/usb_cam/image_raw camera:=/usb_cam` to run the camera_calibrator ROS package.