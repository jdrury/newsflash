//JSHint Validated Custom JS Code by Designova

/*global $:false */
/*global window: false */

(function(){
  "use strict";


$(function ($) {

    //TWITTER INIT (Updated with compatibility on Twitter's new API):
	//PLEASE READ DOCUMENTATION FOR INFO ABOUT SETTING UP YOUR OWN TWITTER CREDENTIALS:
	$(function ($) {
	$('#ticker').tweet({
	modpath: './twitter/',
	count: 5,
	loading_text: 'loading twitter feed flame...',
	username:'designovastudio'
	/* etc... */
	});
	}); 

	// Basic FitVids Test
    $(".container").fitVids();
    // Custom selector and No-Double-Wrapping Prevention Test
    $(".container").fitVids({ customSelector: "iframe[src^='http://socialcam.com']"});
    
	$('.sc-play').click(function(){
    $('.sc-pause').removeClass('hidden');
    });

    $('#options li a').click(function(){
    $('#options li a').removeClass('activated');
    $(this).addClass('activated');
    });

    $('.project-url-btn').click(function(){
    var UrlStored = $(this).attr('data-reveal-project-url');
    window.open(UrlStored);
    });
	
});


})();








	

