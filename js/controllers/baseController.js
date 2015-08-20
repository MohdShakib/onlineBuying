/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var BaseController = (function() {

    function BaseController(model, view) {
        this._model = model;
        this._view = view;
        this.attachListeners();
    }

    BaseController.prototype = {
        attachListeners: function() {
            var _this = this;
            this._view._bottomGroupButtonClick.attach(function(sender, element) {
                _this._view.bottomGroupButtonClicked(element);
            });

            this._view._compareBackButtonClick.attach(function(sender, element) {
                _this._view.compareBackButtonClicked(element);
            });

            this._view._formPopupCloseClick.attach(function(sender, element) {
                _this._view.formPopupCloseClicked();
            });

            this._view._unitCompareButtonClick.attach(function(sender, element) {
                _this._view.unitCompareButtonClicked(element);
            });

            // Unit Component
            this._view._unitComponentMouseEnter.attach(function(sender, params) {
                _this._view.unitComponentMouseEnter(params);
            });
            this._view._unitComponentMouseLeave.attach(function() {
                _this._view.unitComponentMouseLeave();
            });

            this._view._removeShortlistClick.attach(function(sender, data) {
                utils.removeFromShortListed(data.unitIdentifier, data.unitUniqueIdentifier);
            });

            // Booking Event
            this._view._bookingClick.attach(function(sender, element) {
                utils.changeUrl(element);
            });

        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return BaseController;

})();