/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var UnitplaninfoController = (function() {

    function UnitplaninfoController(model, view) {
        this._model = model;
        this._view = view;
        this.attachListeners();
    }

    UnitplaninfoController.prototype = {
        closeUnitPlan: function() {
            var hash = this._model._rootdata.baseUrl + '/' + this._model._data.towerIdentifier;
            router.setRoute(hash);
            return;
        },
        attachListeners: function() {
            var _this = this;

            // Close Events
            this._view._unitCloseClick.attach(function(sender, element) {
                _this.closeUnitPlan();
            });

            // Unit Component
            this._view._unitComponentMouseEnter.attach(function(sender, params) {
                _this._view.unitComponentMouseEnter(params);
            });
            this._view._unitComponentMouseLeave.attach(function() {
                _this._view.unitComponentMouseLeave();
            });

            // Menu Events
            this._view._unitMenuClick.attach(function(sender, element) {
                _this._view.selectUnitMenuOption(element, config.unitMenuLinkClass, config.unitDataContainer);
            });

            // Sunlight menu Events
            this._view._sunlightMenuClick.attach(function(sender, element) {
                _this._view.selectMenuOption(element, config.sunlightMenuOptionClass, config.sunlightImageClass, true);
            });

            // Floor plan menu Event
            this._view._floorPlanMenuClick.attach(function(sender, element) {
                _this._view.selectMenuOption(element, config.floorPlanMenuOptionClass, config.unitDataContainer);
            });

            // Shortlisting button
            this._view._likeBoxClick.attach(function(sender, element) {
                var data = _this._model.getRotationdata();
                utils.likeBoxClicked(element, data.unitIdentifier, data.unitName, data.towerIdentifier, data.rotationAngle, data.unitUniqueIdentifier);
            });

            // Booking Event
            this._view._bookingClick.attach(function(sender, element) {
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
        generateTemplate: function(data, rootdata, elements) {
            this._view.buildView();
        }
    };

    return UnitplaninfoController;

})();