/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var BookingView = (function() {

    var containerMap = {
        'paymentScreen': '<div class="payment-screen" id="payment-screen"></div>'
    };

    function getElements() {
        var elements = {
            'paymentScreen': $('#payment-screen')
        };
        return elements;
    }

    function BookingView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        this._closeEvent = new Event(this);
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
            var code = '<div class="payment-container">' +
                '        <a class="close-payment transition" data-url="' + url + '"><span class="icon icon-cross fs24"></span></a>' +
                '        <div class="payment-left">' +
                '            <div class="payment-left-top">' +
                '                <h3>' + rootdata.projectName + '</h3>' +
                '                <div class="payment-photo-box">' +
                '                <img src="' + rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImageUrl + '" width="100%" alt="">' +
                '                </div>' +
                '                <h5>' + data.listingAddress + ', Floor no. ' + data.floor + '</h5>' +
                '                <div>' +
                '                    <p class="fleft">' +
                '                        Area' +
                '                        <span>' + data.size + ' ' + data.measure + '</span>' +
                '                    </p>' +
                '                    <p class="fright">' +
                '                        Total Price' +
                '                        <span>Rs. ' + utils.getReadablePrice(data.price) + '</span>' +
                '                    </p>' +
                '                    <div class="clear-fix"></div>' +
                '            </div>' +
                '            </div>' +
                '            <a href="#" class="view-price-brakup">View Price Breakup &amp; Payment plan</a>' +
                '            <div class="booking-amount">' +
                '                <h3>Booking Amount: Rs. ' + utils.getReadablePrice(data.bookingAmount) + '</h3> ' +
                '            </div>' +
                '        </div>' +
                '        <div class="payment-right">' +
                '            <div class="payment-right-container">' +
                '            <p>Please verify your flat details &amp; make the payment to block your apartment</p>' +
                '            <h3>Personal Details</h3>' +
                '            <div class="personal-detail-box">' +
                '                <table cellpadding="0" cellspacing="0" width="100%">' +
                '                    <tr>' +
                '                        <td width="50%">' +
                '                            <div id="booking-first-name" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">First Name</label>' +
                '                                <input type="text" />' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-last-name" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">Last Name</label>' +
                '                                <input type="text" />' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                    <tr>' +
                '                        <td width="50%">' +
                '                            <div id="booking-email" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">email</label>' +
                '                                <input type="text" />' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-phone" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">phone</label>' +
                '                                <input type="text" />' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                    <tr>' +
                '                        <td width="50%">' +
                '                            <div id="booking-dob" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">date of birth (DD/MM/YYY)</label>' +
                '                                <input type="text" />' +
                '                            </div>' +
                '                        </td>' +
                '                        <td width="50%">' +
                '                            <div id="booking-nationality" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">nationality</label>' +
                '                                <input type="text" />' +
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
                '                    <tr>' +
                '                        <td colspan="2">' +
                '                            <div id="booking-pan" class="input-box transition ' + config.bookingInputDivClass + '">' +
                '                                <label class="transition">pan number</label>' +
                '                                <input type="text" />' +
                //'                                <span class="error">This field is Required</span>' +
                '                            </div>' +
                '                        </td>' +
                '                    </tr>' +
                '                </table>' +
                '            </div>' +
                '            <div class="terms-condition">' +
                '                <input type="checkbox" id="terms" />' +
                '                <label for="terms">I have read &amp; agree to <a href="#">Terms &amp; Conditions</a></label>' +
                '            </div>' +
                '            <a href="#" class="fright make-payment">Continue to Payment</a>' +
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
                $('#' + this.id).removeClass(config.activeBookingInputClass);
            });

            // _this._elements.paymentScreen.off('click').on('click', '.' + config.bookingSelectionDivClass, function(event) {
            //     event.stopPropagation();
            //     $('#' + this.id + ' > a').addClass(config.activeBookingInputClass);
            //     $('#' + this.id + ' .' + config.bookingDropdownClass).show();
            // });

        }
    };

    return BookingView;

})();