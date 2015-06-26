"use strict";
(function(d, w) {

    function resizeMainContainerHeight() {
        var imageResolutionHeight = config.imageResolution.height;
        var imageResolutionWidth = config.imageResolution.width;
        var imageResolutionUnit = config.imageResolution.unit || 'px';
        var imageResolutionRatio = imageResolutionHeight / imageResolutionWidth;
        var mainContainerElement = d.getElementById(config.mainContainerId);
        var divWidth = document.getElementById(config.mainContainerId).offsetWidth;
        mainContainerElement.style.height = (imageResolutionRatio * divWidth) + imageResolutionUnit;
    };

    resizeMainContainerHeight();
    w.addEventListener('resize', resizeMainContainerHeight);

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
    });

})(document, window);