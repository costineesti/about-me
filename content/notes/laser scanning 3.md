---
title: Mobile Laser Scanning (MLS)
draft: false
tags:
date: 2026-02-09
---
 
MLS combines

* Laser scanner for 3D data acquisition
* GNSS/IMU for positioning and orientation
* Platform (car, boat, UAV, backpack)
* Cameras for visual context (optional)

Add the application for each to the bullet points, you have in slides

The key advantage is the continuous data collection while moving $\rightarrow$ dense, accurate 3D data at ground level. The key challenge is the sensor fusion and the drift that accumulates.

The range is smaller, since we are close to the scenes, so we also have better point density distribution.

**MLS vs. ALS vs. TLS** (Complete these with the slides)

Again, based on TOF (time of flight)

$$
range = \frac{c(t_2-t_1)}{2}
$$

**Multi-return capability**: One pulse can generate 2-5 returns $\rightarrow$ Essential for vegetation penetration (it's the idea that the waves could scatter when they hit some surfaces and then they reflect back. you know it, the idea with the airport as well with gnss and clouds).

Multi-beam lidars are mostly used in autonomous driving because they are cheaper. Single-beam is mostly used when you need high-quality point cloud. 

**Multi-beam spinning LiDARs**

VLP-16 is for example cheaper and it offers bad **point density** distribution. (attach the image) 

Pandar 40P is mostly used in autonomous driving because it assigns some importance to the direct horizontal view, but also up and down.

# Point Density Calculation Framework

So we know the LiDAR has the Emitter and a rotating mirror. What happens then is the beam successfully reflects the beams in a 2D circular manner. 

We talk about driving direction and scan profile(the green one). Each time the mirror rotates a little bit, we get to the next point position (the red dots). We can calculate the point spacing.

$$
d_{\text{along}} = v / f_{scan}
$$

so we calculate the distance along the profile.

The pulse frequency tells how many lidars emissions per second there are. 

>[!example]
>1
>* The platform drives at 50 km/hr
>* The lidar does 100 full rotations each second => 100 Hz
>* In 1 second we expect to get 1 million returns => Pulse frequency of 1MHz
>* We consider the range to target as 100m.
>1
>Therefore, $d_{\text{along}} = \frac{13.89(m/s)}{100Hz} = 0.14m$.
>1
>And then $d_{\text{across}} = \frac{2 \pi \cdot 100(m) \cdot 100(Hz)}{1000000Hz}$ ...

Some characteristics of MLS is that it varies in point density. It depends on multiple key factors:

1. Range Dependency
	1. Ofc, you can keep the speed constant, but in real-life it's not highly realistic.
2. Speed Dependency
3. Occlusions
4. Scan angle

You can calculate what factors you need to have a set point density $\rho$.

>[!example] How many points per $m^2$ are needed to detect a 5cm height difference from the road to the pedestrian walk?

**Advantages**:

* Excellent vertical surface coverage (building façades)
* 360 degrees data (with multiple scans)

**Disadvantages**:

* 

YOU CAN COMBINE MLS AND ALS into one combined point cloud. MLS could see the traffic lines very well, and the ALS could complete the roof of buildings, crowns of trees, etc. To match them, you need to go to the 3D bird-eye-view projection of the MLS and then match the features with the pov of the ALS (done in practice).

look over the questions: https://app.wooclap.com/XFXFMA/questionnaires/69899832cb269fc22c653f64. You have the pictures saved on your desktop.

What is survey grade? What's the difference to mapping grade? Is it the precision?

We can down-sample the point cloud? Does that mean I always want as much as possible and discard what I don't need?

Remember from [[RPCN 17|Global Navigation Satellite System (GNSS)]] that if you are between two tall buildings, the GNSS signal bounces a lot between them until it reaches my terminal. This is one of the disadvantages in MLS.

UAV-based MLS are handy in powerline inspection. I guess it's not ALS since the point density is not as bad ($\rho \sim 50-200points/m^2$)

How does LiDAR deal with transparent windows? 

* They create outliers. Pretty much an edge case for LiDARs. Look over it more because his explanation made pretty much no sense.

How does LiDAR see text on a plate?

* is it intensity based?




Look over the exercise provided by Ville

* Reading material: Puente, I., González-Jorge, H., Martínez-Sánchez, J., & Arias, P. (2013). Review of mobile mapping and surveying technologies. _Measurement_, _46_(7), 2127-2145. [link]([http://www.academia.edu/download/45787001/Review_of_mobile_mapping_and_surveying_t20160519-2012-1tzfhbo.pdf](http://www.academia.edu/download/45787001/Review_of_mobile_mapping_and_surveying_t20160519-2012-1tzfhbo.pdf))

