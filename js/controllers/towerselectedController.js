/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var TowerselectedController = (function(){
	
	function TowerselectedController(model, view) {
	    this._model = model;
	    this._view = view;
	}

	TowerselectedController.prototype = {
		changeUrl: function(element) {
            var hash =  element.dataset.url ? element.dataset.url : null;
            if(hash && hash != "undefined")
                window.location.hash = hash;
           		return;
        },
		attachListeners: function(elements){
			var _this = this;

			if(elements && elements.towerSvgContainer){
				this._view._towerUnitSvgMouseEnter.attach(function(sender, element){
					_this._view.towerUnitMouseEnterEvent(element);
				});	

				this._view._towerUnitSvgMouseLeave.attach(function(sender, element){
					_this._view.towerUnitMouseLeaveEvent();
				});	

				this._view._towerUnitSvgClick.attach(function(sender, element){
					_this.changeUrl(element);
				});	
			}
		},
	    generateTemplate: function(data, rootdata, elements){
	    	this._view.updateElements(elements);
	    	this.attachListeners(elements);
	    	this._model.updateData(data, rootdata);
	    },
	    generateTemplateSkeleton: function(data, containerList){
	    	this._view.renderInitialData(data);
	    	this._view.buildSkeleton(containerList);
	    }
	};

	return TowerselectedController;

})();