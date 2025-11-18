---
title: Risk management, FMEA & RMF
draft: false
tags:
date: 2025-10-29
---
 
We continuously identify, treat and monitor risks throughout the V-Model.

$$
R = P \cdot C
$$

P = Probability, C = Consequences

# Risk Types

>[!NOTE] Project risks
>
>* Technical
>* Cost
>* Planning
>* Programme (external)

>[!NOTE] Other risks
>
>* Safety
>* SWOT
>* Market
>* Legal

### Risk Relations

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/risk_relations.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] if $\langle$situation$\rangle$, then $\langle$consequence$\rangle$, for $\langle$stakeholder$\rangle$.

# Quantifying risk

* Risk Priority Number
* Monetary Cost
* ....

It's not an exact science.

# Risk Handling

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/riskhandling.png" style="max-width: 100%; height: auto;">
</div>

>[!summary] We have the following options considering $R = P \cdot C$
>1. **Avoid**: decrease P (get a chain, don't get your bike)
>2. **Contain**: decrease C (not insurance), but more like buying a cheap second-hand bike
>3. **Take**: Fuck it, we commit
>4. **Delegate**: the formula stays the same, but it's not you who's serving the consequences. You buy insurance. If the bike is stolen, the insurance company pays you back

# Bus Test

Let's say there is a team member who is crucial to the mission and only they know how to solve a problem. That's not how you want things to be. You want that person to share knowledge and avoid going into a crisis whenever they are not available. It prevents that person from taking other projects and developing outside their current area of activity, which might not be ideal for them.

# Risk Management Plan (RMP)

In the Project Planning process, a risk management plan (RMP) is tailored to satisfy the policies, procedures, standards, and regulations related to and affecting the management of risks for the project.

### Formulating Risks

For each, we should always formulate clearly and concisely:
* the cause,
* the effect,
* the likelihood.

And choose one mitigation:
* avoid,
* contain,
* delegate.

For example, let's identify 3 risks for a robot digger on construction sites. And for each formulate *the cause, the effect and the likelihood*. Also choose one mitigation and describe how to lower the risk

1. one technical development risk;
2. one technical product risk;
3. one product safety risk.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/RMP.png" style="max-width: 100%; height: auto;">
</div>

# FMEA (Failure Mode and Effects Analysis)

>[!summary] Failure Modes
>* something breaks
>* human error
>* part under-performs
>* adverse environmental conditions
>* wear & tear

>[!summary] Effects Analysis
>* device completely malfunctions
>* performance specs not achieved
>* ...
>* <u>requirements fail</u>

1. Identify failure modes
2. predict / estimate effects
3. determine remedy

### Risk Priority Number

$$
\text{RPN} = \text{S} \times \text{O} \times \text{D}
$$

S = severity (consequences)

O = occurrence (probability)

D = detection

### Unlikely-but-severe (black swan)

* S high
* O low
* D easy

### Often-but-mild (gremlin)

* S low
* O high
* D medium

### Run-of-the-mill

* S medium
* O medium
* D medium

>[!NOTE] To quantify, we can assume high = 10, medium = 5, low = 1.
>
>* $RPN_{black swan} = 10 \cdot 1 \cdot 1 = 10$
>* $RPN_{gremlin} = 1 \cdot 10 \cdot 5 = 50$
>* $RPN_{Run-of-the-mill} = 5 \cdot 5 \cdot 5 = 125$
>
>Considering this, the run-of-the-mill type of risks should be always tackled first.

# Risk Mitigation

>[!NOTE] Severity
>* break the causal chain
>* add redundancy
>* shielding / armoring
>* ...

>[!NOTE] Occurence
>* remove root cause
>* over-dimension critical components
>* preventive maintenance
>* ...

>[!NOTE] Detection
>* inspection
>* predictive maintenance
>* sensors
>* status: leds / lamps / checks / logging
>* degradation / wear indicators
>* ...

Also, we should hold risk-related discussions with customers / stakeholders and collect any events for future learnings.

# Safety

The product has to comply with **Standards** (ISO, IEC, EU, etc.). Usually the QA / RA engineers handle these things.

### Risk index aspects

* Severity: how bad
	* S1 Slight injury, e.g. scratches, bruising, light wound
	* S2 Serious injury e.g. fatality, broken limbs, fractures, flesh wounds
* Exposure: how often
	* E1 Seldom
	* E2 Often (default)
* Probability: how likely is the SOE*
	* P1 Almost impossible
	* P2 Occasionaly
	* P3 Likely
* Avoidance or reduction of harm
	* A1 Possible (e.g. low speed)
	* A2 Impossible

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/soe.png" style="max-width: 100%; height: auto;">
</div>

# Risk Management Analysis

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/RMA.png" style="max-width: 100%; height: auto;">
</div>

>[!question] What is the result of risk management for the product design?
>* Additional features or requirements may have to be added as mitigation for identified risks.

>[!question] What is the difference between RMA and FMEA?
>* Safety (RMA)
>* Robustness (FMEA)
>* Technical failures may lead to unsafe situations. (link between them)

>[!NOTE] The difference between Exposure, Probability and Avoidance.
>* How often does the risky situation occur = E
>* how large is the chance of the accident actually happening = P
>* can the accident be prevented somehow? = A

