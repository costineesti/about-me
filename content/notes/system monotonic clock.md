---
title: System Monotonic Clock
draft: false
tags:
  - SeaClear
---
 
My brain works so well during the night it's frightening. Related to [[UVC Video Stream]], [[seaclear|SeaClear]].

>[!NOTE] Context:
>I was calling `v4l2-ctl --device=/dev/video5 --stream-mmap --stream-count=0 --verbose` in Ubuntu to see my ArduCam's timestamps and I saw ts: ~30000. I tried to restart the camera and see if the timestamps would reset from 0 and it was not the case. That's when it struck me that it must be Ubuntu's internal clock since I run from a VM. I restarted Ubuntu and the timestamps also reset and started counting from 0.

From ChatGPT: This suggests that the camera uses a **monotonic clock (CLOCK_MONOTONIC)** rather than resetting its timestamp counter on startup.

### How this affects synchronization with ROS

* **ROS timestamps (msg.header.stamp) use CLOCK_REALTIME**, which is based on the system's wall clock. [link to real-time unix clock](https://www.unixtimestamp.com)
* **Camera timestamps (ts) use CLOCK_MONOTONIC**, which is independent of system time and only resets when my VM resets. 
* This means I need to compute the time offset between these two clocks for accurate sync and add it to camera's clock.

>[!warning] MUST DO: Check on a dual-boot laptop with native ubuntu if the timestamps still start from 0 when starting the camera.
>Yes it does, the system boots so the clock does as well. Only ROS has a reference to unix time.

### Solution

```
cat /proc/uptime

37290.12 19827.45
```
The first value (37290.12) is the **CLOCK_MONOTONIC**.

```
date +%s.%N

1707501234.654321
```
This represents the **CLOCK_REALTIME**.

Now I only need to compute:
```
Offset = CLOCK_REALTIME - CLOCK_MONOTONIC
```

>[!question] So what exactly does /usb_cam/image_raw return?
>The timestamps in /usb_cam/image_raw (from sensor_msgs/Image) **are not** the camera’s hardware timestamps. Instead, they are assigned by ROS when the image is **received** by the node.

| **Source**                 | **Timestamp Source**        | **Clock Type**                    |
| -------------------------- | --------------------------- | --------------------------------- |
| `/usb_cam/image_raw`       | Assigned by ROS driver      | `CLOCK_REALTIME` (wall clock)     |
| `/dev/video5` (`v4l2-ctl`) | Assigned by camera hardware | `CLOCK_MONOTONIC` (system uptime) |