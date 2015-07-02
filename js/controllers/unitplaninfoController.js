/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var UnitplaninfoController = (function() {

    function UnitplaninfoController(model, view) {
        this._model = model;
        this._view = view;
    }

    UnitplaninfoController.prototype = {
        closeUnitPlan: function() {
            var hash = this._model._rootdata.baseUrl + '/' + this._model._data.towerIdentifier;
            router.setRoute(hash);
            return;
        },
        attachListeners: function() {
            var _this = this;

            // Close Events
            this._view._unitCloseClick.attach(function(sender, element) {
                _this.closeUnitPlan();
            });

            // Unit Component
            this._view._unitComponentMouseEnter.attach(function(sender, params) {
                _this._view.unitComponentMouseEnter(params);
            });
            this._view._unitComponentMouseLeave.attach(function() {
                _this._view.unitComponentMouseLeave();
            });

            // Menu Events
            this._view._unitMenuClick.attach(function(sender, element) {
                _this._view.selectMenuOption(element);
            });
        },
        generateTemplate: function(data, rootdata, elements) {
            this.attachListeners();
            this._view.buildView();
        }
    };

    return UnitplaninfoController;

})();