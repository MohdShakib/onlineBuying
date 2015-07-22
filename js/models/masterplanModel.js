/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var MasterplanModel = (function() {

    function MasterplanModel(data) {
        this._data = data;
        this._firstLoad = true;
    }

    MasterplanModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },
        isFirstLoad: function() {
            return this._firstLoad;
        },
        toggleFirstLoad: function() {
            this._firstLoad = false;
        },
        updateData: function(data) {
            this._data = data;
        }
    };

    return MasterplanModel;

})();