/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var BaseController = (function() {

    function BaseController(model, view) {
        this._model = model;
        this._view = view;
        this.attachListeners();
    }

    BaseController.prototype = {
        attachListeners: function() {
            var _this = this;
            this._view._bottomGroupButtonClick.attach(function(sender, element) {
                _this._view.bottomGroupButtonClicked(element);
                var data = _this._model.getRootdata(),
                    elementData = element.dataset,
                    label = data.projectIdentifier + '-' + data.projectId + '-' + elementData.name;
                utils.tracking(config.gaCategory, 'bottomPanelClicked', label);
            });

            this._view._formPopupCloseClick.attach(function(sender, element) {
                _this._view.formPopupCloseClicked();
            });

            this._view._showLoaderComplete.attach(function(sender, element) {
                _this._view.prepareCompareUnitsContainer();
            });

            // Get Call back
            this._view._getCallbackClick.attach(function(sender, element) {
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-bottomPanel-callbackButton',
                    callbackData = _this._view.getValidatedCallBackData();
                if(callbackData != null) {
                    utils.tracking(config.gaCategory, 'callbackButtonClicked', label);
                    _this._view.callBackFormSubmit(callbackData);
                }
            });

            // Share with friends
            this._view._shareOnEmailClick.attach(function(sender, element) {
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-bottomPanel-shareOnEmailButton',
                    callbackData = _this._view.getValidatedShareData();
                if(callbackData != null) {
                    utils.tracking(config.gaCategory, 'shareOnEmailButtonClicked', label);
                    _this._view.shareOnEmailSubmit(callbackData);
                }
            });

            // Compare popup
            this._view._unitCompareButtonClick.attach(function(sender, element) {
                _this._view.unitCompareButtonClicked(element);
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-bottomPanel-compareUnitPlanButton';
                utils.tracking(config.gaCategory, 'compareUnitPlanButtonClicked', label);
            });
            this._view._removeShortlistClick.attach(function(sender, data) {
                utils.removeFromShortListed(data.unitIdentifier, data.unitUniqueIdentifier);
            });

            // Compare page
            this._view._compareBackButtonClick.attach(function(sender, element) {
                _this._view.compareBackButtonClicked(element);
            });
            this._view._unitComponentMouseEnter.attach(function(sender, params) {
                _this._view.unitComponentMouseEnter(params);
            });
            this._view._unitComponentMouseLeave.attach(function() {
                _this._view.unitComponentMouseLeave();
            });
            this._view._bookingClick.attach(function(sender, element) {
                utils.changeUrl(element);
                var data = _this._model.getRootdata(),
                    elementData = element.dataset,
                    label = data.projectIdentifier + '-' + data.projectId + '-' + elementData.identifier + '-compareScreen-bookNowButton';
                utils.tracking(config.gaCategory, 'bookNowButtonClicked', label);
            });

        },
        generateTemplate: function() {
            this._view.buildView();
        }
    };

    return BaseController;

})();