const config = require('../../../config.json');
const prefix = config.prefix;

async function invalidErr(message) {
    message.reply(`Invalid command. Type \`${prefix}help\` for a list of commands.`);
    return;
}

module.exports.invalidErr = invalidErr;