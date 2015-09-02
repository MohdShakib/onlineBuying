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
        this._propertyBooking = false;

        var comparedItems = utils.getComparedItems();

        this._data.shortListed = false;
        for (var uniqueIdentifier in comparedItems) {
            if (uniqueIdentifier == this._data.unitUniqueIdentifier) {
                this._data.shortListed = true;
                break;
            }
        }

    }

    UnitplaninfoModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },
        getUnitTypeData: function() {
            var unitType = this._rotationdata.unitTypeIdentifier;
            if (!(this._rootdata.unitTypes && this._rootdata.unitTypes[unitType])) {
                return {};
            }
            return this._rootdata.unitTypes[unitType];
        },
        getRotationdata: function() {
            if (!this._rotationdata) {
                return {};
            }
            return this._rotationdata;
        },
        getRootdata: function() {
            if (!this._rootdata) {
                return {};
            }
            return this._rootdata;
        },
        getPropertyBooking: function() {
            return this._propertyBooking;
        },
        setPropertyBooking: function() {
            this._propertyBooking = true;
        },
        updateData: function(data, rotationdata, rootdata) {
            this._data = data;
            this._rotationdata = rotationdata;
            this._rootdata = rootdata;
        }
    };

    return UnitplaninfoModel;

})();