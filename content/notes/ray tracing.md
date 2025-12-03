---
title: Ray Tracing Through Water
draft: false
tags:
date: 2025-12-03
---
 
**Related**: [[seaclear|SeaClear]], [[coordinate frame|Coordinate Frames]]

I used this concept to determine the position of the underwater robot in a pool, while taking the refraction of the water into consideration. 

> With this, I converted a 2D pixel coordinates into 3D world points, accounting for light refraction at the air-water interface

I assumed

* World Frame: Origin at ArUco marker, Z pointing up
* Camera Frame: Origin at camera optical center

I get some nasty errors, likely due to the distortion parameters, since I implemented this refraction with the water. I could definitely see some improvements in the distances (especially around the edges of the FOV again).

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pool_edge.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pool_edge_plot.png" style="max-width: 100%; height: auto;">
</div>

>[!danger] Basically what happens: when I get to the edge of the FOV in the UsbCamera frame, I get some nasty drift (you can see in the plot image). I highly believe this is a problem because of the setup (I will make a page shortly on that -- how to ensure a good setup when working with multiple cameras) and also because of the poor quality of the ArduCam. Even though I calibrated with many decimals for the distortion, I still get that drift.

### Convert Pixel to normalized camera coordinates

```python
pts = np.array([[[pixel_x, pixel_y]]], dtype=np.float64)
x_n, y_n = cv2.undistortPoints(pts, K, dist_coeffs)[0,0]
dC = np.array([x_n, y_n, 1.0], dtype=np.float64) # not unit
d_air_W = camera_orientation @ dC
o_W = camera_center
```

* Take the raw pixel coordinates (**pixel_x, pixel_y**)
* Remove lens distortion with `cv2.undistortPoints` (performs the inverse)

$$
\mathbf{x}_n = (\text{pixel}_\mathbf{x}-c_\mathbf{x}) / f_\mathbf{x}
$$

$$
\mathbf{y}_n = (\text{pixel}_\mathbf{y}-c_\mathbf{y}) / f_\mathbf{y}
$$

* The intrinsic matrix maps 3D camera points to pixels: 

$$
K = \begin{bmatrix} f_\mathbf{x} &  0 & c_\mathbf{x} \\ 0 & f_{\mathbf{y}} &  c_{\mathbf{y}} \\ 0 & 0 & 1 \end{bmatrix}
$$

* $(\mathbf{x}_n, \mathbf{y_n})$ represents where a ray through that pixel intersects plane $\mathbf{z}=1$ in camera coordinates.
* `d_air_W` is the direction vector of a ray in world coordinates, starting at the camera center (`o_W`) and going towards the pixel, before refraction
* `camera_orientation` is the rotation matrix R from camera frame to world frame
* `camera_center` is the camera position in world coordinates from the ArUco detection. I got it by using [[rodrigues|Rodrigues' Rotation Formula]].

**Camera coordinate system**:

        Z (forward, into scene)
        ^
        |
        |    • (x_n, y_n, 1) <-- point on image plane
        |   /
        |  /
        | /
        o───────→ X (right)
       /
      ↓
      Y (down)

### Intersect with water surface (z=0)

```python
denom = d_air_W[2]
s0 = (0.0 - o_W[2]) / denom
if s0 <= 0:
	rospy.logwarn(f"Ray does not intersect water surface, or camera is below water surface, camera_z = {o_W[2]}")
	return None
I0_W = o_W + s0 * d_air_W
```

* `denom` is the **z** component of the ray
* `s0` $= \frac{0 - O_{W[2]}}{d\_air\_W}$ tells me how far I need to go along the ray to intersect the water surface plane **z** $= 0$
	* If `s0` $> 0$ => it's in front (valid)
	* If `s0` $< 0$ => it's behind (invalid)
* `I0_W` $= O_{W[2]} + s_0 \cdot d\_air\_W$ is the 3D intersection point of the incoming ray with the water surface plane (**z** $= 0$)

o_W (camera)
         \
          \  s0 = distance to water
           \
    ────────●──────────  z = 0
           I0_W

### Compute Refracted Direction Into Water

```python
n_surface_up = np.array([0.0, 0.0, 1.0])
d_in = d_air_W / np.linalg.norm(d_air_W)
d_wtr = self.refract_dir(d_in, n_surface_up, air_n, water_n)
```

* `d_in` is the unit direction vector of the ray in the air pointing towards `I0_W`
* `d_wtr` is the refracted ray inside the water computed with Snell's Law

AIR (n=1.0)
         \  θ₁ (incident angle)
          \
    ───────●─────────  surface
          /
         / θ₂ (refracted angle, smaller)
        /
    WATER (n=1.33)

### Intersect refracted ray with plane z = depth (coming from IMU)

```python
denom2 = d_wtr[2]
s1 = ((float(depth)) - I0_W[2]) / denom2
P_W = I0_W + s1 * d_wtr
```

* `denom2` is the **z** component of the refracted ray direction
	* If `denom2` $\sim 0$ => Ray parallel to water surface after refraction
	* If `denom2` $< 0$ => ray pointing downward into the water
* `s1` $= \frac{\text{depth[IMU]} - I0\_W}{d\_wtr\_Z}$ tells me how far along the ray to travel to reach plane at depth level
* `P_W` $= I0\_W + s_1 \cdot d\_wtr$ is the 3D world point on the ROV's depth plane that corresponds to the original pixel, AFTER refraction. **This is what I want to get**!! (==reference + direction * distance==)

─────────●───────────  z = 0 (X0_W)
              \
               \  d_wtr (refracted ray)
                \
                 ● P_W   z = depth

### Convert back to Camera Frame

```python
R_CW = camera_orientation.T
p_C = R_CW @ (P_W - o_W)
return p_C
```

* `R_CW` is the rotation matrix that takes a world point to express it in the camera frame. I will let the TF library from ROS to handle the conversion back to world.
* `p_C` is the 3D point in camera coordinates, which is then transformed to the ArUco marker frame by the `transform_point_to_world` function. We subtract `P_W - o_W` to get the relative distant from the camera to that exact point under water.

# Why refraction matters

What camera "sees" VERSUS **Actual position**:

      camera                    camera
         \                         \
          \                         \
    ──────●────  surface     ───────●────
           |                           \
           |  (straight line)           \  (bent ray)
           |                             \
           ● <-- wrong position           ● <-- correct position

The error increases with 

* depth
* viewing angle (rays at edge bend more)
