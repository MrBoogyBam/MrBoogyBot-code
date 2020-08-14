const Discord = require('discord.js');
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');

async function rpsCmd(message) {
    let rps = ["rock", "paper", "scissors"];
    let rpsRNG = Math.floor(Math.random() * rps.length);
    let botChoice = rps[rpsRNG];
    let botChoiceN = rps.indexOf(botChoice);
    let rpsChan = message.channel;
    let filter = m => m.author.id === message.author.id;
    let colCounter = 1;
    let msgCollector = new Discord.MessageCollector(rpsChan, filter);
    message.channel.send('Pick one: rock, paper or scissors');
    // eslint-disable-next-line no-unused-vars
    msgCollector.on('collect', async(message, collect) => {
        colCounter = colCounter++;
        if(colCounter == 1) {
            if(message.content.toLowerCase() !== "rock" && message.content.toLowerCase() !== "paper" && message.content.toLowerCase() !== "scissors") {
                message.channel.send(':x: You have to pick rock, paper or scissors.');
                return;
            }
            let userChoice = message.content.toLowerCase();
            await keyv.set('rps-user-choice', userChoice);
            let userChoiceN = rps.indexOf(userChoice);
            await keyv.set('rps-user-choice-number', userChoiceN);
            msgCollector.stop();
        }
    });
    // eslint-disable-next-line no-unused-vars
    msgCollector.on('end', async collected => {
        let userChoice = await keyv.get('rps-user-choice');
        let userChoiceN = await keyv.get('rps-user-choice-number');
        if(userChoice == botChoice) {
            message.channel.send(`${botChoice}, It's a tie.`);
            return;
        } else if( (userChoiceN + 1) % 3 == botChoiceN) {
            message.channel.send(`${botChoice}, I win!`);
            return;
        } else {
            message.channel.send(`${botChoice}, You win!`);
            return;
        }
    });
    return;
}

module.exports.rpsCmd = rpsCmd;