// Description
//   Get info about posts in your class' Piazza forum in chat!
//
// Configuration:
//   HUBOT_PIAZZA_ROOMS - See README.md for configuration detauks.
//   HUBOT_PIAZZA_USERNAME
//   HUBOT_PIAZZA_PASSWORD
//
// Commands:
//   @(\d+) - Match a Piazza post number, and return a link
//   Hubot piazza email - Show email address Hubot is using to access Piazza.
//
// Author:
//   Michael Ball <cycomachead@gmail.com>

var DEFAULT, ROOMS_MAP, allPiazzaIDs, passw, piazzaAPI, piazzaIDByRoom, qs, rooms, uname;

qs = require('querystring');

piazzaAPI = require('./piazza-api.js');

uname = process.env.HUBOT_PIAZZA_USERNAME;

passw = process.env.HUBOT_PIAZZA_PASSWORD;

rooms = process.env.HUBOT_PIAZZA_ROOMS;

ROOMS_MAP = {};

DEFAULT = 'DEFAULT';

piazzaIDByRoom = function(chatroom) {
    var mappings;
    if (rooms.indexOf('=') === -1) {
        return rooms;
    }
    mappings = qs.parse(rooms);
    if (!mappings[chatroom] && mappings[DEFAULT]) {
        return mappings[DEFAULT];
    }
    return mappings[chatroom];
};

allPiazzaIDs = function () {
    var mappings;
    mappings = qs.parse(rooms);
    return Object.keys(mappings).map(function(x) {
        return mappings[x];
    });
};

module.exports = function(robot) {
    robot.respond(/.*piazza (user(name)?|email).*/i, function(res) {
        return res.send("The Piazza email address is: " + uname);
    });
    
    if (!uname) {
        robot.logger.warning('HUBOT_PIAZZA_USERNAME is not set.');
    }
    if (!passw) {
        robot.logger.warning('HUBOT_PIAZZA_PASSWORD is not set.');
    }
    if (!rooms) {
        robot.logger.warning('HUBOT_PIAZZA_ROOMS is not set.');
    }
    
    if (!uname || !passw || !rooms) {
        return;
    }
    
    robot.hear(/piazza.com\/class\/([^\?]+)\?cid=(\d+)/i, function(res) {
        var classID, num;
        classID = res.match[1];
        num = res.match[2];
        if (allPiazzaIDs().indexOf(classID) === -1) {
            return;
        }
        piazzaAPI.getPiazzaMessage(uname, passw, classID, num).then(function(text) {
            return res.send(text);
        }, function(err) {
            return res.send("A Piazza Error Occurred for post " + num + ": " + err);
        });
    });
    
    robot.hear(/@(\d+)(?:$|\b)/i, function(res) {
        var classID, num;
        classID = piazzaIDByRoom(res.message.room);
        num = res.match[1];
        if (!classID) {
            robot.logger.warning("No Piazza Class ID found for room: " + res.room);
            return;
        }
        piazzaAPI.getPiazzaMessage(uname, passw, classID, num).then(function(text) {
            return res.send(text);
        }, function(err) {
            return res.send("A Piazza Error Occurred for post " + num + ": " + err);
        });
    });
};
