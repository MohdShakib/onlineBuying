/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var DataView = (function(){

    var containerMap = {
        'buildingImgContainer': '<div class="img-container" id="img-container"></div>',
        'towerImgContainer': '<div class="img-container" id="img-container"></div>',
        'overviewImgContainer': '<div  class="overview-img-container" id="overview-img-container" ></div>',
        'buildingSvgContainer': '<svg class="svg-container" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'buildingMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>',
        'towerDetailContainer': '<div class="tower-detail-container" id="tower-detail-container"></div>',
        'amenitiesContainer': '<div class="amenities-container" id="amenities-container"></div>'
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
        this._amenityClick = new Event(this);
        this._amenityClose = new Event(this);

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
        renderInitialData: function(data){
            document.getElementById(config.projectDetail.titleId).innerHTML = data.projectName;
            document.getElementById(config.projectDetail.addressId).innerHTML = data.address;
        },
        buildSkeleton: function(containerList){
            var key, mainContainerHtml = '';
            for(key in containerList){
                if(containerList.hasOwnProperty(key) && containerMap[containerList[key]]){
                    mainContainerHtml += containerMap[containerList[key]];
                }
            }
            document.getElementById(config.mainContainerId).innerHTML = mainContainerHtml;
        },
        buildingImgContainer: function(data) {
            var imgCode = "<img id=\"main-image\" width='100%' src=\"" + data.bgImage + "\"/>";
            var tower, towerName;
            for (towerName in data.towers) {
                tower = data.towers[towerName];
                if(tower.hoverImageUrl){
                    imgCode += "<img class=\""+config.imgContainerClass+"\" id=\"" + tower.towerId + "\" width='100%' src=\"" + tower.hoverImageUrl + "\" />";
                }
            }
            this._elements.buildingImgContainer.html(imgCode);
        },
        /*overviewImgContainer: function(data){
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
        },*/
        buildingMenuContainer: function(data) {
            var code = "<table><tr><td class='menu-header'>|||</td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-items'><table>";
            for (var towerName in data.towers) {
                var tower = data.towers[towerName];
                code += "<tr><td><div class='menu-item " + config.leftPanelButtonClass + 
                    "' id='" + tower.towerId + "-menu' data-index='" + towerName + 
                    "' data-imageid='" + tower.towerId + 
                    "' data-url='" + data.baseUrl+"\/building\/"+towerName+
                    "'>" + tower.towerName.split(' ')[1] + "</div></td></tr>";
            }
            code += "</table></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-call'> C </td></tr>";
            code += "</table>";
            this._elements.buildingMenuContainer.html(code);
            this.buildingMenuContainerEvents();
        },
        buildingMenuContainerEvents: function(){
            var _this = this;

            _this._elements.buildingMenuContainer.off('click').on('click', '.'+config.leftPanelButtonClass, function(event){
                // notify controller
                _this._menuClick.notify(this); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseenter').on('mouseenter', '.'+config.leftPanelButtonClass, function(event){
               // notify controller
               _this._menuMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseleave').on('mouseleave', '.'+config.leftPanelButtonClass, function(event){
                // notify controller
                _this._menuMouseLeave.notify(); // this refers to element here
            });
        },
        buildingSvgContainer: function(data) {
            var svgCode = "", towerName, tower;
            for (towerName in data.towers) {
                tower = data.towers[towerName];
                if(tower.towerHoverSvg){
                    svgCode += "<polygon  class=\""+config.imgSvgClass+"\" id=\"" + tower.towerId + "-path\" data-index=\""+towerName+"\" data-url=\""+data.baseUrl+"\/building\/"+towerName+"\" data-imageid=\""+ tower.towerId + "\"  points=\"" + tower.towerHoverSvg + "\" />";
                }
            }
            this._elements.buildingSvgContainer.html(svgCode);
            this.buildingSvgContainerEvents();
        },
        buildingSvgContainerEvents: function() {
            var _this = this;

            _this._elements.buildingSvgContainer.off('click').on('click', '.'+config.imgSvgClass, function(event){
                 // notify controller
                _this._svgClick.notify(this); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseenter').on('mouseenter', '.'+config.imgSvgClass, function(event){
                // notify controller
                _this._svgMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseleave').on('mouseleave', '.'+config.imgSvgClass, function(event){
                // notify controller
                _this._svgMouseLeave.notify(); // this refers to element here
            });
        },
        towerMouseEnterEvent: function(element){
            var data    = this._model.getData();
            var index   = element.dataset.index;
            var toolTipData = data && data.towers ? data.towers[index]  : null;
            var imageid = element.dataset.imageid ? element.dataset.imageid : 'main-image';
            var svgpath = document.getElementById(imageid+'-path');
            var targetImage = $('img#'+imageid);

            if(!(targetImage && targetImage.length)){
                return;
            }

            $('img.'+config.imgContainerClass).addClass(config.fadeImageClass);
            targetImage.removeClass(config.fadeImageClass);
            if(toolTipData && svgpath){
                var svgpathClient = svgpath.getBoundingClientRect();
                this.showTowerDetailContainer(toolTipData, (svgpathClient.left+svgpathClient.width/2), svgpathClient.top);
            }

            $('#'+imageid+'-menu').addClass(config.menuItemHoverClass);
        },
        toweMouseLeaveEvent: function(){
            document.getElementById(config.towerDetailContainerId).innerHTML = '';
            $('img.'+config.imgContainerClass).removeClass(config.fadeImageClass);
            $('.'+config.leftPanelButtonClass).removeClass(config.menuItemHoverClass);
        },
        showTowerDetailContainer: function(data, left, top) {
            if(!(data && data.unitInfo)){
                return;
            }
            var towerCode = "";
            towerCode += "<div id='container-detail' class='tower-detail'>";
            towerCode += "<div class='tower-name'>" + data.towerName.split(' ')[1] + "</div>";
            towerCode += "<table>";

            for (var j in data.unitInfo) {
                var aptType = data.unitInfo[j];
                var availabilityClass = 'apt-available';
                var availabilityText = aptType.available + " Av";
                if (aptType.available == 0) {
                    availabilityClass = 'apt-unavailable';
                    availabilityText = 'Sold';
                }
                towerCode += "<tr><td width='70px'></td>";
                towerCode += "<td class='tower-apt apt-type'>" + aptType.type + "</td>";
                towerCode += "<td class='tower-apt apt-count " + availabilityClass + "'>" + availabilityText + "</td></tr>";
            }
            towerCode += "</table>";

            if(this._elements && this._elements.towerDetailContainer){
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left+'px');
                $('#container-detail').css("top", (top+30)+'px');
            }   

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity;
            document.getElementById('container-detail').style.opacity = "1";
        },
        towerImgContainer: function(data){
            var currentRotationAngle = '0';
            var towerImageUrl = data.rotationAngle && data.rotationAngle[currentRotationAngle] ? data.rotationAngle[currentRotationAngle].towerImageUrl : null ;
            var imgCode = "<img id=\"main-image\" width='100%' src=\"" + towerImageUrl + "\"/>";
            this._elements.towerImgContainer.html(imgCode);
        }
       /* amenitiesContainer: function(data) {
            var code="";    
            for (var i in data.amenities) {
                var amenity = data.amenities[i];
                var position = "top:" + amenity.top + "%; left:" + amenity.left + "%;" ;
                code += "<div id='" + amenity.id + "' class='" + config.amenityIconClass + "' style='"+ position +"'>+";
                code += "<div class='name'>" + amenity.name + "</div>";
                code += "</div>";
            }
            this._elements.amenitiesContainer.html(code);
            this.amenitiesContainerEvents();
        },
        amenitiesContainerEvents: function() {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.'+config.amenityIconClass, function(event){
                 // notify controller
                _this._amenityClick.notify(this); // this refers to element here
            });
        },
        amenityClickEvent: function(element) {
            var data    = this._model.getData();
            var amenityId = element.id;
            var amenity = null;
            for (var i in data.amenities) {
                if (data.amenities[i].id == amenityId) {
                    amenity = data.amenities[i];
                }
            }
            var code = "<div class='" + config.amenityPopupClass + "'><table><tr>";
            code += "<td class='amenity-heading'>" + amenity.name;
            code += "<span class='" + config.amenityPopupCloseClass + "'>X</span></td></tr>";
            code += "<tr><td class='amenity-image'><img src='" + amenity.image_url + "'></td></tr></table>";
            this._elements.amenitiesContainer.append(code);
            this.amenitiesPopupEvents();
        },
        amenitiesPopupEvents: function() {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.'+config.amenityPopupCloseClass, function(event){
                 // notify controller
                _this._amenityClose.notify(this); // this refers to element here
            });
        },
        amenityCloseEvent: function() {
            $("."+config.amenityPopupClass).remove();
            this.amenitiesContainerEvents();
        }*/
    };

    return DataView;

})();