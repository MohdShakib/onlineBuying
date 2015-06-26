/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var TowerselectedView = (function() {

    var containerMap = {
        'towerImgContainer': '<div class="img-container" id="img-container"></div>',
        //'overviewImgContainer': '<div  class="overview-img-container" id="overview-img-container" ></div>',
        'towerSvgContainer': '<svg class="svg-container" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'towerDetailContainer': '<div class="tower-detail-container" id="tower-detail-container"></div>',
        'towerRotationContainer': '<div class="tower-rotation-container" id="tower-rotation-container"></div>',
        'towerMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>'
    };

    function getElements() {
        var elements = {
            'towerImgContainer': $('#img-container'),
            //'overviewImgContainer': $('#overview-img-container'),
            'towerSvgContainer': $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'towerRotationContainer': $('#tower-rotation-container'),
            'towerMenuContainer': $('#tower-menu-container')
        };
        return elements;
    }

    function TowerselectedView(model, elements) {
        this._model = model;
        this._elements = elements;
        var _this = this;

        // Svg Events
        this._towerUnitSvgMouseEnter = new Event(this);
        this._towerUnitSvgMouseLeave = new Event(this);
        this._towerUnitSvgClick = new Event(this);
    }

    TowerselectedView.prototype = {
        buildView: function() {
            var i, data = this._model.getData();
            var rootdata = this._model.getRootdata();
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.renderInitialData(rootdata);
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data, rootdata);
                }
            }
        },
        buildSkeleton: function(containerList) {
            var key, mainContainerHtml = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    mainContainerHtml += containerMap[containerList[key]];
                }
            }
            document.getElementById(config.mainContainerId).innerHTML = mainContainerHtml;
            this._elements = getElements();
        },
        renderInitialData: function(data) {
            document.getElementById(config.projectDetail.titleId).innerHTML = data.projectName;
            document.getElementById(config.projectDetail.addressId).innerHTML = data.address;
        },
        overviewImgContainer: function(data, rootdata) {
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
        },
        towerImgContainer: function(data, rootdata) {
            var currentRotationAngle = this._model._currentRotationAngle,
                towerImageUrl, imageClass, imgCode = '';
            for (var rotationAngle in data.rotationAngle) {
                if (hasOwnProperty.call(data.rotationAngle, rotationAngle)) {
                    towerImageUrl = data.rotationAngle[rotationAngle].towerImageUrl;
                    imageClass = (rotationAngle != this._model._currentRotationAngle) ? 'hidden' : '';
                    imgCode += "<img class='" + imageClass + " " + rotationAngle + " " + config.selectedTowerImagesClass + "' width='100%' src='" + towerImageUrl + "' />";
                }
            }
            this._elements.towerImgContainer.html(imgCode);
        },
        towerSvgContainer: function(data) {
            var currentRotationAngle = this._model._currentRotationAngle;
            var listing = (data && data.rotationAngle[currentRotationAngle] && Object.keys(data.rotationAngle[currentRotationAngle].listing).length) ? data.rotationAngle[currentRotationAngle].listing : null;

            if (!listing) {
                return;
            }

            var svgCode = "",
                unitIdentifier, unitInfo, svgColor;

            for (unitIdentifier in listing) {
                unitInfo = listing[unitIdentifier];
                if (hasOwnProperty.call(listing, unitIdentifier) && hasOwnProperty.call(listing[unitIdentifier], 'isAvailable') && unitInfo.unitSvgOnTower) {
                    svgColor = listing[unitIdentifier].isAvailable ? 'green' : 'red';
                    svgCode += "<circle  class=\"" + config.towerUnitSvgClass + "\" id=\"" + unitInfo.unitName + "-path\" data-index=\"" + unitIdentifier + "\"  cx='" + unitInfo.unitSvgOnTower[0] + "' cy='" + unitInfo.unitSvgOnTower[1] + "' r='0.4' fill='" + svgColor + "' />";
                }
            }

            this._elements.towerSvgContainer.html(svgCode);
            this.towerSvgContainerEvents();
        },
        towerSvgContainerEvents: function() {
            var _this = this;

            _this._elements.towerSvgContainer.off('click').on('click', '.' + config.towerUnitSvgClass, function(event) {
                // notify controller
                _this._towerUnitSvgClick.notify(this); // this refers to element here
            });

            _this._elements.towerSvgContainer.off('mouseenter').on('mouseenter', '.' + config.towerUnitSvgClass, function(event) {
                // notify controller
                _this._towerUnitSvgMouseEnter.notify(this); // this refers to element here
            });

            _this._elements.towerSvgContainer.off('mouseleave').on('mouseleave', '.' + config.towerUnitSvgClass, function(event) {
                // notify controller
                _this._towerUnitSvgMouseLeave.notify(); // this refers to element here
            });
        },
        towerUnitMouseEnterEvent: function(element) {
            var data = this._model.getData();
            var index = element.dataset.index;
            var toolTipData = data && data.listings ? data.listings[index] : null;
            if (toolTipData) {
                var svgpathClient = element.getBoundingClientRect();
                this.showTowerUnitDetailContainer(toolTipData, (svgpathClient.left + svgpathClient.width / 2), svgpathClient.top - 40);
            }
        },
        towerUnitMouseLeaveEvent: function() {
            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        showTowerUnitDetailContainer: function(unitInfo, left, top) {
            if (!(unitInfo && Object.keys(unitInfo).length)) {
                return;
            }
            var towerCode = "";
            towerCode += "<div id='container-detail' class='tooltip-detail'>";
            towerCode += "<div class='tooltip-title'>" + unitInfo.listingAddress.split('-')[1].substring(1) + "</div>";

            var availabilityClass = 'apt-available';
            if (!unitInfo.isAvailable) {
                availabilityClass = 'apt-unavailable';
            }

            var details = {
                'address': unitInfo.listingAddress,
                'size': unitInfo.size + ' ' + unitInfo.measure,
                'floor': unitInfo.floor ? unitInfo.floor : 'Ground',
                'color': unitInfo.isAvailable ? 'apt-available-color' : 'apt-unavailable-color',
                'availability': unitInfo.isAvailable ? 'Available' : 'Sold',
                'type': unitInfo.bedrooms + ' BHK'
            };

            towerCode += '<div class="towerunit-detail-container ' + availabilityClass + '">';
            towerCode += '<div class="towerunit-name">' + details.address + '</div>';
            towerCode += '<div>' + details.type + '</div>';
            towerCode += '<div>' + details.size + '</div>';
            towerCode += '<div>Floor ' + details.floor + '</div>';
            towerCode += '<div class="' + details.color + '">' + details.availability + '</div>';

            if (this._elements && this._elements.towerDetailContainer) {
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", (top + 30) + 'px');
            }

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity;
            document.getElementById('container-detail').style.opacity = "1";
        },
        rotateTower: function() {
            var data = this._model.getData(),
                imageClass = this._model._currentRotationAngle;
            var _this = this;
            $('.' + config.selectedTowerImagesClass).fadeOut(1000);
            $('.' + imageClass).fadeIn(1000, function() {
                // change unit availability svgs
                _this.towerSvgContainer(data);
            });

        },
        towerRotationContainer: function() {
            var _this = this;
            _this._elements.towerRotationContainer.off('click').on('click', '#rotation-button', function(event) {
                _this._elements.towerSvgContainer.html('');
                if (_this._model._currentRotationAngle == '0') {
                    _this._model._currentRotationAngle = '180'
                } else {
                    _this._model._currentRotationAngle = '0'
                }
                _this.rotateTower();
            });

            var code = '<button id="rotation-button" >Rotate</button>';
            if (this._elements && this._elements.towerRotationContainer) {
                this._elements.towerRotationContainer.html(code);
            }
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
                var sfloor = Math.floor(unit.floor / interval) * interval;
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
                var sPrice = Math.floor(unit.price / interval / 100000) * interval;
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

    return TowerselectedView;

})();