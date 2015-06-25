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
        'towerSvgContainer': '<svg class="svg-container" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'buildingMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>',
        'towerDetailContainer': '<div class="tower-detail-container" id="tower-detail-container"></div>',
        'towerRotationContainer': '<div class="tower-rotation-container" id="tower-rotation-container"></div>',
        'amenitiesContainer': '<div class="amenities-container" id="amenities-container"></div>',
        'towerMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>'
    };

    function DataView(model, elements) {
        this._model = model;
        this._elements = elements;
        var _this = this;

        this._menuMouseEnter = new Event(this);
        this._menuMouseLeave = new Event(this);
        this._menuClick = new Event(this);
        this._towerSvgMouseEnter = new Event(this);
        this._towerSvgMouseLeave = new Event(this);
        this._towerSvgClick = new Event(this);
        this._amenityClick = new Event(this);
        this._amenityClose = new Event(this);

        this._towerUnitSvgMouseEnter = new Event(this);
        this._towerUnitSvgMouseLeave = new Event(this);
        this._towerUnitSvgClick = new Event(this);

        // attach model listeners
        this._model.dataUpdated.attach(function () {
            _this.rebuildView();
        });

    }

    DataView.prototype = {

        sortTowersObject: function(towers){

            var towerName, towerValues = [];

            for(towerName in towers){
                if(hasOwnProperty.call(towers, towerName)){
                    towerValues.push(towers[towerName]);
                }
            }

            return towerValues.sort(function(t1, t2){
                return t1.displayOrder - t2.displayOrder;
            });

        },
        rebuildView: function(){
            var i, data = this._model.getData();
            var rootdata = this._model.getRootdata();
            var _this   = this;

            for(i in this._elements){
                if(this._elements.hasOwnProperty(i) && this[i]){
                    this[i](data, rootdata);
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
        buildingImgContainer: function(data, rootdata) {
            var imgCode = "<img id=\"main-image\" width='100%' src=\"" + data.bgImage + "\"/>";
            var tower, i,
            towers = this.sortTowersObject(data.towers),
            tower_length = towers.length;

            for(i = 0; i < tower_length; i++){
                tower = towers[i];
                if(tower.hoverImageUrl){
                    imgCode += "<img class=\""+config.imgContainerClass+"\" id=\"" + tower.towerId + "\" width='100%' src=\"" + tower.hoverImageUrl + "\" />";
                }
            }
            this._elements.buildingImgContainer.html(imgCode);
        },
        /*overviewImgContainer: function(data, rootdata){
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
        },*/
        buildingMenuContainer: function(data, rootdata) {
            var code = "<table><tr><td class='menu-header menu-icon'>|||</td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-items'><table>";
            for (var towerIdentifier in data.towers) {
                var tower = data.towers[towerIdentifier];
                code += "<tr><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + 
                    "' id='" + tower.towerId + "-menu' data-index='" + towerIdentifier + 
                    "' data-imageid='" + tower.towerId + 
                    "' data-url='" + data.baseUrl+"/"+towerIdentifier+
                    "'>" + tower.towerName.split(' ')[1] + "</div></td></tr>";
            }
            code += "</table></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-call menu-icon'> C </td></tr>";
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
        buildingSvgContainer: function(data, rootdata) {
            var svgCode = "", i, tower,
            towers = this.sortTowersObject(data.towers),
            tower_length = towers.length;

            for(i = 0; i < tower_length; i++){
                tower = towers[i];
                if(tower.towerHoverSvg){
                    svgCode += "<polygon  class=\""+config.towerSvgClass+"\" id=\"" + tower.towerId + "-path\" data-index=\""+tower.towerIdentifier+"\" data-url=\""+data.baseUrl+"/"+tower.towerIdentifier+"\" data-imageid=\""+ tower.towerId + "\"  points=\"" + tower.towerHoverSvg + "\" />";
                }
            }

            this._elements.buildingSvgContainer.html(svgCode);
            this.buildingSvgContainerEvents();
        },
        buildingSvgContainerEvents: function() {
            var _this = this;

            _this._elements.buildingSvgContainer.off('click').on('click', '.'+config.towerSvgClass, function(event){
                 // notify controller
                _this._towerSvgClick.notify(this); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseenter').on('mouseenter', '.'+config.towerSvgClass, function(event){
                // notify controller
                _this._towerSvgMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseleave').on('mouseleave', '.'+config.towerSvgClass, function(event){
                // notify controller
                _this._towerSvgMouseLeave.notify(); // this refers to element here
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
            towerCode += "<div id='container-detail' class='tooltip-detail'>";
            towerCode += "<div class='tooltip-title'>" + data.towerName.split(' ')[1] + "</div>";
            towerCode += "<table>";

            for (var j in data.unitInfo) {
                var aptType = data.unitInfo[j];
                var availabilityClass = config.availabilityClass.available;
                var availabilityText = aptType.available + " Av";
                if (aptType.available == 0) {
                    availabilityClass = config.availabilityClass.unavailable;
                    availabilityText = 'Sold';
                }
                towerCode += "<tr><td width='70px'></td>";
                towerCode += "<td class='detail-container container-left'>" + aptType.type + "</td>";
                towerCode += "<td class='detail-container container-right " + availabilityClass + "'>" + availabilityText + "</td></tr>";
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
        towerImgContainer: function(data, rootdata){
            var currentRotationAngle = this._model._currentRotationAngle;
            var towerImageUrl = data.rotationAngle && data.rotationAngle[currentRotationAngle] ? data.rotationAngle[currentRotationAngle].towerImageUrl : null ;
            var imgCode = "<img id=\"main-image\" width='100%' src=\"" + towerImageUrl + "\"/>";
            this._elements.towerImgContainer.html(imgCode);
        },
        towerSvgContainer: function(data){
            var currentRotationAngle = this._model._currentRotationAngle;
            var listing = (data && data.rotationAngle[currentRotationAngle] && Object.keys(data.rotationAngle[currentRotationAngle].listing).length) ? data.rotationAngle[currentRotationAngle].listing : null;

            if(!listing){
                return;
            }

            var svgCode = "", unitIdentifier, unitInfo, svgColor; 
            
            for(unitIdentifier in listing){
                unitInfo = listing[unitIdentifier];
                if(hasOwnProperty.call(listing, unitIdentifier) && hasOwnProperty.call(listing[unitIdentifier], 'isAvailable') && unitInfo.unitSvgOnTower){
                    svgColor = listing[unitIdentifier].isAvailable ? 'green' : 'red'; 
                    svgCode += "<circle  class=\""+config.towerUnitSvgClass+"\" id=\"" + unitInfo.unitName + "-path\" data-index=\""+unitIdentifier+"\"  cx='"+unitInfo.unitSvgOnTower[0]+"' cy='"+unitInfo.unitSvgOnTower[1]+"' r='0.4' fill='"+svgColor+"' />";
                }
            }

            this._elements.towerSvgContainer.html(svgCode);
            this.towerSvgContainerEvents();
        },
        towerSvgContainerEvents: function() {
            var _this = this;

            _this._elements.towerSvgContainer.off('click').on('click', '.'+config.towerUnitSvgClass, function(event){
                 // notify controller
                _this._towerUnitSvgClick.notify(this); // this refers to element here
            });

            _this._elements.towerSvgContainer.off('mouseenter').on('mouseenter', '.'+config.towerUnitSvgClass, function(event){
                // notify controller
                _this._towerUnitSvgMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.towerSvgContainer.off('mouseleave').on('mouseleave', '.'+config.towerUnitSvgClass, function(event){
                // notify controller
                _this._towerUnitSvgMouseLeave.notify(); // this refers to element here
            });
        },
        towerUnitMouseEnterEvent: function(element){
            var data    = this._model.getData();
            var index   = element.dataset.index;
            var toolTipData = data && data.listings ? data.listings[index]  : null;
            if(toolTipData){
                var svgpathClient = element.getBoundingClientRect();
                this.showTowerUnitDetailContainer(toolTipData, (svgpathClient.left+svgpathClient.width/2), svgpathClient.top-40);
            }
        },
        towerUnitMouseLeaveEvent: function(){
            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        showTowerUnitDetailContainer: function(unitInfo, left, top) {
            if(!(unitInfo && Object.keys(unitInfo).length)){
                return;
            }
            var towerCode = "";
            towerCode += "<div id='container-detail' class='tooltip-detail'>";
            towerCode += "<div class='tooltip-title'>" + unitInfo.listingAddress.split('-')[1].substring(1) + "</div>";
            towerCode += "<table>";

            var availabilityClass = 'apt-available';
           // var availabilityText = unitInfo.size+' '+unitInfo.measure;
            if (!unitInfo.isAvailable) {
                availabilityClass = 'apt-unavailable';
            }

            var details = {
                'ADDRESSS' : unitInfo.listingAddress,
                'SIZE' : unitInfo.size+' '+unitInfo.measure,
                'FLOOR' : unitInfo.floor,
                'TYPE' : unitInfo.bedrooms+'BHK',

            }

            for(var key in details){
                towerCode += "<tr><td width='70px'></td>";
                towerCode += "<td class='detail-container container-left'>"+key+"</td>";
                towerCode += "<td class='detail-container container-right " + availabilityClass + "'>" + details[key] + "</td></tr>";
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
        amenitiesContainer: function(data, rootdata) {
            var code="";    
            for (var amenityKey in data.amenities) {
                if(hasOwnProperty.call(data.amenities, amenityKey)){
                    var amenity = data.amenities[amenityKey];
                    var point = data.amenities[amenityKey].amenitySvg.split(' ');
                    var position = "top:" + point[1] + "%; left:" + point[0] + "%;" ;
                    code += "<div id='" + amenityKey + "' class='" + config.amenityIconClass + "' style='"+ position +"'>+";
                    code += "<div class='name'><span>" + amenity.amenityName + "</span></div>";
                    code += "</div>";
                }
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
            var amenity = {};
            for (var amenityKey in data.amenities) {
                if (amenityKey == amenityId) {
                    amenity = data.amenities[amenityKey];
                }
            }
            var code = "<div class='" + config.amenityPopupClass + "'><table><tr>";
            code += "<td class='amenity-heading'>" + amenity.amenityName;
            code += "<span class='" + config.amenityPopupCloseClass + "'>X</span></td></tr>";
            code += "<tr><td class='amenity-image'><img src='" + amenity.imageUrl + "'></td></tr></table>";
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
        },
        towerMenuContainer: function(data, rootdata) {
            var url = rootdata.baseUrl;
            var code = "<table><tr><td class='menu-header menu-icon'><a href='" + url + "'>&lt;--</a></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-items'><table>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + "'> A </div>";
            code += this.getBHKMenuOptions(data);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + "'> B </div>";
            code += this.getFloorMenuOptions(data);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + "'> C </div>";
            code += this.getEntranceMenuOptions(data);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + "'> D </div>";
            code += this.getPriceMenuOptions(data);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass + "'> R </div></td></tr>";            
            code += "</table></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-call menu-icon'> C </td></tr>";
            code += "</table>";
            this._elements.towerMenuContainer.html(code);
        },
        getBHKMenuOptions: function(data) {
            var code = "<div class='menu-item-options'><table>"; 
            var bhks = this.getBHKAvailability(data.listings);
            for (var bhk in bhks) {
                var availabilityClass = config.availabilityClass.available;
                if (bhks[bhk] == 0) {
                    availabilityClass = config.availabilityClass.unavailable;
                }
                code += "<tr><td class='" + availabilityClass + "'>" + bhk + " BHK</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getBHKAvailability: function(units) {
            var bhks = {};
            for (var i in units) {
                var unit = units[i];
                if (bhks[unit.bedrooms] == null) {
                    bhks[unit.bedrooms] = 0;
                }
                if (unit.isAvailable) {
                    bhks[unit.bedrooms]++;
                }
            }
            return bhks;
        },
        getFloorMenuOptions: function(data) {
            var code = "<div class='menu-item-options'><table>"; 
            var floors = this.getFloorAvailability(data.listings);
            for (var floorGroup in floors) {
                var availabilityClass = config.availabilityClass.available;
                if (floors[floorGroup] == 0) {
                    availabilityClass = config.availabilityClass.unavailable;
                }
                code += "<tr><td class='" + availabilityClass + "'>" + floorGroup + "</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getFloorAvailability: function(units) {
            var floors = {};
            var interval = 3;
            for (var i in units) {
                var unit = units[i];
                var sfloor = Math.floor(unit.floor/interval) * interval;
                var floorGroup = sfloor + ' - ' + (sfloor + interval - 1);
                if (floors[floorGroup] == null) {
                    floors[floorGroup] = 0;
                }
                if (unit.isAvailable) {
                    floors[floorGroup]++;
                }
            }
            return floors;
        },
        getEntranceMenuOptions: function(data) {
            var code = "<div class='menu-item-options'><table>"; 
            var entrances = this.getEntranceAvailability(data.listings);
            for (var entrance in entrances) {
                var availabilityClass = config.availabilityClass.available;
                if (entrances[entrance] == 0) {
                    availabilityClass = config.availabilityClass.unavailable;
                }
                code += "<tr><td class='" + availabilityClass + "'>" + entrance + "</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getEntranceAvailability: function(units) {
            var entrances = {};
            for (var i in units) {
                var unit = units[i];
                if (entrances[unit.facing] == null) {
                    entrances[unit.facing] = 0;
                }
                if (unit.isAvailable) {
                    entrances[unit.facing]++;
                }
            }
            return entrances;
        },
        getPriceMenuOptions: function(data) {
            var code = "<div class='menu-item-options'><table>"; 
            var prices = this.getPriceAvailability(data.listings);
            for (var price in prices) {
                var availabilityClass = config.availabilityClass.available;
                if (prices[price] == 0) {
                    availabilityClass = config.availabilityClass.unavailable;
                }
                code += "<tr><td class='" + availabilityClass + "'>" + price + "</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getPriceAvailability: function(units) {
            var prices = {};
            var interval = 5;
            for (var i in units) {
                var unit = units[i];
                var sPrice = Math.floor(unit.price/interval/100000) * interval;
                var priceGroup = sPrice + ' Lac - ' + (sPrice + interval - 1) + ' Lac';
                if (prices[priceGroup] == null) {
                    prices[priceGroup] = 0;
                }
                if (unit.isAvailable) {
                    prices[priceGroup]++;
                }
            }
            return prices;
        }
    };

    return DataView;

})();
