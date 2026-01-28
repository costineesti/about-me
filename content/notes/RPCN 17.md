---
title: Global Navigation Satellite System (GNSS)
draft: false
tags:
date: 2026-01-28
---
 
Will make a page some time. Currently I will simply read the slides since I am pressed by time.

Work on PVT -- Position, Velocity, Time.

The architecture is divided in 3:

* Space Segment (Satellites)
* Control Segment (Control centers)
* User Segment (me?)

UWB relies on time-of-flight, just like lidar. Wi-Fi and BLE rely on existing infrastructure.

GNSS signals consist of a **Carrier** (radio wave): Radio frequency sinusoidal signal at a given frequency.

a **Ranging Code** (Pseudo-Random Noise or PRN sequences of 0s and 1s): which allow the receiver to determine the travel time of radio signal from satellite to receiver

and Navigation Data (ephemeris and clock info).

The satellites use **Phase Modulation(amplitude,frequency,phase) to encode this data**.

Each satellite shouts its own name, i.e. identification code => Pseudo-Random Noise (PRN) sequence.

Carrier phase-based positioning can have cm-level precision, while code-based positioning has a decimeter-level precision.

A key concept for the exam is 3D Trilateration: a receiver requires signals from at least **4 satellites** to calculate a unique 3D position because there are four unknowns (X, Y, Z coordinates and the receiver clock error).

**Ephemeris = the precise, real-time orbit and clock information of** **each satellite.**

* Contains **accurate position and velocity** information
* The receiver uses ephemeris to compute the **exact location of each** **satellite at the moment of signal transmission**, which is essential for accurate GNSS positioning (meter-level accuracy).

**Almanac = coarse orbit and status info for the whole** **constellation (all satellites).**

* **Almanac alone cannot give precise GNSS positioning** because it lacks high-accuracy orbital data.
* Contains **approximate** orbit data (less accurate than ephemeris)
* Used for **finding satellites**, not for precise positioning

**Doppler Effect**: When a wave source is moving relative to an observer, there will be a change in the observed frequency and wavelength.

**GPS alone**

* **Strengths:** High long-term accuracy; Absolute positioning
* **Weaknesses:** Signal blockage (indoors, urban canyons, tunnels), Low update rate; Vulnerable to multipath and interference

**IMU alone**

* **Strengths:** Works everywhere (no external signals), High update rate, Smooth motion estimation
* **Weaknesses:** Errors accumulate over time (drift), Position error grows rapidly

IMU (INS) provides short-term continuity during GPS outages. GPS corrects long-term IMU drift.

# GNSS-IMU Integration

1. **Loosely Coupled**: GNSS receiver is treated as a black-box. Only need PVT for Kalman Filter.
2. **Tightly Coupled**: integration fuses raw GNSS measurements (pseudorange, Doppler) directly with INS states, allowing for a solution even with fewer than 4 satellites
3. **Deeply Coupled**: combines **INS data directly with the GPS signal tracking loops** (code and carrier tracking), not just with measurements or positions. Even one good satellite signal has information value.

• What is the difference between GNSS, Galileo, and GPS?

* They float on different orbits.

• What is the input to and output from a GNSS receiver?

* The input to a GNSS receiver is the raw RF (Radio Frequency) signal received from the satellites via the antenna. The output, after processing, is the user's Position, Velocity, and Time (PVT)

• Explain 3D trilateration.

* 3D trilateration is the mathematical method used to determine a user's position in 3D space. It works by measuring the distance (range) from the user to known reference points (satellites). By solving a system of equations where the range is the distance between the known satellite coordinates (xs,ys,zs) and the unknown receiver coordinates (xr​,yr​,zr​), the receiver's position can be pinpointed

• How many satellites one needs to calculate a unique 3D position?

* You need a minimum of **4 satellites** to calculate a unique 3D position. This is because there are four unknowns to solve for: the three spatial coordinates (X, Y, Z) and the receiver's clock error

• How is a Galileo signal acquired? Hint: PRN

* A Galileo signal is acquired using its **Pseudo-Random Noise (PRN) code**, which is a unique identification code for each satellite . The receiver generates a local replica of the PRN code and correlates it with the incoming signal. Acquisition involves searching a "time-frequency window" to find the correct code shift and Doppler frequency that aligns the local replica with the received signal

• Which one is more accurate, code or carrier-based positioning? Why?

* **Carrier phase-based positioning** is more accurate, offering centimeter-level precision, whereas code-based positioning typically offers decimeter-to-meter-level precision . This is because the carrier wave has a much shorter wavelength (approx. 20 cm) compared to the code chips (approx. 300 m), allowing for much finer measurement resolution.

• What is the difference between loosely coupled and tightly coupled GNSS integration? Consider a fast-flying UAV.

* In a **loosely coupled** system, the GNSS receiver calculates a position solution (PVT) independently, which is then fused with the INS data; the GNSS acts as a "black box" . In a **tightly coupled** system, the raw GNSS measurements (pseudoranges, Doppler) are fused directly with the INS states. For a fast-flying UAV, **tightly coupled** is superior because it can maintain a position solution even when fewer than 4 satellites are visible (e.g., during banking turns or signal blockage), whereas a loosely coupled system would fail to provide a GNSS update in those conditions.


# Second part

**Dilution of Precision** (DOP) = the error propagation of navigation satellite geometry on positional measurement precision. Ah, I encountered this! I had a similar problem in [[seaclear|SeaClear]] with the setup of cameras. Basically, you want them at similar heights and at angles that are easy to compute to avoid positional errors. It's also more useful to observe a scene from different POVs.

* Multi-constellation techniques: Use more satellites to get better satellite geometry(solution to DOP).

**Error Sources**:

1. **Satelite Errors**: Includes orbital (ephemeris) errors and satellite clock inaccuracies
2. **Propagation errors**: As the signal travels through the atmosphere, the **Ionosphere** (upper layer with free electrons) and **Troposphere** (lower layer with weather) delay the signal. The ionospheric error depends on **frequency**, while the tropospheric error is **weather-dependent**. **Fixed by Augmentation**.
3. **Receiver errors:** Electronic noise inside the receiver degrades signal quality. Multipath Signals bounce off surfaces before reaching the antena => measure a longer path than the true line-of-sight signal. Solution to multipath is better antena placement.

 GNSS errors are often spatially correlated — nearby stations experience similar errors. 
 
 **Differential GNSS (DGNSS)**: if errors are estimated at one station, they can be shared with nearby stations, and the nearby stations can remove or reduce their systematic error sources.

**Differential GPS**: use pre-estimated terms and single differences. 

* RTK (Real-Time Kinematics) is a carrier-phased technique. RTK systems use a single base-station receiver and one or many mobile units
	* The base station re-broadcasts the phase of the carrier that it observes, and the mobile units compare their own phase measurements with the one received from the base station.


### Augmentation

The basic idea is: Static GNSS base station at a known location measures the signal flight time and calculates the atmospheric delay which is sent to users via 3G/4G.

Augmentation **accuracy** depends on the range between the base station and the rover station.

**Precise Point Positioning (PPP)**: **focused on estimating signal phase ambiguities**. Uses a single receiver (**no local base station**). It relies on precise orbit and clock data downloaded from a global network (like IGS) to correct errors. It can achieve centimeter-level accuracy but typically has a long convergence time (it takes a while to settle).

**Exam Questions**:

• What is the accuracy of standalone code measurements? and that of differential code measurements?

* **Standalone Code Measurements:** Typically offer an accuracy of **5–10 meters**. This is the standard accuracy for a basic receiver (like a smartphone) without any corrections.
* **Differential Code Measurements (DGNSS):** Enhance accuracy to the **sub-meter level** (typically **0.5 m – 1 m**). By applying corrections from a base station, most correlated errors are removed.

• What is the conceptual difference between standalone measurements and differential measurements?

* **Standalone Positioning:** The receiver operates independently. It calculates its position using only the signals received from satellites and models atmospheric errors using general broadcast parameters. It is subject to all full error sources (orbit, clock, atmosphere).
* **Differential Positioning:** Uses two receivers: a **Rover** (the user) and a **Base Station** (a reference receiver at a known, fixed location). The Base Station calculates the errors in the satellite signals (since it knows its true position, any deviation is an error) and transmits these **corrections** to the Rover. This technique relies on the principle that receivers close to each other experience similar errors (spatial correlation).

• How to apply differential corrections?

1. **Calculate Errors:** The Base Station calculates the "Range Error" for each satellite
2. **Transmit:** The Base Station broadcasts these range corrections to the Rover via a radio link or internet.
3. **Apply:** The Rover subtracts this correction value from its own measured pseudorange for that specific satellite _before_calculating its position.

• Briefly explain DOP. This I know -- poor geometry.

• List the errors affecting GNSS measurements. Hint: see equation below.

$$
\hat{\rho}_k = \rho_k + c[\delta t_u - \delta t^k] + I^k + T^k + \epsilon_u + M_u
$$

* $c[\delta t_u - \delta t^k]$ are the **clock errors**: Specifically, the receiver clock bias ($\delta t_u$)  and the satelite clock bias $\delta t^k$.
* $I_k$ is the **Ionospheric Delay**: This error depends on frequency and is caused by free electrons in the upper atmosphere.
* $T_k$ is the **Tropospheric Delay**. Signal delay caused by weather layers in the lower atmosphere.
* $M_u$ are the multipath errors caused by signals bouncing off surfaces (buildings, ground) before reaching the antenna.
* $\epsilon_u$ is the receiver noise. Thermal noise and internal measurement jitter of the receiver hardware.

• List four GNSS shortcomings, and briefly explain if and how can they be mitigated. I'll have to rely on talent on this one.

• If you need to survey an area with 0.5m, or 0.05m, horizontal position accuracy, which kind of GPS instrument and GPS measurement is required to get a sufficiently accurate position estimate?

* **For 0.5 m Accuracy:**
    - **Instrument:** A GNSS receiver capable of **DGNSS (Differential GNSS)**.
    - **Measurement:** Uses **Code-based** differential corrections. This removes enough error to reach sub-meter levels.
- **For 0.05 m (5 cm) Accuracy:**
    - **Instrument:** A Survey-grade GNSS receiver capable of **RTK (Real-Time Kinematic)**.
    - **Measurement:** Uses **Carrier Phase** differential measurements. The carrier wave (wavelength ~19cm) provides the precision needed for centimeter-level accuracy.


As a rule of thumb:

* if "close enough" is not good enough, then I need RTK. It uses **Carrier Phase** measurements.
* if I am in the middle of nowhere, use PPP since it has downloaded data
* a reliable option would be DGNSS for accuracy from 0.5 to 1m. Uses **Code measurements** instead of Carrier Phase.
* Standalone to find the nearest store.

Difference between Code measurements and Carrier Phase?

**Code Measurements (Pseudoranging)** use the **PRN codes** (the sequences of 0s and 1s) modulated onto the signal. The receiver measures the travel time by aligning its internal code replica with the received code. Since the "chips" (bits) of the code are physically long (about 300 meters for GPS L1), the measurement resolution is coarse, typically resulting in **meter-level accuracy**. This method is robust and unambiguous, meaning the receiver immediately knows its approximate distance to the satellite.

**Carrier Phase Measurements** discard the code and measure the alignment of the **carrier wave** itself (the 1.5 GHz radio sine wave). Because the wavelength of this carrier is extremely short (about 19 centimeters), the measurement resolution is much finer, allowing for **centimeter or millimeter-level accuracy**. However, this method suffers from **Integer Ambiguity**: the receiver can measure the fractional phase within one wave cycle perfectly but does not know the total number of full cycles (N) between the satellite and the receiver. This ambiguity must be mathematically solved (as in RTK) before high-precision positioning is possible, making it more complex and fragile than code positioning

Yeah this was a poor effort from me. I am not that attracted to this topic tho.