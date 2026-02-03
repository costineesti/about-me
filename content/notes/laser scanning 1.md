---
title: Laser Scanning and Point Cloud Processing
draft: false
tags:
date: 2026-02-02
---
 
This is lecture 1.

Accurate digital terrain levels using LiDARS in the NL. They want to upgrade the elevation of the country since they are 1/3 below sea level.

8th week -- oral reports on assignment. (Monday 30-3). Team up with Lars. Download the book chapters locally.

**Infra red light gets absorbed by water, it doesn't get reflected!** If it's turbulent water, then you do get some reflections.

https://www.ahn.nl/ahn-viewer : you can view the NL in point cloud measurements! Holy shitt

You measure the incoming relflection on the rising edge when it exceeds a set threshold!

How do you deal with echoes? How do you know which pulse is attributed to that echo? I solve it by slightly varying the intervals between emitted pulses. So, irregular intervals between emitted pulses => correct assocation.

Geiger-mode LiDAR receive an array of points that come from a certain direction (? search this). Photo diode with 4096 detectors => 200 milion points in one sec.

Single Photon LiDAR -- split beam into 10x10 beamlets and then process(?)

See accuracy for them. When you want to use each. For e.g. NL requires <5cm accuracy.

You can set speed limits for boats by measuring the waves levels. 

You want to tune the scan rate based on the pulse rate to get a good variety of the raspandire a punctelor.

Pulse Position Modulation -- see what that is

