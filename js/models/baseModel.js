/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

"use strict";
var BaseModel = (function() {

    function BaseModel(rootdata) {
        this._rootdata = rootdata;
        this._comparedItems = [{
            unitIdentifier: 'a-0003',
            towerIdentifier: 'tower-a',
            rotationAngle: '0'
        },{
            unitIdentifier: 'a-0303',
            towerIdentifier: 'tower-a',
            rotationAngle: '0'
        }];
        //this._comparedItems = [];

    }

    BaseModel.prototype = {
        getCompareList: function() {
            if (!this._comparedItems) {
                return {};
            }

            var data = [], item, eachItem;
            var totalItems = this._comparedItems.length;

            for(var i=0; i<totalItems; i++){
                eachItem = this._comparedItems[i];
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
                    data.push(item);
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