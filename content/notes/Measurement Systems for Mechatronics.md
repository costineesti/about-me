---
title: Measurement Systems for Mechatronics
draft: false
tags:
date: 2026-11-03
---

Just some notes for my upcoming exam.

![[Pasted image 20261103141549.png]]

"Creep" = drift in output _under_ a steady, applied load. Silicon is highly valued in mechanical microsensor design because it acts as an almost perfect spring and exhibits virtually zero creep or hysteresis.

Noise = random errors. Some are systematic (we can account for them), and some are not (just random).

![[Pasted image 20261103141818.png]]

# 2. Micromachining

* Silicon is a really strong material, stronger than steel.
	* It doesn't deform, but it breaks when it's overloaded (it's "brittle").
* Monocrystalline silicon is an almost perfect spring, showing no hysteresis or creep, i.e., ideal material for sensors
* Photolithography is essentially a 2D process, making true 3D mechanical structures difficult to create.

![[Pasted image 20261103142552.png]]

# 3. Strain gauges and capacitive sensors

**Core transducer concepts**

* **Modulator Type Transducers**: 
	* no energy flow from one physical domain to the other; 
	* the blank energy flow in the receiving domain is modulated by information from the other domain 
	* e.g., resistive strain gauges
* **Generator Type Transducers**: 
	* transduction relates to an energy flow from one domain to another;
	* energy can be stored in the transducer. 
	* For these, the energy function is key to analyzing them.
	* e.g., capacitive, magnetic, and piezoelectric transducers

**Piezoresistive Strain Gauges**

Strain gauges are metal or semiconductor resistors bonded to a deforming structure, where deformation induces changes in resistance.

![[Pasted image 20261103152049.png]]

**Piezoresistive vs. Geometric Effect:** for semiconductor strain gauges, the piezoresistive effect is about 100 times larger than the purely geometric effect.

![[Pasted image 20261103152245.png]]

Strain gauges are typically connected in a Wheatstone bridge because it reduces temperature dependence and provides an output voltage directly proportional to the change in resistance

$$
V_{bridge} = \frac{\Delta R}{R} \cdot V_{supply}
$$
![[Pasted image 20261104104133.png]]

Stress and strain calculus:

* Stress $\sigma=\frac{F}{S}=E\cdot \epsilon$ is force per unit area
* Strain $\epsilon = \frac{dl}{l}=\frac{\sigma}{E}$ is relative elongation
* $E$ is Young's Modulus.
* The spring constant is $K = \frac{ES}{L}$

![[Pasted image 20261103152859.png]]
![[Pasted image 20261103152926.png]]


![[Pasted image 20261103153231.png]]

How to find the neutral line $v$?

Resistance is dependent directly to length and inverse to area.
![[Pasted image 20261104103928.png]]

Piezoresistivity: semincoductor strain gauges. Greek = to press. The silicon adds a 100x larger effect than metal (geometric effect).

# Capacitive Sensors

Capacitance of parallel plates is direct to area, and inverse to distance between the plates (the electrodes).

![[Pasted image 20261104103853.png]]

![[Pasted image 20261104104548.png]]

The displacement on the horizontal causes the overlap to increase on C2 and decrease on C1, so that's how we sense force in the inplane direction.

Some examples are microphones. something to do with the pressure change. Another one is the accelerometer.

![[Pasted image 20261104104855.png]]

Where the laser beam is, the top part is the mass with each finger attached to the mass. And each finger is in-between two fixed electrodes. If the red mass moves to the right, the capacitance of the green fingers increases, and the capacitance of the blue fingers decreases, since the distance is larger.

Capacitors are used for both actuation and detection. Example: Gyroscope

**Core transducer concepts**

* **Modulator Type Transducers**: 
	* no energy flow from one physical domain to the other; 
	* the blank energy flow in the receiving domain is modulated by information from the other domain 
	* e.g., resistive strain gauges
* **Generator Type Transducers**: 
	* transduction relates to an energy flow from one domain to another;
	* energy can be stored in the transducer. For these, the energy function is key to analyzing them.
	* e.g., capacitive, magnetic, and piezoelectric transducers

![[Pasted image 20261104105952.png]]

With this one, think that charge $q$ in electrical domain corresponds to displacement $x$ in the mechanical domain. And the same for voltage and force.

![[Pasted image 20261104130751.png]]

Again remember the transverse comb structure and the C = eps Area(A) / Displacement(x)

![[Pasted image 20261104132200.png]]

And the lateral comb.

![[Pasted image 20261104132440.png]]

piezoresistive sensors are more sensitive than metal sensors. The relative change in capacitance / resistance drives that.

# Force and pressure sensors



![[Pasted image 20261104151200.png]]

Optical readout: the LED in the center transmits the light coming from the reflective layer to the photodiodes. Therefore, if the surface is pressed upon, then the deformation will be caught by the reflective layer, and the photodiodes will catch that deformation.

![[Pasted image 20261104152143.png]]

Touch-mode sensor concept: the membrane actually touches the electrode, and tests have shown that we get a fairly linear characteristic of the Capacitance in relation to Pressure. Useful for example when you have car tyres and you don't want to measure the small pressures, but the tyre pressure around the values that we have.

![[Pasted image 20261104152514.png]]

With pressure sensors, the pressure is mostly felt by the resonator, as the ends want to rotate away from each other. The resonators are those small thin beams that connect one ridge to the other. Think also of a string of a guitar -- when we apply pressure, it vibrates. 

![[Pasted image 20261104153156.png]]
![[Pasted image 20261104153207.png]]

For thermal pressure sensors, the heat flow from the heater to the silicon substrate depends on the distance. And the temperature of the heater is a measure for the pressure. On the triangle graph, if there's no pressure, the measurements to the left and right should be equal. As soon as the pressure starts to come from one side, the air flow moves and so we can detect from which side and how much.

# Acceleration Sensors

![[Pasted image 20261104214905.png]]

![[Pasted image 20261104215100.png]]

Force feedback is applied so the mass is stable, at equilibrium. For example, if the mass moves and it enters oscillations, it will take time until it stops. So apparently we compensate with a closed loop.

![[Pasted image 20261104215257.png]]

* position sensing convert displacement to voltage
* the compensator reduces the shift for higher frequencies, because those tend to make the system oscillate.

![[Pasted image 20261104215758.png]]

It's used in this configuration for 3 reasons:

1. Differential change in capacitance from which we can obtain the position of the mass.
2. We can reduce the spring constant K to increase sensitivity => we get more displacement for a certain acceleration
3. We can apply bias voltages to the static fingers so we can apply a feedback force that really drives the mass back to the centre position.

![[Pasted image 20261104220216.png]]

![[Pasted image 20261104220301.png]]

![[Pasted image 20261104221021.png]]

The mass fluctuates on the crystal => electrical voltage. 

![[Pasted image 20261104221232.png]]

Piezoelectric accelerometers have reduced sensitivity for lower frequencies. 

![[Pasted image 20261104221328.png]]

If the deformation remains in the crystal, that causes reduction in sensitivity below a certain frequency i.e. leakage.

![[Pasted image 20261104231803.png]]

this counters the seismic noise.

![[Pasted image 20261104231911.png]]

Reducing the spring constant K increases the sensitivity => we get a larger displacement for a certain acceleration 

![[Pasted image 20261105121140.png]]

the hot bubble of air moves, and the two temperature sensors TC will understand from where. It is not that accurate, performance not that good. It is almost impossible to damage and accelerometer like this.

![[Pasted image 20261105121410.png]]

Piezoresistive readout is not that sensitive, so use it when you don't need high precision.

![[Pasted image 20261105121435.png]]

However, for high precision accelerometers, we find electron tunneling readout. The electrons can travel between the very narrow gap between the tip and proof mass. Sub nanometer displacement of the proof mass can be detected. Huge temp dependence + low freq drift make it not very usable.

![[Pasted image 20261105121745.png]]

The magnetic field between the two electrodes keeps the mass floating. Works only in theory. High noise.

# Gyroscopes

![[Pasted image 20261105132344.png]]

![[Pasted image 20261105144721.png]]

omega = angular velocity, v = linear velocity of the ball.

![[Pasted image 20261105145108.png]]

The farther away we are from the center of rotation, a higher velocity we need to stay in place.

![[Pasted image 20261105145420.png]]

In an angular rate sensor like this, we need a moving structure that moves away and towards the rotation axis. Then it has to adjust the velocity => the coriolis acc. 

![[Pasted image 20261105150436.png]]

It's always at least 2 masses that we need -- we need to distinguish the rotation from accelerations. Only one mass -- the coriolis motion could be mistaken for acceleration. They vibrate in opposite directions, then linear accelerations will have the same effect on both of them, so the Coriolis will have an opposite effect. the comb structures are used to electrostatically apply a force => we can generate the motion in the x direction, and if there's a angular velocity, we get the motion in the y direction.

If I understood correctly: in the case above the Force is applied from the z direction, and the masses move away and towards each other on the x axis. That leaves the linear velocity on the y axis.

- The **Drive Force** (from the comb structures) is applied along the **X-axis**, causing the masses to move towards and away from each other.
- The input **Angular Velocity / Rotation ($\Omega$)** is around the **Z-axis**.
- This specific combination results in the **Coriolis Force** pushing the masses along the **Y-axis**, which is what the sensor measures.

![[Pasted image 20261105152209.png]]
![[Pasted image 20261105152240.png]]

**How to increase the sense amplitude?**

* Increase the drive amplitude ($x_0$)
* Match the resonance frequency of the sense mode to the drive frequency
	* Gain equal to $Q$
	* Bandwidth reduced to $\omega_{drive} / Q$

![[Pasted image 20261105152807.png]]

Here the idea is as follows: You have the second order system on the left which you are trying to keep at its resonant frequency amplitude (the drive force causes it to vibrate). Then, the velocity together with the angular velocity ($\Omega$) activates the second order system.

![[Pasted image 20261105153122.png]]

There are 2 possibilities:

1. the resonant frequency of the sense mode is much higher so we are in the flat area of the response. It introduces shift.
2. we can tune the resonant frequency to be the exact same as the drive mode => we get the maximum amount of motion.

![[Pasted image 20261105153300.png]]

![[Pasted image 20261105153406.png]]

In the mode-split case we have 2/4 masses that are vibrating. In that case the drive and sense mode have completely different spring suspensions => hard to match the resonant frequencies. Sensitivity is low. Really small signals we need a large mass and low spring constant to get the highest detection amplitudes.

The ring type structure on the right deforms continuously in an electrical shape, since it's symmetrical in all directions. Bandwidth is decreased since we divide by the quality vector, but we gain sensitivity.

![[Pasted image 20261105153755.png]]

with 2 masses we distinguish angular velocity & linear acc. With 4 masses we can distinguish between angular velocity & angular acc.

![[Pasted image 20261105154643.png]]

To sense tilt, this structure has an electrode underneath, and with the capacitive combs we see, we detect movements along that axis too.

![[Pasted image 20261105154854.png]]

# Optical Sensors

![[Pasted image 20261105173951.png]]

![[Pasted image 20261105174145.png]]

![[Pasted image 20261105175352.png]]

![[Pasted image 20261105180708.png]]

Stimulated emission: 1 in, 2 out. As longs as the atom is excited. So we need to create a condition where most of the atoms are excited => produce double photons. 

LASER = Light Amplification Stimulated Emission of Radiation. Exactly the process above. 

![[Pasted image 20261105180840.png]]

The right mirror is partially reflective since we want some light to return into the system, and some light to get out of the system. The flashlamp excites it. 

![[Pasted image 20261105181207.png]]

Compared to a LED, the laser is very concentrated in one direction. The LED spreads the light randomly. We can also see the wavelength. The ends of the Semiconductor Diode Laser are polished so the light can reflect perfectly inside. 

![[Pasted image 20261105181328.png]]

![[Pasted image 20261105181422.png]]

With photodiodes, they start to conduct enormous amounts of current once we reach $V_F$ and they don't allow reverse current flow unless we reach a Breakdown point. 

![[Pasted image 20261105181539.png]]

![[Pasted image 20261105182421.png]]

You need to be with the curve in the green band or over it if you want to absorb light in the semiconductor. So that's somewhere around 100 $\mu m$?

![[Pasted image 20261105182728.png]]

A real photodiode lies below the ideal curve because not every absorbed photon produces a collected electron-hole pair, and not every incident photon is absorbed: there are reflection losses at the surface, absorption in inactive regions (e.g. the top contact or surface layers) where generated carriers recombine before being collected, and incomplete internal quantum efficiency, all of which reduce the responsivity below the ideal (100% quantum efficiency) value.

![[Pasted image 20261105183130.png]]

If we shine light in the middle, we expect to measure 4 identical currents. But If I move it towards one quadrant, then that signal gets much stronger than the other. So in electronics, we can steer/refocus the beam towards the middle. 

Image sensors have millions of this. We can use them to very accurately steer motors.

![[Pasted image 20261105183456.png]]

![[Pasted image 20261105184508.png]]

![[Pasted image 20261105184855.png]]

A small camera chip looks at the surface and sees some kind of contrast. That is a direct measure of the speed of the mouse. The LED makes it easy to distinguish the surface.

![[Pasted image 20261105185301.png]]

In all three there's a very small tip that goes over a surface and barely touching it. In the Atomic Force Microscope, we use a laser and a photodiode to readout the position of the sample tip.

![[Pasted image 20261105185447.png]]

Better than 1 $nm$ resolution in the height measurement of that tip. Because only very small rotations of that sample result in large distances on the photodiode. 

![[Pasted image 20261105190927.png]]

![[Pasted image 20261105191023.png]]

Never two consecutive changes. The electronic systems are not able to detect with that much accuracy. At least 2 0's in between.

![[Pasted image 20261105191229.png]]

![[Pasted image 20261105191324.png]]

When we see a hill with a laser, no light will reflect because half of the reflective face is out phase. If there's no hill, then all light gets reflected. For some reason the hill distance must be $\lambda/4$.

![[Pasted image 20261105191706.png]]

That's how they make the light/dark connection. By measuring which one of the beams has the higher intensity, we will know that we need steering correction. 

![[Pasted image 20261105191841.png]]

They use a cylindrical lens => the shape looks different depending on the case. And if the laser is out of focus, we know in which direction we need to steer from the shape. Again an application of the four-quadrant diode. 

![[Pasted image 20261105192057.png]]

# Flow Sensors and Controllers

![[Pasted image 20261105211837.png]]

![[Pasted image 20261105212317.png]]

![[Pasted image 20261105213055.png]]

![[Pasted image 20261105212451.png]]

Everything is stainless steel. The slits drop the pressure and increase the flow. The flow tube mesures flows up to 10mm/min. So we need to increase the flow rate. The split allows the 10mm/min to flow through the Sensor tube. We keep the split ratio always constant. That's done with the laminar flow elements -- tiny slits where each slit ~ 10 mm/min. So we can put additional 10 mm/min devices in paralel with the sensor tube => we can incease the flow rate by increasing the number of slits.

![[Pasted image 20261105213729.png]]

![[Pasted image 20261105215808.png]]

![[Pasted image 20261105213853.png]]

![[Pasted image 20261105214034.png]]

Using Wheatstone Bridge, we get an output differential voltage as a function of delta T (differential temperature). If we connect 10 thermocouples in series, we get 10 times the Seebeck coefficient. Thermocouples in series => Thermopiles. We use them to increase the amount of voltage per temperature. The nice thing with thermopiles is that we do not have offset issues.

![[Pasted image 20261105214732.png]]

![[Pasted image 20261105214947.png]]

In the middle of the chip we see a membrane -- a thinner region. Bottom right we have a cross-sectional view. In the middle of the membrane we apply the heater and to the left and right we have the sensors. When we apply power to the heater, in the middle there's the higher temp. And with flow we can detect the movement. We can see the thermopiles on the sides.

![[Pasted image 20261105220205.png]]

Because of the square root, it's not nice and linear. The gas type always needs to be known in advance so calibration can take place beforehand. I believe they reached linearity in the end which wins speed.

**Micromachined Coriolis mass flows sensors**

Coriolis is only dependent on the mass flow. 

![[Pasted image 20261105220553.png]]

This is the basic structure of a coriolis flow sensor. A loop structure which vibrates. When flow passes through, we get resulting vibration which is always a true measure of the mass flow.

![[Pasted image 20261105220713.png]]

Moreover, these sensors need to operate under vacuum conditions (packaging issues)

![[Pasted image 20261105221011.png]]

Again a loop, tiny tube. Let the tube vibrate. Two magnets => magnetic field. Applied alternating currents. When flow passes, the size of the tube will move according to the Coriolis force up and down. It's proportional to the massflow, independent of the properties of the gas or liquid. Apparently there's two capacitors and the time difference between the readings is the measure for the flow.

![[Pasted image 20261105221344.png]]
![[Pasted image 20261105221641.png]]

Does not need vacuum packaging. The quality vector of ~30 gives enough sensitivity. 

![[Pasted image 20261105221935.png]]

has 2 functions

1. actuate the flow tube at its resonance freq
2. readout the two capacitors with charge amplif. to obtain the flow sensor signal.

Coriolis sensors respond faster than thermal devices. Again, coriolis only measures mass flow!

![[Pasted image 20261105222747.png]]

The higher the mass, the lower the freq. The square root eq from above holds this.

![[Pasted image 20261105223819.png]]

![[Pasted image 20261105223924.png]]

The thermoflow sensor has a wheatstone bridge. We apply power to these heaters => temp will rise. In the middle will be the highest and symetrically temp will drop (delta t ~ 0 when no flow). One side will decrease, one will increase, and that delta T will be the measure for the flow.

![[Pasted image 20261105224002.png]]

![[Pasted image 20261105224034.png]]

Combinations of flow and other sensors

![[Pasted image 20261105224954.png]]

With Surface Channel Technology we can integrate many sensors on one chip. 

![[Pasted image 20261105225240.png]]

![[Pasted image 20261105225338.png]]

This enables us to calculate so much more. If we combine the eq. for coriolis and thermal sensor, we can get heat capacity. Coriolis + Pressure => viscosity.

![[Pasted image 20261105225522.png]]

With 4 types of info, we can solve 4 eq with 4 unknowns. We can solve how much of each gas/liquid is in the mixture. 

Wobbe index has strong correlation with viscosity from pressure+density+coriolis. From viscosity we can say something about the percentage of the inputs.

# Noise

Johnson

![[Pasted image 20261106083406.png]]

averaging out decreases the noise. The bandwidth term is the reason -- averaging out results in surpressing the high frequencies.

![[Pasted image 20261106084756.png]]

![[Pasted image 20261106085217.png]]

Shot noise occurs because the intervals of the individual photons are unevenly distributed.
![[Pasted image 20261106085511.png]]

It scales linearly with the square root of I_dc. Also white noise (no frequency). This noise is not dependent on temperature. So changing temperature makes it clear which one it is (Johnson or shot).

![[Pasted image 20261106085646.png]]

![[Pasted image 20261106085922.png]]

Some electrons block others. And so we see these impulses.

![[Pasted image 20261106090047.png]]

At high frequencies, it drops down with 1/f^2. At low freq it looks like white noise.

![[Pasted image 20261106090150.png]]

![[Pasted image 20261106090337.png]]

![[Pasted image 20261106090523.png]]

