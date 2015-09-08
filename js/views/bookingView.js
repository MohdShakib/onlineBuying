/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var BookingView = (function() {

    var containerMap = {
        'paymentScreen': '<div id="payment-screen" class="payment-screen" style="display:none;"></div>',
        'termsConditionPopup': '<div id="terms-condition-popup" class="terms-condition-popup" style="display:none;"></div>',
        'paymentBreakupPopup': '<div id="payment-breakup-popup" class="terms-condition-popup" style="display:none;"></div>'
    };

    function getElements() {
        var elements = {
            'paymentScreen': $('#payment-screen'),
            'termsConditionPopup': $('#terms-condition-popup'),
            'paymentBreakupPopup': $('#payment-breakup-popup')
        };
        return elements;
    }

    var ivrsData = {
        "501448": "+91-7930641590",
        "640926": "+91-7930641590",
        "513534": "+91-8049202151",
        "656047": "+91-8049202151",
        "668509": "+91-4439942696",
        "672575": "+91-1166764112",
        "501639": "+91-3330566486",
        "669434": "+91-2261739689",
        "655929": "+91-2039520706",
        "667404": "+91-2039520706"
    };

    function BookingView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        this._closeEvent = new Event(this);
        this._makePayment = new Event(this);
        this._getCallBack = new Event(this);
    }

    BookingView.prototype = {
        buildView: function() {
            var i, data = this._model.getData(),
                rotationdata = this._model.getRotationdata(),
                rootdata = this._model.getRootdata(),
                _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.renderInitialData(data);
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data, rotationdata, rootdata);
                }
            }
        },
        renderInitialData: function(data) {
            document.title = "Proptiger Payment";
        },
        startAnimation: function() {
            $('#payment-screen').fadeIn(900);
        },
        endAnimation: function() {
            $('#payment-screen').fadeOut(800);
        },
        buildSkeleton: function(containerList) {
            var key, mainContainerHtml = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    mainContainerHtml += containerMap[containerList[key]];
                }
            }
            $('#' + config.mainContainerId).html(mainContainerHtml);
            this._elements = getElements();
        },
        paymentScreen: function(data, rotationdata, rootdata) {
            var paymentBtnClass = 'make-payment',
                propertyBooking = this._model.getPropertyBooking();

            var offerBanner, propertyDetail, titleText, offerList, getCallbackCode, url, imageUrl, unitDetails, paymentBreakup;

            if (propertyBooking) {
                offerBanner = "";
                unitDetails = "";
                paymentBreakup = "";
                offerList = "";
                imageUrl = data.floorPlanImage;

                var offers = offerData[rootdata.projectId] ? offerData[rootdata.projectId][data.propertyId] : null;
                if (offers) {
                    offerList += '<div class="offers"><h4>' + offers.length + ' Offers</h4><ul>';
                    for (var i in offers) {
                        offerList += '<li><p>' + offers[i] + '</p></li>';
                    }
                    offerList += '</ul></div>';
                }

                propertyDetail = "<div class='property-detail'><span>" + data.bedrooms + " BHK + " + data.bathrooms + " T, " + data.size + " " + data.measure + "</span><span class='right'><span class='icon icon-rupee_final fleft fs18'></span>" + utils.getReadablePriceInWord(data.price) + "</span></div>";
                titleText = "<br>You will have the flexibility to change your selection later.";
                getCallbackCode = '<a class="fleft transition callback-btn get-callback">Get Call Back</a>';
                url = 'href= "' + envConfig.apiURL + 'online-buying/' + utils.getIdentifier(rootdata.city) + '/' + utils.getIdentifier(rootdata.builderName) + '/' + utils.getIdentifier(rootdata.projectName) + '-' + rootdata.projectId + '"';
            } else {
                offerBanner = '';
                propertyDetail = '';
                titleText = '';
                offerList = '';
                getCallbackCode = '';
                url = 'data-url="' + rootdata.baseUrl + '/' + data.towerIdentifier + '/' + rotationdata.rotationAngle + '/' + data.unitIdentifier + '"';
                imageUrl = rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImageUrl;
                unitDetails = '<div class="floor-area"><h5>' + data.listingAddress + '</h5> <p>Area <span>' + data.size + ' ' + data.measure + '</span></p> <p class="ml5 mr5">|</p> <p>Floor no. <span>' + data.floor + '</span></p><div class="clear-fix"></div></div>' +
                    '<div class="clear-fix"></div>' +
                    '<p class="fleft width-100">' +
                    '<span class="fleft">Total Price</span>' +
                    '<span class="fright"><span class="icon icon-rupee_final fleft fs18"></span>' + utils.getReadablePriceInWord(data.price - data.discount) + ' </span>' +
                    '<span class="fright line-through"><span class="icon icon-rupee_final fleft fs18"></span>' + utils.getReadablePriceInWord(data.price) + '</span>' +
                    '</p>';
                paymentBreakup = '<div class="clear-fix"></div><a id="payment-breakup" class="view-price-brakup">View Price Breakup &amp; Payment plan</a>';

                if (data.discount) {
                    offerBanner = '<div class="special-offers">' + '<span></span>' + '<p>Save <strong><label       class="icon fs14 icon-rupee"></label>' + utils.getReadablePrice(data.discount) + '</strong> ' + data.discountDescription + '</p>' + '</div>';
                }
            }

            if (!config.enablePayment || data.bookingStatus != 'Available') {
                paymentBtnClass = 'disabled';
            }

            var code = '<div class="payment-container">' +
                '        <div class="title-text">' +
                '           <a class="close-payment transition" ' + url + '><span class="icon icon-arrow_left fs24"></span></a>' +
                '           <p>Payment Screen</p>';
                if (ivrsData[rootdata.projectId] !== undefined) {
                    code += '<span class="phoneNumber"><i class="icon icon-phone"></i> ' + ivrsData[rootdata.projectId] + '</span>';
                }
                code += '        </div>' +
                '        <div class="payment-left">' + offerBanner +
                '        <div class="payment-left-top">' +
                '                <h3>' + rootdata.builderName + ' ' + rootdata.projectName + ' <span>' + rootdata.address + '</span></h3>' + propertyDetail +
                '                <div class="payment-photo-box">' +
                '                   <img src="' + imageUrl + '" width="100%" alt="">' +
                '                </div>' + unitDetails +
                '        </div>' + paymentBreakup + offerList +
                '            <div class="booking-amount">' +
                '            <h3>Booking Amount: <span><span class="icon icon-rupee"><span><strong>' + utils.getReadablePrice(data.bookingAmount) + ' </strong><label>only</label></span></h3> ' +
                '            <p>( no cancellation charges )</p>' +
                '            </div>' +
                '        </div>' +
                '        <div class="payment-right">' +
                '            <div id="booking-user-details" class="payment-right-container">' +
                '            <h3>Nice Selection!</h3>' +
                '            <p>Now, make a token payment of <span class="icon icon-rupee fs14"></span> ' + utils.getReadablePrice(data.bookingAmount) + '/- to book your choice.' + titleText + '</p>' +
                '            <div class="personal-detail-box">' +
                '                <table cellpadding="0" cellspacing="0" width="100%">' +
                '                    <tr>' +
                '                        <td width="50%">' +
                '                            <div id="booking-first-name" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">First Name</label>' +
                '                                <input type="text" required />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-last-name" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">Last Name</label>' +
                '                                <input type="text" />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                    <tr>' +
                '                        <td width="50%">' +
                '                            <div id="booking-email" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">email</label>' +
                '                                <input type="email" required />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-phone" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">phone</label>' +
                '                                <input type="text" name="phone" id="phone-number" required />' +
                '                                <input type="hidden" id="country-code" name="phone-number" />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                    <tr>' +
                //'                        <td width="50%">' +
                //'                            <div id="booking-dob" class="input-box transition ' + config.bookingInputDivClass + '">' +
                //'                                <label class="transition">date of birth (DD/MM/YYY)</label>' +
                //'                                <input type="text" />' +
                //'                                <span class="error ' + config.errorMsgClass + '"></span>' +
                //'                            </div>' +
                //'                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-pan" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">pan number</label>' +
                '                                <input type="text" />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-nationality" class="input-box transition no-paddind  ' + config.bookingSelectionDivClass + '">' +
                '                                <a class="nationalty-link selectedCountry" data-countrycode="0">Country<span class="icon fs18 icon-next transition"></span></a>' +
                '                                <ul class="' + config.nationalityDropdownClass + ' transition ' + config.bookingDropdownClass + '" style="display:none;">' +
                '                                </ul>' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                </table>' +
                '            </div>' +
                '            <div class="terms-condition">' +
                '                <input type="checkbox" id="terms" required />' +
                '                <label for="terms">I have read &amp; agree to <a id="tnc">Terms &amp; Conditions</a></label>' +
                '                <span class="error ' + config.errorMsgClass + '"></span>' +
                '            </div>';

            var defaultMsg = '';
            if (data.bookingStatus != 'Available') {
                defaultMsg = '<span class="form-msg-failure">This unit is currently sold out.</span>';
            }
            code += '<div class="btn-container"><div class="action-message">' + defaultMsg + '</div>';
            code += '<a class="fleft transition payment-btn ' + paymentBtnClass + '"  id="paymentButton" >Continue to Payment</a>';
            //code += getCallbackCode;
            code += '</div>';
            code += '<div class="clear-fix"></div>' +
                '</div>' +
                '</div>' +
                '</div>';


            this._elements.paymentScreen.html(code);
            ajaxUtils.getCountries({
                successCallback: this.getCountriesList,
                self: this
            });
            this.paymentScreenEvents();
        },
        getCountriesList: function(countries, params) {
            var htmlCode = '',
                totalCountries = countries ? countries.length : 0;
            if (countries && totalCountries) {
                for (var i = 0; i < totalCountries; i++) {
                    htmlCode += '<li class="country-list-item" data-countryid="' + countries[i].countryId + '" data-countrycode="' + countries[i].countryCode + '"><a class="transition">' + countries[i].label + '</a></li>';
                }
            }
            $('.' + config.nationalityDropdownClass).html(htmlCode);
            params.self.countryDropdownEvents();
        },
        countryDropdownEvents: function() {
            $('.' + config.nationalityDropdownClass).off('click').on('click', '.country-list-item', function(event) {
                event.stopPropagation();
                var countryName = $(this).find('a').text();
                var countryId = $(this).data('countryid');
                var countryCode = $(this).data('countrycode');
                $('.' + config.bookingSelectionDivClass + ' .selectedCountry').text(countryName);
                $('.' + config.bookingSelectionDivClass + ' .selectedCountry').data('countryid', countryId);
                $('.' + config.nationalityDropdownClass).css('display', 'none');
                $('#country-code').val(countryCode);
            });
        },
        paymentScreenEvents: function() {
            var _this = this;

            _this._elements.paymentScreen.off('click').on('click', '.close-payment', function(event) {
                // notify controller
                _this._closeEvent.notify(this); // this refers to element here
            });

            _this._elements.paymentScreen.off('focus').on('focus', '.' + config.bookingInputDivClass, function(event) {
                $('#' + this.id).addClass(config.activeBookingInputClass);
            });

            _this._elements.paymentScreen.off('focusout').on('focusout', '.' + config.bookingInputDivClass, function(event) {
                var value = $('#' + this.id + ' input').val();
                if (value === null || value === "") {
                    $('#' + this.id).removeClass(config.activeBookingInputClass);
                }
            });

            _this._elements.paymentScreen.on('click', '.' + config.bookingSelectionDivClass, function(event) {
                event.stopPropagation();
                $('#' + this.id + ' > a').addClass(config.activeBookingInputClass);
                $('#' + this.id + ' .' + config.bookingDropdownClass).show();
            });


            // Form Validations and submit
            _this._elements.paymentScreen.on('click', '.make-payment', function(event) {
                // notify controller
                _this._makePayment.notify(this); // this refers to element here
            });

            // Form Validations and get call back
            _this._elements.paymentScreen.on('click', '.get-callback', function(event) {
                // notify controller
                _this._getCallBack.notify(this); // this refers to element here
            });

            _this._elements.paymentScreen.on('keyup', '#booking-user-details', function(event) {
                var bookingForm = $('#booking-user-details');
                utils.validateForm(bookingForm, false);
            });
            _this._elements.paymentScreen.on('change', '#terms', function(event) {
                var bookingForm = $('#booking-user-details');
                utils.validateForm(bookingForm, false);
            });

            _this._elements.paymentScreen.on('click', '#tnc', function(event) {
                $('#' + config.termsConditionPopupId).show();
            });

            _this._elements.paymentScreen.on('click', '#payment-breakup', function(event) {
                $('#' + config.paymentBreakupPopupId).show();
            });

            _this._elements.paymentScreen.on('click', function() {
                //close country dropdown when clicked outside anywhere
                $('.' + config.nationalityDropdownClass).css('display', 'none');
            });

            _this._elements.paymentScreen.on('click', '.' + config.nationalityDropdownClass, function() {
                event.stopPropagation();
            });
        },
        getValidatedPaymentData: function() {
            var bookingForm = $('#booking-user-details'),
                unitData = this._model.getData(),
                data = {};

            if (!utils.validateForm(bookingForm, true)) {
                return null;
            }

            data.firstName = $('#booking-first-name input').val();
            data.lastName = $('#booking-last-name input').val();
            data.email = $('#booking-email input').val();
            data.phone = $('#booking-phone input').val();
            data.countryId = $('.' + config.bookingSelectionDivClass + ' .selectedCountry').data('countryid');
            data.pan = $('#booking-pan input').val();
            if (this._model.getPropertyBooking()) {
                data.productId = unitData.couponId;
                data.productType = 'Non4DSale';
            } else {
                data.productId = unitData.listingId;
                data.productType = 'PrimaryOnline';
            }
            data.amount = unitData.bookingAmount;
            return data;
        },
        validateAndSendEmail: function() {
            var bookingForm = $('#booking-user-details'),
                rootdata = this._model.getRootdata(),
                property = this._model.getData(),
                ignoreFields = ['terms'];

            function resetFields() {
                $('.personal-detail-box').find('input').val(null).blur();
                $('.personal-detail-box').find('input:hidden').val('');
                $('input[type="checkbox"]').prop('checked', false);
                $('.' + config.bookingSelectionDivClass + ' .selectedCountry').text('COUNTRY');
                $('.' + config.bookingSelectionDivClass + ' .selectedCountry').data('countryid', 0);
            }

            if ($('.callback-btn').hasClass("disabled")) {
                return;
            }

            if (!utils.validateForm(bookingForm, true, ignoreFields)) {
                return;
            }

            var data = {
                notificationType: 'get_callback',
                email: 'vijay.kumar@proptiger.com',
                mailCC: ['rohit.arora@proptiger.com', 'sumit.sikri@proptiger.com'],
                payloadMap: {
                    projectName: rootdata.projectName,
                    city: rootdata.city,
                    firstName: $('#booking-first-name input').val(),
                    lastName: $('#booking-last-name input').val(),
                    email: $('#booking-email input').val(),
                    phone: $('#booking-phone input').val(),
                    nationality: $('.' + config.bookingSelectionDivClass + ' .selectedCountry').text(),
                    pan: $('#booking-pan input').val(),
                    configuration: property.bedrooms + " BHK + " + property.bathrooms + " T",
                    area: property.size + " " + property.measure,
                    propertyId: property.propertyId
                }
            };

            $('.callback-btn').addClass("disabled");
            $('.action-message').empty();
            var params = {
                successCallback: function(response, params) {
                    $('.callback-btn').removeClass("disabled");
                    resetFields();
                    $('.action-message').html('<span class="form-msg-success">Thank you for your interest. Our property advisors will get in touch shortly.</span>');
                },
                errorCallback: function(response, params) {
                    $('.callback-btn').removeClass("disabled");
                    $('.action-message').html('<span class="form-msg-failure">Something went wrong. Please contact +91-11-66764181 for assistance.</span>');
                }
            };
            ajaxUtils.sendEmail(data, params);
        },
        termsConditionPopup: function(data, rotationdata, rootdata) {
            var code = '<div class="tc-container">' +
                '<a class="close-payment"><span class="icon icon-cross fs24"></span></a>' +
                utils.getTermsConditionsHtml(data, rootdata) +
                '</div>';
            this._elements.termsConditionPopup.html(code);
            this.termsConditionPopupEvents();
        },
        termsConditionPopupEvents: function() {
            var _this = this;

            _this._elements.termsConditionPopup.off('click').on('click', '.close-payment', function(event) {
                $('#' + config.termsConditionPopupId).hide();
            });
        },
        paymentBreakupPopup: function(data, rotationdata, rootdata) {
            var code = '<div class="tc-container">' +
                '<a class="close-payment"><span class="icon icon-cross fs24"></span></a>' +
                utils.getPriceBreakupHtml(data, rotationdata, rootdata, false) +
                '</div>';
            this._elements.paymentBreakupPopup.html(code);
            this.paymentBreakupPopupEvents();
        },
        paymentBreakupPopupEvents: function() {
            var _this = this;

            _this._elements.paymentBreakupPopup.off('click').on('click', '.close-payment', function(event) {
                $('#' + config.paymentBreakupPopupId).hide();
            });

            _this._elements.paymentBreakupPopup.on('click', '.pricebreakup-tabs li', function() {
                var type = $(this).data('type');
                $('.pricebreakup-tabs li').removeClass('active');
                $(this).addClass('active');

                $('.unit-content-wrapper  .pricebreakup-tabs-content').addClass(config.hideClass);
                $('.unit-content-wrapper  .pricebreakup-tabs-content.' + type).removeClass(config.hideClass);
            });

            _this._elements.paymentBreakupPopup.on('click', '.' + config.optionalPriceClass, function() {
                utils.updateTotalPrice(_this._model.getData());
            });
        },
        bookListing: function() {
            if ($("#paymentButton").hasClass("disabled")) {
                return;
            }

            var data = this.getValidatedPaymentData();

            if (data == null) {
                return;
            }

            var params = {
                successCallback: function(data, params) {
                    window.location.href = data;
                },
                errorCallback: function(data, params, statusCode) {
                    if (statusCode && statusCode == 499) {
                        window.location.reload();
                    } else {
                        $("#paymentButton").removeClass("disabled");
                        $(".action-message").html("<span class='form-msg-failure'>Something went wrong. Please contact +91-11-66764181 for assistance.</span>");
                    }
                }
            };

            if (config.enablePayment && this._model.getData().bookingStatus == "Available") {
                $('#paymentButton').addClass('disabled');
                utils.tracking('button', 'clicked', 'continue-to-payment');
                ajaxUtils.bookListing(data, params);
            } else {
                $('#paymentButton').removeClass('disabled');
                $(".action-message").html("<span class='form-msg-failure'>Something went wrong. Please contact +91-11-66764181 for assistance.</span>");
            }
        }
    };

    return BookingView;

})();