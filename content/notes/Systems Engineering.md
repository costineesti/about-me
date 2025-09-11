---
title: Systems Engineering
draft: false
tags:
date: 2025-09-11
---
 
I'm taking this class during Q1 in my first year of Master's in Robotics at Twente.

So far, I have these topics covered:

[[systems engineering 2|Acquisition Phase in Systems Engineering]]
[[systems engineering 2|Conceptual Design]]
[[systems engineering sde 2|Systems Engineering Process]]

Reference material:
* Falconbridge and Ryan, **Applied Systems Engineering (ASE)** book - ISBN 978-1-921138-13-3
* Bonnema, Veenvliet and Broenink, **System Design Engineering(SDE)** book - ISBN: 978-1-498751-26-1

>[!abstract] Systems Engineering
>How is the process of bringing large and complex systems into being organized? 
>
>By investigating the problem and dividing it into smaller pieces, the work is made more manageable. The importance of identifying the interfaces between the pieces and how to put the pieces together is treated.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/SUD.png" style="max-width: 100%; height: auto;">
</div>

# List of abbreviations

- **BNR — Business Needs & Requirements:** The business’ fundamental needs and constraints that kick off Conceptual Design and lead into the PLCD and BRS. 
    
- **BRS — Business Requirements Specification:** The document capturing the BNR at the business level; produced alongside the PLCD. 
    
- **SNR — Stakeholder Needs & Requirements:** The endorsed set of stakeholder needs/requirements (refined via trade studies) used to drive the system requirements. 
    
- **StRS — Stakeholder Requirements Specification:** Formal, stakeholder-readable requirements describing missions, operational characteristics, constraints, interfaces, environment, and support concept; it is _not_ the baseline spec. 
    
- **SyRS — System Requirements Specification:** The system-level requirements document; becomes the centerpiece of the functional baseline when approved. 
    
- **FBL — Functional Baseline:** The initial, system-level logical architecture established at the end of Conceptual Design (the main product of the phase). 
    
- **RBS — Requirements Breakdown Structure:** The hierarchical framework for analyzing, allocating, and tracing requirements; forms the structure for the SyRS. 
    

  

### **Life-cycle descriptions & concept docs**

- **PLCD — Preliminary Life-Cycle Documents/Concepts:** The preliminary set of life-cycle concepts/documents developed early from the BNR. (The chapter uses “preliminary life-cycle concepts” and “preliminary life-cycle documents” together.)
    
- **LCD — Life-Cycle Documents (Descriptions):** The broader set of life-cycle descriptions (e.g., operations, support, retirement) refined with the SNR and StRS. 
    
- **OpsCon — Operational Concept (document):** The preliminary operational concept document that frames scenarios and intended use. 
    

  

### **Reviews & plans**

- **SRR — System Requirements Review:** Iterative reviews during Conceptual Design to progressively verify/approve system-level requirements and manage priorities/margins. 
    
- **SDR — System Design Review:** End-of-phase review confirming the system-level solution, approving V&V plans and SEMP, and baselining the initial FBL. (OCR sometimes shows “SOR” but it’s SDR.) 
    
- **SEMP — Systems Engineering Management Plan:** Describes the complete requirements-engineering process (iterations, responsibilities, inputs/outputs, tools) and is approved at SDR.
    
- **PMP — Project Management Plan:** Refined/confirmed at SDR alongside cost/schedule/risk alignment. 
    
- **WBS — Work Breakdown Structure:** Contract/management structure influenced by systems-engineering considerations listed alongside the SyRS. 
    
- **SOW — Statement of Work:** Contractual document referenced with WBS for capturing management/engineering expectations that affect development. 
    

  

### **Analysis models & diagrams**

- **FFBD — Functional Flow Block Diagram:** Used to analyze functions/flows and support allocation (e.g., aircraft turnaround example). 
    

  

### **Measures, verification & quality/logistics**

- **CI — Critical Issue:** A measure of an issue of primary importance to business management; commonly phrased as a must-answer-yes question before proceeding. 
    
- **COI — Critical Operational Issue:** Mission-critical operational issue (subset of CI) that must be affirmed to show the system meets its operational needs. 
    
- **MOE — Measure of Effectiveness:** (Quantitative or qualitative) degree to which an operational objective is met under specified conditions; reflects mission effectiveness and integration into the operational environment. 
    
- **MOP — Measure of Performance:** Performance measure (e.g., range, velocity, weight) that composes/feeds MOEs. 
    
- **TPM — Technical Performance Measure:** Selected requirement(s) tracked as key health/risk indicators during development. 
    
- **V&V — Verification & Validation:** Planning/activities to verify requirements and validate the system’s suitability; V&V plans are approved at SDR. 
    
- **QA — Quality Assurance:** An input considered when comparing architectural options during system-level synthesis. 
    
- **ILS — Integrated Logistics Support:** Considered during synthesis alongside maintenance, test/evaluation, etc., when selecting a preferred architecture.
