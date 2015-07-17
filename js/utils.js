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
            var readablePrice = (price == 0) ? rem : this.addLeadingZeros(rem, 3);
            while (price > 0) {
                rem = price % 100;
                price = Math.floor(price / 100);
                var prefix = (price == 0) ? rem : this.addLeadingZeros(rem, 2);
                readablePrice = prefix + "," + readablePrice;
            }
            return readablePrice;
        },
        getIdentifier: function(string) {
            var identifier = '';
            if (string) {
                identifier = string.toLowerCase().replace(' ', '-');
            }
            return identifier;
        },
        ajax: function(url, params, isPost, postData) {
            var success_callback = typeof(params.success_callback) == 'function' ? params.success_callback : null;
            var error_callback = typeof(params.error_callback) == 'function' ? params.error_callback : null;
            var complete_callback = typeof(params.complete_callback) == 'function' ? params.complete_callback : null;

            var ajaxObj = {
                type: "GET",
                url: url,
                async: false,
                //dataType: 'JSON',
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
            }

            if (isPost) {
                ajaxObj.type = "POST";
                ajaxObj.contentType = "application/json";
                ajaxObj.async = true;
                ajaxObj.data = postData ? postData : {};
                //ajaxObj.data = JSON.stringify(ajaxObj.data);
            }

            $.ajax(ajaxObj);
        },
        validateForm: function(form) {
            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            function validatePhone(phoneNumber) {
                var re = /^\d{10}$/;
                return re.test(phoneNumber);
            }

            var fields = $(form).find('input[type=text],input[type=password],input[type=email]');
            var total_fields = fields.length;

            var requiredMessage = 'This field is required';
            var invalidEmailMessage = 'Invalid email address';
            var invalidNumberMessage = 'Enter 10 digit number';

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
                    $(this_field).siblings('.error-box').text(requiredMessage);
                } else if (isRequired && type == 'email' && !validateEmail(value)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.error-box').text(invalidEmailMessage);
                } else if (isRequired && name == 'phone' && !validatePhone(value)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.error-box').text(invalidNumberMessage);
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
            return '<h3>Terms &amp; Conditions</h3>' +
                '<p>All details provided about the project is based on information provided by Prestige Group to <a href="http://www.makaan.com/" target="_blank">makaan.com</a> . <a href="http://www.makaan.com/" target="_blank">Makaan.com</a> is not liable for the changes in facts post buying.</p>' +
                '<p>Only Indian Residents, Non- Resident Indians (NRIs) &amp; Persons of Indian Origin (PIOs) eligible to enter into contract as per Indian Contract Act, 1881 shall be eligible to apply.</p>' +
                '<p>Payment plan and Prices are subject to change at the sole discretion of the builder. Images displayed are for representational purpose only.Floor plan and the layout dimensions are subject to modification.</p>' +
                '<p>The booking amount of Rs.20000/- paid by the user for booking is only a token advance and it does not confer ownership rights in the chosen property. The booking only ensures blocking of the property temporarily and should not be considered as buying or owning the property.</p>' +
                '<p>The booking amount is refundable. For cancellation or refunding please contact <a href="http://www.makaan.com/" target="_blank">makaan.com</a> customer care.</p>' +
                '<p>Any request for customisation or changes are to be handled directly with Prestige builders</p>' +
                '<p>Post booking the builder can provide further information required for the completion of the purchase and further till possession of the property</p>' +
                '<p>Please use the Booking ID in all further communication with builder and <a href="http://www.makaan.com/">makaan.com</a></p>' +
                '<p>Offer prices provided are subject to the payment schedule mentioned in the project</p>';
        },
        getPriceBreakupHtml: function(data, rotationdata, rootdata, showTnc) {
            var code = '<ul class="pricebreakup-tabs">' + '<li class="active"  data-type="pricebreakup">Price Breakup</li>' + '<li  data-type="paymentplan">Payment Plan</li>' + '</ul>' + '<div class="unit-content-wrapper">' + '<div class="payment-pic pricebreakup-tabs-content paymentplan ' + config.hideClass + '"><img src="images/walkthrough-cover.jpg" alt="" /></div>'
            code += "<table class='base-table pricebreakup-tabs-content pricebreakup' cellpadding='0' cellspacing='0' border='0'>";
            if (data.price) {
                code += "<tr><td width='50%'>Base Price</td><td width='50%'>Rs. " + data.basePrice + "</td></tr>";

                var length = data.unitPricingSubcategories ? data.unitPricingSubcategories.length : 0,
                    pricingSubcategory, unitPricingSubcategory;
                for (var i = 0; i < length; i++) {
                    unitPricingSubcategory = data.unitPricingSubcategories[i] || {};
                    pricingSubcategory = rootdata.pricingSubcategories[unitPricingSubcategory.id];
                    if (pricingSubcategory) {
                        code += "<tr><td>" + pricingSubcategory.name + " (" + pricingSubcategory.masterName + ")</td><td>Rs. " + unitPricingSubcategory.price + "</td></tr>";
                    }
                }
                code += "<tr><td class='total-price'>Total</td><td class='total-price'>Rs. " + data.formattedPrice + "</td></tr>";
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