/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var ListView = (function(){

    function ListView(model, elements) {
        this._model = model;
        this._elements = elements;

        this.listUpdated = new Event(this);
        var _this = this;

        this._elements.list_div.on('mouseenter', 'li.liHoverClass', function (e) {
            $('img').addClass('hidden');
            var imageid = this.dataset.imageid ? this.dataset.imageid : 'main-image';
            $('img#'+imageid).removeClass('hidden');
        });

        this._elements.list_div.on('mouseleave', function (e) {
            $('img').addClass('hidden');
            $('img#main-image').removeClass('hidden');
        });

        // attach model listeners
        this._model.itemUpdated.attach(function () {
            _this.rebuildList();
        });

    }

    ListView.prototype = {
        show: function () {
            this.rebuildList();
        },

        rebuildList: function () {
            var list, images,  items, key;

            list = this._elements.list_div;
            images = this._elements.image_div;
            list.html('');

            items = this._model.getItems();
            var leftPanel = '<ul>';
            
            if(items && items.parent){
                leftPanel += '<li><a href="'+items.parent.url+'" >Back</a></li>';
            }

            var image = '<img src="'+items.image_url+'" id="main-image" class="'+items.id+'" width="100%;">';

            for (key in items.subItems) {
                if (items.subItems.hasOwnProperty(key)) {
                    var url = items.subItems[key].url ? items.subItems[key].url : 'javascript:void(0)';
                    var liHoverClass = items.subItems[key].url ? 'liHoverClass' : '';
                    leftPanel += '<li data-imageid="'+items.subItems[key].id+'"" class="'+liHoverClass+'" ><a href="'+url+'" >'+items.subItems[key].name+'</a></li>';
                    image += '<img src="'+items.subItems[key].hover_imageUrl+'" id="'+items.subItems[key].class+'" class="hidden" width="100%;">';
                }
            }
            leftPanel += "</ul>";

            images.html(image);
            list.html(leftPanel)

        }
    };

    return ListView;

})();