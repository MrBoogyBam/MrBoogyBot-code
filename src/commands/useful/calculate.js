const config = require('../../../config.json');
const prefix = config.prefix;
const functionsF = require('../../functions.js');
const badErr = functionsF.badErr;

async function calculateCmd(message) {
    const args = message.content.substring(prefix.length).split(" ");
    args.shift();
    if(message.content.toLowerCase() == `${prefix}calculate`) {
        badErr(message);
        return;
    }
    let calculationNums = args;
    let number1 = calculationNums[0];
    let number2 = calculationNums[2];
    let operation = calculationNums[1];
    number1 = Number(number1, 10);
    number2 = Number(number2, 10);
    if(isNaN(number1 / number2) || isNaN(number1 + number2) || isNaN(number1 - number2) || isNaN(number1 * number2) || isNaN(number1 ** number2)) {
        message.reply(':x: Math error.');
        return;
    }
    if(isNaN(number1) || isNaN(number2)) {
        message.reply(':x: You can only use integers.');
        return;
    }
    if(operation == "+") {
        message.reply(number1 + number2);
        return;
    } else if (operation == "-") {
        message.reply(number1 - number2);
        return;
    } else if (operation == "*" || operation == "x") {
        message.reply(number1 * number2);
        return;
    } else if (operation == "/" || operation == ":" || operation == "÷") {
        message.reply(number1 / number2);
        return;
    } else if (operation == "^") {
        message.reply(number1 ** number2);
        return;
    } else {
        message.reply(':x: That is not an operation.');
        return;
    }
}

module.exports.calculateCmd = calculateCmd;