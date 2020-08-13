const config = require('../../../config.json');
const prefix = config.prefix;

async function rollCmd(message) {
    const args = message.content.substring(prefix.length).split(" ");
    args.shift();
    if(message.content.toLowerCase() == `${prefix}roll`) {
        message.reply(`:x: You have to set a range. For example: \`${prefix}roll ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``);
    }
    let rollNums = args.shift().split("/");
    rollNums[0] = +rollNums[0], 10;
    rollNums[1] = +rollNums[1], 10;
    let randomRoll = Math.floor((Math.random() * (rollNums[1] - rollNums[0] + 1)) + rollNums[0]);
    message.reply(`Your number is ${randomRoll}`);
}

module.exports.rollCmd = rollCmd;