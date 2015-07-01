/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var ErrorPageController = (function() {

    function ErrorPageController(view) {
        this._view = view;
    }

    ErrorPageController.prototype = {
        /*changeUrl: function(element) {
            var hash = element.dataset.url ? element.dataset.url : null;
            if (hash && hash != "undefined")
                window.location.hash = hash;
            return;
        },*/
        generateTemplate: function() {
            //this.attachListeners();
            this._view.buildView();
        }
    };

    return ErrorPageController;

})();