#!/bin/sh

# Using the customer-engagement endpoint
# POST /v3/tone_chat method to analyze the contents of the file tone-chat.json.

echo "Analyze the contents tone of the file tone_chat.json"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
        --header "Content-Type: application/json" \
        --data-binary @./json/tone_chat.json \
        "https://gateway-lon.watsonplatform.net/tone-analyzer/api/v3/tone_chat?version=2017-09-21"
fi
