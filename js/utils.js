var utils = (function() {

    return {
        addResizeEventListener: function(listenerFunction) {
            listenerFunction();;
            $(window).off('resize').on('resize', listenerFunction);
        },
        defaultDynamicResizeContainers: function() {
            utils.dynamicResizeContainers(window.innerWidth);
        },
        dynamicResizeContainers: function(containerWidth) {
            var imageResolutionHeight = config.imageResolution.height;
            var imageResolutionWidth = config.imageResolution.width;
            var imageResolutionUnit = config.imageResolution.unit || 'px';

            var mainContainerElement = document.getElementById(config.mainContainerId);
            var dynamicResizeElement = $('.' + config.dynamicResizeClass);

            if (containerWidth == null || containerWidth == 'undefined') {
                containerWidth = window.innerWidth;
            }
            var height = window.innerHeight;
            var width = imageResolutionWidth / imageResolutionHeight * height;
            var diff = (width - containerWidth) / -2;

            mainContainerElement.style.height = height + imageResolutionUnit;
            dynamicResizeElement.css('height', height + imageResolutionUnit);
            dynamicResizeElement.css('width', width + imageResolutionUnit);
            dynamicResizeElement.css('left', diff + imageResolutionUnit);
        },
        getGroupInterval: function(n, interval) {
            var start = Math.floor(n / interval) * interval;
            var end = start + interval;
            return {
                start: start,
                end: end
            };
        },
        addLeadingZeros: function(n, length) {
            var str = (n > 0 ? n : -n) + "";
            var zeros = "";
            for (var i = length - str.length; i > 0; i--)
                zeros += "0";
            zeros += str;
            return n >= 0 ? zeros : "-" + zeros;
        },
        getReadablePrice: function(price) {
            var rem = price % 1000;
            price = Math.floor(price / 1000);
            var readablePrice = this.addLeadingZeros(rem, 3);
            while (price > 0) {
                rem = price % 100;
                price = Math.floor(price / 100);
                readablePrice = this.addLeadingZeros(rem, 2) + "," + readablePrice;
            }
            return readablePrice;
        },
        ajax: function(url, params) {
            var success_callback = typeof(params.success_callback) == 'function' ? params.success_callback : null;
            var error_callback = typeof(params.error_callback) == 'function' ? params.error_callback : null;
            var complete_callback = typeof(params.complete_callback) == 'function' ? params.complete_callback : null;

            $.ajax({
                type: "GET",
                url: url,
                async: false,
                dataType: 'JSON',
                success: function(response) {
                    if (response.statusCode == '2XX') {
                        if (success_callback == null) {
                            // default error callback handling
                        } else {
                            success_callback(response.data, params);
                        }
                    } else {
                        if (error_callback == null) {
                            // default error callback handling
                        } else {
                            error_callback(response.data);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ajax in error callback');
                    console.log('error occured ' + errorThrown);
                },
                complete: function() {
                    if (complete_callback != null) {
                        complete_callback(params);
                    }
                }
            });
        },
        getSvgData: function(url) {
            return $.ajax({
                type: "GET",
                url: url,
                async: false,
                dataType: "text",
                success: function(data) {
                    // register success callback in return promise
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('read csv error callback for: ' + url);
                    console.log('error occured ' + errorThrown);
                    return false;
                }
            });
        },
        getTooltipPosition: function(event){

            if(!event){
                return 'top-right';
            }

            var positionClass,
            screenWidth = $(window).width(), screenHeight = $(window).height(),
            x = event.pageX, y = event.pageY;
            x = (x/screenWidth)*100;
            y = (y/screenHeight)*100;

            positionClass  = y < 50 ? 'top-' : 'bottom-';
            positionClass += x > 50 ? 'left' : 'right';
          
            return positionClass;
        }
    }

})();