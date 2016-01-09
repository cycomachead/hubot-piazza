/* Piazza API helper for hubot-piazza */


var piazza = require('piazza.js');
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
    var intro, url, timeago, snippet, title, type, state;
    
    type = postData.type;
    if (type == 'question') {
        state = isAnswered(postData.changeLog) ? 'Answered' : 'UNANSWERED';
        type =  state + ' ' + type;
    }
    intro = type + ' @' + num + ':'; 
    title = postData.title;
    title = title.length > 70 ? title.slice(0, 70) + '…' : title;
    // Extract content from any html tag, but usually it's <p>
    snippet = $.load(postData.content)('*').text();
    snippet = snippet.length > 200 ? snippet.slice(0,   200) + '…' : snippet;
    timeago = 'Posted: ' + moment(postData.created).fromNow();    
    url = piazzaURL(postData.classId, num);
    
    return  [ intro, url, timeago, title, snippet ].join('\n\t');
}

function piazzaURL (courseID, postNum) {
    return 'https://piazza.com/class/' + courseID + '?cid=' + postNum;
}

function isAnswered (log) {
    return log.map(function(i) { return i.type }).indexOf('i_answer') != -1;
}

function getPiazzaMessage (username, password, classID, postNumber) {
    return getPiazzaPost(username, password, classID, postNumber)
        .then(function (post) {
            return formatPostInfo(post, postNumber);
        });
}

module.exports.getPiazzaMessage = getPiazzaMessage;