/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var TowerselectedModel = (function() {

    function TowerselectedModel(data, rootdata) {
        this._data = data;
        this._rootdata = rootdata;

        this._currentRotationAngle = '0';
        this._filteredListings = null;
    }

    TowerselectedModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },

        getRootdata: function() {
            if (!this._rootdata) {
                return {};
            }
            return this._rootdata;
        },

        getCurrentRotationAngle: function() {
            return this._currentRotationAngle;
        },

        updateCurrentRotationAngle: function(currentRotationAngle) {
            this._currentRotationAngle = currentRotationAngle;
        },

        getFilteredListings: function() {
            return this._filteredListings;
        },

        updateFilteredListings: function(listings) {
            this._filteredListings = listings;
        },

        updateData: function(data, rootdata) {
            this._data = data;
            this._rootdata = rootdata;
        }
    };

    return TowerselectedModel;

})();