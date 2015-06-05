/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var DataView = (function(){

    function DataView(model, elements) {
        this._model = model;
        this._elements = elements;

        this.dataUpdated = new Event(this);
        var _this = this;

       /* this._elements.list_div.on('mouseenter', 'li.liHoverClass', function (e) {
            $('img').addClass('hidden');
            var imageid = this.dataset.imageid ? this.dataset.imageid : 'main-image';
            $('img#'+imageid).removeClass('hidden');
        });

        this._elements.list_div.on('mouseleave', function (e) {
            $('img').addClass('hidden');
            $('img#main-image').removeClass('hidden');
        });
        */

        // attach model listeners
        this._model.dataUpdated.attach(function () {
            _this.rebuildView();
        });

    }

    DataView.prototype = {
        /*show: function () {
            this.rebuildView();
        },

        rebuildView: function () {
            var list, images,  data, key;

            list = this._elements.list_div;
            images = this._elements.image_div;
            list.html('');

            data = this._model.getData();
            var leftPanel = '<ul>';
            
            if(data && data.parent){
                leftPanel += '<li><a href="'+data.parent.url+'" >Back</a></li>';
            }

            var image = '<img src="'+data.image_url+'" id="main-image" class="'+data.id+'" width="100%;">';

            for (key in data.subItems) {
                if (data.subItems.hasOwnProperty(key)) {
                    var url = data.subItems[key].url ? data.subItems[key].url : 'javascript:void(0)';
                    var liHoverClass = data.subItems[key].url ? 'liHoverClass' : '';
                    leftPanel += '<li data-imageid="'+data.subItems[key].id+'"" class="'+liHoverClass+'" ><a href="'+url+'" >'+data.subItems[key].name+'</a></li>';
                    image += '<img src="'+data.subItems[key].hover_imageUrl+'" id="'+data.subItems[key].class+'" class="hidden" width="100%;">';
                }
            }
            leftPanel += "</ul>";

            images.html(image);
            list.html(leftPanel)

        },
        */

        show: function(){
            this.rebuildView();
        },
        rebuildView: function(){
            var i, data = this._model.getData();

            for(i in this._elements){
                if(this._elements.hasOwnProperty(i) && this[i]){
                    this[i](data);
                }
            }
            
          /*  this.imgContainer(data);
            this.svgContainer(data);
            this.towerMenuContainer(data);*/
        },
        imgContainer: function(data) {
            var imgCode = "<img width='100%' src=\"" + data.image_url + "\"/>";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                imgCode += "<img id=\"" + tower.id + "\" class='hide' width='100%' src=\"" + tower.hover_imageUrl + "\" />";
            }
            this._elements.imgContainer.html(imgCode);
        },
        towerMenuContainer: function(data) {
            var code = "<table><tr><th colspan='2' class='menu-header'>Towers</th></tr><tr>";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                code += "<td class='menu-item'><table>";
                code += "<tr><td class='tower-icon'>";
                code += "<div onmouseover=\"towerElevationMouseOver('" + tower.id + "')\" onclick=\"towerElevationClick('" + tower.id + "')\" onmouseout=\"towerElevationMouseOut('" + tower.id + "')\">" + tower.name.charAt(0) + "</div></td></tr>";
                code += "<tr><td class='tower-name'>" + tower.name + "</td></tr></table></td>";
            }
            code += "</table>";
            this._elements.towerMenuContainer.html(code);
        },
        svgContainer: function(data) {
            var svgCode = "";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                svgCode += "<polygon id=\"" + tower.id + "-path\" points=\"" + tower.path + "\" onmouseover=\"towerElevationMouseOver('" + tower.id + "')\" onclick=\"towerElevationClick('" + tower.id + "')\" onmouseout=\"towerElevationMouseOut('" + tower.id + "')\"/>";
            }
            //svgCode += "<circle cx='50' cy='50' r='10' stroke='black' stroke-width='1'/>";
            this._elements.svgContainer.html(svgCode);
        }

    };

    return DataView;

})();