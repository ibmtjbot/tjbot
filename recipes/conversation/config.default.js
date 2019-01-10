/*
* User-specific configuration
* IMPORTANT NOTES:
*  Please ensure you do not interchange your username and password.
*  Your username is the longer value: 36 digits, including hyphens
*  Your password is the smaller value: 12 characters
*/

exports.workspaceId = ''; // replace with the workspace identifier of your conversation

// Set this to false if your TJBot does not have a camera.
exports.hasCamera = true;

// Create the credentials object for export
exports.credentials = {};

// Watson Assistant
// https://www.ibm.com/watson/services/conversation/
exports.credentials.assistant = {
    // IAM authentication key -- fill in your API key below
    apikey: 'FILL IN YOUR API KEY HERE',
    // service URL -- change this if the URL is different in your authentication credentials
    url: 'https://gateway.watsonplatform.net/assistant/api/'
};

// Watson Speech to Text
// https://www.ibm.com/watson/services/speech-to-text/
exports.credentials.speech_to_text = {
    // IAM authentication key -- fill in your API key below
    apikey: 'FILL IN YOUR API KEY HERE',
    // service URL -- change this if the URL is different in your authentication credentials
    url: 'https://stream.watsonplatform.net/speech-to-text/api/'
};

// Watson Text to Speech
// https://www.ibm.com/watson/services/text-to-speech/
exports.credentials.text_to_speech = {
    // IAM authentication key -- fill in your API key below
    apikey: 'FILL IN YOUR API KEY HERE',
    // service URL -- change this if the URL is different in your authentication credentials
    url: 'https://stream.watsonplatform.net/text-to-speech/api/'
};

// Watson Visual Recognition
// https://www.ibm.com/watson/services/visual-recognition/
exports.credentials.visual_recognition = {
    // IAM authentication key -- fill in your API key below
    apikey: 'FILL IN YOUR API KEY HERE',
    // service URL -- change this if the URL is different in your authentication credentials
    url: 'https://gateway.watsonplatform.net/visual-recognition/api'
};
