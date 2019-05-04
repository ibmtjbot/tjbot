#!/bin/sh

# Detect faces in an image
# The response provides the location of the face in the image and the estimated age range and gender for each face.

echo "Detect faces in an image"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -u "apikey:$1" \
    "https://gateway.watsonplatform.net/visual-recognition/api/v3/detect_faces?url=https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/Ginni_Rometty_at_the_Fortune_MPW_Summit_in_2011.jpg&version=2018-03-19"
fi
