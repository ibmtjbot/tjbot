#!/bin/sh

# Transcribe audio with options
# Set the timestamps parameter to true to indicate the beginning and end of each word in the audio stream.
# Set the max_alternatives parameter to 3 to receive the three most likely alternatives for the transcription.
# The example uses the Content-Type header to indicate the type of the audio, audio/flac.
# The request uses the default model, en-US_BroadbandModel.

echo "Transcribe audio with options"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
		--header "Content-Type: audio/flac" \
		--data-binary @speech/audio-file.flac \
		"https://gateway-lon.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&max_alternatives=3"
fi
