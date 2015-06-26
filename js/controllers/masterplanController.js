/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var MasterplanController = (function(){
	
	function MasterplanController(model, view) {
	    this._model = model;
	    this._view = view;
	}

	MasterplanController.prototype = {
		changeUrl: function(element) {
            var hash =  element.dataset.url ? element.dataset.url : null;
            if(hash && hash != "undefined")
                window.location.hash = hash;
           		return;
        },/*,
		attachListeners: function(){
			var _this = this;

			//if(elements && elements.buildingMenuContainer){
				this._view._menuMouseEnter.attach(function(sender, element){
					_this._view.towerMouseEnterEvent(element);
				});	

				this._view._menuMouseLeave.attach(function(sender, element){
					_this._view.toweMouseLeaveEvent();
				});	

				this._view._menuClick.attach(function(sender, element){
					_this.changeUrl(element);
				});	
			//}

			//if(elements && elements.buildingSvgContainer){
				this._view._towerSvgMouseEnter.attach(function(sender, element){
					_this._view.towerMouseEnterEvent(element);
				});	

				this._view._towerSvgMouseLeave.attach(function(sender, element){
					_this._view.toweMouseLeaveEvent();
				});	

				this._view._towerSvgClick.attach(function(sender, element){
					_this.changeUrl(element);
				});	
			//}

			//if(elements && elements.amenitiesContainer){
				this._view._amenityClick.attach(function(sender, element){
					_this._view.amenityClickEvent(element);
				});	

				this._view._amenityClose.attach(function(sender, element){
					_this._view.amenityCloseEvent();
				});	
			//}
		},*/
	    generateTemplate: function(){
	    	
	    	//this._view.updateElements(elements);
	    	//this.attachListeners();
	    	//this._model.updateData(data, rootdata);
	    	this._view.rebuildView();
	    }
	    // },
	    // generateTemplateSkeleton: function(data, containerList){
	    // 	this._view.renderInitialData(data);
	    // 	this._view.buildSkeleton(containerList);
	    // }
	};

	return MasterplanController;

})();