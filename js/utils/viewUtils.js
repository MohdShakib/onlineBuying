var viewUtils = (function() {

    var notificationTooltipTimeout;
    return {


        getUnit3dSvgPolygonElements: function(unitTypeData) {
            var svgData = unitTypeData ? unitTypeData.svgs : null,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = [];
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                if (svgObj.type == 'info') {
                    var attrs = {
                        'class': 'transition',
                        'id': utils.getIdentifier('comp-' + svgObj.name),
                        'data-name': svgObj.name,
                        'data-type': svgObj.type,
                        'data-details': svgObj.details,
                        points: svgObj.svgPath
                    };
                    var eachPolygon = viewUtils.makeSVG('polygon', attrs);
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
                tooltipCoordinates.pageX = params.event.clientX + 10;
                tooltipCoordinates.pageY = params.event.clientY + 10;
            } else {
                tooltipCoordinates.pageX = $('#' + config.selectedUnitContainerId).offset().left + (params.pointX * $('#' + config.selectedUnitContainerId).width() / 120)+ 120;
                tooltipCoordinates.pageY = $('#' + config.selectedUnitContainerId).offset().top + (params.pointY * $('#' + config.selectedUnitContainerId).height() / 120) + 135;
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
                if (document.getElementById('container-detail')) {
                    window.getComputedStyle(document.getElementById('container-detail')).opacity; // jshint ignore:line
                    document.getElementById('container-detail').style.opacity = "1";
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
                    viewUtils.removeSVGClass(svgElementsArray[i].id, removeClass);
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
        getTermsConditionsHtml: function(data, rootdata) {
            return '<p>All details provided about the project are based on information provided by the builder to PropTiger.com. No warranty of the accuracy of the details as provided by the builder. <a href="https://www.proptiger.com/" target="_blank">PropTiger.com</a> is not liable for any change in specifications post buying.</p>' +
                '<p>All the commitments on the delivery and quality of material used for the proposed flat/property are from the builder and PropTiger cannot be held accountable for any variations or non-delivery of any such committed things.</p>' +
                '<p>Builder reserves the right to change the specifications of the flats at its own discretion as mentioned herein and PropTiger shall not be held responsible for any such change in specifications in future.</p>' +
                '<p>Only Indian Residents, Non- Resident Indians (NRIs), OCI (Overseas Citizens of India) & Persons of Indian Origin (PIOs) who are eligible to enter into contract as per Indian Contract Act, 1881 shall be eligible to apply.</p>' +
                '<p>Images shown here are artistic view only and the actual project/property may be different from this. Payment plan and prices are subject to change at the sole discretion of the builder. Floor plan and the layout dimensions are subject to modification.</p>' +
                '<p>Token amount of <span class="icon icon-rupee fs10"></span> ' + data.bookingAmount + '/- will be forfeited in case the Client does not complete all booking formalities including filling up application form and payment of the balance booking amount (as applicable) within  15 days of the booking. No claim whatsoever will be entertained in this regard after  15 days.</p>' +
                '<p>Liability of the PropTiger in all circumstances shall not exceed the booking amount paid on this website for booking this property.</p>' +
                '<p>The booking amount paid by the user for booking is only a token advance and it does not confer ownership rights of the chosen property. The booking only ensures blocking of the property temporarily and should not be considered as buying or owning the property.</p>' +
                '<p>Modification of the booking is allowed within the <strong>7 days</strong> of booking. Any service charges will not be applied during this period. For modifications please contact <a href="https://www.proptiger.com/" target="_blank">Proptiger.com</a> customer care at <strong>+91-11-66764181</strong>.</p>' +
                '<p>Any request for customisation or changes is to be handled directly with the builders. PropTiger will not be responsible for any such request not entertained by Builder.</p>' +
                '<p>Updates regarding the project completion etc. shall be provided by the builder directly post booking of the flat.</p>' +
                '<p>Please use the Booking ID allotted in all further communication with the builder and <a href="https://www.proptiger.com/" target="_blank">Proptiger.com</a></p>' +
                '<p>Offer prices provided are subject to adhering the payment schedule mentioned in the project.</p>';
        },
        getPriceBreakupHtml: function(data, rotationdata, rootdata, showTnc) {
            var opCode = '';
            var code = '<div class="unit-content-wrapper">' +
                '<div class="payment-pic pricebreakup-tabs-content paymentplan"><h3>Price Breakup</h3>';
            if (rootdata.paymentPlanImage) {
                code += '<img src="' + rootdata.paymentPlanImage + '" />';
            } else {
                code += 'No payment plan available';
            }

            code += '</div>';
            code += "<h3>Payment Plan</h3><table class='base-table pricebreakup-tabs-content pricebreakup' cellpadding='0' cellspacing='0' border='0'>";
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

                    if (unitPricingSubcategory.price <= 10) {
                        // Remove prices if value is less than 10
                        continue;
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

                code += "<tr><td colspan='2' class='pricebreakup-text'>- Service Tax, VAT &amp; Registration fees will be charged extra. <br>- Other charges including PLC subject to Unit selection which is not covered in price list will be charged extra.</td></tr>";

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

            var canvas = document.getElementById('loading-circle');
            var context = canvas.getContext('2d');
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            var radius = 85;
            var circ = Math.PI * 2;
            var quart = Math.PI / 2;

            function animate(current) {
                context.lineWidth = 2;
                context.strokeStyle = '#d36242';

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
                context.stroke();
            }

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
                        var percentage = Math.floor(percentCounter);
                        animate(percentage /100);
                        $('.ldr span').html(percentage + '%');
                        if (percentCounter == 100) {
                            startAnimation(model);
                            setTimeout(function(){
                                $('.show-loading').hide();
                            },100);
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
            $('.' + config.notificationTooltipClass + ' .' + config.notificationMessageClass).html(message);
            $('.' + config.notificationTooltipClass).animate({
                'top': 0
            }, 1000, function() {
                notificationTooltipTimeout = setTimeout(function() {
                    viewUtils.hideNotificationTooltip();
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
        },
        slideIt: function() {
            var slideCount = $('#slider ul li').length;
            var slideWidth = $('#slider ul li div').width();
            var slideHeight = $('#slider ul li div').height();
            var sliderUlWidth = slideCount * slideWidth;

            function moveLeft() {
                $('#slider ul').animate({
                    left: +slideWidth
                }, 200, function() {
                    $('#slider ul li:last-child').prependTo('#slider ul');
                    $('#slider ul').css('left', '');
                });
            }

            function moveRight() {
                $('#slider ul').animate({
                    left: -slideWidth
                }, 200, function() {
                    $('#slider ul li:first-child').appendTo('#slider ul');
                    $('#slider ul').css('left', '');
                });
            }

            $('a.control_prev').click(function() {
                moveLeft();
            });

            $('a.control_next').click(function() {
                moveRight();
            });
        },
        getAmenitiesIconHtml : function(amenityName, amenityIcon){
            var iconMapObject = {       // todo add icon-name (same as amenity name) and path count for each icon
                "Swimming-Pool" : {
                   "pathCount" : 14
                },
                "Jogging" : {
                   "pathCount" : 9
                },
                "Indoor-Games" : {
                   "pathCount" : 11
                },
                "mountain" : {
                   "pathCount" : 11
                },
                "Club-House" : {
                   "pathCount" : 10
                },
                "Hill-View" : {
                   "pathCount" : 10
                },
                "templebell" : {
                   "pathCount" : 12
                },
                "Tennis-Court" : {
                   "pathCount" : 12
                },
                "Amphitheater" : {
                   "pathCount" : 6
                },
                "Golf-Course" : {
                   "pathCount" : 6
                },
                "Gymnasium" : {
                   "pathCount" : 9
                },
                "Kids-Play" : {
                   "pathCount" : 22
                },
                "homecinema" : {
                   "pathCount" : 10
                },
                "traveling" : {
                   "pathCount" : 8
                }
            };
            var displayIcon = amenityName.trim().split(' ').join('-');
            var pathCount  = iconMapObject[displayIcon] && iconMapObject[displayIcon].pathCount || 0;
            var htmlCode = '';
            var extraClasses = '';
            if(pathCount === 0 ){
                displayIcon = amenityIcon || 'location';
            }
            if(!amenityIcon){
                extraClasses = ' transition tower-amenity';
            }
            if(pathCount === 0 && displayIcon === 'location'){
                extraClasses = ' transition';
            }
            htmlCode += "<span class='icon icon-"+ displayIcon + extraClasses + "'>" ;
            for(var i = 1 ; i <= pathCount ; i++){
                htmlCode += "<span class='path"+ i +"'></span>";
            }
            htmlCode += "</span>";
            return htmlCode;
        }
    };

})();
