---
title: GoPro Livestream
draft: false
tags:
  - SeaClear
---
 
# Mission: Adding timestamps to GoPro footage and using it in ROS for [[seaclear|SeaClear]].

Sources: [This response on official community support](https://community.gopro.com/s/question/0D53b00008BtdkiCAB/date-time-stamp?language=en_US), [another community question](https://community.gopro.com/s/question/0D53b00008HOPq7CAH/how-do-i-add-timestamp-to-hero-10-videos?language=en_US), [adding overlay](https://gopro.github.io/labs/control/overlays/), [firmware update](https://gopro.github.io/labs/install/)

Update Firmware tutorial: https://github.com/gopro/labs/tree/master/docs/install

>[!NOTE] Add an Overlay to Video
>
>Here I can [overlay](https://gopro.github.io/labs/control/overlays/) HH:MM:SSaa on the real-time footage.

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/gopro.png" style="max-width: 100%; height: auto;">
</div>

>[!CAUTION] UTC Date And Time
>
>**PRO:** There is a field in the metadata that could give the time format in ms.
>
>Look into **[gopro-telemetry](https://gopro.github.io/OpenGoPro/python_sdk/index.html#summary) (Python)** or **[gpmf-parser](https://gopro.github.io/gpmf-parser/) (C library)**.
>
>**CON:** Only in postprocessing can I access this data.

**UPDATE**: I can only extract through gpmf-parser in offline, no online solution. Theoretically, I only need the .mp4 which has the metadata included.

# Install **[gpmf-parser](https://gopro.github.io/gpmf-parser/) (C library)**

*Steps*:
1) git clone https://github.com/gopro/gpmf-parser.git
2) cd gpmf-parser/
3) mkdir build
4) cd build
5) cmake ..
6) make

# STMP and GPSU fields

From the official documentation, it appears that 
* **STMP** is a precise but relative microsecond timestamp -- 1 Hz
* **GPSU** is an absolute UTC time of low frequency that can miss here and there -- 1 Hz

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/gpsu.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/stmp.png" style="max-width: 100%; height: auto;">
</div>

>[!CAUTION] TO GET THESE FIELDS, ALWAYS GET THE VIDEOS DIRECTLY FROM THE SD-CARD OR CONNECT THE GOPRO THROUGH USB-C CABLE.
>Metadata is lost if videos are sent through conventional platforms such as WhatsApp or AirDrop. Lost a lot of fucking time figuring out that one :)
>
>Also, put GoPro in MTP mode so you can see it's files.



To get them in code and actually view them, I added `extract_utc.c`(add link later) inside `gpmf-parser/demo`

```
STMP microsecond timestamp: 0.102411 s
GPSU UTC Timedata: 2015-04-25 10:38:23.679
STMP microsecond timestamp: 1.099822 s
GPSU UTC Timedata: 2015-04-25 10:38:26.319
STMP microsecond timestamp: 2.102296 s
GPSU UTC Timedata: 2015-04-25 10:38:27.309
STMP microsecond timestamp: 3.104771 s
GPSU UTC Timedata: 2015-04-25 10:38:28.299
STMP microsecond timestamp: 4.107248 s
GPSU UTC Timedata: 2015-04-25 10:38:29.344
STMP microsecond timestamp: 5.104663 s
GPSU UTC Timedata: 2015-04-25 10:38:30.334
STMP microsecond timestamp: 6.107141 s
GPSU UTC Timedata: 2015-04-25 10:38:31.324
STMP microsecond timestamp: 7.109622 s
GPSU UTC Timedata: 2015-04-25 10:38:32.314
STMP microsecond timestamp: 8.107037 s
...
```

So if STMP = 0.102411 s and GPSU = 2015-04-25 10:38:23.679, it means that:

- The **first STMP in the payload** occurred **102 ms after the GPSU anchor**.
- The next STMP (~1.099 s) is ~1 second later → makes sense, it’s a ~30 Hz stream.

For some reason, there is always a drop in the GPSU time and then it stabilizes around ~1 second per frame.

# CONCLUSION

>[!NOTE] I can't extract the timestamp attached to each frame since the sensors are working only at 1 Hz.