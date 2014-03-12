$(document).ready(function() {
  var socket = io.connect(window.location.hostname);

  socket.on('watchList', function(data) {
    $('#list').empty();
    var tally = data.total;
    for (var key in data.keywords) {
      // var val = data.keywords[key] / total;
      $('#list').append('<li id='+key+'>' + key + ': ' + data.keywords[key] + '</li>')
      $("li #"+key).css({"font-size:"+ val});
    }
  });
});