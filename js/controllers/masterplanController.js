/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var MasterplanController = (function() {

    function MasterplanController(model, view) {
        this._model = model;
        this._view = view;
        this.attachListeners();
    }

    MasterplanController.prototype = {
        attachListeners: function() {
            var _this = this;

            // Menu Events
            this._view._menuMouseEnter.attach(function(sender, obj) {
                _this._view.towerMouseEnterEvent(obj);
            });
            this._view._menuMouseLeave.attach(function(sender, element) {
                _this._view.towerMouseLeaveEvent(element);
            });
            this._view._menuClick.attach(function(sender, element) {
                utils.changeUrl(element);
            });

            // Svg Events
            this._view._towerSvgMouseEnter.attach(function(sender, obj) {
                _this._view.towerMouseEnterEvent(obj);
            });
            this._view._towerSvgMouseLeave.attach(function(sender, element) {
                _this._view.towerMouseLeaveEvent(element);
            });
            this._view._towerSvgClick.attach(function(sender, element) {
                utils.changeUrl(element);
            });

            // Amenity Events
            this._view._amenityClick.attach(function(sender, element) {
                _this._view.amenityClickEvent(element);
            });
            this._view._amenityClose.attach(function(sender, element) {
                _this._view.amenityCloseEvent();
            });
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return MasterplanController;

})();