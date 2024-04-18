# Conversation using watsonx
> Chat with TJBot using a LLM!

This recipe uses [watsonx.ai](https://www.ibm.com/products/watsonx-ai), [Watson Machine Learning](https://www.ibm.com/products/watson-studio), [Speech to Text](https://www.ibm.com/products/speech-to-text) and [Text to Speech](https://www.ibm.com/products/text-to-speech) services to turn TJ into a chatting robot.

## Hardware
This recipe requires a TJBot with a microphone and a speaker.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/conversation_watsonxai` folder and install the dependencies.

    $ cd tjbot/recipes/conversation_watsonxai
    $ npm install

Create instances of the [Watson Machine Learning](https://cloud.ibm.com/catalog/services/watson-machine-learning), [Speech to Text](https://cloud.ibm.com/catalog/services/speech-to-text), and [Text to Speech](https://cloud.ibm.com/catalog/services/text-to-speech) services and download the authentication credentials file for each service except Watson Machine Learning. Combine each of these files into a single file named `ibm-credentials.env` and place it in the `tjbot/recipes/conversation_watsonxai` folder. See `ibm-credentials.sample.env` for an example.

Setup watsonx

1. Launch [watson]x(https://dataplatform.cloud.ibm.com/wx/home?context=wx&apps=cos&nocache=true&onboarding=true&quick_start_target=watsonx)
2. Sign up or login.
3. Click the "+" sign in the "Projects" section. Follow the steps to create a new project.
4. Open the project and click the "Manage" tab.
5. From the "General" section copy your project ID. Save this for later.
6. Next click "Services & integrations".
7. Click "Associate service" and select the "Watson Machine Learning" service.
8. Click "Associate" at the bottom right.
9. For your endpoint URL, visit the [API documentation](https://cloud.ibm.com/apidocs/machine-learning) and select a URL under `Endpoint URLs` that corresponds to the region you created your service in.

Make a copy of the default configuration file and enter your watsonx endpoint and project ID.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your endpoint and the watsonx project ID in the specified places>

Create a IBM Cloud API Key

1. Navigate to the [IBM Cloud IAM API Keys](https://cloud.ibm.com/iam/apikeys) page.
2. Click the blue "Create" button.
3. Type a name for your API key and click "Create".
4. Copy this API key.
5. Paste the API key in your `ibm-credentials.env` file for `IBM_CLOUD_APIKEY`.

Run!

    $ sudo node conversation.js

> Note the `sudo` command. Root user access is required to run TJBot recipes. Now you can have a chat with TJBot!

Try It Yourself

Try updating the [parameters](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-parameters.html?context=wx&audience=wdp) in your `config.js` file to experiment with different configurations. 

An **attention word** is used so TJBot knows you are talking to it. The default attention word is 'Watson', but you can change it in `config.js` by changing `robotName`:

    export default {
        robotName: 'Watson', // set this to the name you wish to use to address your tjbot!
        endpoint: '', // add your endoing from the Watson Machine Learning documentation
        project_id: '', // add your watsonx project ID here
        model_id: 'ibm/granite-13b-chat',
        version: '2023-05-29',
        parameters: {
            decoding_method: 'greedy',
            max_new_tokens: 20,
            min_new_tokens: 0,
            stop_sequences: [],
            repetition_penalty: 1
        }
    };

## Troubleshoot
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# Watson Services
- [watsonx.ai](https://www.ibm.com/products/watsonx-ai)
- [Watson Machine Learning](https://www.ibm.com/products/watson-studio)
- [Text to Speech](https://www.ibm.com/products/text-to-speech)
- [Speech to Text](https://www.ibm.com/products/speech-to-text)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
