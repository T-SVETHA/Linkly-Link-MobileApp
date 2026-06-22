const assert = require('assert');

// Simulate real-world delay (network request, animation, processing)
const simulateDelay = (min = 100, max = 500) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

// Custom wrapper to pass metadata to Mocha reporter
const testScenario = (id, moduleName, screenName, scenarioName, expectedResult, testFn) => {
    it(scenarioName, async function () {
        this.test.metadata = {
            id,
            module: moduleName,
            screen: screenName,
            scenario: scenarioName,
            expected: expectedResult,
        };
        await testFn(this);
    });
};

module.exports = {
    simulateDelay,
    testScenario
};
