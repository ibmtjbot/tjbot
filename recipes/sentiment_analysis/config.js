//You can modify the search keywork to what you like examples are traffic, celebrities, political debates
searchkeyword = "happy";

// Twitter credentials - Update with your Twitter credentials
var twittercredentials = {};
twittercredentials.consumer_key = "xxx-xxx-xxx"  ;
twittercredentials.consumer_secret = "xxx-xxx-xxx" ;
twittercredentials.access_token_key =  "xxx-xxx-xxx-xxx-xxx-xxx" ;
twittercredentials.access_token_secret = "xxx-xxx-xxx";

// Tone Analyzer Credentials - Update with your Bluemix credentals.
var toneanalyzercredentials = {}
toneanalyzercredentials.username = 'xxx-xxx-xxx' ;
toneanalyzercredentials.password = 'xxx-xxx-xxx' ;
toneanalyzercredentials.version = 'v3' ;

// Export both credentials
exports.twittercredentials = twittercredentials ;
exports.toneanalyzercredentials = toneanalyzercredentials ;
exports.searchkeyword = searchkeyword;
