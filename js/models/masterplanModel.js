/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var MasterplanModel = (function() {

    function MasterplanModel(data) {
        this._data = data;
    }

    MasterplanModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },
        updateData: function(data) {
            this._data = data;
        }
    };

    return MasterplanModel;

})();