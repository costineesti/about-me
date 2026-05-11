---
title: PWM Module in Verilog
draft: false
tags:
date: 2026-05-11
---
 
I was provided the datasheet for the `Automotive fully integrated H-bridge motor driver` (**VNH2SP30-E**).

The assignment is to design and develop a PWM module. It has to provide three output signals:

1. `INA (Pin 5)` and `INB (Pin 11)` which provide the direction
2. `PWM (Pin 8)`. The pins are provided by Table 3.

The **implementation follows Table 12** from the datasheet.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/table12_hbridge.png" style="max-width: 100%; height: auto;">
</div>

So for forward: `INA=1, INB=0`. For backward: `INA=0, INB=1`.

Some design choices:

- **Maximum PWM frequency: 20 kHz** (Table 9) — so 20 kHz is actually the **maximum**, not the minimum. I will go with the maximum value.
- **Minimum PWM off time: 6 µs** (Table 9, footnote) — the PWM signal must stay low for at least 6 $\mu s$ per cycle to avoid false short-circuit detection. At 20 kHz the period is 50 µs, so this is naturally satisfied unless duty cycle is above 88%.
- **Logic input thresholds** (Table 7): low = 1.25V, high = 3.25V — the FPGA's 3.3V output is compatible.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embedsys4_1.png" style="max-width: 100%; height: auto;">
</div>

I can see the duty cycle going `00 -> 80 -> FF -> 40` which matches the testbench sequence exactly (0\% => 50\% => 100\% => 25\%) with inverse direction on the last section.

>[!NOTE] To avoid **false Short to battery**, the PWM signal must be low for a time longer than $6 \mu s$. The documentation specifically mentions this aspect.
>
>`max_threshold` vs `raw_threshold` — at `FF` (100%), `raw_threshold` is `0x09BA` (2490) but `max_threshold` is capped at `0x0898` (2200), which is exactly `PERIOD - MIN_OFF_CYCLES = 2500 - 300`. The minimum off-time enforcement is working correctly.
>
>* Normally, at `duty_cycle = 255`, the code would calculate 2490 clock cycles. The total period is 2500 cycles though (50 MHz clock with 20kHz PWM module => 50$\mu s$).
>	* This would only leave 10 clock cycles where `PWM_OUT` would be low. It would provide only $0.2 \mu s$ off-time which would violently violate the minimum $6 \mu s$.
>	* So I clamped with a `max_threshold` which leaves $6 \mu s$ at the end of every cycle like this: $6 \mu s / 20ns = 300 \text{clock cycles}$. So the absolute maximum "high" time would be $2500 - 300 = 2200 \text{cycles}$.



