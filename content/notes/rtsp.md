---
title: Real-Time Streaming Protocol
draft: false
tags:
  - notes
---
 
RTSP, the Real-Time Streaming Protocol, is a widley used and well supported
protocol for sending multimedia over the network.

>[!NOTE] 
>RTSP does not impose any restrictions on the particular encoding used and
most clients are able to select based on information from the server, but for
internal implementations it may be useful to know that the data is streamed in
H.264-format. When decoded, each image corresponds to a rectangular matrix
of unsigned 8-bit integers.

The matrix has one column for each beam, and one row for each sample. The
number rows changes depending on the range. The intensity of each pixel
represents the return strength of the acoustic signal at that point. This is the case of the sonar I'm using during my contribution to [[SeaClear]]. The matrix has one column for each beam, and one row for each sample. The number rows changes depending on the range. The intensity of each pixel represents the return strength of the acoustic signal at that point.

>[!question] The RTSP-stream can be quickly sanity checked using a viewer which supports
RTSP, such as vlc. With the sonar mounted in a small tank, and after setting
the stream type to RTSP in the web-UI, the video stream from VLC looks like
this when connected to rtsp://192.168.2.42:8554/raw

```
Python RTSP example

from matplotlib import pyplot as plt
import requests
import cv2 as cv

sonar_ip= '192.168.2.42'
rtsp_url= f'rtsp://{sonar_ip}:8554/raw'
api_url= f'http://{sonar_ip}:8000/api/v1'

# Enable the sonar and set the range to 3m. HTTP Request
requests.patch(api_url + '/transponder', json={
"enable": True,
"sonar_range": 3,
})

# Enable RTSP. Now we can see the video.
requests.put(api_url + '/streamtype', json={
"value": 2,
})

cap= cv.VideoCapture(rtsp_url)
ret, frame= cap.read()
plt.imshow(frame)
plt.show()
```

### Continuously reading the video stream

Continuous streaming introduces some additional complexity, mainly how to
handle changes in stream resolution. The RTSP stream is capped by network
bandwidth, and always attempts to provide the largest possible image that will
not exceed it. This means that changing the range changes the size of the image.
For opencv, the ==FFmpeg== backend (Which is the default on most systems) ==does
not handle this exceptionally well== - If the resolution changes, the stream will
throw an error or resize the new image to fit the resolution of the previous
images, depending on how well the image sizes add up.

If the settings are expected to change while streaming, the ==GStreamer backend
may be a better fit==. (GStreamer can also be used directly, although this is not
trivial in Python). Note that GStreamer is more difficult to install correctly. than FFmpeg. Exactly how to install it differs from system to system, but you will need to find some source for the following:

* gstreamer
* gst-plugins-base
* gst-plugins-good
* gst-plugins-bad

``` Example in python:

if args.backend == 'auto':
	video_stream = cv.VideoCapture(rtsp_url)
elif args.backend == 'gstreamer':
	gs = f'uridecodebin uri="{rtsp_url}" ! videoconvert ! appsink'

video_stream = cv.VideoCapture(gs, cv.CAP_GSTREAMER)
animation = WedgeAnimation(video_stream, args.swath, args.min_range,                                   args.range)
plt.show()
```