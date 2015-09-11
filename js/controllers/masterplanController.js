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
                var data = _this._model.getData(),
                    elementData = element.dataset,
                    label = data.projectIdentifier + '-' + data.projectId + '-' + elementData.index + '-' + elementData.imageid + '-menu';
                utils.tracking('masterPlanTowerMenu', 'clicked', label);
            });
            this._view._menuUp.attach(function(sender, element) {
                _this._view.menuUpHandler();
            });
            this._view._menuDown.attach(function(sender, element) {
                _this._view.menuDownHandler();
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
                var data = _this._model.getData(),
                    elementData = $(element).data(),
                    label = data.projectIdentifier + '-' + data.projectId + '-' + elementData.index + '-' + elementData.imageid + '-svg';
                utils.tracking('masterPlanTowerSvg', 'clicked', label);
            });

            // Amenity Events
            this._view._amenityClick.attach(function(sender, element) {
                _this._view.amenityClickEvent(element);
                var data = _this._model.getData(),
                    label = data.projectIdentifier + '-' + data.projectId + '-' + $(element).attr('id');
                utils.tracking('masterPlanAmenities', 'clicked', label);
            });
            this._view._amenityClose.attach(function(sender, element) {
                _this._view.amenityCloseEvent();
            });
        },
        generateTemplate: function() {
            this._view.buildView();
            if (this._model.isFirstLoad()) {
                var _this = this,
                    animationStart;
                if (animationStart) {
                    clearTimeout(animationStart);
                }
                var animationStart = setTimeout(function() {
                    utils.showLoader(_this._view, _this._view.startAnimation);
                    _this._model.toggleFirstLoad();
                }, 200);
            } else {
                this._view.displayWithoutAnimation();
            }
            // Add resize event listener
            utils.addResizeEventListener(this._view.dynamicResizeContainers);
        }
    };

    return MasterplanController;

})();