/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var DataView = (function(){
    
    var containerMap = {
        'imgContainer': '<div class="img-container" id="img-container"></div>',
        'overviewImgContainer': '<div class="overview-img-container container" id="overview-img-container" ></div>',
        'svgContainer': '<svg class="svg-container container" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'towerMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>',
        'towerDetailContainer': '<div class="tower-detail-container container"></div>'
    };


    function DataView(model, elements) {
        this._model = model;
        this._elements = elements;
        var _this = this;

        this._menuMouseEnter = new Event(this);
        this._menuMouseLeave = new Event(this);
        this._menuClick = new Event(this);
        this._svgMouseEnter = new Event(this);
        this._svgMouseLeave = new Event(this);
        this._svgClick = new Event(this);

        // attach model listeners
        this._model.dataUpdated.attach(function () {
            _this.rebuildView();
        });

    }

    DataView.prototype = {

        rebuildView: function(){
            var i, data = this._model.getData();
            var _this   = this;

            for(i in this._elements){
                if(this._elements.hasOwnProperty(i) && this[i]){
                    this[i](data);
                }
            }
        },
        updateElements: function(elements){
            this._elements = elements;
        },
        buildSkeleton: function(containerList){
            var key, mainContainerHtml = '';
            for(key in containerList){
                if(containerList.hasOwnProperty(key) && containerMap[containerList[key]]){
                    mainContainerHtml += containerMap[containerList[key]];
                }
            }
            $('.main-container').html(mainContainerHtml);
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
        },
        overviewImgContainer: function(data){
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
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
            this.towerMenuContainerEvents();
        },
        towerMenuContainerEvents: function(){
            var _this = this;

            _this._elements.towerMenuContainer.off('click').on('click', '.left-panel-button', function(event){
                // notify controller
                _this._menuClick.notify(this); // this refers to element here
            });

            _this._elements.towerMenuContainer.off('mouseenter').on('mouseenter', '.left-panel-button', function(event){
               // notify controller
               _this._menuMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.towerMenuContainer.off('mouseleave').on('mouseleave', '.left-panel-button', function(event){
                // notify controller
                _this._menuMouseLeave.notify(); // this refers to element here
            });
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

            _this._elements.svgContainer.off('click').on('click', '.image-svg-path', function(event){
                 // notify controller
                _this._svgClick.notify(this); // this refers to element here
            });

            _this._elements.svgContainer.off('mouseenter').on('mouseenter', '.image-svg-path', function(event){
                // notify controller
                _this._svgMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.svgContainer.off('mouseleave').on('mouseleave', '.image-svg-path', function(event){
                // notify controller
                _this._svgMouseLeave.notify(); // this refers to element here
            });
        },
        towerMouseEnterEvent: function(element, data){
            
            var data    = this._model.getData();
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