const Discord = require('discord.js');
const fetch = require('node-fetch');

async function catCmd(message) {
    message.channel.startTyping();
    const randomCatAPI = await (await fetch('https://api.thecatapi.com/v1/images/search')).json();
    let randomCat = new Discord.MessageAttachment(randomCatAPI[0].url);
    message.channel.send(randomCat);
    message.channel.stopTyping();
    return;
}

module.exports.catCmd = catCmd;