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
	  
	}

	DataController.prototype = {
	    generateTemplate: function(data, elements){
	    	this._view.updateElements(elements);
	    	this._model.updateData(data);
	    },
	    generateTemplateSkeleton: function(containerList){
	    	this._view.buildSkeleton(containerList);
	    }
	};

	return DataController;

})();