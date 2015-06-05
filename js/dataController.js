/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var DataController = (function(){
	
	function DataController(model, view) {
	    this._model = model;
	    this._view = view;
	    var _this = this;
	    
	    this._view.dataUpdated.attach(function (sender, args) {
	        _this.updateData(args.data);
	    });

	}

	DataController.prototype = {
	    updateData: function(data){
	        this._model.updateData(data);
	    }
	};

	return DataController;

})();