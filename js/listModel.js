/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

 "use strict";
 var ListModel = (function(){

    function ListModel(items) {
        this._items = items;
        this.itemUpdated = new Event(this);
    }

    ListModel.prototype = {
        getItems: function () {
            if(!this._items){
                return {};
            }
            return this._items;
        },

        updateItems: function(items){
            this._items = items;
            this.itemUpdated.notify({
                items: items
            });
        }
    };

    return ListModel;

})();