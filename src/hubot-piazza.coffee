# Description
#   A simple hubot script to integrate with Piazza.com
#
# Configuration:
#   HUBOT_PIAZZA_ROOMS - See README.md for configuration detauks.
#   HUBOT_PIAZZA_USERNAME
#   HUBOT_PIAZZA_PASSWORD
#
# Commands:
#   @(\d+) - Match a Piazza post number, and return a link.
#
# Notes:
#   <optional notes required for the script>
#
# Author:
#   Michael Ball <cycomachead@gmail.com>

qs = require('querystring')

piazzaAPI = require('./piazza-api.js');


# Config is a URL encoded QS as described in README.md
# Format is either: 'classID' or 'roomID=classID&room2=class2'
getClassID = (room) ->
  config = process.env.HUBOT_PIAZZA_ROOMS
  if (config.indexOf('=') == -1)
    return config
  mappings = qs.parse(config)
  return mappings[room]
  
module.exports = (robot) ->
  uname = process.env.HUBOT_PIAZZA_USERNAME
  passw = process.env.HUBOT_PIAZZA_PASSWORD
  rooms = process.env.HUBOT_PIAZZA_ROOMS
  
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

