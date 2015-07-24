/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var BookingView = (function() {

    var containerMap = {
        'paymentScreen': '<div id="payment-screen" class="payment-screen"></div>',
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

    function BookingView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        this._closeEvent = new Event(this);
        this._makePayment = new Event(this);
    }

    BookingView.prototype = {
        buildView: function() {
            var i, data = this._model.getData(),
                rotationdata = this._model.getRotationdata(),
                rootdata = this._model.getRootdata(),
                _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data, rotationdata, rootdata);
                }
            }
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
            var url = rootdata.baseUrl + '/' + data.towerIdentifier + '/' + rotationdata.rotationAngle + '/' + data.unitIdentifier;
			var offerDiv = '';
			if (data.discount) {
				offerDiv = '<div class="special-offers">' + '<span></span>' + '<p>Save <strong><label 		class="icon fs14 icon-rupee"></label>' + utils.getReadablePrice(data.discount) + '</strong> ' + data.discountDescription + '</p>' + '</div>';
			}
            var code = '<div class="payment-container">' +
				'		 <div class="title-text">' +
				'        	<a class="close-payment transition" data-url="' + url + '"><span class="icon icon-arrow_left fs24"></span></a>' +
				'			<p>Payment Screen</p>' +
				' 		 </div>' +
                '        <div class="payment-left">' + offerDiv +
                '<div class="payment-left-top">' +
                '                <h3>' + rootdata.projectName + ' <span>Whitefield Bangalore</span></h3>' +
                '                <div class="payment-photo-box">' +
                '                <img src="' + rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImageUrl + '" width="100%" alt="">' +
                '                </div>' +
                '                <div class="floor-area">' +
				'                <h5>' + data.listingAddress + '</h5>' +
                '                    <p>' +
                '                        Area' +
                '                        <span>' + data.size + ' ' + data.measure + '</span>' +
                '                    </p>' +
				'					 <p class="ml5 mr5">|</p>' +
				'                    <p>' +
                '                        Floor no.' +
                '                        <span>' + data.floor + '</span>' +
                '                    </p>' +
                '                    <div class="clear-fix"></div>' +
                '            </div>' +
				'            <div class="clear-fix"></div>' +
				'                    <p class="fleft">' +
                '                        Total Price [ <span class="icon icon-rupee_final fs18"></span> ]' +
				'						 <span class="fright"><span class="icon icon-rupee_final fleft fs18"></span>'+ utils.getReadablePriceInLacs(data.price  - data.discount) + '* </span>' + 
                '                        <span class="fright"><span class="icon icon-rupee_final fleft fs18"></span>' + utils.getReadablePrice(data.price) + '</span>' +
                '                    </p>' +
                '            </div>' +
				'            <div class="clear-fix"></div>' +
                '            <a id="payment-breakup" class="view-price-brakup">View Price Breakup &amp; Payment plan</a>' +
                '            <div class="booking-amount">' +
                '            <h3>Booking Amount: <span><span class="icon icon-rupee"><span><strong>' + utils.getReadablePrice(data.bookingAmount) + ' </strong><label>only</label></span></h3> ' +
				'			 <p>( no cancellation charges )</p>' +
                '            </div>' +
                '        </div>' +
                '        <div class="payment-right">' +
                '            <div id="booking-user-details" class="payment-right-container">' +
				'            <h3>Nice Selection!</h3>' +
                '            <p>Now Make a tokan payment of <span class="icon icon-rupee fs14"></span> ' + utils.getReadablePrice(data.bookingAmount) + '/- to book your choice.</p>' +
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
                '                                <input type="text" required />' +
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
                '                                <input type="text" name="phone" required />' +
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
                '                            <div id="booking-nationality" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">nationality</label>' +
                '                                <input type="text" />' +
                '                                <span class="error ' + config.errorMsgClass + '"></span>' +                
                '                            </div>' +
                '                        </td>' +
                // '                        <td width="50%">' +
                // '                            <div id="booking-nationality" class="input-box transition no-paddind  ' + config.bookingSelectionDivClass + '">' +
                // '                                <a class="nationalty-link">Nationality<span class="icon fs18 icon-next transition"></span></a>' +
                // '                                <ul class="nationalty-drop-down transition ' + config.bookingDropdownClass + '" style="display:none;">' +
                // '                                    <li><a class="transition">Indian</a></li>' +
                // '                                    <li><a class="transition">Other</a></li>' +
                // '                                </ul>' +
                // '                            </div>' +
                // '                        </td>' +
                '                    </tr>' +
                '                </table>' +
                '            </div>' +
                '            <div class="terms-condition">' +
                '                <input type="checkbox" id="terms" required />' +
                '                <label for="terms">I have read &amp; agree to <a id="tnc">Terms &amp; Conditions</a></label>' +
                '                <span class="error ' + config.errorMsgClass + '"></span>' +                
                '            </div>' +
                '            <a class="fleft transition make-payment">Continue to Payment</a>' +
                '            <div class="clear-fix"></div>' +
                '        </div>' +
                '        </div>' +
                '        </div>';
            this._elements.paymentScreen.html(code);
            this.paymentScreenEvents();
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
                if (value == null || value == "") {
                    $('#' + this.id).removeClass(config.activeBookingInputClass);
                }
            });

            // _this._elements.paymentScreen.off('click').on('click', '.' + config.bookingSelectionDivClass, function(event) {
            //     event.stopPropagation();
            //     $('#' + this.id + ' > a').addClass(config.activeBookingInputClass);
            //     $('#' + this.id + ' .' + config.bookingDropdownClass).show();
            // });

            _this._elements.paymentScreen.on('click', '.make-payment', function(event) {
                // notify controller
                _this._makePayment.notify(this); // this refers to element here
            });

            _this._elements.paymentScreen.on('click', '#tnc', function(event) {
                $('#' + config.termsConditionPopupId).show();
            });

            _this._elements.paymentScreen.on('click', '#payment-breakup', function(event) {
                $('#' + config.paymentBreakupPopupId).show();
            });
        },
        getValidatedPaymentData: function() {
            var bookingForm = $('#booking-user-details'),
                unitData = this._model.getData(),
                data = {};

            if(!utils.validateForm(bookingForm)) {
                return null;
            }

            data.firstName = $('#booking-first-name input').val();
            data.lastName = $('#booking-last-name input').val();
            data.email = $('#booking-email input').val();
            data.phone = $('#booking-phone input').val();
            data.dob = $('#booking-dob input').val();
            data.nationality = $('#booking-nationality input').val();
            data.pan = $('#booking-pan input').val();
            data.listingId = unitData.listingId;
            data.amount = unitData.bookingAmount;
            return data;
        },
        termsConditionPopup: function(data, rotationdata, rootdata) {
            var code = '<div class="tc-container">' +
                '<a class="close-payment"><span class="icon icon-cross fs24"></span></a>' +
                utils.getTermsConditionsHtml() +
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
        }
    };

    return BookingView;

})();