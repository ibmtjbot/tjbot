#! /bin/sh

# Classify an image using General Model
# The response includes the classes identified in the image from the built-in General model ("classifier_id": "default")
# By default, responses from the Classify calls don't include classes with a score below 0.5 (50%).

echo "Classify an image using General Model"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
    "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?url=https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/640px-IBM_VGA_90X8941_on_PS55.jpg&version=2018-03-19"
fi
