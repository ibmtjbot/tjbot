#!/bin/sh

# Synthesize text in Spanish
# Synthesize the string "hola mundo" and produce a WAV file that is named hola_mundo.wav
# The input text is URL-encoded.
# The method includes the query parameter accept to specify the audio format 
# The method includes the query parameter voice to specify a Spanish voice, es-ES_EnriqueVoice.

echo "Synthesize text in Spanish"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X GET -u "apikey:$1" \
      --output ./speech/hola_mundo.wav \
      "https://gateway-lon.watsonplatform.net/text-to-speech/api/v1/synthesize\?accept=audio%2Fwav&text=hola%20mundo&voice=es-ES_EnriqueVoice"
fi
