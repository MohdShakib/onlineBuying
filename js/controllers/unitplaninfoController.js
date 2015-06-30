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
        changeUrl: function(element) {
            var hash = element.dataset.url ? element.dataset.url : null;
            if (hash && hash != "undefined")
                window.location.hash = hash;
            return;
        },
        attachListeners: function() {
            var _this = this;
        },
        generateTemplate: function(data, rootdata, elements) {
            this.attachListeners();
            this._view.buildView();
        }
    };

    return UnitplaninfoController;

})();