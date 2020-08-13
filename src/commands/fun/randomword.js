const Discord = require('discord.js');
const fetch = require('node-fetch');
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');

async function randomwordCmd(message) {
    const randomWord = await (await fetch("https://random-word-api.herokuapp.com/word?number=1&swear=0")).json();
    if(randomWord.includes('nigga' || 'nigger')) {
        message.channel.send(`:x: Something went wrong, please try again.`);
        return;
    }
    let RWTime = new Date().getTime();
    let RWChannelID = message.channel.id;
    await keyv.set('random-word-channel', RWChannelID);
    await keyv.set('random-word-time'+message.channel.id, RWTime);
    await keyv.set('random-word'+message.channel.id, (await message.channel.send(randomWord)).content);
    return;
}

async function randomwordW(message) {
    let timeInMSCalRW = (new Date().getTime() - await keyv.get('random-word-time'+message.channel.id));
    let timeInSecondsRW = Math.floor(timeInMSCalRW / 1000);
    let timeInMSRW = timeInMSCalRW % 1000;
    message.channel.send(`${message.author.username} typed the word in ${timeInSecondsRW} seconds and ${timeInMSRW}ms`);
    await keyv.delete('random-word'+message.channel.id);
    return;
}

module.exports.randomwordCmd = randomwordCmd;
module.exports.randomwordW = randomwordW;