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
                var paymentData = _this._view.getValidatedPaymentData(),
                    rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-continueToPaymentButton';
                if (paymentData != null && config.enablePayment && data.bookingStatus == "Available") {
                    utils.tracking(config.gaCategory, 'continueToPaymentButtonClicked', label);
                    _this._view.bookListing(paymentData);
                }
            });

            // Get Call Back
            this._view._getCallBack.attach(function(sender, element) {
                var emailData = _this._view.getValidatedEmailData("GetCallBack"),
                    rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-getCallbackButton';
                if (emailData != null) {
                    utils.tracking(config.gaCategory, 'callbackButtonClicked', label);
                    _this._view.sendEmail(emailData);
                }
            });

        },
        generateTemplate: function() {
            this._view.buildView();
            this._view.startAnimation();
        }
    };

    return BookingController;

})();