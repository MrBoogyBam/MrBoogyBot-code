const Discord = require('discord.js');
const bot = new Discord.Client;
const config = require('../../../config.json');
const prefix = config.prefix;
const myID = '368115473310547969';

async function suggestCmd(message) {
    if(message.content == `${prefix}suggest`) {
        message.reply(':x: Must put suggestion in suggestion.');
        return;
    }
    const suggestMsg = message.content.substring(10);
    //eslint-disable-next-line no-unused-vars
    message.delete().catch(O_o=>{});
    bot.users.resolve(`${myID}`).send(`Suggestion from ${message.author}: ${suggestMsg}`);
    message.reply('Your suggestion has been sent.');
    return;
}

module.exports.suggestCmd = suggestCmd;