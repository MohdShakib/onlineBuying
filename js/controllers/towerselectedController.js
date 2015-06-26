/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var TowerselectedController = (function() {

    var rotateAngleHash = {
        '0': '180',
        '180': '0'
    };

    function TowerselectedController(model, view) {
        this._model = model;
        this._view = view;
    }

    TowerselectedController.prototype = {
        changeUrl: function(element) {
            var hash = element.dataset.url ? element.dataset.url : null;
            if (hash && hash != "undefined")
                window.location.hash = hash;
            return;
        },
        attachListeners: function() {
            var _this = this;

            // Svg Events
            this._view._towerUnitSvgMouseEnter.attach(function(sender, element) {
                _this._view.towerUnitMouseEnterEvent(element);
            });
            this._view._towerUnitSvgMouseLeave.attach(function(sender, element) {
                _this._view.towerUnitMouseLeaveEvent();
            });
            this._view._towerUnitSvgClick.attach(function(sender, element) {
                _this.changeUrl(element);
            });


            //tower rotation button listener
            this._view._towerRotateClicked.attach(function(sender, element) {
                var currentRotationAngle = _this._model._currentRotationAngle;
                // change roationangle value
                _this._model._currentRotationAngle = rotateAngleHash[currentRotationAngle] || '0';
                _this._view.rotateTower();

                
            });
        },
        generateTemplate: function(data, rootdata, elements) {
            this.attachListeners();
            this._view.buildView();
        }
    };

    return TowerselectedController;

})();