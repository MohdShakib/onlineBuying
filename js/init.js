"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
    });

    $(document).ajaxStart(function() {
        $('.show-loading').show();
    }).ajaxStop(function() {
        $('.show-loading').hide();
    });

})(document, window);