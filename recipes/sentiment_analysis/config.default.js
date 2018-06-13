/*
* User-specific configuration
* IMPORTANT NOTES:
*  Please ensure you do not interchange your username and password.
*  Your username is the longer value: 36 digits, including hyphens
*  Your password is the smaller value: 12 characters
*/

exports.sentiment_keyword = "education";       // keyword to monitor in Twitter
exports.sentiment_analysis_frequency_sec = 30; // analyze sentiment every N seconds

// Create the credentials object for export
exports.credentials = {};

// Watson Tone Analyzer
// https://www.ibm.com/watson/services/tone-analyzer/
exports.credentials.tone_analyzer = {
    password: '',
    username: ''
};

// Twitter
exports.credentials.twitter = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
};
