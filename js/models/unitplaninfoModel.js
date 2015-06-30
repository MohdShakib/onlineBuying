/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var UnitplaninfoModel = (function() {

    function UnitplaninfoModel(data, rotationdata, rootdata) {
        this._data = data;
        this._rotationdata = rotationdata;
        this._rootdata = rootdata;
    }

    UnitplaninfoModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },
        getRotationdata: function() {
            if (!this.__rotationdata) {
                return {};
            }
            return this.__rotationdata;
        },
        getRootdata: function() {
            if (!this._rootdata) {
                return {};
            }
            return this._rootdata;
        },
        updateData: function(data, rotationdata, rootdata) {
            this._data = data;
            this._rotationdata = rotationdata;
            this._rootdata = rootdata;
        }
    };

    return UnitplaninfoModel;

})();