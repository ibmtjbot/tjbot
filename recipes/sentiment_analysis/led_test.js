// Run "sudo node led_test.js" from your terminal to test your LED.
// It should set your light to white and turn the LED on.

var ws281x = require('rpi-ws281x-native');
var NUM_LEDS = 1;        // Number of LEDs
ws281x.init(NUM_LEDS);   // initialize LEDs 

// ----  reset LED before exit
process.on('SIGINT', function () {
    ws281x.reset();    
    process.nextTick(function () { process.exit(0); });
});

var color = new Uint32Array(NUM_LEDS); 
ws281x.render(color);

console.log("turning ON the light");
setLED("on"); // setLED sets the light

function setLED(value) {
    if (value == "on") {
        color[0] = 0xffffff ;
    } else {
        color[0] = 0x000000 ;
    }
    ws281x.render(color);
}
