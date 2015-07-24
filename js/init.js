"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
    });

    $(window).load(function() {
        $('.show-loading').hide();
    });
    
})(document, window);