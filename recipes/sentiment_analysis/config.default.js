// User-specific configuration
exports.sentiment_keyword = "education";       // keyword to monitor in Twitter
exports.sentiment_analysis_frequency_sec = 30; // analyze sentiment every N seconds

// Create the credentials object for export
exports.credentials = {};

// Watson Tone Analyzer
// https://www.ibm.com/watson/developercloud/tone-analyzer.html
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
