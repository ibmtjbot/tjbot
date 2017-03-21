// User-specific configuration
exports.sentiment_keyword = "happy"; // keyword to monitor in Twitter

// Create the credentials object for export
exports.credentials = {};

// Watson Text to Speech
// https://www.ibm.com/watson/developercloud/text-to-speech.html
exports.credentials.text_to_speech = {
    password: '',
    username: '',
};

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
