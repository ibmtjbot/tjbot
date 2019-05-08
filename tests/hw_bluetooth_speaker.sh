#!/bin/sh

# the following will send test.wav file to bluetooth speaker.
# you need to change the MAC address to match your actual bluetooth speaker MAC
# you can use hcitool or bluetoothctl to scan/pair/connect to your bluetooth speaker and capture MAC address.

aplay -D bluealsa:HCI=hci0,DEV=11:2C:33:A4:1E:5B,PROFILE=a2dp speech/test.wav
