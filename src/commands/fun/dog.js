const Discord = require('discord.js');
const fetch = require('node-fetch');

async function dogCmd(message) {
    if(Math.random() < 0.5) {
        message.channel.startTyping();
        const randomDogAPI = await (await fetch("https://random.dog/woof.json")).json();
        const randomDog = new Discord.MessageAttachment(randomDogAPI.url);
        message.channel.send(randomDog);
        message.channel.stopTyping();
        return;
    } else {
        message.channel.startTyping();
        const randomDogAPI = await (await fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1")).json();
        const randomDog = new Discord.MessageAttachment(randomDogAPI[0].url);
        message.channel.send(randomDog);
        message.channel.stopTyping();
        return;
    }
}

module.exports.dogCmd = dogCmd;