---
title: Coordinate Systems
draft: false
tags:
date: 2025-11-18
---
 
This is Lecture 3 from my [[RPCN|Robotic Perception, Cognition and Navigation]] course. Also related to [[coordinate frame|Coordinate Frame]].

# Geographic Coordinate System ($\phi, \lambda, h$)

<div class="encoder-section">
  <img src="../static/notes/geographical_system.png" style="width: 200px; margin-bottom: 10px; margin-right: 20px; margin-bottom: 0;">
  <div class="encoder-text">
    <ul>
      <li><b>Geographic Latitude (φ)</b></li>
	      <ul>
		      <li>the angle between the ellipsoidal normal through point "P" and the equatorial plane</li>
	      </ul>
	<li><b>Geographic Longitude (λ)</b></li>
		<ul>
			<li>angle in the equatorial plane between the zero median and the meridian of point "P"</li>
		</ul>
	<li><b>Elipsoidal Height (h)</b></li>
		<ul>
			<li>the distance along the normal from the surface of the ellipsoid. </li>
		</ul>
	<li><b>Geometric surface (Geoid)</b>: An equipotential surface where gravity is constant everywhere. It approximates mean sea level extended through continents.</li>
	<li><b>Reference surface (Ellipsoid)</b>: A mathematical approximation of the geoid used for navigation and mapping. It's a smooth ellipsoid shape.</li>
    </ul>
  </div>
</div>

* Lines of equal latitude are called parallels. They form circles on the surface of the ellipsoid.
* Lines of equal longitude are called meridians and they form ellipses (meridian ellipses) on the ellipsoid of the Earth.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/earth_ref.png" style="max-width: 100%; height: auto;">
</div>

<div class="image-row"> <img src="../static/notes/earth_1.png" style="width: 200px;"> <img src="../static/notes/earth_2.png" style="width: 200px;"> </div>



<style>
  .encoder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .encoder-text {
    max-width: 600px;
  }
  .image-row { 
	display: flex; 
	gap: 20px; 
	flex-wrap: wrap; 
	justify-content: center; 
  }

  @media (min-width: 768px) {
    .encoder-section {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .encoder-text {
      text-align: left;
    }

    ul {
      padding-left: 40px; /* Maintain indentation for desktop */
    }
  }

  @media (max-width: 767px) {
    .encoder-text {
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