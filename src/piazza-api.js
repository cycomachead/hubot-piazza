/* Piazza API helper for hubot-piazza */


var piazza = require('piazza-api');
var moment = require('moment');
var $ = require('cheerio');

function getPiazzaPost (username, password, classID, number) {
    return piazza.login(username, password)
    .then(function (user) {
        return user.getClassById(classID);
    }).then(function (course) {
        return course.getContentById(number);
    });
}

function formatPostInfo (postData, num) {
    console.log(postData);
    var intro, url, timeago, snippet, title;
    
    intro = 'Post @' + num + ':'; 
    title = postData.title;
    title = title.length > 40 ? title.slice(0, 40) + '…' : title;
    // Extract content from any html tag, but usually it's <p>
    snippet = $.load(postData.content)('*').text();
    snippet = snippet.length > 125 ? snippet.slice(0,   125) + '…' : snippet;
    timeago = 'From: ' + moment(postData.created).fromNow();    
    url = piazzaURL(postData.classId, num);
    
    return  [ intro, url, timeago, title, snippet ].join('\n\t');
}

function piazzaURL (courseID, postNum) {
    return 'https://piazza.com/class/' + courseID + '?cid=' + postNum;
}

function getPiazzaMessage (username, password, classID, postNumber) {
    return getPiazzaPost(username, password, classID, postNumber)
        .then(function (post) {
            return formatPostInfo(post, postNumber);
        });
}

module.exports.getPiazzaMessage = getPiazzaMessage;