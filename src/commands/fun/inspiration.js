const Discord = require('discord.js');
const fetch = require('node-fetch');

async function inspirationCmd(message) {
    message.channel.startTyping();
    let insAPI = await (await fetch("https://inspirobot.me/api?generate=true&oy=vey")).text();
    let insQ = new Discord.MessageAttachment(insAPI);
    message.channel.send(insQ);
    message.channel.stopTyping();
    return;
}

module.exports.inspirationCmd = inspirationCmd;