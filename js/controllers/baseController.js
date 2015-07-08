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
        attachListeners: function(){
            var _this = this;
            this._view._bottomGroupButtonClick.attach(function(sender, element){
                _this._view.bottomGroupButtonClicked(element);
            });

            this._view._compareBackButtonClick.attach(function(sender, element){
                _this._view.compareBackButtonClicked(element);
            });

            this._view._unitCompareButtonClick.attach(function(sender, element){
                _this._view.unitCompareButtonClicked(element); 
            });
            
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return BaseController;

})();