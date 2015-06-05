/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var ListController = (function(){
	
	function ListController(model, view) {
	    this._model = model;
	    this._view = view;
	    var _this = this;
	    
	    this._view.listUpdated.attach(function (sender, args) {
	        _this.updateItems(args.items);
	    });

	}

	ListController.prototype = {
	    updateItems: function(items){
	        this._model.updateItems(items);
	    }
	};

	return ListController;

})();