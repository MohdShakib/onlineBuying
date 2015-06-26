/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

 "use strict";
 var DataModel = (function(){

    function DataModel(data, rootdata) {
        this._data = data;
        this._currentRotationAngle = 0;
        this._rootdata = rootdata;
        //this.dataUpdated = new Event(this);
    }

    DataModel.prototype = {
        getData: function () {
            if(!this._data){
                return {};
            }
            return this._data;
        },

        getRootdata: function () {
            if(!this._rootdata){
                return {};
            }
            return this._rootdata;
        },

        updateData: function(data, rootdata){
            this._data = data;
            this._rootdata = rootdata;
            //this.dataUpdated.notify();
        }
    };

    return DataModel;

})();
