/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var BaseModel = (function() {

    function BaseModel(rootdata) {
        this._rootdata = rootdata;
        this._comparedItems = utils.getComparedItems();
    }

    BaseModel.prototype = {
        getCompareList: function() {

            this._comparedItems = utils.getComparedItems();
            var totalItems = Object.keys(this._comparedItems).length;

            if (!totalItems) {
                return {};
            }

            var data = {},
                item, eachItem;

            for (var uniqueIdentifier in this._comparedItems) {
                eachItem = this._comparedItems[uniqueIdentifier];
                if (this._rootdata) {
                    var towerData = this._rootdata.towers[eachItem.towerIdentifier] || {};
                    if(!towerData.listings || !towerData.listings[eachItem.unitIdentifier] || !towerData.rotationAngle[eachItem.rotationAngle] || !towerData.rotationAngle[eachItem.rotationAngle].listing ||!towerData.rotationAngle[eachItem.rotationAngle].listing[eachItem.unitIdentifier]) {
                        utils.removeShortlistedUnit(eachItem.unitUniqueIdentifier);
                        return {};
                    }
                    var listingItem = towerData.listings[eachItem.unitIdentifier] || {};
                    item = towerData.rotationAngle[eachItem.rotationAngle].listing[eachItem.unitIdentifier];
                    item[item.unitIdentifier] = item;
                    item.bookingAmount = listingItem.bookingAmount;
                    item.bookingStatus = listingItem.bookingStatus;
                    item.price = '<span class="icon icon-rupee fs10"></span>' + utils.getReadablePriceInWord(listingItem.price - listingItem.discount);
                    item.size = listingItem.size + ' ' + listingItem.measure;
                    item.floor = 'Floor ' + listingItem.floor;
                    item.bedrooms = listingItem.bedrooms + ' BHK';
                    if(item.unitTypeIdentifierArr) {
                      var tempArr = item.unitTypeIdentifierArr;
                      for(var i=0; i < tempArr.length; i++) {
                        item[tempArr[i]] = this._rootdata.unitTypes[tempArr[i]];
                      }
                    } else {
                      item[item.unitTypeIdentifier] = this._rootdata.unitTypes[item.unitTypeIdentifier];
                    }
                    data[uniqueIdentifier] = item;
                }
            }

            return data;
        },
        getRootdata: function() {
            if (!this._rootdata) {
                return {};
            }
            return this._rootdata;
        }
    };

    return BaseModel;

})();
