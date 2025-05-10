---
title: "Hadoop: MapReduce in Python"
draft: false
tags:
---
 
# Installation for MacOS
source: https://medium.com/@MinatoNamikaze02/installing-hadoop-on-macos-m1-m2-2023-d963abeab38e

```java
brew install hadoop
cd /opt/homebrew/Cellar/hadoop/3.4.1/libexec/etc/hadoop
```

Configure core-site.xml, hdfs-site.xml, mapred-site.xml, yarn-site.xml and hadoop-env.sh

```java
brew install --cask adoptopenjdk8 // deprecated
brew install --cask temurin@8 // use this instead. It will install Rosetta 2 which is very hard to remove from MacOS. Not really important.
hadoop % export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-8.jdk/Contents/Home"
```

If `start-all.sh` throws an error like this ==Permission denied (publickey,password,keyboard-interactive)== , then call `ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa` and `cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys`

```
hadoop namenode -format
```

# Start

```java
start-all.sh
```


<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/start_hadoop.png" style="max-width: 100%; height: auto;">
</div>

# Anything should go wrong, just run

```java
hadoop namenode -format
```
# Don't forget to stop it

```java
stop-all.sh
```
# Uninstall

### Hadoop

```java
brew uninstall --ignore-dependencies hadoop

brew autoremove

brew cleanup --prune=all

rm -rf ~/hadoop ~/.hadoop

nano ~/.zshrc  # or ~/.bashrc, and remove Hadoop-related exports

brew uninstall --force openjdk@11 mysql qemu python@3.13 gettext glib cairo

brew list ( and remove what we do not want )
```
### Temurin (java)

```java
brew uninstall --cask temurin@8
```
### ssh-key

```java
> ~/.ssh/authorized_keys
```


# MapReduce with Python

>[!NOTE] a.k.a. the main MISSION of this assignment

I created hadoop_test/ which contains `mapper.py` and `reducer.py`. I have two files `file01.txt` and `file02.txt` which got the following contents -- ==echo "Hello World Bye World" > file01.txt==, ==echo "Hello Hadoop Goodbye Hadoop" > file02.txt==.

```python
"""
mapper.py:
"""
#!/usr/bin/env python3

import sys
for line in sys.stdin:
    for word in line.strip().split():
        print(f"{word}\t1")

"""
reducer.py
"""
#!/usr/bin/env python3
import sys
current_word = None
current_count = 0
for line in sys.stdin:
    word, count = line.strip().split("\t")
    count = int(count)
    if word == current_word:
        current_count += count
    else:
        if current_word:
            print(f"{current_word}\t{current_count}")
        current_word = word
        current_count = count
if current_word:
    print(f"{current_word}\t{current_count}")
```

I made both of them executables like this: `chmod +x mapper.py reducer.py`.

### Run the Hadoop Streaming Job

```
hadoop fs -mkdir -p /user/costinchitic/input
hadoop fs -put file01.txt file02.txt /user/costinchitic/input

hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming*.jar \
  -input /user/costinchitic/input \
  -output /user/costinchitic/output \
  -mapper mapper.py \
  -reducer reducer.py
```

From **terminal**:

```

costinchitic@Costins-MacBook-Pro hadoop_test % hadoop fs -cat  /user/costinchitic/output/part-00000

2025-05-10 17:50:36,953 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable

Bye 2
Hadoop 2
Hello 2
World 2
```

After browsing to https://localhost:9870, I can view inside /user/costinchitic/input and output the files and the result!

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hadoop_input.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hadoop_output.png" style="max-width: 100%; height: auto;">
</div>

<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/hadoop_proof.png" style="max-width: 100%; height: auto;">
</div>

