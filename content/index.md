---
title: Hello Hello, I'm Costin 😎
---
<div class="profile-section">
  <img src="static/pictures/beligool.jpg" alt="Profile Picture" class="profile-image">
  <div class="profile-text">
    <p>I'm a Software Engineer who graduated from Technical University of Cluj-Napoca (2020-2024). I enjoy challenging myself constantly by implementing things from scratch as I can thoroughly understand the process.</p>
    <p>My expertise currently lies in:</p>
    <ul>
      <li><a href="/projects/Control Engineering">Control Engineering</a> (MATLAB/SIMULINK),</li>
      <li>Python and C++</li>
      <li>Robotics, Automation
      <li>Mathematical Modelling, Optimizations</li>
      <li>Perception Algorithms</li>
    </ul>
  </div>
</div>

<style>
  .profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-image {
    width: 200px;
    margin-bottom: 10px;
  }

  .profile-text {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    .profile-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .profile-image {
      margin-right: 20px;
      margin-bottom: 0;
    }

    .profile-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .profile-text {
      padding: 0 15px; /* Add padding on mobile for better spacing */
      text-align: left; /* Align text to the left on mobile */
    }

    ul {
      padding-left: 20px; /* Reduce padding for better mobile view */
    }

    li {
      margin-bottom: 10px; /* Add space between list items for clarity */
    }
  }
</style>

I will upload my personal <a href="/projects/">projects</a> and <a href="/notes/">notes</a> through the years using **Obsidian**.

### Socials

You can find me @:
* [LinkedIn](https://www.linkedin.com/in/costin-chitic-1169a6235/)
* [Instagram](https://www.instagram.com/costin_chitic/)
* [Github](https://github.com/costineesti)

>[!NOTE] Some emphasis on my projects
>
>These notes are primarily written with the goal of creating a vault where I can always find my most important <a href="/projects/">projects</a> and <a href="/notes/">notes</a> . Therefore, they are filled with **MY** dumb humour. If you find a link that doesn't work, it's probably just for looks. Please contact me if you ever want to pass on a message :)

### What I'm currently working on

>[!hint] Most of my time goes into...
> - [[seaclear|SeaClear]] -- I'm currently working on autonomous and real-time ground truth validation of 3D pose estimation.
> - Implementing SORT from scratch in C++ with ROS
> - Implementing ML from scratch,
> - Implementing AI from scratch.

### What I've worked on in the past

* I've been a Software Engineer at Bosch for the past 3 years in the Model-Based team. I have successfully automated the regression test using [[Python]] and [[MATLAB]] and now I'm working with [[SIMULINK]] mathematical models (we're basically simulating cars).
* My [[Bachelors|bachelors]] degree is my biggest project yet; having implemented a [[Kalman Filter]] in order to achieve sensor fusion between a camera and a IMU in order to get the odometry from an autonomous car.
* [[Analysis and Prediction of Stock Market]] where I improved my knowledge of ML and AI, having implemented all the algorithms from scratch ([[principal_component_analysis|PCA]], [[LSTM]], Gradient Descent, [[QR Decomposition]]).
