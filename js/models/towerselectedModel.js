/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var TowerselectedModel = (function() {

    function TowerselectedModel(data, rootdata, towerAngle) {
        this._data = data;
        this._rootdata = rootdata;

        this._currentRotationAngle = towerAngle ? '' + towerAngle : '0';
        this._filteredListings = null;
        this._selectedListing = null;

        this._filters = {
            bhk: [],
            floor: [],
            entrance: [],
            price: []
        };
    }

    TowerselectedModel.prototype = {
        init: function() {
            this._selectedListing = null;
        },
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
        getSelectedFiltersData: function() {
            return this._filters;
        },
        getSelectedListing: function() {
            return this._selectedListing;
        },
        setSelectedListing: function(selectedListing) {
            this._selectedListing = selectedListing;
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