
"use strict";
(function(d, w){
    
    function resizeMainContainerHeight() {
        var imageResolutionHeight   = config.imageResolution.height || 720;
        var imageResolutionWidth    = config.imageResolution.width || 1280;
        var imageResolutionUnit     = config.imageResolution.unit || 'px';
        var imageResolutionRatio    = imageResolutionHeight/imageResolutionWidth;
        var mainContainerElement    = d.getElementById(config.mainContainerId);
        var divWidth = document.getElementById(config.mainContainerId).offsetWidth;
        mainContainerElement.style.height = (imageResolutionRatio * divWidth) + imageResolutionUnit;
    };

    resizeMainContainerHeight();
    w.addEventListener('resize', resizeMainContainerHeight);

    d.addEventListener('DOMContentLoaded', function() {
            var data = null;
            var model = new DataModel(data),
            view = new DataView(model),
            controller = new DataController(model, view);

            initializeRoutes(data, controller);
    });

})(document, window);