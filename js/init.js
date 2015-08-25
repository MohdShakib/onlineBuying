"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
        //lazy loading facebook sdk and google platform file
        var lazyLoadScript = function(id, src){
          (function(d, s, id, src) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = src;
            js.async = true;
            js.defer = true;
            fjs.parentNode.insertBefore(js, fjs);
          }(d, 'script', id, src));
        };

        lazyLoadScript('facebook-jssdk','//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3');
        lazyLoadScript('google-platform','//apis.google.com/js/platform.js');

    });

})(document, window);
