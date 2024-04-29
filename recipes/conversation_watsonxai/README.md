# Conversation using watsonx
> :robot: :microphone: Build a talking robot with watsonx.ai and Llama 3 🦙

This recipe uses [watsonx.ai](https://www.ibm.com/products/watsonx-ai), [Watson Machine Learning](https://www.ibm.com/products/watson-studio), [Speech to Text](https://www.ibm.com/products/speech-to-text) and [Text to Speech](https://www.ibm.com/products/text-to-speech) services to turn TJBot into an adept conversational partner.

## Hardware
This recipe requires a TJBot with a microphone, a speaker, and (optionally) an LED.

## Configure
> 🤖 Prerequisite: Make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

### Install dependencies
Open a Terminal, navigate to the `tjbot/recipes/conversation_watsonxai` directory, and install the dependencies.

```sh
$ cd tjbot/recipes/conversation_watsonxai
$ npm install
```

### Create instances of IBM Cloud AI services
Create instances of the [Watson Machine Learning](https://cloud.ibm.com/catalog/services/watson-machine-learning), [Speech to Text](https://cloud.ibm.com/catalog/services/speech-to-text), and [Text to Speech](https://cloud.ibm.com/catalog/services/text-to-speech) services. Download the authentication credentials file for each service, except Watson Machine Learning. Combine each of these files into a single file named `ibm-credentials.env` and place it in the `tjbot/recipes/conversation_watsonxai` folder. See `ibm-credentials.sample.env` for an example.

### Create an IBM Cloud API Key
The first step is to create an API key to connect to the watsonx.ai service in the IBM Cloud.

1. Navigate to the [IBM Cloud IAM API Keys](https://cloud.ibm.com/iam/apikeys) page.
2. Click the blue "Create" button.
3. Type a name for your API key and click "Create" (we recommend "TJBot"!)
4. Copy the API key. Important: Once you close the dialog, you will not be able to retrieve this API key in the future; instead, you will need to revoke the key and generate a new one.

Next, make a copy of TJBot's sample configuration file.

```sh
$ cp tjbot.sample.toml tjbot.toml
$ nano tjbot.toml
```

In the `[Recipe]` section, fill in the `ibmCloudApiKey` configuration parameter.

```toml
ibmCloudApiKey = '' # FILL IN WITH YOUR IBM CLOUD API KEY
```

### Create an instance of watsonx.ai
The next step is to create a new instance of the watsonx.ai service.

1. Launch [watsonx.ai](https://dataplatform.cloud.ibm.com/wx/home?context=wx&apps=cos&nocache=true&onboarding=true&quick_start_target=watsonx)
2. Sign up or login.
3. Click the "+" sign in the "Projects" section. Follow the steps to create a new project.
4. Open the project and click the "Manage" tab.
5. From the "General" section copy your project ID. Save this for later.
6. Next click "Services & integrations".
7. Click "Associate service" and select the "Watson Machine Learning" service.
8. Click "Associate" at the bottom right.
9. For your endpoint URL, visit the [API documentation](https://cloud.ibm.com/apidocs/machine-learning) and select a URL under `Endpoint URLs` that corresponds to the region in which you created your service.

Edit your TJBot configuration file.

```sh
$ nano tjbot.toml
```

In the `[Recipe]` section, fill in the `projectId` and `endpoint` configuration parameters.

```toml
projectId = '' # FILL IN WITH YOUR WATSONX.AI PROJECT ID
endpoint = '' # FILL IN WITH YOUR WATSONX.AI ENDPOINT URL
```

### (Optional) Configure your LED
If you are using an LED, edit the `tjbot.toml` file to indicate which kind of LED you are using by specifying it in the `[Recipe]` section. This example shows the configuration for a NeoPixel LED.

```toml
useNeoPixelLED = true     # set to true if using a NeoPixel LED
useCommonAnodeLED = false # set to true if using a Common Anode LED
```

## Run
Run the recipe using `npm`:

```sh
$ npm start
```

Now you can have a chat with TJBot!

## Customize

Try updating the [parameters](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-parameters.html?context=wx&audience=wdp) in your `tjbot.toml` file to experiment with different configurations. 

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

# Contribute
See [CONTRIBUTING.md](../../CONTRIBUTING.md).

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

