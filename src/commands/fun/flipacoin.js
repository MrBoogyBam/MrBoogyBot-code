const config = require('../../../config.json');
const prefix = config.prefix;

async function flipacoinCmd(message) {
    if(message.content.toLowerCase() == `${prefix}flip a coin` || message.content.toLowerCase() == `${prefix}flipacoin`) {
        let sides = [ "heads", "tails" ];
        let side = Math.floor(Math.random() * sides.length);
        if(side == 0) {
            message.reply(`The coin landed on heads.`);
            return;
        }
        if(side == 1) {
            message.reply(`The coin landed on tails.`);
            return;
        }
    }
    let coinUsrChoice = message.content.substring(15);
    let sides = [ "heads", "tails" ];
    let side = Math.floor(Math.random() * sides.length);
    if(coinUsrChoice == sides[0]) {
        if(side == 0) {
            message.reply(`It's heads, you win!`);
            return;
        }
        if(side == 1) {
            message.reply(`It's tails, you lose.`);
            return;
        }
    }
    if(coinUsrChoice == sides[1]) {
        if(side == 0) {
            message.reply(`It's heads, you lose.`);
            return;
        }
        if(side == 1) {
            message.reply(`It's tails, you win!`);
            return;
        }
    }
    if(coinUsrChoice !== sides[0] || coinUsrChoice !== sides[1]) {
        message.reply(':x: You can only pick heads or tails.');
        return;
    }
}

module.exports.flipacoinCmd = flipacoinCmd;