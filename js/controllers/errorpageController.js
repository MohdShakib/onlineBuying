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
        attachListeners: function(){
            
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return ErrorPageController;

})();