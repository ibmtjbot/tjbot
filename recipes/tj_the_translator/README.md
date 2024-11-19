# Chat with TJ
> :robot: :microphone: Build a talking robot with watsonx.ai!

This recipe uses IBM [watsonx.ai](https://www.ibm.com/products/watsonx-ai), [Speech to Text](https://www.ibm.com/products/speech-to-text) and [Text to Speech](https://www.ibm.com/products/text-to-speech) services to turn TJBot into a conversational partner.

## Hardware
This recipe requires a TJBot with a microphone, a speaker, and (optionally) an LED.

## Configure
> 🤖 Prerequisite: Make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

### Install dependencies
Open a Terminal, navigate to the `tjbot/recipes/chat_with_tj` directory, and install the dependencies.

```sh
$ cd tjbot/recipes/chat_with_tj
$ npm install
```

### Create instances of IBM Cloud AI services
Create instances of the [Speech to Text](https://cloud.ibm.com/catalog/services/speech-to-text), and [Text to Speech](https://cloud.ibm.com/catalog/services/text-to-speech) services. Download the authentication credentials file for each service and combine them into a single file named `ibm-credentials.env`. Place this file in the `tjbot/recipes/chat_with_tj` folder. See `ibm-credentials.sample.env` for an example.

### Create an IBM Cloud API Key
Create an API key to connect to watsonx.ai in the IBM Cloud.

1. Visit the [IBM Cloud IAM API Keys](https://cloud.ibm.com/iam/apikeys) page.
2. Click the blue "Create" button.
3. Type in a name for your API key and click "Create" (we recommend "TJBot"!)
4. Copy the API key. **Important**: Once you close the dialog, you will not be able to retrieve this API key in the future; instead, you will need to revoke the key and generate a new one.
5. Open the `ibm-credentials.env` file and paste the API key next to `WATSONX_AI_APIKEY=`.

### Create a watsonx.ai Project
Create a watsonx.ai project.

1. Launch [watsonx.ai](https://dataplatform.cloud.ibm.com/wx/home?context=wx)
2. Sign up or login.
3. Click the "+" sign in the "Projects" section. Follow the steps to create a new project.
4. Open the project and click the "Manage" tab.
5. From the "General" section copy your `projectId`. Save this for later.
6. Next click "Services & integrations".
7. Click "Associate service" and select the "Watson Machine Learning" service.
8. Click "Associate" at the bottom right.
9. Find your `serviceUrl` by visiting the [API documentation](https://cloud.ibm.com/apidocs/machine-learning) and locating the section titled "Endpoint URLs." Copy the URL that corresponds to the region in which you created your Watson Machine Learning service, you will need it in the next step.

### Update TJBot's Configuration
Make a copy of TJBot's sample configuration file.

```sh
$ cp tjbot.sample.toml tjbot.toml
```

Open `tjbot.toml` in a text editor. In the `[Recipe]` section, fill in the `projectId` and `serviceUrl` configuration parameters from watsonx.ai.

```toml
projectId = '' # FILL IN WITH YOUR WATSONX.AI PROJECT ID
serviceUrl = 'https://us-south.ml.cloud.ibm.com' # CHANGE THIS IF YOUR SERVICEURL IS IN A DIFFERENT REGION
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
$ sudo npm start
```

Now you can chat with TJBot!

## Customize

### Shine while speaking
Have an LED hooked up to your TJBot? Update your `tjbot.toml` file to indicate which kind of LED you have by setting one (or both) of these values to `true`:

```toml
useNeoPixelLED = false     # set to true if using a NeoPixel LED
useCommonAnodeLED = false  # set to true if using a Common Anode LED
```

Then, TJBot will shine green when listening, orange when processing your speech, and yellow when speaking!

### Try a different LLM
Want to try a different large language model? Check out the [full list of large language models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-model-ids.html?context=wx&audience=wdp) supported by watsonx.ai. and then change the `modelId` parameter in your `tjbot.toml` file.

```toml
modelId = 'meta-llama/llama-3-70b-instruct'
```

You can also try changing different [model parameters](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-parameters.html?context=wx&audience=wdp), such as the `modelDecodingMethod` and the `modelTemperature` to change how TJBot responds to you.

### Change TJBot's voice
Find a new voice for TJBot! Check out the [list of Speech to Text voices](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices) and updatte the `voice` parameter in your `tjbot.toml` file. Try different voices such as Lisa (`en-US_LisaV3Voice`), Kate (`en-GB_KateV3Voice`), or Emma (`en-US_EmmaExpressive`)!

## Troubleshoot
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# IBM Cloud Services
- [watsonx.ai](https://www.ibm.com/products/watsonx-ai)
- [Text to Speech](https://www.ibm.com/products/text-to-speech)
- [Speech to Text](https://www.ibm.com/products/speech-to-text)

# Contribute
See [CONTRIBUTING.md](../../CONTRIBUTING.md).

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

