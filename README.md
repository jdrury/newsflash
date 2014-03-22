#####newsflash v.0.0.7

=================

**newsflash** is a visual news-cycle app that tracks news events as they are mentioned on Twitter.

News is defined by [The New York Times newswire API](http://nyti.ms/PkaWYK). [Alchemy API](link) provides entities for the 50 most recent abstracts on the newswire. Each entity is compared to the [Twitter](https://dev.twitter.com/) stream. Any tweets which contain an entity have their hashtags transposed on a [D3](http://d3js.org/) treemap. [Socket.io](http://socket.io/) feeds the treemap with Twitter stream updates, eliminating the need to refresh the browser.

newsflash is a dynamic visualization of the news cycle, defined by professionals and vetted by the masses.

#####v.0.0.1      [Twitter Firehouse]
+ Wire up connection to Twitter firehose.
+ Initialize socket.io to emit an event with each new tweet.
+ Filter Twitter firehose for built-in keywords.
+ Keywords are represented as squares that change color based on volume of tweets.
+ Squares refresh with each new tweet.

#####v.0.0.2      [NYT Breaking News]
+ Wire up connection to NYT Breaking News API.

#####v.0.0.3      [Dynamic Keywords]
+ Connect NYT API to Twitter API.
+ Index all the words in all the articles of NYTimes Breaking Newswire API.
+ Index each keyword in the watchList object.
+ Sift NYT Keywords through Twitter stream and capture matches.

#####v.0.0.4      [Views and socket.io]
+ Wire Jade to render index.jade properly, including script.js.
+ Set client to load initialized watchList on first view.
+ Wire up socket.io for seamless refresh.
+ Display news items in a skeleton format.
+ Fix logic so the browser does not lockdown due to volume.

#####v.0.0.5      [Refined Keywords, Better Results]
+ Switched to EJS views for convenience.
+ Wire up alchemy API to produce meaningful keywords out of the NYTimes abstracts.
+ Add logic to view to hide words that occur less than 10 times.
+ Total news items shown is capped at 75.

#####v.0.0.6      [Visualization with D3]
+ Squares and color scheme have been removed.
+ Keywords are visually represented by a treemap which grows and shrinks.
+ Alchemy API is now searching for entities, changed from keywords.

#####v.0.0.7      [Better Visualization with D3]
+ Each entity is now represented by child nodes, which are hashtags taken from tweets about the parent entity.
+ Number of child nodes is limited to seven (7) per entity.
+ The treemap now has transition animation, but it needs smoother transitions.
+ The treemap now has three layers: root, parent and child.

#####v.0.0.8      [Article references added]
+ Smoother transitions added for D3 treemap.
+ Each news item on the treemap now has a concomitant headline, abstract and link.
+ newsFlash pings NYTimes newswire every two (2) minutes to see if there is a new story.
+ New stories are added to the pre-existing list and announced in a banner message.
+ Child nodes are now filtered for profanity hashtags.

#####v.0.1.0      [CSS Styling]:                      4 hours
+  Add custom CSS styling and fonts

