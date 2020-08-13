const modpackDownload = `\nModpack: http://www.anjo2.com/goi/modpack.zip`;
const potDownloads = `__**PotPNG Mod**__\nModpack: http://www.anjo2.com/goi/modpack.zip\npotPNG: https://mega.nz/file/10MlUaDJ#eH0ECXpGFhIZblwSkTdw80FP2b-6E3iEdmiWndHDsxo\n\n`;
const potHowToDownload = `__**How to install the potPNG mod**__\n1. Open steam.\n2. Go to library.\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files.\n6. Click on "Browse Local Files"\n7. Open the PotPng.zip file.\n8. Drag the GettingOverIt_Data folder into the Getting Over It folder.\n9. Click on "Replace the files in the destination".\n10. Open the game.`;
const modpackHowToDownload = `__**How to install the modpack**__\n1. Open steam.\n2. Go to library\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files\n6. Click on "Browse Local Files".\n7. Drag all the files from the modpack.zip file to the Getting Over It folder.\n8. Open the game.`;
const potInstructions = `__**How to make a custom pot**__\n1. Open steam.\n2. Go to library\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files.\n6. Click on "Browse Local Files".\n7. Open the GettingOverIt_Data folder\n8. Open StreamingAssets folder.\n9. Open pots folder.\n10. Open PotLayout (With GIMP/Photoshop)\n11. Make a new pot.\n12. Export your pot.\n13. Rename the pot to "pot"\n14. Drag the potPNG you created into StreamingAssets folder.\n15. Open the game.`;


async function potCmd(message) {
    message.reply(`__**PotPNG mod**__\n\nPot commands:\n**${prefix}potdownload**\n**${prefix}modpackdownload**\n**${prefix}potdownload instructions**\n**${prefix}modpackdownload instructions**\n**${prefix}pot instructions**`);
    return;
}

async function potDownloadsF(message) {
    message.reply(potDownloads);
    return;
}

async function potInstructionsF(message) {
    message.reply(potInstructions);
    return;
}

async function potHowToDownloadF(message) {
    message.reply(potHowToDownload);
    return;
}

async function modpackDownloadF(message) {
    message.reply(modpackDownload);
    return;
}

async function modpackHowToDownloadF(message) {
    message.reply(modpackHowToDownload);
    return;
}

module.exports.potCmd = potCmd;
module.exports.potDownloadsF = potDownloadsF;
module.exports.potInstructionsF = potInstructionsF;
module.exports.potHowToDownloadF = potHowToDownloadF;
module.exports.modpackDownloadF = modpackDownloadF;
module.exports.modpackHowToDownloadF = modpackHowToDownloadF;