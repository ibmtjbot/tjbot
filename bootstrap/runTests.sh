#!/bin/bash
TJBOT_DIR=$1

if [ -z "${TJBOT_DIR// }" ]; then
    TJBOT_DIR='/home/pi/Desktop/tjbot'
fi

#----test hardware
cd $TJBOT_DIR/bootstrap/tests
echo "Installing support libraries for TJBot. This may take few minutes."

npm install > install.log 2>&1

echo "Running camera test"
sudo node test.camera.js

echo "Running LED test"
sudo node test.led.js

echo "Running servo test"
sudo node test.servo.js

echo "Running speaker test"
sudo node test.speaker.js

echo "-------------------------------------------------------------------"
echo "Tests complete. Have fun! ;)"
echo "-------------------------------------------------------------------"
