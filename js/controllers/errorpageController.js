/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var ErrorPageController = (function() {

    function ErrorPageController(view) {
        this._view = view;
        this.attachListeners();
    }

    ErrorPageController.prototype = {
        /*changeUrl: function(element) {
            element = $(element);
            var hash = element.data('url') ? element.data('url') : null;
            if (hash && hash != "undefined")
                window.location.hash = hash;
            return;
        },*/
        attachListeners: function(){
            
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return ErrorPageController;

})();