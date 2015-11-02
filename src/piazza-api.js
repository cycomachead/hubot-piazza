/* Piazza API helper for hubot-piazza */


var piazza = require('piazza-api');

function getPiazzaMessage (username, password, classID, postNumber) {
    return 'Class ID: ' + classID;
}

module.exports.getPiazzaMessage = getPiazzaMessage;