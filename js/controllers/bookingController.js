/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var BookingController = (function() {

    function BookingController(model, view) {
        this._model = model;
        this._view = view;
        this.attachListeners();
    }

    BookingController.prototype = {

        attachListeners: function() {
            var _this = this;

            // Close Event
            this._view._closeEvent.attach(function(sender, element) {
                utils.changeUrl(element);
            });

            // Make payment Event
            this._view._makePayment.attach(function(sender, element) {
                var data = _this._view.getValidatedPaymentData();
                if (data != null) {
                    ajaxUtils.bookListing(data);
                }
            });

        },
        generateTemplate: function(data, rootdata, elements) {
            this._view.buildView();
        }
    };

    return BookingController;

})();