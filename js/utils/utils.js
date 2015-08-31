var utils = (function() {

    var notificationTooltipTimeout;
    return {
        projectId: null,
        masterPlanModel: null, // For dynamic height of tower menu
        log: function(obj) {
            if (config.showLogs) {
                console.log(obj);
            }
        },
        addResizeEventListener: function(listenerFunction) {
            listenerFunction();
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

            if (containerWidth === null || containerWidth == 'undefined') {
                containerWidth = window.innerWidth;
            }

            // For max height and width of containers
            var height = (window.innerHeight < imageResolutionHeight) ? window.innerHeight : imageResolutionHeight;
            var width = imageResolutionWidth / imageResolutionHeight * height;
            var diff = (width - containerWidth) / -2;
            var parentDiff = (width - window.innerWidth) / -2;
            var parentContainerElementTop = (window.innerHeight / 2) - (height / 2);

            if(!(parentContainerElement && parentContainerElement.style)){
                return;
            }

            parentContainerElement.style.width = (width > parentContainerWidth) ? (parentContainerWidth + imageResolutionUnit) : (width + imageResolutionUnit);
            parentContainerElement.style.height = height + imageResolutionUnit;
            parentContainerElement.style.left = (parentDiff > 0) ? (parentDiff + imageResolutionUnit) : 0;
            parentContainerElement.style.top = (parentContainerElementTop > 0) ? parentContainerElementTop + 'px' : 0 + 'px';

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
            for (var i = length - str.length; i > 0; i--) {
                zeros += "0";
            }
            zeros += str;
            return n >= 0 ? zeros : "-" + zeros;
        },
        getReadablePrice: function(price) {
            var rem = price % 1000;
            price = Math.floor(price / 1000);
            var readablePrice = (price === 0) ? rem : this.addLeadingZeros(rem, 3);
            while (price > 0) {
                rem = price % 100;
                price = Math.floor(price / 100);
                var prefix = (price === 0) ? rem : this.addLeadingZeros(rem, 2);
                readablePrice = prefix + "," + readablePrice;
            }
            return readablePrice;
        },
        getReadablePriceInWord: function(price) {
            if (price / 10000000 > 1) {
                return Math.floor(price / 1000000) / 10 + " Crores";
            } else if (price / 100000 > 1) {
                return Math.floor(price / 10000) / 10 + " Lacs";
            } else if (price / 1000) {
                return Math.floor(price / 100) / 10 + " K";
            } else {
                return price;
            }
        },
        getIdentifier: function(string) {
            var identifier = '';
            if (string) {
                identifier = string.toLowerCase().replace(/ /g, '-');
            }
            return identifier;
        },
        validateForm: function(form, strict) {
            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            function validatePhone(phoneNumber, countryCode) {
                var re = /^\d{5,15}$/,
                    sre = /^\d{10}$/;
                if (countryCode == '+91') {
                    return sre.test(phoneNumber);
                }
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
                    id = $(this_field).attr('id'),
                    dep_field = $(form).find('input[name=' + id + ']').val(),
                    value = $(this_field).val(),
                    type = $(this_field).attr('type'),
                    name = $(this_field).attr('name'),
                    isRequired = $(this_field).attr('required'),
                    hasError = false;

                if (!$(this_field).parent('div').hasClass('error') && !strict) {
                    continue;
                }
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
                } else if (isRequired && name == 'phone' && !validatePhone(value, dep_field)) {
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
                    utils.log('read csv error callback for: ' + url);
                    utils.log('error occured ' + errorThrown);
                    return false;
                }
            });
        },
        getJsonData: function(url) {
            return $.ajax({
                type: 'GET',
                url: url,
                async: true,
                jsonpCallback: 'callback',
                contentType: "application/json",
                dataType: "jsonp",
                success: function(data) {
                    // register success callback in return promise
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    utils.log('read json error callback for: ' + url);
                    utils.log('error occured ' + errorThrown);
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
        getUnit3dSvgPolygonElements: function(unitTypeData) {
            var svgData = unitTypeData ? unitTypeData.svgs : null,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = [];
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                if (svgObj.type == 'info') {
                    var attrs = {
                        'class': 'transition',
                        'id': this.getIdentifier('comp-' + svgObj.name),
                        'data-name': svgObj.name,
                        'data-type': svgObj.type,
                        'data-details': svgObj.details,
                        points: svgObj.svgPath
                    };
                    var eachPolygon = utils.makeSVG('polygon', attrs);
                    svgCode.push(eachPolygon);
                }
            }

            return svgCode;
        },
        unitComponentMouseEnter: function(params, containerReference) {
            var dataset = $(params.element).data(),
                towerCode = "<div id='container-detail' class='tooltip-detail'>";

            var tooltipCoordinates = {};
            if (params.event) {
                tooltipCoordinates.pageX = params.event.clientX;
                tooltipCoordinates.pageY = params.event.clientY;
            } else {
                tooltipCoordinates.pageX = $('#' + config.selectedUnitContainerId).offset().left + (params.pointX * $('#' + config.selectedUnitContainerId).width() / 100) + 10;
                tooltipCoordinates.pageY = $('#' + config.selectedUnitContainerId).offset().top + (params.pointY * $('#' + config.selectedUnitContainerId).height() / 100) + 10;
            }
            var tooltipClass = utils.getTooltipPosition(tooltipCoordinates);
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
                var left = tooltipCoordinates.pageX - offset.left;
                var top = tooltipCoordinates.pageY - offset.top;

                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", top + 'px');


                /*pointX = params.pointX;
                pointY = params.pointY;
                $('#container-detail').css("left", pointX + '%');
                $('#container-detail').css("top", pointY + '%');*/

                // animate
                window.getComputedStyle(document.getElementById('container-detail')).opacity; // jshint ignore:line
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
                this.hideShortlistText();
            } else {
                var comparedItems = utils.getComparedItems('shortlistedItems');
                if (Object.keys(comparedItems).length < config.maxShortlistCount) {
                    $(element).addClass('selected');
                    utils.addToShortListed(unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier);
                    this.showShortlistText(false);
                } else {
                    utils.log("Max shortlist count reached.");
                    this.showShortlistText(true);
                }
            }
        },
        showShortlistText: function(isMaxReached) {
            var _this = this;
            $('.like-box a p.click-txt').stop().hide();
            if (isMaxReached) {
                $('.like-box a p.shortlisted').addClass('max');
            }
            $('.like-box a p.shortlisted').stop().fadeIn(500);
            setTimeout(function() {
                _this.hideShortlistText();
            }, 3000);
        },
        hideShortlistText: function() {
            $('.like-box a p.shortlisted').stop().hide();
            $('.like-box a p.click-txt').stop().show();
            $('.like-box a p.shortlisted').removeClass('max');
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
                    htmlCode += '<li >' + comparedItems[uniqueIdentifier].unitName + '<span class="icon icon-cross ' + config.shortlistedUnitRemoveClass + '" data-unitidentifier="' + comparedItems[uniqueIdentifier].unitIdentifier + '" data-uniqueidentifier="' + uniqueIdentifier + '"></span></li>';
                }
                htmlCode += '</ul>';
            } else {
                htmlCode += '<p>Please shortlist items to compare</p>';
            }

            $('#' + config.unitCompareButtonId).addClass('disable');
            if (length > 1) {
                $('#' + config.unitCompareButtonId).removeClass('disable');
            }

            $('#' + config.shortListedUnitListId).html(htmlCode);
            $('#' + config.likeCountId).html(length);
            $('.' + config.blinkElementClass).addClass(config.beepEffectClass);
            setTimeout(function() {
                $('.' + config.blinkElementClass).removeClass(config.beepEffectClass);
            }, 500);
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
        removeSVGClasses: function(svgElementsArray, removeClass) {
            if (svgElementsArray && svgElementsArray.length > 0) {
                for (var i = svgElementsArray.length - 1; i >= 0; i--) {
                    // element should have a unique id
                    utils.removeSVGClass(svgElementsArray[i].id, removeClass);
                }
            }
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
            if (hash && hash != "undefined") {
                router.setRoute(hash);
            }
            return;
        },
        getTermsConditionsHtml: function(data, rootdata) {
            return '<h3>Terms &amp; Conditions</h3>' +
                '<p>All details provided about the project are based on information provided by the builder to PropTiger.com. No warranty of the accuracy of the details as provided by the builder. PropTiger.com is not liable for any change in specifications post buying.</p>' +
                '<p>All the commitments on the delivery and quality of material used for the proposed flat/property are from the developer and PropTiger cannot be held accountable for any variations or non-delivery of any such committed things.</p>' +
                '<p>Developer reserves the right to change the specifications of the flats at its own discretion as mentioned herein and PropTiger shall not be held responsible for any such change in specifications in future.</p>' +
                '<p>Only Indian Residents, Non-Resident Indians (NRIs), OCI (Overseas Citizens of India) and Persons of Indian Origin (PIOs) who are eligible to enter into contract as per Indian Contract Act, 1881 shall be eligible to apply.</p>' +
                '<p>Images shown here are artistic view only and the actual project/property may be different from this. Payment plan and prices are subject to change at the sole discretion of the builder. Floor plan and the layout dimensions are subject to modification.</p>' +
                '<p>Token amount of <span class="icon icon-rupee fs10"></span> ' + data.bookingAmount + '/- will be forfeited in case the Client does not complete all booking formalities including filling up application form and payment of the balance booking amount (5% or 10% as the case may be) within 30 days of the booking. No claim whatsoever will be entertained in this regard after 1 month.</p>' +
                '<p>Liability of the PropTiger in all circumstances shall not exceed the booking amount paid on this website for booking this property.</p>' +
                '<p>The booking amount paid by the user for booking is only a token advance and it does not confer ownership rights of the chosen property. The booking only ensures blocking of the property temporarily and should not be considered as buying or owning the property.</p>' +
                '<p>Modification of the booking is allowed within the <strong>7 days</strong> of booking. Any service charges will not be applied during this period. For modifications please contact Proptiger.com customer care at <strong>+919278892788</strong>.</p>' +
                '<p>Any request for customization or changes is to be handled directly with the builders. PropTiger will not be responsible for any such request not entertained by Builder.</p>' +
                '<p>Updates regarding the project completion etc. shall be provided by the builder directly post booking of the flat.</p>' +
                '<p>Please use the Booking ID allotted in all further communication with the builder and Proptiger.com.</p>' +
                '<p>Offer prices provided are subject to adhering the payment schedule mentioned in the project.</p>';
        },
        getPriceBreakupHtml: function(data, rotationdata, rootdata, showTnc) {
            var opCode = '';
            var code = '<ul class="pricebreakup-tabs">' + '<li class="active"  data-type="pricebreakup">Price Breakup</li>' + '<li  data-type="paymentplan">Payment Plan</li>' + '</ul>' +
                '<div class="unit-content-wrapper">' +
                '<div class="payment-pic pricebreakup-tabs-content paymentplan ' + config.hideClass + '">';
            if (rootdata.paymentPlanImage) {
                code += '<img src="' + rootdata.paymentPlanImage + '" />';
            } else {
                code += 'No payment plan available';
            }

            code += '</div>';
            code += "<table class='base-table pricebreakup-tabs-content pricebreakup' cellpadding='0' cellspacing='0' border='0'>";
            if (data.price) {
                code += "<tr><td>BSP <span>(Basic Selling Price)</span></td><td class='right-align'>" + data.basePrice + "</td></tr>";

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
                        code += "<tr><td>" + pricingSubcategory.name + " <span>(" + pricingSubcategory.masterName + ")</span></td><td class='right-align'>" + utils.getReadablePrice(unitPricingSubcategory.price) + "</td></tr>";
                    } else if (pricingSubcategory) {
                        opCode += "<tr class='" + config.optionalPriceClass + "'><td><input type='checkbox' value='" + unitPricingSubcategory.price + "'/> " + pricingSubcategory.name + " <span>(" + pricingSubcategory.masterName + ")</span></td><td class='right-align'>" + utils.getReadablePrice(unitPricingSubcategory.price) + "</td></tr>";
                    }
                }
                if (opCode !== '') {
                    code += "<tr><td colspan=2 class='other-options'>Other optional costs</td></tr>" + opCode;
                }

                code += "<tr><td class='sub-total-price'>Sub Total</td><td class='sub-total-price " + config.subTotalAmountClass + " right-align'>" + utils.getReadablePrice(data.price) + "</td></tr>";
                if (data.discount && data.discount > 0) {
                    code += "<tr><td class='discount-price'>Discount <span>(" + data.discountDescription + ")</span> </td><td class='discount-price right-align'>" + utils.getReadablePrice(data.discount) + "</td></tr>";
                    code += "<tr><td class='total-price'>Price after Discount</td><td class='total-price right-align' width='100px'><span class='icon fs14 icon-rupee'></span> <label class='" + config.totalAmountClass + "'>" + utils.getReadablePrice(data.price - data.discount) + "</label></td></tr>";
                }

                if (showTnc) {
                    code += "<tr><td colspan='2'><div class='price-breakup-trems'><a class='price-terms'>Terms &amp; Conditions</a></div></td></tr>";
                }
            } else {
                code += "<tr><td colspan='2'><br/><br/><br/>No price details available.</td></tr>";
            }
            code += "</table>";
            return code;
        },
        updateTotalPrice: function(data) {
            var amount = data.price,
                optionalPrices = $('.' + config.optionalPriceClass);

            for (var i = 0; i < optionalPrices.length; i++) {
                var checkbox = $(optionalPrices[i]).find('input[type=checkbox]');
                if (checkbox.is(':checked') === true) {
                    amount += parseInt(checkbox.val(), 10);
                }
            }

            $('.' + config.totalAmountClass).html(utils.getReadablePrice(amount - data.discount));
            $('.' + config.subTotalAmountClass).html(utils.getReadablePrice(amount));
        },
        makeSVG: function(tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        },
        showLoader: function(model, startAnimation) {
            $('.loading-bar span').width('0%');
            $('.loading-persentage').html('0%');
            $('.show-loading').show();
            var percentCounter = 0,
                count = 0,
                arrayOfImageUrls = $('img').not(config.lazyloadClass);

            if (!(arrayOfImageUrls && arrayOfImageUrls.length)) {
                $('.show-loading').hide();
                startAnimation(model);
                return;
            }

            $.each(arrayOfImageUrls, function(index, value) {
                $('<img>').attr('src', value.src) //load image
                    .load(function() {
                        count++;
                        percentCounter = (count / arrayOfImageUrls.length) * 100; //set the percentCounter after this image has loaded
                        var percentage = Math.floor(percentCounter) + '%';
                        $('.loading-bar span').width(percentage);
                        $('.loading-persentage').html(percentage);
                        if (percentCounter == 100) {
                            $('.show-loading').hide();
                            startAnimation(model);
                        }
                    });
            });
        },
        showNotificationTooltip: function(message) {
            if (!message) {
                return;
            }

            if (notificationTooltipTimeout) {
                clearTimeout(notificationTooltipTimeout);
            }

            $('.' + config.notificationTooltipClass).stop(true, true);
            this.removeNotificationTooltip();
            $('.' + config.notificationTooltipClass + ' .' + config.notificationMessageClass).text(message);
            $('.' + config.notificationTooltipClass).animate({
                'top': 0
            }, 1000, function() {
                notificationTooltipTimeout = setTimeout(function() {
                    utils.hideNotificationTooltip();
                }, 8000);
            });
        },
        //fly to shortlist starts here
        flyToShortlist: function(element) {
            var cart = $('#heart-added');
            var imgtodrag = $(element).find('.heart-clone');
            if (imgtodrag) {
                var imgclone = imgtodrag.clone()
                    .offset({
                        top: imgtodrag.offset().top,
                        left: imgtodrag.offset().left
                    })
                    .css({
                        'opacity': '0.8',
                        'position': 'absolute',
                        'color': '#f18d18',
                        'font-size': '50px',
                        'z-index': '999999'
                    })
                    .appendTo($('body'))
                    .animate({
                        'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'font-size': '25px',
                        'color': '#f18d18'
                    }, 1500, 'easeInOutQuint');

                imgclone.animate({
                    'opacity': '0',
                    'font-size': '14px'
                }, function() {
                    $(this).detach();
                });
            }
        },
        //fly to shortlist ends here
        hideNotificationTooltip: function() {
            $('.' + config.notificationTooltipClass).animate({
                'top': -100
            }, 3000);
        },
        removeNotificationTooltip: function() {
            $('.' + config.notificationTooltipClass).css('top', '-100px');
        },
        reOrderFrames: function(angles) {
            var arr = [];
            var queue = [];


            function queuepush(start, end) {
                if (start <= end) {
                    queue.push({
                        start: start,
                        end: end
                    });
                }
            }

            function findMiddleElement(que) {
                var middleIndex = parseInt((que.end + que.start) / 2);
                arr.push(angles[middleIndex]);
                queuepush(que.start, middleIndex - 1);
                queuepush(middleIndex + 1, que.end);
            }

            queuepush(0, angles.length - 1);
            while (queue.length) {
                var obj = queue.shift();
                findMiddleElement(obj);
            }

            return arr;
        }
    };

})();