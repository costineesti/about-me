---
title: Untitled
draft: false
tags:
---

# asdfr-02
Repository for ASDfr Assignments on RELBot

### General explanation on how to run the Assigments

For specific information about each ROS2 node we created, visit the specific README files in each folder.

# `PLEASE RERUN THE VIDEOSERVER.PY ON THE HOST MACHINE FOR EVERY RUN.`
# `Please make sure that your connection between videoserver.py from HOST and cam2image works prior to starting`
# `Switch the IP address from cam2image_vm2ros/config/cam2image.yaml to your host IP address before starting!`

# `Assignemnt 1.1.3 - brightness node`

To run assignment 1.1.3, which is the brightness node that's supposed to tell whether the light is ON or OFF based on a threshold, run the following:

1. change directory to ros workspace e.g. `cd ros2_ws`
2. `ros2 launch cam2image_vm2ros brightness.launch.py`
3. if you want to change the threshold parameter during runtime, you can run `ros2 param set /brightness_node brightness_threshold x` in another terminal. MAKE SURE `x` IS OF TYPE DOUBLE! AS IN 150.0 and not 150.

# `Assignment 1.1.5 - color object detector`

To run assignment 1.1.5, which is the color object detector node that's supposed to return the center of gravity of the brightest object is sees, run the following:

1. change directory to ros workspace e.g. `cd ros2_ws`
2. `ros2 launch cam2image_vm2ros color_object_detector.launch.py`
3. if you want to view the processed image and the middle point, run `ros2 run rqt_image_view rqt_image_view` and select `/debug_image`.

remember to restart videoserver.py in case nothing pops up.

# `Assignment 1.2.1`
To run assignment 1.2.1, which is the relbot following a sequence of velocity setpoints, run the following in the root of the workspace:
1. `source /opt/ros/jazzy/setup.bash`
2. `colcon build --packages-select relbot_msgs`
3. `source install/setup.bash`
4. `colcon build`
5. `source install/setup.bash`
6. `ros2 launch relbot_simulator sim_launch_assignment1.py`

# `Assignment 1.2.2`
To run assignment 1.2.1, which is the relbot trying to follow a light shining in camera view of your webcam:
1. `source /opt/ros/jazzy/setup.bash`
2. `colcon build --packages-select relbot_msgs`
3. `source install/setup.bash`
4. `colcon build`
5. `source install/setup.bash`
6. `ros2 launch relbot_simulator sim_launch_assignment2.py`

---

# Assignment 2.1: Non RT Thread

* Spawns a `POSIX` timer thread with default scheduler policy (*SCHED_OTHER*) from the pthread library and a `sigset` (signal set) from the signals library, which allows for the use of the `sigwait()` function. 

The pipeline works like this:

1. Define a sigset (signal set) and initialize it as empty;
2. Create a timer using the clock id, signal event, and timer id as parameters;
3. Start the timer which starts every 1ms;
4. Execute the main loop which first waits for the signal through the \textit{sigwait()} function and then store the current value of the clock in a vector of size $x \cdot 10^3$, where $x$ is the number of seconds we want the main loop to last, expressed in miliseconds.
5. Delete the timer after the main loop and save the corresponding jitter for every iteration in a .csv file to later analyze the data with the `visualization.py` script.

* Results and choice of parameters can be viewed in the report for both Non RT and SRT.

To run locally: 

1. change directory to current folder containing POSIX_timer.cpp
2. to compile: `g++ -O2 -std=c++17 POSIX_timer.cpp -o NonRT_loop -pthread`
3. to run on selected core: `sudo taskset -c <core_number> ./NonRT_loop `

`htop` to view load on the selected CPU, `stress --cpu 4` to stress all cores. replace `4` with how many you have.

Most of the documentation is already present in the code.

# Assignment 2.2: Firm Real-Time (FRT) Thread on Xenomai

* Meant to be run on Xenomai, core 1 of the Raspberry Pi that is allocated especially for firm real-time (FRT) tasks.
* Most of the POSIX key functionality stays intact, however some of the names and/or attributes of functions change a bit, allowing evl-safe implementation. If a function is not evl-safe, calling it within the real-time loop will break the real-time operation. To correctly initialize the real time thread, the scheduling policy and priority are assigned, as well as setting the core which the thread should be pinned to. In the case of the current setup, core 1 is the EVL core and runs real-time processes, so the thread is pinned to thread 1. This is done by setting its ’affinity’ to core 1.

The code works on the XRF2 framework from Xenomai. It allows for FRT capabilities, as seen in the results from the Report. The parameters are also discussed in the Report.

The pipeline works like this:

1. Let the thread sleep until the ’next’ wake up time. This makes sure the thread is periodically started with the same interval.
2. Read the time as soon as the thread wakes up, and compare with the last wake-up time to compute the elapsed time. This allows the computation of ’jitter’.
3. Perform the computational loop. If the computation takes longer than the indicated sleep time, the jitter spikes up, since the next computation is started later.

To run locally:

1. change directory to working folder of Assignment 2.2 which contains XRF2_timer.cpp
2. to compile: `g++ -O2 -Wall -std=c++17 XRF2_timer.cpp -o RT_loop -I/usr/evl/include -L/usr/evl/lib -levl -lpthread -lm`
3. to run: `./RT_loop`

To view results, use `visualization.py` from `/2.1_periodic_timing_thread`.
