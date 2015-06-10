/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

 "use strict";
 var DataModel = (function(){

    function DataModel(data) {
        this._data = data;
        this.dataUpdated = new Event(this);
    }

    DataModel.prototype = {
        getData: function () {
            if(!this._data){
                return {};
            }
            return this._data;
        },

        updateData: function(data){
            this._data = data;
            this.dataUpdated.notify();
        }
    };

    return DataModel;

})();