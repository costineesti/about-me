---
title: Rodrigues' Rotation Formula
draft: false
tags:
  - SeaClear
  - perception
---
 
Sources: [1](https://www.youtube.com/watch?v=-TUTqVOGSa8&list=PLbMVogVj5nJSyt80VRXYC-YrAvQuUb6dh&index=15) [2](https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula) [3](https://stevengong.co/notes/Axis-Angle-Representation)

I stumbled upon this when checking my [[camera calibration]]. I could see that depending on the angle of the camera upon the X axis, a stationary ArUco mark would fluctuate a lot on it's Z-axis position. This is related to [[camera backward projection]], [[seaclear|SeaClear]]. 

The issue was fixed through Rodrigues' Rotation Formula in opencv:

```python
rmat, _ = cv2.Rodrigues(rvec)  
rmat_inv = rmat.T  
tvec_inv = -np.dot(rmat_inv, tvec.T)  
rvec_inv, _ = cv2.Rodrigues(rmat_inv)  
return rvec_inv, tvec_inv.T
```

So, I want to document this algorithm and see what exactly it does and why it fixed the issue. From what I understood, it succeeds in computing the camera pose [[camera backward projection]] and not the ArUco marker's pose. (I could definitely phrase that better)

>[!warning] TO DO!

