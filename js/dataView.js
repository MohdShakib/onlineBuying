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
            var _this   = this;

            for(i in this._elements){
                if(this._elements.hasOwnProperty(i) && this[i]){
                    this[i](data);
                }
            }
            
        },
        imgContainer: function(data) {
            var imgCode = "<img class=\"menu-mapped-image\" id=\"main-image\" width='100%' src=\"" + data.image_url + "\"/>";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                if(tower.hover_imageUrl){
                    imgCode += "<img class=\"menu-mapped-image hidden\" id=\"" + tower.id + "\" width='100%' src=\"" + tower.hover_imageUrl + "\" />";
                }
            }
            this._elements.imgContainer.html(imgCode);
            this.imgContainerEvents();
        },
        imgContainerEvents: function(){
            var _this = this;
            var data  = _this._model.getData();

            _this._elements.towerMenuContainer.off('click').on('click', '.left-panel-button', function(event){
                _this.towerClickEvent(this);
            });

            _this._elements.towerMenuContainer.off('mouseenter').on('mouseenter', '.left-panel-button', function(event){
               _this.towerMouseEnterEvent(this, data);
            });

            _this._elements.towerMenuContainer.off('mouseleave').on('mouseleave', '.left-panel-button', function(event){
                _this.toweMouseLeaveEvent();
            });
        },
        towerMenuContainer: function(data) {
            var code = "<table><tr><th colspan='2' class='menu-header'>Towers</th></tr><tr>";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                code += "<td class='menu-item'><table>";
                code += "<tr><td class='tower-icon'>";
                code += "<div class=\"left-panel-button\" data-index=\""+i+"\" data-imageid=\""+ tower.id + "\" data-url=\""+tower.url+"\" >" + tower.name.split(' ')[1] + "</div></td></tr>";
                code += "<tr><td class='tower-name'>" + tower.name + "</td></tr></table></td>";
            }
            code += "</table>";
            this._elements.towerMenuContainer.html(code);
        },
        svgContainer: function(data) {
            var svgCode = "";
            for (var i in data.subItems) {
                var tower = data.subItems[i];
                if(tower.path){
                    svgCode += "<polygon  class=\"image-svg-path\" id=\"" + tower.id + "-path\" data-index=\""+i+"\" data-imageid=\""+ tower.id + "\" data-url=\""+tower.url+"\" points=\"" + tower.path + "\" />";
                }
            }
            this._elements.svgContainer.html(svgCode);
            this.svgContainerEvents();
        },
        svgContainerEvents: function() {
            var _this = this;
            var data  = _this._model.getData();

            _this._elements.svgContainer.off('click').on('click', '.image-svg-path', function(event){
                _this.towerClickEvent(this);
            });

            _this._elements.svgContainer.off('mouseenter').on('mouseenter', '.image-svg-path', function(event){
               _this.towerMouseEnterEvent(this, data);
            });

            _this._elements.svgContainer.off('mouseleave').on('mouseleave', '.image-svg-path', function(event){
               _this.toweMouseLeaveEvent();
            });
        },
        towerClickEvent: function(element) {
            var hash =  element.dataset.url ? element.dataset.url : null;
            if(hash && hash != "undefined")
                window.location.hash = hash;
        },
        towerMouseEnterEvent: function(element, data){
            
            var index   = element.dataset.index;
            var toolTipData = data && data.subItems ? data.subItems[index]  : null;
            var imageid = element.dataset.imageid ? element.dataset.imageid : 'main-image';
            var svgpath = document.getElementById(imageid+'-path');
            var targetImage = $('img#'+imageid);

            if(!(targetImage && targetImage.length)){
                return;
            }

            $('img.menu-mapped-image').addClass('hidden');
            targetImage.removeClass('hidden');
            if(toolTipData && svgpath){
                var svgpathClient = svgpath.getBoundingClientRect();
                this.showTowerDetailContainer(toolTipData, svgpathClient.left, svgpathClient.top);
            }

        },
        toweMouseLeaveEvent: function(){
            $(".tower-detail-container").html('');
            $('img.menu-mapped-image').addClass('hidden');
            $('img#main-image').removeClass('hidden');
        },
        showTowerDetailContainer: function(data, left, top) {

            if(!(data && data.details)){
                return;
            }
            var towerCode = "";
            towerCode += "<div id=\"container-detail\" class='tower-detail'>";
            towerCode += "<table><tr><th class='tower-name'>" + data.name + "</th></tr>";
            towerCode += "<tr><td class='tower-apt'><table><tr>";

            for (var j in data.details) {
                var aptType = data.details[j];
                towerCode += "<td colspan='2' class='apt-type'>" + aptType.type + " APTS</td>";
            }

            towerCode += "</tr><tr>";
            for (var j in data.details) {
                var aptType = data.details[j];
                towerCode += "<td class='apt-count apt-available'><div>" + aptType.available + "</div></td>";
                towerCode += "<td class='apt-count apt-unavailable'><div>" + aptType.unavailable + "</div></td>";
            }
            towerCode += "</tr></table></td></tr></table></div>";

            $(".tower-detail-container").html(towerCode);
            $('#container-detail').css("left", (left+100)+'px');
            $('#container-detail').css("top", top+'px');
        }


    };

    return DataView;

})();