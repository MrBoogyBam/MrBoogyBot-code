const config = require('../../../config.json');
const prefix = config.prefix;
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const functionsF = require('../../functions.js');
const badErr = functionsF.badErr;
const check = ':white_check_mark:'


async function guesssetCmd(message) {
    const args = message.content.substring(prefix.length).split(" ");
    args.shift();
    if(message.content.toLowerCase() == `${prefix}guessset`) {
        message.reply(':x: You have to set a range.');
        return;
    }
    let guessNums = args.shift().split("/");
    guessNums[0] = +guessNums[0], 10;
    guessNums[1] = +guessNums[1], 10;
    let randomNum = Math.floor((Math.random() * (guessNums[1] - guessNums[0] + 1)) + guessNums[0]);
    if(guessNums[0] == Infinity || guessNums[1] == Infinity) {
        badErr(message);
        return;
    }
    if(guessNums[0] > guessNums[1]) {
        badErr(message);
        return;
    }
    if(guessNums.length >= 3) {
        badErr(message);
        return;
    }
    if(isNaN(guessNums[0]) || isNaN(guessNums[1])) {
        badErr(message);
        return;
    }
    await keyv.set('selected-numbers'+message.author.id+message.channel.id, guessNums);
    await keyv.set('random-number'+message.author.id+message.channel.id, randomNum);
    if(guessNums[0] <= -1000000 || guessNums[1] >= 1000000) {
        message.reply(`${check} glhf`);
        return;
    }
    message.reply(`${check} Done.`);
    return;
}

async function guessCmd(message) {
    if(message.content.toLowerCase() == `${prefix}guess`) {
        badErr(message);
        return;
    }
    let guessNums = await keyv.get('selected-numbers'+message.author.id+message.channel.id);
    let randomNum = await keyv.get('random-number'+message.author.id+message.channel.id);
    let userNum = message.content.substring(8);
    if(!guessNums) {
        message.reply(`You have to set the number first by using \`${prefix}guessset\``);
        return;
    }
    if(isNaN(userNum)) {
        badErr(message);
        return;
    }
    if(userNum < guessNums[0] || userNum > guessNums[1]) {
        message.reply(`Your number has to be between ${guessNums[0]}-${guessNums[1]}`);
        return;
    }
    if(userNum < randomNum) {
        message.channel.send(`The number is higher than ${userNum}`);
        return;
    }
    if(userNum > randomNum) {
        message.channel.send(`The number is lower than ${userNum}`);
        return;
    }
    if(userNum == randomNum) {
        message.channel.send(`The number was ${randomNum}, you got it!`);
        randomNum = Math.floor((Math.random() * (guessNums[1] - guessNums[0])) + guessNums[0]);
        await keyv.set('random-number'+message.author.id+message.channel.id, randomNum);
        return;
    }
}


module.exports.guesssetCmd = guesssetCmd;
module.exports.guessCmd = guessCmd;