#!/bin/sh

# The following will identify the language of text

# Please update url if you are using a differnet WATSON api version
URL="https://gateway-lon.watsonplatform.net/language-translator/api/v3/identify"

echo "Identify the language of text"

if test "$#" -ne 1; then
    echo "Usage: $0 apikey"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
		--header "Content-Type: text/plain" \
		--data "Language Translator translates text from one language to another" \
		"$URL?version=2018-05-01"
fi
