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
                _this._view.endAnimation();
                setTimeout(function() {
                    utils.changeUrl(element);
                }, 500);
            });

            // Make payment Event
            this._view._makePayment.attach(function(sender, element) {
                _this._view.bookListing();
            });

            // Get Call Back
            this._view._getCallBack.attach(function(sender, element) {
                _this._view.validateAndSendEmail("GetCallBack");
            });

        },
        generateTemplate: function() {
            this._view.buildView();
            this._view.startAnimation();
        }
    };

    return BookingController;

})();
