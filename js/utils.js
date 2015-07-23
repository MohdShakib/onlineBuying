var utils = (function() {

    return {
        projectId: null,
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

            var parentContainerElement = document.getElementById(config.parentContainerId);
            var parentContainerWidth = window.innerWidth;

            var dynamicResizeElement = $('.' + config.dynamicResizeClass);

            if (containerWidth == null || containerWidth == 'undefined') {
                containerWidth = window.innerWidth;
            }
            
            // For max height and width of containers
            var height = (window.innerHeight < imageResolutionHeight) ? window.innerHeight : imageResolutionHeight;
            var width = imageResolutionWidth / imageResolutionHeight * height;
            var diff = (width - containerWidth) / -2;
            var parentDiff = (width - window.innerWidth) / -2;

            parentContainerElement.style.width = (width > parentContainerWidth) ? (parentContainerWidth + imageResolutionUnit) : (width + imageResolutionUnit);
            parentContainerElement.style.height = height + imageResolutionUnit;
            parentContainerElement.style.left = (parentDiff > 0) ? (parentDiff + imageResolutionUnit) : 0;

            dynamicResizeElement.css('height', height + imageResolutionUnit);
            dynamicResizeElement.css('width', width + imageResolutionUnit);
            dynamicResizeElement.css('left', (diff < 0) ? (diff + imageResolutionUnit) : 0);
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
            var readablePrice = (price == 0) ? rem : this.addLeadingZeros(rem, 3);
            while (price > 0) {
                rem = price % 100;
                price = Math.floor(price / 100);
                var prefix = (price == 0) ? rem : this.addLeadingZeros(rem, 2);
                readablePrice = prefix + "," + readablePrice;
            }
            return readablePrice;
        },
        getReadablePriceInLacs: function(price) {
            return Math.floor(price/10000)/10 + " Lacs";
        },
        getIdentifier: function(string) {
            var identifier = '';
            if (string) {
                identifier = string.toLowerCase().replace(' ', '-');
            }
            return identifier;
        },
        validateForm: function(form) {
            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            function validatePhone(phoneNumber) {
                var re = /^\d{5,15}$/;
                return re.test(phoneNumber);
            }

            var fields = $(form).find('input[type=text],input[type=password],input[type=email],input[type=checkbox]');
            var total_fields = fields.length;

            var requiredMessage = 'This field is required';
            var requiredCheckboxMessage = 'Please read and agree to Terms & Conditions';
            var invalidEmailMessage = 'Invalid email address';
            var invalidNumberMessage = 'Invalid phone number';

            var validationFlag = true;
            for (var i = 0; i < total_fields; i++) {

                var this_field = $(fields[i]),
                    value = $(this_field).val(),
                    type = $(this_field).attr('type'),
                    name = $(this_field).attr('name'),
                    isRequired = $(this_field).attr('required');

                $(this_field).parent('div').removeClass('error');

                if (isRequired && !value) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(requiredMessage);
                } else if (isRequired && type == 'checkbox' && !$(this_field).is(":checked")) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(requiredCheckboxMessage);
                } else if (isRequired && type == 'email' && !validateEmail(value)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(invalidEmailMessage);
                } else if (isRequired && name == 'phone' && !validatePhone(value)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(invalidNumberMessage);
                }

            }
            return validationFlag;
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
        getTooltipPosition: function(event) {

            if (!event) {
                return 'top-right';
            }

            var positionClass,
                screenWidth = $(window).width(),
                screenHeight = $(window).height(),
                x = event.pageX,
                y = event.pageY;
            x = (x / screenWidth) * 100;
            y = (y / screenHeight) * 100;

            positionClass = y < 50 ? 'top-' : 'bottom-';
            positionClass += x > 50 ? 'left' : 'right';

            return positionClass;
        },
        priceFormat: function(price) {
            if (!price) {
                return '';
            }
            return (price / 100000) + ' Lacs';
        },
        getUnit3dSvgPolygonHtml: function(unitTypeData) {
            var svgData = unitTypeData ? unitTypeData.svgs : null,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = '';
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                if (svgObj.type == 'info') {
                    svgCode += "<polygon class='transition' data-name='" + svgObj.name + "' data-type='" + svgObj.type + "' data-details='" + svgObj.details + "'   points=\"" + svgObj.svgPath + "\" />";
                }
            }

            return svgCode;
        },
        unitComponentMouseEnter: function(params, containerReference) {
            var dataset = $(params.element).data(),
                towerCode = "<div id='container-detail' class='tooltip-detail'>";

            var tooltipClass = utils.getTooltipPosition({
                pageX: params.event.clientX,
                pageY: params.event.clientY
            });
            tooltipClass = tooltipClass ? tooltipClass : 'bottom-right';

            towerCode += "<div class='detail-box show-details tSelected-view unit-view'>";
            towerCode += "<div class='line " + tooltipClass + "' >";
            towerCode += "<div class='dot-one'></div>";
            towerCode += "<div class='dot-two'></div>";

            var info = {
                'name': dataset.name,
                'type': dataset.type,
                'details': dataset.details
            };

            towerCode += '<div class="tSelected-detail towerunit-detail-container floor-detail">';
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


                /*pointX = params.pointX;
                pointY = params.pointY;
                $('#container-detail').css("left", pointX + '%');
                $('#container-detail').css("top", pointY + '%');*/

                // animate
                window.getComputedStyle(document.getElementById('container-detail')).opacity;
                document.getElementById('container-detail').style.opacity = "1";
            }
        },
        getComparedItems: function() {
            var comparedItems = localStorage.getItem('shortlistedItems');
            var projectId = utils.projectId;

            if (!comparedItems) {
                return {};
            }

            if (comparedItems) {
                comparedItems = JSON.parse(comparedItems);
            } else {
                comparedItems = {};
            }

            if (!(comparedItems[projectId] && Object.keys(comparedItems[projectId]).length)) {
                return {};
            }

            return comparedItems[projectId];
        },
        updateShortListInStorage: function(updatedComparedItems) {
            var comparedItems = localStorage.getItem('shortlistedItems');
            var projectId = utils.projectId;

            if (comparedItems) {
                comparedItems = JSON.parse(comparedItems);
            } else {
                comparedItems = {};
            }

            comparedItems[projectId] = updatedComparedItems;
            comparedItems = JSON.stringify(comparedItems);
            localStorage.setItem('shortlistedItems', comparedItems);
        },
        likeBoxClicked: function(element, unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier) {
            if ($(element).hasClass('selected')) {
                $(element).removeClass('selected');
                utils.removeFromShortListed(unitIdentifier, unitUniqueIdentifier);
            } else {
                $(element).addClass('selected');
                utils.addToShortListed(unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier);
            }
        },
        removeFromShortListed: function(unitIdentifier, unitUniqueIdentifier) {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = comparedItems.length,
                found = 0;

            for (var uniqueIdentifier in comparedItems) {
                if (uniqueIdentifier == unitUniqueIdentifier) {
                    found = uniqueIdentifier;
                    break;
                }
            }

            if (found) {
                if ($('.' + unitUniqueIdentifier + '-like-box')) {
                    $('.' + unitUniqueIdentifier + '-like-box').removeClass('selected');
                }

                if ($('#' + config.compareBottomBox + '-' + unitUniqueIdentifier)) {
                    $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier).remove();
                }
                delete comparedItems[found];
                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        addToShortListed: function(unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier) {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = comparedItems.length;

            if (!comparedItems[unitUniqueIdentifier]) {
                comparedItems[unitUniqueIdentifier] = {
                    unitIdentifier: unitIdentifier,
                    unitName: unitName,
                    towerIdentifier: towerIdentifier,
                    rotationAngle: rotationAngle,
                    unitUniqueIdentifier: unitUniqueIdentifier
                };

                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        updateShortListedList: function() {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = Object.keys(comparedItems).length,
                htmlCode = '';
            if (length) {
                htmlCode = '<ul>';

                for (var uniqueIdentifier in comparedItems) {
                    htmlCode += '<li >' + comparedItems[uniqueIdentifier].unitName + '<span class="' + config.shortlistedUnitRemoveClass + '" data-unitidentifier="' + comparedItems[uniqueIdentifier].unitIdentifier + '" data-uniqueidentifier="' + uniqueIdentifier + '">x</span></li>';
                }
                htmlCode += '</ul>';
            } else {
                htmlCode += '<p>Nothing To Compare</p>';
            }

            $('#' + config.unitCompareButtonId).addClass('disable');
            if (length > 1) {
                $('#' + config.unitCompareButtonId).removeClass('disable');
            }

            $('#' + config.shortListedUnitListId).html(htmlCode);
            $('#' + config.likeCountId).html(length);
        },
        addSVGClass: function(id, newClass) {
            var originalClasses = document.getElementById(id).getAttribute('class');
            var classArray = originalClasses.split(" ");
            var index = classArray.indexOf(newClass);
            if (index < 0) {
                document.getElementById(id).setAttribute('class', originalClasses + " " + newClass);
            }
        },
        removeSVGClass: function(id, removeClass) {

            if (!document.getElementById(id)) {
                return;
            }

            var originalClasses = document.getElementById(id).getAttribute('class');
            var classArray = originalClasses.split(" ");
            if (classArray && classArray.length > 0) {
                var index = classArray.indexOf(removeClass);
                if (index > -1) {
                    classArray.splice(index, 1);
                }
            }
            document.getElementById(id).setAttribute('class', classArray.join(' '));
        },
        addSVGClassToElements: function(svgElements, newClass) {
            for (var i = 0; i < svgElements.length; i++) {
                var svgElement = svgElements[i];
                var originalClasses = svgElement.getAttribute('class');
                var classArray = originalClasses.split(" ");
                var index = classArray.indexOf(newClass);
                if (index < 0) {
                    svgElement.setAttribute('class', originalClasses + " " + newClass);
                }
            }
        },
        socialClicked: function(shareon) {
            var url = location.href;
            var url = 'http://beta-onlinebuying.proptiger-ws.com/#/projectname-640037';
            switch (shareon) {
                case 'facebook':
                    window.open("https://www.facebook.com/sharer.php?u=" + encodeURIComponent(url), "sharer?", "toolbar=0,status=0,width=626,height=436");
                    break;
                case 'googleplus':
                    window.open("https://plus.google.com/share?url=" + encodeURIComponent(url), " ", " status=0,width=626,height=436,menubar=no,toolbar=no,resizable=yes,scrollbars=yes");
                    break;
                default:
                    return false;
            }
        },
        changeUrl: function(element) {
            element = $(element);
            var hash = element.data('url') ? element.data('url') : null;
            if (hash && hash != "undefined")
                router.setRoute(hash);
            return;
        },
        getTermsConditionsHtml: function() {
            return '<a class="price-terms">Terms &amp; Conditions</a>';
        },
        getPriceBreakupHtml: function(data, rotationdata, rootdata, showTnc) {
            var opCode = '';
            var code = '<ul class="pricebreakup-tabs">' + '<li class="active"  data-type="pricebreakup">Price Breakup</li>' + '<li  data-type="paymentplan">Payment Plan</li>' + '</ul>' + '<div class="unit-content-wrapper">' + '<div class="payment-pic pricebreakup-tabs-content paymentplan ' + config.hideClass + '"><img src="images/walkthrough-cover.jpg" alt="" /></div>'
            code += "<table class='base-table pricebreakup-tabs-content pricebreakup' cellpadding='0' cellspacing='0' border='0'>";
            if (data.price) {
                code += "<tr><td>Base Price</td><td class='right-align'>" + data.basePrice + "</td></tr>";

                var length = data.unitPricingSubcategories ? data.unitPricingSubcategories.length : 0,
                    pricingSubcategory, unitPricingSubcategory;
                for (var i = 0; i < length; i++) {
                    unitPricingSubcategory = data.unitPricingSubcategories[i] || {};
                    pricingSubcategory = rootdata.pricingSubcategories[unitPricingSubcategory.id];
                    
                    // Handling floor rise use case
                    if (!pricingSubcategory) {
                        var key = unitPricingSubcategory.id + '-' + data.towerId + '-' + data.floor;
                        pricingSubcategory = rootdata.pricingSubcategories[key];
                    }
                    
                    if (pricingSubcategory && pricingSubcategory.isMandatory) {
                        code += "<tr><td>" + pricingSubcategory.name + " (" + pricingSubcategory.masterName + ")</td><td class='right-align'>" + unitPricingSubcategory.price + "</td></tr>";
                    } else if (pricingSubcategory) {
                        opCode += "<tr><td>" + pricingSubcategory.name + " (" + pricingSubcategory.masterName + ")</td><td class='right-align'>" + unitPricingSubcategory.price + "</td></tr>";
                    }
                }
                code += "<tr><td class='total-price'>Sub Total</td><td class='total-price right-align'>" + data.formattedPrice + "</td></tr>";
                if (data.discount && data.discount > 0) {
                    code += "<tr><td class='discount-price'>Discount (" + data.discountDescription + ")</td><td class='discount-price right-align'>" + utils.getReadablePrice(data.discount) + "</td></tr>";
                    code += "<tr><td class='total-price'>Total Price</td><td class='total-price right-align'><span class='icon fs14 icon-rupee'></span> " + utils.getReadablePrice(data.price - data.discount) + "</td></tr>";
                }
                code += "<tr><td colspan=2>Other optional costs</td></tr>" + opCode;
                if (showTnc) {
                    code += "<tr><td colspan='2'><div class='price-breakup-trems'>" + utils.getTermsConditionsHtml() + "</div></td></tr>";
                }
            } else {
                code += "<tr><td colspan='2'><br/><br/><br/>No price details available.</td></tr>";
            }
            code += "</table>";
            return code;
        }
    }

})();