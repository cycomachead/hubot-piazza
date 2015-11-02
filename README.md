# hubot-piazza
> Get info about posts in your class' Piazza forum in chat!

This is simple hubot script to integrate with [Piazza](piazza.com), an educational forum. This script makes it easy to reference posts by Piazza conventions (`@##`) in a typical chat. Since few rational people use numbers as their user names, this poses little (if any) problem in conversations.

See [`src/hubot-piazza.coffee`](src/hubot-piazza.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-piazza --save`

Then add **hubot-piazza** to your `external-scripts.json`:

```json
[
  "hubot-piazza"
]
```

## Configuration
There are 3 environment variables you must set:

* `HUBOT_PIAZZA_USERNAME` and
* `HUBOT_PIAZZA_PASSWORD`
Are the login credentials of a course TA. *NOTE*: I recommend creating a separate "bot-only" TA account for this info so that you don't risk revealing a personal password to everyone. (Of course, if you generated a random, unique, and cryptographically secure password for each service, you probably wouldn't care about others having access to your Piazza account. :stuck_out_tongue:)

* `HUBOT_PIAZZA_ROOMS`
This maps a Piazza course ID to your chat rooms. There are two options here:

* 1 ID for the chat bot:
	* This means that every room maps to the same Piazza course.
	* Simply set `HUBOT_PIAZZA_ROOMS=classId` and you're done!
* A Separate Piazza course per chatroom:
	* This allows each room to map to a particular Piazza course.
	* The format is a query string:
	* `HUBOT_PIAZZA_ROOMS='roomId1=courseId1&room2=course2'`
	* In this format there is a special room id, `DEFAULT` which you can use a fallback if you don't want to specify something for every room.
	
Piazza course ids can be found by examining URL when looking at a particular post. It follows this format:

```js
'https://piazza.com/class/' + courseID + '?cid=' + postNum;
```

## Sample Interaction

```
user1>> Checkout @100
hubot>> Post @100
	[url]
	[time ago]
	[title]
	[short text]
```
