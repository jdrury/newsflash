jQuery(document).ready(function(){

if ( $('.flexslider')[0] ) {
    jQuery('.flexslider').flexslider({
    animation: "slide",
    start: function(slider){
var $container = $('#container'),
          // object that will keep track of options
          isotopeOptions = {},
          // defaults, used if not explicitly set in hash
          defaultOptions = {
            filter: '.home',
            sortBy: 'original-order',
            sortAscending: true,
            layoutMode: 'masonry'
          };
$container.imagesLoaded( function(){
      $container.isotope({
    			itemSelector : '.element'
    		  });
  
      // set up Isotope
      $container.isotope({
    			  // options...
    			  resizable: false, // disable normal resizing
    			  // set columnWidth to a percentage of container width
    			  masonry: { columnWidth: $container.width() / 12 }
    			});
	  
	  // update columnWidth on window resize
    			$(window).smartresize(function(){
    			  $container.isotope({
    				// update columnWidth to a percentage of container width
    				masonry: { columnWidth: $container.width() / 12 }
    			  });
    			});
  
      var $optionSets = $('#options').find('.option-set'),
          isOptionLinkClicked = false;
  
      // switches selected class on buttons
      function changeSelectedLink( $elem ) {
        // remove selected class on previous item
        $elem.parents('.option-set').find('.selected').removeClass('selected');
        // set selected class on new item
        $elem.addClass('selected');
      }
  
  
	$optionSets.find('a[href^="#filter"]').click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return;
        }
        changeSelectedLink( $this );
            // get href attr, remove leading #
        var href = $this.attr('href').replace( /^#/, '' ),
            // convert href into object
            // i.e. 'filter=.inner-transition' -> { filter: '.inner-transition' }
            option = $.deparam( href, true );
        // apply new option to previous
        $.extend( isotopeOptions, option );
        // set hash, triggers hashchange on window
        $.bbq.pushState( isotopeOptions );
        isOptionLinkClicked = true;
        return false;
      });

      var hashChanged = false;

      $(window).bind( 'hashchange', function( event ){
        // get options object from hash
        var hashOptions = window.location.hash ? $.deparam.fragment( window.location.hash, true ) : {},
            // do not animate first call
            aniEngine = hashChanged ? 'best-available' : 'none',
            // apply defaults where no option was specified
            options = $.extend( {}, defaultOptions, hashOptions, { animationEngine: aniEngine } );
        // apply options from hash
        $container.isotope( options );
        // save options
        isotopeOptions = hashOptions;
    
        // if option link was not clicked
        // then we'll need to update selected links
        if ( !isOptionLinkClicked ) {
          // iterate over options
          var hrefObj, hrefValue, $selectedLink;
          for ( var key in options ) {
            hrefObj = {};
            hrefObj[ key ] = options[ key ];
            // convert object into parameter string
            // i.e. { filter: '.inner-transition' } -> 'filter=.inner-transition'
            hrefValue = $.param( hrefObj );
            // get matching link
            $selectedLink = $optionSets.find('a[href="#' + hrefValue + '"]');
            changeSelectedLink( $selectedLink );
          }
        }
    
        isOptionLinkClicked = false;
        hashChanged = true;
      })
        // trigger hashchange to capture any hash data on init
		
        .trigger('hashchange');
		
		
		return false;
		});
}
  });
} else {
	      var $container = $('#container'),
          // object that will keep track of options
          isotopeOptions = {},
          // defaults, used if not explicitly set in hash
          defaultOptions = {
            filter: '.home',
            sortBy: 'original-order',
            sortAscending: true,
            layoutMode: 'masonry'
          };
$container.imagesLoaded( function(){
      $container.isotope({
    			itemSelector : '.element'
    		  });
  
      // set up Isotope
      $container.isotope({
    			  // options...
    			  resizable: false, // disable normal resizing
    			  // set columnWidth to a percentage of container width
    			  masonry: { columnWidth: $container.width() / 12 }
    			});
	  
	  // update columnWidth on window resize
    			$(window).smartresize(function(){
    			  $container.isotope({
    				// update columnWidth to a percentage of container width
    				masonry: { columnWidth: $container.width() / 12 }
    			  });
    			});
  
      var $optionSets = $('#options').find('.option-set'),
          isOptionLinkClicked = false;
  
      // switches selected class on buttons
      function changeSelectedLink( $elem ) {
        // remove selected class on previous item
        $elem.parents('.option-set').find('.selected').removeClass('selected');
        // set selected class on new item
        $elem.addClass('selected');
      }
  
  
	$optionSets.find('a[href^="#filter"]').click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return;
        }
        changeSelectedLink( $this );
            // get href attr, remove leading #
        var href = $this.attr('href').replace( /^#/, '' ),
            // convert href into object
            // i.e. 'filter=.inner-transition' -> { filter: '.inner-transition' }
            option = $.deparam( href, true );
        // apply new option to previous
        $.extend( isotopeOptions, option );
        // set hash, triggers hashchange on window
        $.bbq.pushState( isotopeOptions );
        isOptionLinkClicked = true;
        return false;
      });

      var hashChanged = false;

      $(window).bind( 'hashchange', function( event ){
        // get options object from hash
        var hashOptions = window.location.hash ? $.deparam.fragment( window.location.hash, true ) : {},
            // do not animate first call
            aniEngine = hashChanged ? 'best-available' : 'none',
            // apply defaults where no option was specified
            options = $.extend( {}, defaultOptions, hashOptions, { animationEngine: aniEngine } );
        // apply options from hash
        $container.isotope( options );
        // save options
        isotopeOptions = hashOptions;
    
        // if option link was not clicked
        // then we'll need to update selected links
        if ( !isOptionLinkClicked ) {
          // iterate over options
          var hrefObj, hrefValue, $selectedLink;
          for ( var key in options ) {
            hrefObj = {};
            hrefObj[ key ] = options[ key ];
            // convert object into parameter string
            // i.e. { filter: '.inner-transition' } -> 'filter=.inner-transition'
            hrefValue = $.param( hrefObj );
            // get matching link
            $selectedLink = $optionSets.find('a[href="#' + hrefValue + '"]');
            changeSelectedLink( $selectedLink );
          }
        }
    
        isOptionLinkClicked = false;
        hashChanged = true;
      })
        // trigger hashchange to capture any hash data on init
		
        .trigger('hashchange');
		
		
		return false;
		});
}
  
});


jQuery(window).load(function(){
	setTimeout(function(){
		jQuery('#container').isotope('reLayout');
	}, 1000);
});

