const config = require('../../../config.json');
const prefix = config.prefix;

async function prefixCmd(message) {
    message.reply(`The prefix is \`${prefix}\``);
    return;
}

module.exports.prefixCmd = prefixCmd;