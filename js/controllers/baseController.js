/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var BaseController = (function() {

    function BaseController(view) {
        this._view = view;
        this.attachListeners();
    }

    BaseController.prototype = {
        attachListeners: function(){
            var _this = this;
            this._view._bottomGroupButtonClick.attach(function(sender, element){
                _this._view.bottomGroupButtonClicked(element);
            });
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return BaseController;

})();