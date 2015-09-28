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
            this._view._unitComponentMouseLeave.attach(function(sender, params) {
               _this._view.unitComponentMouseLeave(params);
            });

            // Menu Events
            this._view._unitMenuClick.attach(function(sender, element) {
                _this._view.selectUnitMenuOption(element, config.unitMenuLinkClass, config.unitDataContainer);

                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    dataset = $(element).data(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-' + dataset.menu;
                utils.tracking(config.gaCategory, 'towerUnitTopMenuClicked', label);
            });

            // Sunlight menu Events
            this._view._sunlightMenuClick.attach(function(sender, element) {
                _this._view.selectMenuOption(element, config.sunlightMenuOptionClass, config.sunlightImageClass, true);

                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    dataset = $(element).data(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-sunlight-' + dataset.target;
                utils.tracking(config.gaCategory, 'sunlightMenuClicked', label);
            });

            // Floor plan menu Event
            this._view._floorPlanMenuClick.attach(function(sender, element) {
                _this._view.selectMenuOption(element, config.floorPlanMenuOptionClass, config.unitDataContainer);

                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    dataset = $(element).data(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-' + dataset.menu;
                utils.tracking(config.gaCategory, 'unitPlanMenuClicked', label);
            });

            // Shortlisting button
            this._view._likeBoxClick.attach(function(sender, element) {
                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    rotationData = _this._model.getRotationdata();
                utils.likeBoxClicked(element, rotationData.unitIdentifier, rotationData.unitName, rotationData.towerIdentifier, rotationData.rotationAngle, rotationData.unitUniqueIdentifier);

                var dataset = $(element).data(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-shortlistButton';
                utils.tracking(config.gaCategory, 'shortlistButtonClicked', label);
            });

            // Booking Event
            this._view._bookingClick.attach(function(sender, element) {
                utils.changeUrl(element);
                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-bookNowButton';
                utils.tracking(config.gaCategory, 'bookNowButtonClicked', label);
            });

            // Amenity Events
            this._view._amenityClick.attach(function(sender, element) {
                _this._view.amenityClickEvent(element);
                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    viewId = $(element).attr('id'),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + data.unitIdentifier + '-' + viewId;
                utils.tracking(config.gaCategory, 'balconyViewsClicked', label);
            });
            this._view._amenityClose.attach(function(sender, element) {
                _this._view.amenityCloseEvent();
            });
        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return UnitplaninfoController;

})();
