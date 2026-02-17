---
title: ROS2 Starting Basics
draft: false
tags:
date: 2026-02-17
---

 Most of this stuff I already know from ROS1. But a refresh is never bad.
 
>[!NOTE] Compared to `catkin`, there is no `devel` directory.

ROS2 uses `colcon`: an iteration on the ROS build tools `catkin_make`, `catkin_make_isolated`, `catkin_tools` and `ament_tools`.

>[!tip] Running `colcon build` may freeze the screen and mouse of systems that are CPU-, RAM- and I/O-limited (e.g., Raspberry Pi), so it might be useful to use the `--executor sequential` argument to build the packages one by one instead of using parallelism.

Example of package.xml for when I want to create a package from scratch

```
<package format="2">
  <name>my_package</name>
  <version>1.2.3</version>
  <description>
    This is my package's description.
  </description>
  <maintainer email="someone@example.com">Someone</maintainer>

  <license>BSD</license>
  <license file="LICENSE">LGPL</license>

  <url type="website">http://wiki.ros.org/my_package</url>
  <url type="repository">http://www.github.com/my_org/my_package</url>
  <url type="bugtracker">http://www.github.com/my_org/my_package/issues</url>
  <author>John Doe</author>
  <author email="jane.doe@example.com">Jane Doe</author>

  <buildtool_depend>catkin</buildtool_depend>
  <build_depend version_gte="1.1" version_lt="2.0">genmsg</build_depend>

  <depend>roscpp</depend>

  <build_depend>libgstreamer0.10-dev</build_depend>
  <build_export_depend>libgstreamer0.10-dev</build_export_depend>
  <exec_depend>libgstreamer0.10-0</exec_depend>

  <test_depend>gtest</test_depend>

  <doc_depend>doxygen</doc_depend>

  <conflict>alternative_implementation</conflict>

  <replace>my_old_package</replace>

  <export>
    ...
  </export>
</package>
```

>[!danger] The command `colcon_cd` allows you to quickly change the current working directory of your shell to the directory of a package. As an example `colcon_cd some_ros_package` would quickly bring you to the directory `~/ros2_ws/src/some_ros_package`.

# ROS2 Package

Package creation in ROS2 uses ament as its build system and colcon as its build tool. You can create a package using either CMake or Python, which are officially supported.

ROS 2 Python and CMake packages each have their own minimum required contents:

>[!summary] CMake
>
>- `CMakeLists.txt` file that describes how to build the code within the package. Here I can mention the version of C++ I want to use.
>- `include/<package_name>` directory containing the public headers for the package
>- `package.xml` file containing meta information about the package
>- `src` directory containing the source code for the package

>[!summary] Python
>
>- `package.xml` file containing meta information about the package
>- `resource/<package_name>` marker file for the package
>- `setup.cfg` is required when a package has executables, so `ros2 run` can find them
>- `setup.py` containing instructions for how to install the package
>- `<package_name>` - a directory with the same name as your package, used by ROS2 tools to find your package, contains `__init__.py`

The command syntax for creating a new package in ROS 2 is:

> ros2 pkg create --build-type ament_cmake --license Apache-2.0 <package_name>

For example, I can create the files simply by doing:

```
$ ros2 pkg create --build-type ament_cmake --license Apache-2.0 --node-name my_node my_package

going to create a new package
package name: my_package
destination directory: /home/user/ros2_ws/src
package format: 3
version: 0.0.0
description: TODO: Package description
maintainer: ['<name> <email>']
licenses: ['Apache-2.0']
build type: ament_cmake
dependencies: []
node_name: my_node
creating folder ./my_package
creating ./my_package/package.xml
creating source and include folder
creating folder ./my_package/src
creating folder ./my_package/include/my_package
creating ./my_package/CMakeLists.txt
creating ./my_package/src/my_node.cpp
```

After I fill them with what I need and the structure I need, I can simply do `colcon_build`. I care mostly about completing the `package.xml` file.

Related: [[ROS2 Basics]], [[ROS2 - Writing Publishers and Subscribers]].