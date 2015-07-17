"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
    });

    // Clouds
	$('.back-cloud').animate({right:'80%'}, 6000);
	$('.front-cloud').animate({left:'80%'}, 6000);

})(document, window);