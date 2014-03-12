#####newsFlash v.0.0.4

=================

**newsFlash** is a graphic news-cycle app that dynamically reacts to the day's events.

newsFlash filters breaking news from the [NYTimes API](http://nyti.ms/PkaWYK) and feeds it into [Twitter](https://dev.twitter.com/) firehose. The outgoing stream represents the popularity of a particular news item. Each item is dynamically represented with circles, which grow and contract according to tweet volume. [Socket.io](http://socket.io/) updates items without the need to refresh the browser.

#####v.0.0.1      [Twitter Firehouse]:                  ~~5 hours~~
+ Wire up connection to Twitter firehose.
+ Initialize socket.io to emit an event with each new tweet.
+ Filter Twitter firehose for built-in keywords.
+ Keywords are represented as squares that change color based on volume of tweets.
+ Squares refresh with each new tweet.

#####v.0.0.2      [NYT Breaking News]:                  ~~5 hours~~
+ Wire up connection to NYT Breaking News API.

#####v.0.0.3      [Dynamic Keywords]:                   ~~7 hours~~
+ Connect NYT API to Twitter API.
+ Index all the words in all the articles of NYTimes Breaking Newswire API.
+ Index each keyword in the watchList object.
+ Sift NYT Keywords through Twitter stream and capture matches.

#####v.0.0.4      [Views and socket.io]:                4 hours
+ Wire Jade to render index.jade properly, including script.js.
+ Set client to load initialized watchList on first view.
+ Wire up socket.io for seamless refresh.
+ Display news items in a skeleton format.
+ Fix logic so the browser does not lockdown due to volume.

#####v.0.0.5      [Refined Keywords, Better Results]:   5 hours
+ Trim keywords for whitespace and meaningless words such as 'in', 'of', 'the'.
+ Add logic to view to hide words that occur less than 10 times.
+ Create algorithm combine words that have no meaning on their own (United + States)
+ Total news items shown is capped at 75.

#####v.0.0.6      [Visualization with D3]:            10 hours
+ Squares and color scheme have been removed.
+ Keywords are visually represented by circles which grow and shrink.
+ Circles are updated by socket.io every 3 seconds.

#####v.0.0.7      [View streams]:                     2 hours
+ Each news item now has a show view that streams respective tweets from Twitter.

#####v.0.0.8      [Data persistence with Mongoose]:   1 hour
+ Data is now stored on MongoDB.
+ Mongoose wired up.
+ Schemas created for news items and tweets.
+ Database dropped every 72 hours.

#####v.0.0.9      [User authentication]:              6 hours
+ Sessions can now persist through user authentication.
+ Basic user authentication via Passportjs.
+ Users are also able to authenticate using github, Twitter or Facebook.

#####v.0.1.0      [CSS Styling]:                      4 hours
+ Add improved CSS styling and fonts