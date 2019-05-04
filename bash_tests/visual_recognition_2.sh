#!/bin/sh

# Classify with the Food model

echo "Classify with the Food model"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
        -F "classifier_ids=food" \
        "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?url=https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/fruitbowl.jpg&version=2018-03-19"
fi
