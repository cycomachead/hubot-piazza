# hubot-piazza

A simple hubot script to integrate with Piazza.com

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

## Sample Interaction

```
user1>> Checkout @100
hubot>> Post @100
	[url]
	[time ago]
	[title]
	[short text]
```
