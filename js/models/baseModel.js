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
            var totalItems =  Object.keys(this._comparedItems).length;

            if (!totalItems) {
                return {};
            }

            var data = {}, item, eachItem;

            for(var uniqueIdentifier in this._comparedItems){
                eachItem = this._comparedItems[uniqueIdentifier];
                if(this._rootdata){
                    var listingItem = this._rootdata.towers[eachItem.towerIdentifier].listings[eachItem.unitIdentifier] || {};
                    item = this._rootdata.towers[eachItem.towerIdentifier].rotationAngle[eachItem.rotationAngle].listing[eachItem.unitIdentifier];
                    item[item.unitIdentifier] = item;
                    item['bookingAmount'] = listingItem.bookingAmount;
                    item['price'] = 'Rs. '+utils.priceFormat(listingItem.price);
                    item['size'] = listingItem.size+' '+listingItem.measure;
                    item['floor'] = 'Floor '+listingItem.floor;
                    item['bedrooms'] = listingItem.bedrooms+' BHK';
                    item['unitTypeData'] = this._rootdata.unitTypes[item.unitTypeIdentifier];
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