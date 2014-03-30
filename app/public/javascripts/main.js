
$('#get-news').on('click', function(event) {
  var self = event.target.attr('id');
  $('self'+'-blurb').toggle();
});