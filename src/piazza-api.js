/* Piazza API helper for hubot-piazza */


var piazza = require('piazza-api');
var moment = require('moment');
var $ = require('cheerio');

function getPiazzaPost (username, password, classID, number) {
    return piazza.login(username, password)
    .then(function (user) {
        console.log('Logged Into Piazza for ', username);
        return user.getClassById(classID);
    }).then(function (course) {
        console.log('Got Course Data: ', classID);
        return course.getContentById(number);
    });
}

function formatPostInfo (postData, num) {
    console.log('ZOMG: Post Data:  ', postData);
    var url, timeago, snippet, title;
    
    title = postData.title;
    title = title.slice(50) + (title.length > 50 ? '…' : '');
    // TODO: Cleanup
    snippet = postData.content;
    // TODO: moment JS
    timeago = postData.created;
    
    url = piazzaURL(postData.classID, num);
    
    return  [ title, snippet, timeago, url ].join('\n');
}

function piazzaURL (courseID, postNum) {
    return 'https://piazza.com/class/' + courseID + '?cid=' + postNum;
}

function getPiazzaMessage (username, password, classID, postNumber) {
    console.log('getting message:  ', postNumber);
    return getPiazzaPost(username, password, classID, postNumber)
        .then(function (post) {
            console.log('message promise');
            return formatPostInfo(post, postNumber);
        });
}

module.exports.getPiazzaMessage = getPiazzaMessage;