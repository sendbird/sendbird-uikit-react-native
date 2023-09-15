#!/bin/bash

devices=$(adb devices | awk '$2 == "device" {print $1}')

for device_id in $devices
do
  adb -s $device_id reverse tcp:8081 tcp:8081
done
