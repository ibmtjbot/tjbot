#!/bin/sh

# Classify with the Food model

# Please update url if you are using a differnet WATSON api version
URL="https://gateway.watsonplatform.net/visual-recognition/api/v3/classify"

echo "Classify with the Food model"

if test "$#" -ne 1; then
    echo "Usage: $0 apikey"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
        -F "classifier_ids=food" \
        "$URL?url=https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/fruitbowl.jpg&version=2018-03-19"
fi
