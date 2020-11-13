# IBM TJBot
<img src="images/tjbot.jpg" width="85%">

[Maker Kits](http://ibm.biz/mytjbot) are a collection of DIY open source templates to build things with IBM AI services in a fun and easy way. [IBM TJBot](http://ibm.biz/mytjbot) is the first maker kit in the collection. You can 3D print or laser cut the robot body, then use one of our [recipes](recipes) to bring him to life!

In addition, you can unleash your own creativity and create new recipes that bring TJBot to life using any of the available IBM AI services!

**TJBot only works with a Raspberry Pi.**

# Build TJBot
You can make your own TJBot in a number of ways.

- **3d Print or Laser Cut**. If you have access to a 3D printer or laser cutter, you can print/cut TJBot yourself. Begin by downloading the [design files](https://ibmtjbot.github.io/#gettj) and firing up your printer/cutter.
- **TJBot Full Kit**. You can order a full TJBot kit with the laser cut cardboard and all the electronics from [Sparkfun](https://www.sparkfun.com/products/14123), [Adafruit](https://www.adafruit.com/product/3462), or [Robotkingdom](http://shop.robotkingdom.com.tw/raspberry-pi/tjbot01.html).
- **TJBot Cardboard Kit**. You can purchase the TJBot laser cut cardboard from [Texas Laser Creations](http://texlaser.com).

## Electronics
There are a number of components you can add to TJBot to bring him to life. Not all of these are required for all recipes.

- [Raspberry Pi 3 + SD card preloaded with NOOBS](https://www.amazon.com/Vilros-Raspberry-Complete-Starter-Clear/dp/B01CUMNIV8/). **This is a required component to make TJBot work!** 🤖
- LED. We recommend the [NeoPixel RGB LED (8mm)](https://www.adafruit.com/product/1734), although TJBot supports Common Anode LEDs as well. Note that if you are not using a NeoPixel LED, you may also need to add resistors between it and the Raspberry Pi. Neopixel LEDs do not require resistors.
- [Female-to-female jumper wires](https://www.amazon.com/dp/B00KOL5BCC/). TJBot will only need 3 of these wires, so you’ll have extra.
- [Female-to-male jumper wires](https://www.amazon.com/dp/B00PBZMN7C/). TJBot will only need 3 of these wires, so you’ll have extra.
- [USB Microphone](https://www.amazon.com/gp/product/B00IR8R7WQ/). Other brands of USB microphones should also work.
- Mini Speaker. We recommend any small speaker with the ability to connect to a 3.5mm audio jack. We've had much success with the [Anker Mini Bluetooth Speaker](https://www.anker.com/uk/products/variant/pocket-bluetooth-speaker/A7910011), although this product has been discontinued as of 2018. For the best audio experience, we recommend using a [USB Audio Adapter](https://www.adafruit.com/product/1475) to avoid audio interference with the LED and to avoid difficulties in making Bluetooth speakers work reliably.
- [Servo Motor](https://www.amazon.com/RioRand-micro-Helicopter-Airplane-Controls/dp/B00JJZXRR0/). Note that the red (middle) wire is 5v, the brown wire is ground, and the orange wire is data.
- [Raspberry Pi Camera](https://www.amazon.com/dp/B01ER2SKFS/). Either the 5MP or 8MP camera will work.

## Assembly
Once you have obtained your TJBot, please refer to [the assembly instructions](http://www.instructables.com/id/Build-TJ-Bot-Out-of-Cardboard/) to put it all together.

For reference, here is the wiring diagram to hook up a Neopixel LED and servo to your Raspberry Pi.

![](images/wiring.png)

TJBot expects LEDs and servos to be connected to specific kinds of pins, including voltage (+3.3v or +5v), ground, and data. See [https://pinout.xyz](https://pinout.xyz) for a complete pin diagram. The tables below shows the default pins expected for different components, although these pin numbers can be overridden in TJBot's configuration.

### Neopixel LED

| PIN type | PIN Name | Physical PIN |
|---|---|---|
| Data | GPIO 18 | Physical 12 |
| Power | +3.3v | Physical 1 |
| Ground | Ground | Physical 6 |

> 💡 Be careful when connecting the LED! If it is connected the wrong way, you may end up burning it out. The Neopixel LED has a flat notch on one side; use this to orient the LED and figure out which pin is which.

### Common Anode LED

| PIN type | PIN Name | Physical PIN |
|---|---|---|
| Red | GPIO 19 | Physical 35 |
| Power | +3.3v | Physical 17 |
| Green | GPIO 13 | Physical 33 |
| Blue | GPIO 12 | Physical 32 |

> 💡 Common Anode LEDs and Neopixel LEDs can both be connected to TJBot at the same time and will shine the same color. However, TJBot's head only has room for one LED!

### Servo

| PIN type | PIN Name | Physical PIN |
|---|---|---|
| Data (orange) | GPIO 7 | Physical 26 |
| Power (red) | +5v | Physical 2 |
| Ground (brown) | Ground | Physical 14 |

# Bring TJBot to Life
First, configure your Raspberry Pi for TJBot by running the bootstrap script.

    curl -sL http://ibm.biz/tjbot-bootstrap | sudo sh -

Next, take a look at TJBot's [recipes](recipes), which are pre-configured behaviors that bring TJBot to life using IBM's Watson AI services.

TJBot comes with these [recipes](recipes) to demonstrate different capabilities.

- Use Your Voice to Control a Light with Watson [[instructions](http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/speech_to_text)]
- Make Your Robot Respond to Emotions Using Watson [[instructions](http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/sentiment_analysis)]
- Build a Talking Robot with Watson [[instructions](http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/conversation)]
- Build a Robot Translator [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/translator)]

After checking out these recipes, we encourage you to take a look at [featured recipes](featured) created by members of the #tjbot community!

# Troubleshooting TJBot
Please take a look at the [troubleshooting guide](TROUBLESHOOTING.md) if you are having difficulties with TJBot.

# Contribute to TJBot
TJBot is an open source project designed to make it fun and easy to interact with [Watson](https://www.ibm.com/watson/products-services/). We’d love to see what you can make with him!

If you would like your own recipe included in our [featured recipe](featured) list, please [open an issue](../../issues) with a link to your repository and a demo video.

# About TJBot
[TJBot](http://ibm.biz/mytjbot) was affectionately named after Thomas J. Watson, the first Chairman and CEO of IBM. TJBot was created by [Maryam Ashoori](https://github.com/maryamashoori) at IBM Research as an experiment to find the best practices in the design and implementation of cognitive objects. He was born on November 9, 2016 via [this blog post](https://www.ibm.com/blogs/research/2016/11/calling-makers-meet-tj-bot/).

# License
This project uses the [Apache License Version 2.0](LICENSE) software license.
