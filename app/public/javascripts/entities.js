
$('#about').on('click', function() {

  $('#container').append('<article class="element clearfix one-full about">
      <div class="reveal-bg-one">
        <h2 class="pad pad-top-minus pad-bottom-minus">Newsflash</h2>
        <p class="pad pad-top-minus pad-bottom-minus">is a visual representation of the news-cycle.</p>
        <br>
        <p class="pad pad-top-minus">Newsflash pulls breaking news from the <em>The New York Times</em> <a href="http://nyti.ms/PkaWYK">newswire</a> and translates it into entities (similar to keywords) with <a href="http://www.alchemyapi.com/">AlchemyAPI</a>. Each entity is compared to the <a href="https://dev.twitter.com/">Twitter stream</a>. When Newsflash finds a tweet with an entity, it uses <a href="http://socket.io/">socket.io</a> to populate a <a href="http://d3js.org/">D3</a> treemap with the tweet\'s hashtags.</p>
      </div>
    </article>');
});

$('#news').on('click', function() {
  var list = '<ul>';

  var entities = masterlist.children.forEach(function(entity) {
    list += '<li>' + entity + '</li>'
  });

  $('#container').append('<div class="reveal-bg-one">
        <h2 class="pad pad-top-minus pad-bottom-minus">Tracking ' + {{masterlist.children.length} + ' + entities across 30 articles.</h2>
        <p class="pad pad-top-minus pad-bottom-minus">blah blah blah.</p>
        <br>
        <p class="pad pad-top-minus">
         ' + list + '</p>
      </div>');
});

$('#news').on('click', function() {
  $('#container').append('<div class="reveal-bg-one">
        <h2 class="pad pad-top-minus pad-bottom-minus">Trending</h2>
        <p class="pad pad-top-minus pad-bottom-minus">blah blah blah.</p>
        <br>
        <p class="pad pad-top-minus">This where the twitter counter clicks</p>
      </div>');
});