#Newsflash v0.0.7

**[Newsflash](newsflash.herokuapp.com)** is a visual representation of the news-cycle.

##### How It Works
Newsflash pulls breaking news from the *The New York Times* [newswire](http://nyti.ms/PkaWYK) and translates it into entities (similar to keywords) with [AlchemyAPI](http://www.alchemyapi.com/). Each entity is compared to the [Twitter stream](https://dev.twitter.com/). When Newsflash finds a tweet with an entity, it uses [socket.io](http://socket.io/) to populate a [D3](http://d3js.org/) treemap with the respective hashtags.

#####v0.1.0 Twitter Firehouse
+ Wire up connection to Twitter firehose.
+ Initialize socket.io to emit an event with each new tweet.
+ Filter Twitter firehose for built-in keywords.
+ Keywords are represented as squares that change color based on volume of tweets.
+ Squares refresh with each new tweet.

#####v0.2.0 NYT Breaking News
+ Wire up connection to NYT Breaking News API.

#####v0.3.0 Dynamic Keywords
+ Connect NYT API to Twitter API.
+ Index all the words in all the articles of NYTimes Breaking Newswire API.
+ Index each keyword in the watchList object.
+ Sift NYT Keywords through Twitter stream and capture matches.

#####v0.4.0 Views and socket.io
+ Wire Jade to render index.jade properly, including script.js.
+ Set client to load initialized watchList on first view.
+ Wire up socket.io for seamless refresh.
+ Display news items in a skeleton format.
+ Fix logic so the browser does not lockdown due to volume.

#####v0.5.0 Refined Keywords, Better Results
+ Switched to EJS views for easier debugging.
+ Wire up alchemy API to produce meaningful keywords out of the NYTimes abstracts.
+ Add logic to view to hide words that occur less than 10 times.
+ Total news items shown is capped at 75.

#####v0.6.0 Visualization with D3
+ Squares and color scheme have been removed.
+ Keywords are visually represented by a treemap which grows and shrinks.
+ Alchemy API is now searching for entities, changed from keywords.

#####v0.7.0 Better Visualization with D3
+ Each entity is now represented by child nodes, which are hashtags taken from tweets which match the parent entity.
+ NYT limited to pulling 12 articles (approx 20 entitites) to keep browser responsive.
+ Number of child nodes is limited to seven (7) per entity.
+ The treemap now has transition animation, but it needs smoother transitions.
+ The treemap now has three layers: root, parent and child.

#####v0.8.0 CSS Styling
+  Add custom CSS styling and fonts

#####v0.9.0 Article references added
+ Smoother transitions added for D3 treemap.
+ Each news item on the treemap now has a concomitant headline, abstract and link.
+ newsFlash pings NYTimes newswire every two (2) minutes to see if there is a new story.
+ New stories are added to the pre-existing list and announced in a banner message.
+ Child nodes are now filtered for profanity.

