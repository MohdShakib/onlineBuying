/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var BookingView = (function() {

    var containerMap = {
 
    };

    function getElements() {
        var elements = {
            
        };
        return elements;
    }

    function BookingView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;
    }

    BookingView.prototype = {
        buildView: function() {
            console.log("Hey");
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
            document.getElementById(config.mainContainerId).innerHTML = mainContainerHtml;
            this._elements = getElements();
        },
        data: function() {
            var code =  '    <div class="payment-screen">' +
                        '        <div class="payment-container">' +
                        '        <a href="#" class="close-payment"><span class="icon icon-cross fs24"></span></a>' +
                        '        <div class="payment-left">' +
                        '            <div class="payment-left-top">' +
                        '                <h3>Prestige High Fields</h3>' +
                        '                <div class="payment-photo-box">' +
                        '                <img src="images/swimmingpool.jpg" width="100%" alt="">' +
                        '                </div>' +
                        '                <h5>C-1407, Floor no. 14</h5>' +
                        '                <div>' +
                        '                    <p class="fleft">' +
                        '                        Area' +
                        '                        <span>1175 sq.ft.</span>' +
                        '                    </p>' +
                        '                    <p class="fright">' +
                        '                        Total Price' +
                        '                        <span>Rs. 85 lacs</span>' +
                        '                    </p>' +
                        '                    <div class="clear-fix"></div>' +
                        '            </div>' +
                        '            </div>' +
                        '            <a href="#" class="view-price-brakup">View Price Breakup &amp; Payment plan</a>' +
                        '            <div class="booking-amount">' +
                        '                <h3>Booking Amount: Rs. 30000</h3> ' +
                        '            </div>' +
                        '        </div>' +
                        '        <div class="payment-right">' +
                        '            <div class="payment-right-container">' +
                        '            <p>Please verify your flat details &amp; make the payment to block your apartment</p>' +
                        '            <h3>Personla Details</h3>' +
                        '            <div class="personal-detail-box">' +
                        '                <table cellpadding="0" cellspacing="0" width="100%">' +
                        '                    <tr>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition">' +
                        '                                <label class="transition">First Name</label>' +
                        '                                <input type="text" />' +
                        '                            </div>' +
                        '                        </td>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition">' +
                        '                                <label>Last Name</label>' +
                        '                                <input type="text" />' +
                        '                            </div>' +
                        '                        </td>' +
                        '                    </tr>' +
                        '                    <tr>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition">' +
                        '                                <label class="transition">email</label>' +
                        '                                <input type="text" />' +
                        '                            </div>' +
                        '                        </td>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition">' +
                        '                                <label>phone</label>' +
                        '                                <input type="text" />' +
                        '                            </div>' +
                        '                        </td>' +
                        '                    </tr>' +
                        '                    <tr>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition">' +
                        '                                <label class="transition">dob</label>' +
                        '                                <input type="text" />' +
                        '                            </div>' +
                        '                        </td>' +
                        '                        <td width="50%">' +
                        '                            <div class="input-box transition no-paddind">' +
                        '                                <a class="nationalty-link" href="#">Nationality<span class="icon fs18 icon-next transition"></span></a>' +
                        '                                <ul class="nationalty-drop-down">' +
                        '                                    <li><a href="#" class="transition">Indian</a></li>' +
                        '                                    <li><a href="#" class="transition">ABCD</a></li>' +
                        '                                    <li><a href="#" class="transition">ABCD</a></li>' +
                        '                                    <li><a href="#" class="transition">ABCD</a></li>' +
                        '                                    <li><a href="#" class="transition">ABCD</a></li>' +
                        '                                </ul>' +
                        '                            </div>' +
                        '                        </td>' +
                        '                    </tr>' +
                        '                    <tr>' +
                        '                        <td colspan="2">' +
                        '                            <div class="input-box transition error">' +
                        '                                <label class="transition">pan</label>' +
                        '                                <input type="text" />' +
                        '                                <span class="error">This field is Required</span>' +
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
                        '        </div>' +
                        '    </div>';
        }

    };

    return BookingView;

})();
