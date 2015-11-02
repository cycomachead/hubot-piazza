# Description
#   Get info about posts in your class' Piazza forum in chat!
#
# Configuration:
#   HUBOT_PIAZZA_ROOMS - See README.md for configuration detauks.
#   HUBOT_PIAZZA_USERNAME
#   HUBOT_PIAZZA_PASSWORD
#
# Commands:
#   @(\d+) - Match a Piazza post number, and return a link
#   Hubout piazza email - Show email address Hubot is using to access Piazza.
#
# Author:
#   Michael Ball <cycomachead@gmail.com>

qs = require('querystring')

piazzaAPI = require('./piazza-api.js');

# Get Config values
uname = process.env.HUBOT_PIAZZA_USERNAME
passw = process.env.HUBOT_PIAZZA_PASSWORD
rooms = process.env.HUBOT_PIAZZA_ROOMS
ROOMS_MAP = {}

DEFAULT = 'DEFAULT'

# Config is a URL encoded QS as described in README.md
# Format is either: 'classID' or 'roomID=classID&room2=class2'
getClassID = (chatroom) ->
  if (rooms.indexOf('=') == -1)
    return rooms
  mappings = qs.parse(rooms)
  if not mappings[chatroom] and mappings[DEFAULT]
    return mappings[DEFAULT]
  return mappings[chatroom]
  
module.exports = (robot) ->
  robot.respond /.*piazza (user(name)?|email).*/i, (res) ->
    res.send "The Piazza email address is: #{uname}"
  
  if !uname
    robot.logger.warning 'HUBOT_PIAZZA_USERNAME is not set.'
  if !passw
    robot.logger.warning 'HUBOT_PIAZZA_PASSWORD is not set.'
  if !rooms
    robot.logger.warning 'HUBOT_PIAZZA_ROOMS is not set.'

  if !uname || !passw || !rooms
    return
  
  robot.hear /@(\d+)/i, (res) ->
    classID = getClassID res.message.room
    num = res.match[1]
    if !classID
      robot.logger.warning "No Piazza Class ID found for room: #{res.room}"
      return
    
    piazzaAPI.getPiazzaMessage(uname, passw, classID, num).then(
      (text) -> res.send text,
      (err) -> res.send "A Piazza Error Occurred for post #{num}: #{err}" )

