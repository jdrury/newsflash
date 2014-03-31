jQuery(function() {
	jQuery(window).scroll(function() {
		if(jQuery(this).scrollTop() != 0) {
			jQuery('#toTop, #backtotop').fadeIn();	
		} else {
			jQuery('#toTop, #backtotop').fadeOut();
		}
	});
	jQuery('#toTop').click(function() {
		jQuery('body,html').animate({scrollTop:0},800);
	});	
});