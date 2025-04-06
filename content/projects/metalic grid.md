---
title: Computer Vision for detecting a Metallic Grid and a set reference
draft: false
tags:
  - "#SeaClear"
---
 
Code: [GitHub](https://github.com/costineesti/SeaClear/blob/main/grid_detection.py)
Related to: [[seaclear|SeaClear]], [[Line Segment Detector]]

## Context

I had to clean up a pool using a mop and constantly throwing out the accumulated water with a bucket that I stole from the cleaning ladies. Not cool.

After it was cleaned, we had to install a metalic grid on it's bottom that will further be used to detect a reference coordinates point and how far the ROV has displaced from it.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/original_grid.png" style="max-width: 100%; height: auto;">
</div>

First I had to detect the grid. For the picture above, the boys lend me a GoPro that I attached to an overhead support and shot 1 min worth of full HD video. Should definitely try out the algorithms with 4k.

## Preprocessing the data

>[!NOTE] To make things easier, I applied a region of interest (found empirically) that only has the grid to worry about.
>I had to keep it in mind when plotting the lines on the original video because I always had to add up the minimal x and y values.

After applying the ROI, I had to emphasize the vertical and horizontal lines of the grid before applying a detection algorithm. To do that, I:

1) transformed the original frame into a gray image (`BGR2GRAY`)
2) applied a `Gaussian Blur` to remove the background noise
3) detected the edges of the frame through `Canny`
4) Apply Dilation and Erosion -- Morphological operations apply a structuring element to an input image and generate an output image.  I used a kernel of $3 \times 3$. They help in:
	* Removing noise,
	* Isolation of individual elements and joining disparate elements in an image,
	* Finding of intensity bumps or holes in an image.


```python
gray = cv2.cvtColor(roi_frame, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (5,5), 0)
edges = cv2.Canny(blur, 50, 150, apertureSize=3)
kernel = np.ones((3,3), np.uint8)
edges = cv2.dilate(edges, kernel, iterations=2)
edges = cv2.erode(edges, kernel, iterations=2)

cv2.imwrite('canny.jpg', edges)
```

## Postprocessing the data

>[!hint] I tried to make it work with Probabilistic Hough transform, but it would not be consistent in the output results, no matter how good the preprocessing was

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/houghLines.png" style="max-width: 100%; height: auto;">
</div>

So I tried a technique many people recommended - and that's [Line Segment Detector](https://www.ipol.im/pub/art/2012/gjmr-lsd/?utm_source=doi). It is aimed at detecting locally straight contours on images called `line segments`. Contours are zones of the image where the gray level is changing fast enough from dark to light or the opposite. I dedicated a whole page to this subject - [[Line Segment Detector]].

I filtered the background noise and actual dirt from the pool with constraining that a segment should at least have a minimal length of 30.

```python
lsd = cv2.createLineSegmentDetector(0)
lsd_lines = lsd.detect(edges)[0]  # Use blurred image
# FILTER NOISE
min_length = 30  # adjust based on resolution
filtered_lines = []

for line in lsd_lines:
	x1, y1, x2, y2 = line[0]
	length = np.hypot(x2 - x1, y2 - y1)
	if length > min_length:
		filtered_lines.append(line)
```

Next, I had to sort the LSD lines in `horizontal` and `vertical` and draw a coordinates frame using the last lines in those lists.

For simplicity of understanding, I decided to index the inner squares.

>[!idea] It's a shame I could not make use of the chessboard calibration method since the squares were not black and white. It would have been perfect for this type of application.

```python
horizontal_lines, vertical_lines = sort_lsd_lines(filtered_lines)
horizontal_lines_sorted = sorted(horizontal_lines, 
					key=lambda l: (l[0][1] + l[0][3]) / 2)
vertical_lines_sorted = sorted(vertical_lines, 
					key=lambda l: (l[0][0] + l[0][2]) / 2)
 
coord_frame_x, coord_frame_y = get_intersection_point(
						horizontal_lines_sorted[-1], 
						vertical_lines_sorted[-1])
horizontal_y = simplify_lines(horizontal_lines, 
						axis='horizontal', 
						threshold=10)
vertical_x = simplify_lines(vertical_lines, 
		axis='vertical', 
		threshold=10)
 
postprocessing_image = np.copy(roi_frame)
squares_nbr = index_squares(postprocessing_image, 
				horizontal_y, 
				vertical_x)
draw_coordinate_frame(postprocessing_image,
			coord_frame_x,
			coord_frame_y)

drawn = lsd.drawSegments(postprocessing_image, np.array(filtered_lines))
cv2.imwrite('lsd.jpg', drawn)
```

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/lsd_canny.png" style="max-width: 100%; height: auto;">
</div>

>[!question] Is it a good solution? We'll see what my professor has to say about it.
