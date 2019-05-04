#!/bin/sh

# The following will translate two phrases, "Hello, world!" and "How are you?" from English to Spanish.

echo "Translate two phrases from English to Spanish"

if test "$#" -ne 1; then
    echo "Usage: $0 api-key"
else
	echo " Calling Watson Service API Using -> \"apikey:$1\""
	curl -X POST -u "apikey:$1" \
	--header "Content-Type: application/json" \
	--data "{\"text\": [\"Hello, world! \", \"How are you?\"], \"model_id\":\"en-es\"}" \
	"https://gateway-lon.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01"
fi
