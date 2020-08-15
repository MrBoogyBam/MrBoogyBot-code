async function pimgCmd(message) {
    const msgpimg = await message.channel.send('🏓Pimgimg...');
    msgpimg.edit(`🏓Pomg!\nLatemcy is ${Math.floor(msgpimg.createdTimestamp - message.createdTimestamp)}ms`);
    return;
}

async function pingCmd(message) {
    const msg = await message.channel.send('🏓Pinging...');
    msg.edit(`🏓Pong!\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`);
    return;
}

module.exports.pingCmd = pingCmd;
module.exports.pingCmd = pimgCmd;