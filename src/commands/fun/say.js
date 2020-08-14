const config = require('../../../config.json');
const prefix = config.prefix;

async function sayCmd(message) {
    if(message.content.toLowerCase() == `${prefix}say`) {
        message.channel.send('_ _');
        return;
    }
    const sayMsg = message.content.substring(6);
    //eslint-disable-next-line no-unused-vars
    message.delete().catch(O_o=>{});
    message.channel.send(sayMsg);
    return;
}

module.exports.sayCmd = sayCmd;