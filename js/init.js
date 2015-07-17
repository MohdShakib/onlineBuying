"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
    });
	$('.back-cloud').animate({right:'80%', top:'150px'}, 6000);
	$('.front-cloud').animate({left:'90%', top:'100px'}, 6000);
})(document, window);