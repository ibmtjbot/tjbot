#!/bin/sh

# Analyze the contents tone of the file tone.json
# Using the general-purpose endpoint via the POST request method
# The file includes a single paragraph of plain text that is written by one person.
# Issue the following command to analyze the tone of the overall content only by setting the sentences parameter to false.

echo "Analyze the contents tone of the file tone.json"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
      --header "Content-Type: application/json" \
      --data-binary @./json/tone.json \
      "https://gateway-lon.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&sentences=false"

fi
