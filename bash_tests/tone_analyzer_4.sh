#!/bin/sh

# Using the general-purpose endpoint via the GET request method
# The GET method provides the same functionality and produces the same results as the POST method
# use the method's text query parameter to specify the content to be analyzed. 
# GET method accepts only plain text input.

echo "Analyze the contents tone of the file tone.json"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
      --header "Content-Type: application/json" \
      --data-binary @./json/tone_chat.json \
      "https://gateway-lon.watsonplatform.net/tone-analyzer/api/v3/tone_chat?version=2017-09-21"
fi
