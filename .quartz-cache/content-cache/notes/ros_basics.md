---
title: ROS Basics
date: 2024-11-19
draft: false
tags:
  - projects
  - ros
---

Source: [this legend](https://youtube.com/playlist?list=PLLSegLrePWgIbIrA4iehUQ-impvIXdd9Q&si=qVlQpJCC2g5OxWvZ)

In order to learn ROS, you need to know in advance how to program in `C++` or `Python`. Also, you need to be comfortable using the Linux shell.

In order to run ROS nodes, you need to type `roscore` into one of the terminals. Prior to that, you should make sure that you sourced these two directories in ~/.bashrc in order to make sure you can use your code with ROS functionalities:

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/bashrc.png" style="max-width: 100%; height: auto;">
</div>

If you want to develop such nodes, ROS works on a subscriber/publisher basis [[ros_architecture]]. Everything takes place in the `catkin_ws` directory.

### catkin_ws directory

>[!note] In order to create a ROS package, we need to call in catkins_ws/src:
>`catkin_create_pkg package_name rospy[or roscpp] ros_packages`
>
>for example: `catkin_create_pkg my_robot_controller rospy turtlesim` which will return:
><div class="container" style="display: flex; justify-content: center; align-items: center;">
><img src="../static/notes/catkin_create.png" style="max-width: 100%; height: auto;">
></div>
>
>If we want to add other packages later, we can simply add them in package.xml.
>To run, we would need to type in another terminal `rosrun my_robot_controller script.py`

>[!hint] In order to build the new ROS package we just created, we call
>`catkin_make` inside /catkin_ws
>Also, in order to run the node through `rosrun`, you need to make the script executable with `chmod +x script.py`
>Also, for the script to work, it needs to have `#!/usr/bin/env python3` as first line in order to know the interpreter

### ROS useful commands

>[!question]
>* `rosnode list` shows all active nodes
>* `rosnode kill node_name` kills any active node
>* `rqt_graph` opens up a GUI that shows the relationships between active nodes.
>* `rostopic info /node_name` gives details about the type, publishers and subscribers.
><div class="container" style="display: flex; justify-content: center; align-items: center;">
><img src="../static/notes/rostopic_info.png" style="max-width: 100%; height: auto;">
></div>
>
>* `rosmsg show` 
>
><div class="container" style="display: flex; justify-content: center; align-items: center;">
><img src="../static/notes/rosmsg_show.png" style="max-width: 100%; height: auto;">
></div>
>
>* `rostopic echo` gives real-time data of a topic

