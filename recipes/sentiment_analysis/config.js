//You can modify the search keywork to what you like examples are traffic, celebrities, political debates
searchkeyword = "people";

// Twitter credentials - Update with your Twitter credentials
var twittercredentials = {};
twittercredentials.consumer_key = "xxxxxx"  ;
twittercredentials.consumer_secret = "xxxxxx" ;
twittercredentials.access_token_key =  "xxxxxx" ;
twittercredentials.access_token_secret = "xxx-xxx-xxx";

// Tone Analyzer Credentials - Update with your Bluemix credentals.
var toneanalyzercredentials = {}

toneanalyzercredentials.password = 'xxxxxx' ;
toneanalyzercredentials.username = 'xxxxxx' ;
toneanalyzercredentials.version = 'v3' ;

// Export both credentials
exports.twittercredentials = twittercredentials ;
exports.toneanalyzercredentials = toneanalyzercredentials ;
exports.searchkeyword = searchkeyword;
