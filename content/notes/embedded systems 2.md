---
title: Verilog
draft: false
tags:
date: 2026-04-29
---

>[!summary] Hardware Description Language
>
>* Essence of an HDL is describing Programmable logic (cells)
>* ESL: Verilog for both FPGAs used in this course

It flows from HDL to FPGA through different levels of detail / description.

```cpp
// Halves clock freq
module ClockDivisor(
	input wire clock, //binary
	output reg half = 0 //out
);
// Toggle output at positive edge of clock
always @(posedge clock)
	half <= !half;
endmodule
```

So it does have a C++ appearance.

> LaMeres, B.J., (2019) **Quick Start Guide to Verilog** (@ UB). Can also look at "Into to Logic Circuits $\dots$ with Verilog".

# HDL -- Hardware Description Language

In **essence**, it is about ==parallel-running== functionality, and it models/describes digital circuits:

* Flip Flop
* CPU
* adders, registers, ...

There are two assignment statements: `=` and `<=`.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_1.png" style="max-width: 100%; height: auto;">
</div>

The Figure above is from the book mentioned before. It represents the different level of description / detail that occur from specification to FPGA. As we go down, we go more in **detail**, and as we go up we **abstract** more. Every component can be viewed as:

1. System -- Specifications
2. Algorithm -- Code, structure
3. Register Transfer -- Logic structures
4. Gate -- Basic gates and registers
5. Circuit -- Electrical components
6. Material -- Implement Electrical components

It works in a Y architecture. When you use one FPGA board, you need to map the inputs to that board. Basically, bits and maybe bytes. So the **Algorithm** and the **Target Architecture** need to be taken into consideration always together! (hence the Y idea)

**How does it work to produce FPGA code?**

In this course we either use Altera tools or ICE40 tools. In Altera if you make a mistake in the number in the name or whatever, everything blows. In ICE40 you do a functional simulation (is the logic right? you can check). With icoprog you put the logic in FPGA.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_2.png" style="max-width: 100%; height: auto;">
</div>

It's easier to use ICE40 tools since the coding part is only the top layer. Testing (the interface) is done through DigitalJS.

>[!example] Test if number > 2
>
>* Input: a 4-bit number => values between 0-15 -- $\text{input wire[3:0] inp}$
>* Output: one bit, TRUE or FALSE -- $\text{output outp}$
>
>The input is usually called **wire** for some reason.
>
>```cpp
>module HigherThanTwo(input wire[3:0] inp, output outp);
>	assign outp = (inp > 2);
>endmodule
>```
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/embsys2_3.png" style="max-width: 100%; height: auto;"> </div>
>
>The left diagram I can simulate in VSCode. The flow is from left to right.

When I say I have **blocking functionality**, it means it runs immediately (counter-intuitive) => order of statements is important. The end-result is the current value of `outp=F(inp)` at that moment.

When I say I have **non-blocking** functionality (deferred), it means I have an event(clock)-triggered logic. The statements run concurrently and simultaneously. The end-result is all at once, synchronised on the clock.

>[!danger] Two assignment types
>
>* `=` **blocking, immediately**. Order matters!
>* `<=` **non-blocking, synchronised on the clock**. Order doesn't matter!
>* **NEVER EVER MIX THESE IN ONE BLOCK!!!!!**

Some specifics in Verilog:

```cpp
reg a = 0; // Single-bit register
b = 1; // Value HIGH
c = X; // X is Unknown
d = Z; // Z is floating, high impedance supported by DigitalJS
integer myNum = 531; // 32-bit var
time myTime = $time; // for simulation only

wire w = a || b; // OR gate
wire z; // declare wire to assign later
assign z = w && a; // assign prev z to AND gate.

reg[7:0] count = 0; // value 0..255
reg[1:0] twoBit = 2 * b01; // value 1
reg[3:0] arr[8]; // eight 4-bit values

reg[3:0] q = 4'ha; // decimal value 10
reg[2:0] r = 3'b110; // decimal value 6
reg[2:0] s = 3'sb111; // decimal value -1

"""
Base: binary, octal, decimal, hexadecimal
Signed base: sb, so, sd, sh
"""
```

I need to think in digital circuits, not in C++, C, or whatever! Good thing I had a course on that in my Bachelor's. The MSB (Most Significant Bit) is always on the left side!

Example to toggle a LED on-off every 4th count of the clock:

```cpp
module TopEntity(
	input clk,
	output reg led = 0
);

reg[31:0]count=0; // 32 bit counter

always @(posedge clk) begin // at each positive edge of the clock do:

if(count==4) begin
	count <= 0; // reset counter
	led <= ~led; // toggle
end 
else begin
	count <= count+1; // increment
end
end
endmodule
```

> begin $\dots$ end

why 32 bits for only values of 4? makes no sense to me. Apparently, if-test is originally 99999999, (100 MHz clock). but he said we could use 2 bits.

Submodules need explicit connections through wires (i.e. port mapping).

* **Explicit port mapping**: explicitly mention submodule ports in connection list
* **Implicit port mapping**: no submodule port names; connections must be in the same order.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_4.png" style="max-width: 100%; height: auto;">
</div>

We have a higher module System 3 with two sub-modules. I have to connect them; otherwise it doesn't work. Apparently, outputs come first and inputs last. Dots I don't know why. The lower level box I would say is the implicit; he said we should avoid it.

In the Figure below, If I click on one circle; I can see the value of that circle. Also it's good for visualization on how to add inverter gates, OR gates, etc. Pretty fun so far.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_5.png" style="max-width: 100%; height: auto;">
</div>

>[!example] Blocking functionality for detecting a prime input number.
>
>```cpp
>module PrimeTest(
>	input wire[3:0] in, // 4-bit num, 0..15
>	output wire out
>);
>	always @(*) // for every input basically, execute always
>		case(in)
>			2,3,5,7,11,13: out = 1; // prime
>			default: out = 0;       // not prime
>		endcase
>endmodule
>```
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/embsys2_6.png" style="max-width: 100%; height: auto;"> </div>

I haven't asked if indentation is necessary like in python.

>[!summary] Difference in computation between BLOCKING and NON-BLOCKING
>
>I can see only in the block we have the difference. The difference is that the Blocking one will immediately switch the values of A and B, and they will be different. 
>
>The NonBlocking will always run concurrently. So, since A does not change before B, they will both have the same value.
>
><div class="container" style="display: flex; justify-content: center; align-items: center;"> <img src="../static/notes/embsys2_7.png" style="max-width: 100%; height: auto;"> </div>

# How to do testing?

It's called system tasks. they can only be used in simulation, not synthesize it on FPGA. Apparently it's not standard to always send values back from the board to the laptop. I can store the results of a simulation in a file and read complex stimulus vectors. Feels a lil bit stupid.

>[!summary] Text output, **only** at simulation
>
>* \$display();   -- print text(values) and newline
>* \$write();      -- print text(values) without newline
>* \$strobe();  -- display, after all simulation events are executed
>* \$monitor(); -- display, when value of the argument changes

### Test Bench

The device under test we already have. so we need to produce inputs and capture the outputs. Verilog provides constructs to build TBs. I did not necessarily get this part. Ok based on the Figure below I understand. Basically I need to name the Test Bench as my main system with \_TB after it and declare the complex input sequence meant to test the main system.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_8.png" style="max-width: 100%; height: auto;">
</div>

# Finite State Machine

A state variable will have 2 bits. IDLE = 0, INIT = 1, OPER = 2. 

>[!summary] Sequential process
> Executed at positive edge of **clock** or **reset**, and maintains state transitions from **A,B,reset**. So naturally we will use `<=` to synchronize (i.e. delay). **The order won't matter** since they run **concurrently**.

>[!summary] Combinatorial process
>Calculates outputs **Q** and **R** from **state**. 
>
>* If it depends on **state only**: **Moore FSM**
>* If it **also** depends on **input**: **Mealy FSM**
>
>**Immediate**, use `=` and **mind the order**!

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_9.png" style="max-width: 100%; height: auto;">
</div>

# Difference between Verilog & VHDL

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/embsys2_10.png" style="max-width: 100%; height: auto;">
</div>
