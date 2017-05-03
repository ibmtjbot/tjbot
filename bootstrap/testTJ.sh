#!/bin/bash

#----test hardware
read -p "Would you like to test TJBot hardwares (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" ) 
	cd $TJBOT_FOLDER
	cd bootstrap/tests
	echo "Installing TJBot tests. Please wait until npm install completes. It may take few mintues."

	npm install > install.log 2>&1

	echo "Testing camera hardware"
	sudo node test.camera.js

	echo "Testing LED hardware"
	sudo node test.led.js

	echo "Testing servo hardware"
	sudo node test.servo.js

	echo "Testing speaker hardware"
	sudo node test.speaker.js
     ;;
*) ;;
esac


#----try to run tjbot
read -p "Do you want to run TJBot conversation service? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" ) 
	if [ ! -f "${TJBOT_FOLDER}/recipes/conversation/config.js" ]; then
	    echo "------------------------------------";
	    echo "If you would like to run Conversation, please first create ${TJBOT_FOLDER}/recipes/conversation/config.js with your Bluemix Credentials."
	    echo "After that try 'node conversation.js'"
	    echo "------------------------------------";
	else
	node conversation.js
fi
     ;;
*) ;;
esac

#----TJBot
echo "------------------------------------";
echo "Your TJBot is ready. Go have fun!"
echo "------------------------------------";
