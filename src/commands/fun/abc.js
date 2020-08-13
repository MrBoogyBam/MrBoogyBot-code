/* eslint-disable no-unused-vars */
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const abcF = require('../../../bot.js');
let abcData = {
    ABCType: true
}
module.exports.abcData = abcData;

async function abcCmd(message) {
    abcData.ABCType = true;
    message.reply('Type the English Alphabet.');
    let ABCTime = new Date().getTime();
    await keyv.set('abc-time'+message.channel.id, ABCTime);
    return;
}

async function abcCmd2(message) {
    let timeInMSCalABC = (new Date().getTime() - await keyv.get('abc-time'+message.channel.id));
    let timeInSecondsABC = Math.floor(timeInMSCalABC / 1000);
    let timeInMSABC = timeInMSCalABC % 1000
    message.reply(`${message.author.username} typed the alphabet in ${timeInSecondsABC} seconds and ${timeInMSABC}ms.`);
    abcData.ABCType = false;
    return;
}

module.exports.abcCmd = abcCmd;
module.exports.abcCmd2 = abcCmd2;