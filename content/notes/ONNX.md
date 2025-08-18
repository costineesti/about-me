---
title: ONNX
draft: false
tags: 
date: 2025-08-18
---
 
ONNX stands for ==Open Neural Network Exchange==. It is an open format built to represent machine learning models. ONNX doesn’t actually make the model run faster. I’m used to just working with `.pt` formats.

The advantages are that:
* Runs on many backends (TensorRT, ONNX Runtime, OpenVINO ..)
* Supports inference on edge devices (Raspberry, Jetson Nano, Apple Silicon)
* Basically export once -> use everywhere type shit

# ONNX Runtime

This is different from the current topic, which is just a file format.
This actually does inference on the ONNX model weights.