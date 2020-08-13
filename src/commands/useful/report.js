const Discord = require('discord.js');
const bot = new Discord.Client;
const config = require('../../../config.json');
const prefix = config.prefix;
const myID = '368115473310547969';
const functionsF = require('../../functions');
const badErr = functionsF.badErr;
const check = ':white_check_mark:';

async function reportbugCmd(message) {
    if(message.content.toLowerCase() == `${prefix}reportbug` || message.content.toLowerCase() == `${prefix}bugreport` || message.content.toLowerCase() == `${prefix}report bug` || message.cotnent.toLowerCase() == `${prefix}bug report`) {
        badErr(message);
        return;
    }
    const bugMsg = message.content.substring(13);
    //eslint-disable-next-line no-unused-vars
    message.delete().catch(O_o=>{});
    bot.users.resolve(myID).send(`Bug report from ${message.author.username}: ${bugMsg}`);
    message.reply(`${check} Your bug report has been sent.`);
    return;
}

module.exports.bugreportCmd = reportbugCmd;