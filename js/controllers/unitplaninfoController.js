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
        attachListeners: function() {
            var _this = this;
            // Menu Events
            this._view._unitCloseClick.attach(function(sender, element) {
                _this._view.closeUnitPlan();
            });
        },
        generateTemplate: function(data, rootdata, elements) {
            this.attachListeners();
            this._view.buildView();
        }
    };

    return UnitplaninfoController;

})();