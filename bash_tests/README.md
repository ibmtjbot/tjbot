## Bash Scripts to test Watson AI Services

This folder contains bash scripts that are using **curl** command to call Watson APIs as explained on Watson getting started pages.

Test whether **curl** is installed. Run the following command on the command line. 

```bash
curl -V
```

If the output lists the curl version with SSL support, you are all set otherwise install it.

```bash
sudo apt install curl
```
To run a script, 
* change to the folder where you have the scripts:
```bash
cd ~/TJBOT/bash_tests
```
* type **./** followed by the name of script file then space then your api-key for the related service

```bash
./tone_analyzer_4.sh pomy6gsgO4kmjtNa3eiuhg7haziujhyf0Ps8WxTrIom6
```

example output:

```json
{"utterances_tone":[

    {"utterance_id":0,
        "utterance_text":"Hello, I'm having a problem with your product.",
        "tones":[{  "score":0.686361,
                    "tone_id":"polite",
                    "tone_name":"Polite"}]},

    {"utterance_id":1,
        "utterance_text":"OK, let me know what's going on, please.",
        "tones":[{  "score":0.92724,
                    "tone_id":"polite",
                    "tone_name":"Polite"}]},

    {"utterance_id":2,"utterance_text":"Well, nothing is working :(",
        "tones":[{  "score":0.997795,
                    "tone_id":"sad",
                    "tone_name":"Sad"}]},

    {"utterance_id":3,"utterance_text":"Sorry to hear that.",
        "tones":[{  "score":0.730982,
                    "tone_id":"polite",
                    "tone_name":"Polite"},

                 {  "score":0.672499,
                    "tone_id":"sympathetic",
                    "tone_name":"Sympathetic"}]}
    ]
}
```

Please note the following:

* api-key is the only parameter that you need to pass to the script
* script output will be either text in json format or a file that will be written to a subfolder
* scripts are modified version from what is given by Watson getting started to make it easier to understand
* service URLs are embedded inside the script, you might need to change it if you are using different service version
* you can get more details/help/examples on Watson Portal.
