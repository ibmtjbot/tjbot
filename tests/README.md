# TJBot Hardware Tests
These tests are provided to help you ensure your TJBot's hardware is functioning correctly. 

### Prerequisite: install dependencies
Before running any hardware tests, first install their dependencies. Run this command from within the `tjbot/tests` directory.

```
$ npm install
```

### Running hardware tests
From the `tjbot/tests` directory, you can run each of the hardware tests using `npm run-script`. Each test is interactive and will ask you whether or not TJBot performed a certain action. If you say "N", the test will fail.

```
$ npm run-script test-camera
$ npm run-script test-led
$ npm run-script test-mic
$ npm run-script test-servo
$ npm run-script test-speaker
```

> 💡 Note: The `test-mic` tests requires authentication credientials for the Tone Analyzer service. Add your `ibm-credentials.env` file to the `tests` directory before running this test.
