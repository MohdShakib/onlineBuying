/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var DataController = (function(){
	
	function DataController(model, view) {
	    this._model = model;
	    this._view = view;
	  	
	}

	DataController.prototype = {
		changeUrl: function(element) {
            var hash =  element.dataset.url ? element.dataset.url : null;
            if(hash && hash != "undefined")
                window.location.hash = hash;
        },
		attachListeners: function(elements){
			var _this = this;

			if(elements && elements.towerMenuContainer){
				this._view._menuMouseEnter.attach(function(sender, element){
					_this._view.towerMouseEnterEvent(element);
				});	

				this._view._menuMouseLeave.attach(function(sender, element){
					_this._view.toweMouseLeaveEvent();
				});	

				this._view._menuClick.attach(function(sender, element){
					_this.changeUrl(element);
				});	
			}

			if(elements && elements.svgContainer){
				this._view._svgMouseEnter.attach(function(sender, element){
					_this._view.towerMouseEnterEvent(element);
				});	

				this._view._svgMouseLeave.attach(function(sender, element){
					_this._view.toweMouseLeaveEvent();
				});	

				this._view._svgClick.attach(function(sender, element){
					_this.changeUrl(element);
				});	
			}
		},
	    generateTemplate: function(data, elements){
	    	this._view.updateElements(elements);
	    	this.attachListeners(elements);
	    	this._model.updateData(data);
	    },
	    generateTemplateSkeleton: function(containerList){
	    	this._view.buildSkeleton(containerList);
	    }
	};

	return DataController;

})();