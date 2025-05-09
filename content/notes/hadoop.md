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

If `start-all.sh` throws an error like this ==Permission denied (publickey,password,keyboard-interactive)== , then call `ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa`

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

