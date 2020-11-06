# Troubleshooting TJBot
Having difficulties making a TJBot recipe work? Please see these frequently asked questions.

## Testing your TJBot's hardware
As TJBot has a number of hardware components that may or may not be hooked up correctly, we provide an additional set of hardware tests. These tests are contained in the `tests` directory and may be run via `npm run-script`. See the [instructions for running the hardware tests](bootstrap/README.md) for more detail.

## How to debug TJBot
TJBot uses the `winston` library to log information about its internal operation. You can adjust the log level through the `log.level` configuration parameter as follows:

    const tj = new TJBot({
        log: {
            level: 'verbose'
        }
    });

`winston` defines an number of logging levels, but in general the ones used by TJBot are `info` (lowest detail), `verbose` (more detail), and `silly` (highest level of detail).

If you have an issue with TJBot, try increasing the log level first to see more detail as to what could be going on.

## LED Issues

### LED not lighting up
If the LED does not light up, you can try moving the power from 3.3 to 5 volts. If neither the 3.3v or 5v pins work, you will need a 1N4001 diode. The diode is inserted between the power pin of the LED (the shorter of the two middle pins) and the 5v pin on the Raspberry Pi.

### LED showing the wrong color
By default, TJBot sends colors to the LED in "RGB" format. Some LEDs may expect colors to be sent in the "GRB" format. The configuration option `shine.grbFormat` lets you switch between these two formats.

    const tj = new TJBot({
        shine: {
            grbFormat: true
        }
    });

### LED still showing the wrong color
If the LED shows the wrong color, or flashes different colors very rapidly, it may be due to interference with the built-in audio hardware. Depending on your configuration of Raspbian, the sound drivers may be more aggressive in taking away control of GPIO 18 from other processes. If your LED shows random colors instead of the expected color, use this trick to fix it.

    sudo cp bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
    sudo update-initramfs -u
    sudo reboot

After TJBot finishes rebooting, confirm no "snd" modules are running.

    lsmod

### LED not working on a Raspberry Pi 4
There is a known issue in the `rpi-ws281x-native` library on Raspberry Pi 4 that prevents the LED from shining. There is a software workaround which involves checking out code from a special branch. As of this writing, this branch has not been merged into the main `rpi-ws281x-native` library. Within the `tjbot/recipes/speech_to_text` directory, run the following commands:

    npm install rpi-ws281x-native@latest
    git clone --single-branch --branch raspi4support https://github.com/jimbotel/rpi_ws281x.git
    cp -r rpi_ws281x/* node_modules/rpi-ws281x-native/src/rpi_ws281x
    npm build node_modules/rpi-ws281x-native

### Additional LED difficulties
If you have additional difficulties not covered in this guide, please refer to [Adafruit's NeoPixel on Raspbeery Pi guide](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview) to troubleshoot.

## Speaker issues
