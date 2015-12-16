/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var MasterplanModel = (function() {

    var googleMapData = {
        '501660':{
            upperEnd:{
                lat: 28.379743,
                lng: 76.978000
            },
            lowerEnd:{
                lat: 28.382616,
                lng: 76.980592
            }
        }
    }

    function MasterplanModel(data) {
        this._data = data;
        this._firstLoad = true;
        this._towerCount = Object.keys(data.towers).length;
        this._towerMenu = {
            start: 0,
            end: 0
        };
    }

    MasterplanModel.prototype = {
        getData: function() {
            if (!this._data) {
                return {};
            }
            return this._data;
        },
        getGoogleMapData: function(projectId){
            return googleMapData[projectId];
        },
        isFirstLoad: function() {
            return this._firstLoad;
        },
        toggleFirstLoad: function() {
            this._firstLoad = false;
        },
        updateData: function(data) {
            this._data = data;
        },
        updateTowerMenuEnd: function(count) {
            this._towerMenu.end = this._towerMenu.start + count - 1;
        },
        slideUpTowerMenu: function() {
            this._towerMenu.start--;
            this._towerMenu.end--;
        },
        slideDownTowerMenu: function() {
            this._towerMenu.start++;
            this._towerMenu.end++;
        },
        getTowerMenu: function() {
            return this._towerMenu;
        },
        getTowerCount: function() {
            return this._towerCount;
        }
    };

    return MasterplanModel;

})();