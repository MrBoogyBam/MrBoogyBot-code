const check = `:white_check_mark:`

async function testCmd(message) {
    message.reply(`${check} It works!`);
    return;
}

module.exports.testCmd = testCmd;