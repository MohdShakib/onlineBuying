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
        },
        priceFormat : function(price){
            if(!price){
                return '';
            }
            return (price/100000)+' Lacs';
        },
        getUnit3dSvgPolygonHtml: function(unitTypeData){
            var svgData = unitTypeData ? unitTypeData.svgs : null,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = '';
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                if (svgObj.type == 'link') {
                    svgCode += "<circle data-name='" + svgObj.name + "' data-type='" + svgObj.type + "' data-details='" + svgObj.details + "' cx='" + svgObj.svgPath.split(' ')[0] + "' cy='" + svgObj.svgPath.split(' ')[1] + "' r='1'  />";
                } else {
                    svgCode += "<polygon data-name='" + svgObj.name + "' data-type='" + svgObj.type + "' data-details='" + svgObj.details + "'   points=\"" + svgObj.svgPath + "\" />";
                }
            }

            return svgCode;
        },
        unitComponentMouseEnter: function(params, containerReference){
            var dataset = params.element.dataset,
                towerCode = "<div id='container-detail' class='tooltip-detail'>";

              towerCode += "<div class='detail-box show-details tSelected-view unit-view'>";
                towerCode += "<div class='line bottom-right' >";
                towerCode += "<div class='dot-one'></div>";
                towerCode += "<div class='dot-two'></div>";

            var info = {
                'name': dataset.name,
                'type': dataset.type,
                'details': dataset.details
            };

            towerCode += '<div class="tSelected-detail towerunit-detail-container">';
            towerCode += '<div class="towerunit-name">' + info.name + '</div>';
            towerCode += '<div class="towerunit-detail">' + info.details + '</div>';

            towerCode += '</div></div></div></div>';
            towerCode += '</div>';

            if (containerReference) {
                containerReference.html(towerCode);
                var offset = containerReference.offset();
                var left = params.event.clientX - offset.left;
                var top = params.event.clientY - offset.top;

                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", top + 'px');
                // animate
                window.getComputedStyle(document.getElementById('container-detail')).opacity;
                document.getElementById('container-detail').style.opacity = "1";
            }
        },
        getComparedItems: function(){
            var comparedItems = localStorage.getItem('shortlistedItems');
            if(comparedItems){
                comparedItems = JSON.parse(comparedItems);
            }else{
                comparedItems = [];
            }
            return comparedItems;
        },
        likeBoxClicked: function(element, unitIdentifier, unitName, towerIdentifier, rotationAngle){
            if($(element).hasClass('selected')){
                $(element).removeClass('selected');
                utils.removeFromShortListed(unitIdentifier);
            }else{
                $(element).addClass('selected');
                utils.addToShortListed(unitIdentifier, unitName, towerIdentifier, rotationAngle);
            }
        },
        removeFromShortListed : function(unitIdentifier){
            var comparedItems = utils.getComparedItems('shortlistedItems'),
            length = comparedItems.length, itemIndex = -1;
            for(var i=0; i<length; i++){
                if(comparedItems[i].unitIdentifier == unitIdentifier){
                    itemIndex = i;
                    break;
                }
            }

            if(itemIndex > -1){
                if($('.'+unitIdentifier+'-like-box')){
                    $('.'+unitIdentifier+'-like-box').removeClass('selected');
                }
                comparedItems.splice(itemIndex, 1);
                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        addToShortListed: function(unitIdentifier, unitName, towerIdentifier, rotationAngle){
            var comparedItems = utils.getComparedItems('shortlistedItems'),
            length = comparedItems.length, itemIndex = -1;
            for(var i=0; i<length; i++){
                if(comparedItems[i].unitIdentifier == unitIdentifier){
                    itemIndex = i;
                    break;
                }
            }

            if(itemIndex == -1){
                comparedItems.push({
                    unitIdentifier: unitIdentifier,
                    unitName: unitName,
                    towerIdentifier: towerIdentifier,
                    rotationAngle: rotationAngle
                });
                
                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        updateShortListInStorage: function(comparedItems){
            comparedItems = JSON.stringify(comparedItems);
            localStorage.setItem('shortlistedItems',comparedItems);
        },
        updateShortListedList: function(){
            var comparedItems = utils.getComparedItems('shortlistedItems'),
            length = comparedItems.length, htmlCode = '';
            if(length){
                htmlCode = '<ul>';
                for(var i=0; i<length; i++){
                    htmlCode += '<li >'+comparedItems[i].unitName+'<span class="'+config.shortlistedUnitRemoveClass+'" data-unitIdentifier="'+comparedItems[i].unitIdentifier+'">x</span></li>';
                }
                htmlCode += '</ul>';
            }else{
                htmlCode += '<p>Nothing To Compare</p>';
            }

            $('#'+config.unitCompareButtonId).addClass('disable');
            if(length > 1){
                $('#'+config.unitCompareButtonId).removeClass('disable');
            }

            $('#'+config.shortListedUnitListId).html(htmlCode);
            $('#'+config.likeCountId).html(length);
        }
    }

})();