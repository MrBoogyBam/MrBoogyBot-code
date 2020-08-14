const config = require('../../../config.json');
const prefix = config.prefix;
const functionsF = require('../../functions.js');
const badErr = functionsF.badErr;
const check = ':white_check_mark:'

async function remindmeCmd(message) {
    const args = message.content.substring(prefix.length).split(" ");
    args.shift();
    let number = args[0];
    let unitAmounts = {
        second: 1000,
        seconds: 1000,
        minute: 1000 * 60,
        minutes: 1000 * 60,
        hour: 1000 * 60 * 60,
        hours: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24,
        days: 1000 * 60 * 60 * 24,
        week: 1000 * 60 * 60 * 24 * 7,
        weeks: 1000 * 60 * 60 * 24 * 7,
        month: 1000 * 60 * 60 * 24 * 30,
        months: 1000 * 60 * 60 * 24 * 30,
        year: 1000 * 60 * 60 * 24 * 365,
        years: 1000 * 60 * 60 * 24 * 365
    }
    let tUnit = args[1];
    let rmMsgL = message.url;
    if(isNaN(number) || unitAmounts[args[1]] == undefined) {
        badErr(message);
        return;
    }
    number = number * unitAmounts[tUnit];
    console.log(number);
    setTimeout(() => {
        message.author.send(`reminder: ${rmMsgL}`);
    }, number);
    message.reply(`${check} Okay.`);
    return;
}

module.exports.remindmeCmd = remindmeCmd;