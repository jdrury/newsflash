#Newsflash v0.9.2

**[Newsflash](newsflash.herokuapp.com)** is a crowdsourced news tracker, defined by *The New York Times*, driven by Twitter.

##### How It Works
Newsflash pulls breaking news from the *The New York Times* [newswire](http://nyti.ms/PkaWYK) and translates it into entities with the help of [AlchemyAPI](http://www.alchemyapi.com/). Each entity is compared to the [Twitter stream](https://dev.twitter.com/). When Newsflash finds a tweet that mentions an entity, it uses [socket.io](http://socket.io/) to populate a [D3](http://d3js.org/) treemap with the tweet's hashtags.

Live site: <a href="http://newsflash.herokuapp.com/">http://newsflash.herokuapp.com/</a>

===========

#####v0.9.2 New layer added to masterlist object
+ Entities are nested inside respective article
+ Headlines are added to the view; keywords are broken up my article on main page

#####v0.9.1 Less articles, better UX
+ cronJob resets masterlist every 48 minutes
+ articles reduced to 10
+ less articles and faster reset makes treemap easier to read
+ new banner on welcome page shows number of articles, entities, tweets

#####v0.9.0 Article references added
+ Tracks 20 articles to match D3's 20 colors
+ Limit 4 hashtags per entity
+ Each news item on the treemap now has a concomitant headline, abstract and link
+ Newsflash no longer reboots on refresh (masterlist made global variable)

#####v0.8.0 CSS Styling
+ Adds custom CSS styling and fonts

#####v0.7.0 Better Visualization with D3
+ Each entity is now represented by child nodes, which are hashtags taken from tweets which match the parent entity
+ NYT limited to pulling 12 articles (approx 20 entitites) to keep browser responsive
+ Number of child nodes is limited to seven (7) per entity
+ The treemap now has transition animation, but it needs smoother transitions
+ The treemap now has three layers: root, parent and child

#####v0.6.0 Visualization with D3
+ Squares and color scheme have been removed
+ entities are visually represented by a treemap which grows and shrinks
+ Alchemy API is now searching for entities, changed from entities

#####v0.5.0 Refined entities, Better Results
+ Switched to EJS views for easier debugging
+ Wire up alchemy API to produce meaningful entities out of the NYTimes abstracts
+ Add logic to view to hide words that occur less than 10 times
+ Total news items shown is capped at 75

#####v0.4.0 Views and socket.io
+ Wire Jade to render index.jade properly, including script.js
+ Set client to load initialized watchList on first view
+ Wire up socket.io for seamless refresh
+ Display news items in a skeleton format
+ Fix logic so the browser does not lockdown due to volume

#####v0.3.0 Dynamic entities
+ Connect NYT API to Twitter API
+ Index all the words in all the articles of NYTimes Breaking Newswire API
+ Index each keyword in the watchList object
+ Sift NYT entities through Twitter stream and capture matches

#####v0.2.0 NYT Breaking News
+ Wire up connection to NYT Breaking News API

#####v0.1.0 Twitter Firehouse
+ Wire up connection to Twitter firehose
+ Initialize socket.io to emit an event with each new tweet
+ Filter Twitter firehose for built-in entities
+ entities are represented as squares that change color based on volume of tweets
+ Squares refresh with each new tweet

######Newsflash - My individual capstone project at <a href="http://www.fullstackacademy.com">Fullstack Academy of Code</a>.