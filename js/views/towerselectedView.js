/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var TowerselectedView = (function() {

    var containerMap = {
        'towerImgContainer': '<div class="img-container ' + config.dynamicResizeClass + ' ' + config.slowTransitionClass + '" id="img-container"></div>',
        //'overviewImgContainer': '<div  class="overview-img-container" id="overview-img-container" ></div>',
        'towerSvgContainer': '<svg class="svg-container ' + config.dynamicResizeClass + ' ' + config.slowTransitionClass + '" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'towerDetailContainer': '<div class="tower-unit-detail-container" id="tower-detail-container"></div>',
        'towerRotationContainer': '<div class="tower-rotation-container ' + config.slowTransitionClass + '" id="' + config.towerRotationContainerId + '"></div>',
        'filterMenuContainer': '<div class="tower-menu-container ' + config.transitionClass + '" id="' + config.filterMenuContainerId + '"></div>'
    };

    function getElements() {
        var elements = {
            'towerImgContainer': $('#img-container'),
            //'overviewImgContainer': $('#overview-img-container'),
            'towerSvgContainer': $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'towerRotationContainer': $('#tower-rotation-container'),
            'filterMenuContainer': $('#filter-menu-container')
        };
        return elements;
    }

    function TowerselectedView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        // Svg Events
        this._towerUnitSvgMouseEnter = new Event(this);
        this._towerUnitSvgMouseLeave = new Event(this);
        this._towerUnitSvgClick = new Event(this);

        this._towerRotateClicked = new Event(this);

        // Filter Events
        this._bhkFilterOptionClick = new Event(this);
        this._floorFilterOptionClick = new Event(this);
        this._entranceFilterOptionClick = new Event(this);
        this._priceFilterOptionClick = new Event(this);
        this._resetFiltersClick = new Event(this);
    }

    TowerselectedView.prototype = {
        buildView: function() {
            var i, data = this._model.getData();
            var rootdata = this._model.getRootdata();
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.renderInitialData(data, rootdata);
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
        renderInitialData: function(data, rootdata) {
            document.getElementById(config.projectDetail.titleId).innerHTML = rootdata.projectName;
            document.getElementById(config.projectDetail.addressId).innerHTML = data.towerName;
        },
        overviewImgContainer: function(data, rootdata) {
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
        },
        towerImgContainer: function(data, rootdata) {
            var currentRotationAngle = this._model.getCurrentRotationAngle(),
                towerImageUrl, imageClass, imgCode = '';
            for (var rotationAngle in data.rotationAngle) {
                if (hasOwnProperty.call(data.rotationAngle, rotationAngle)) {
                    towerImageUrl = data.rotationAngle[rotationAngle].towerImageUrl;
                    imageClass = (rotationAngle != this._model.getCurrentRotationAngle()) ? 'hidden' : '';
                    imgCode += "<img class='" + imageClass + " " + rotationAngle + " " + config.selectedTowerImagesClass + "' width='100%' src='" + towerImageUrl + "' />";
                }
            }
            this._elements.towerImgContainer.html(imgCode);
        },
        towerSvgContainer: function(data, rootdata) {
            var currentRotationAngle = this._model.getCurrentRotationAngle();
            var listings = (data && data.rotationAngle[currentRotationAngle] && Object.keys(data.rotationAngle[currentRotationAngle].listing).length) ? data.rotationAngle[currentRotationAngle].listing : null;

            if (!listings) {
                return;
            }

            var svgCode = "",
                unitIdentifier, unitInfo, svgClass,
                filteredListingKeys = this._model.getFilteredListings(),
                baseUrl = rootdata.baseUrl + "/" + data.towerIdentifier + "/";

            for (unitIdentifier in listings) {
                unitInfo = listings[unitIdentifier];
                if (hasOwnProperty.call(listings, unitIdentifier) &&
                    hasOwnProperty.call(unitInfo, 'isAvailable') &&
                    unitInfo.unitSvgOnTower &&
                    (filteredListingKeys == null || filteredListingKeys.indexOf(unitIdentifier) > -1)
                ) {
                    var rotationAngle = this._model.getCurrentRotationAngle(),
                        url = listings[unitIdentifier].isAvailable ? baseUrl + rotationAngle + '/' + unitIdentifier : "undefined";
                    svgClass = listings[unitIdentifier].isAvailable ? 'apt-available' : 'apt-unavailable';
                    svgCode += "<ellipse  class=\"" + config.towerUnitSvgClass + " " + svgClass +
                        "\" id=\"" + unitInfo.unitIdentifier + "-path\" data-index=\"" + unitIdentifier +
                        "\" data-url=\"" + url +
                        "\"  cx='" + unitInfo.unitSvgOnTower[0] + "' cy='" + unitInfo.unitSvgOnTower[1] + "' ry='1.2' rx='0.55' />";
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
                _this._towerUnitSvgMouseEnter.notify({
                    element: this,
                    event: event
                }); // this refers to element here
            });

            _this._elements.towerSvgContainer.off('mouseleave').on('mouseleave', '.' + config.towerUnitSvgClass, function(event) {
                // notify controller
                _this._towerUnitSvgMouseLeave.notify(); // this refers to element here
            });
        },
        towerUnitMouseEnterEvent: function(obj) {
            var element = obj.element;
            var data = this._model.getData();
            var index = element.dataset.index;
            var toolTipData = data && data.listings ? data.listings[index] : null;
            if (toolTipData) {
                var svgpathClient = element.getBoundingClientRect();
                this.showTowerUnitDetailContainer(toolTipData, (svgpathClient.right), (svgpathClient.top + svgpathClient.height / 2));
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

            var availabilityClass = 'apt-available';
            if (!unitInfo.isAvailable) {
                availabilityClass = 'apt-unavailable';
            }

            var tooltipClass = utils.getTooltipPosition({
                pageX: left,
                pageY: top
            });
            tooltipClass = tooltipClass ? tooltipClass : 'bottom-right';

            var details = {
                'address': unitInfo.listingAddress,
                'size': unitInfo.size + ' ' + unitInfo.measure,
                'floor': unitInfo.floor ? unitInfo.floor : 'Ground',
                'color': unitInfo.isAvailable ? 'apt-available-color' : 'apt-unavailable-color',
                'availability': unitInfo.isAvailable ? 'Available' : 'Sold',
                'price': Math.floor(unitInfo.price / 1000) / 100 + ' Lacs',
                'type': unitInfo.bedrooms + ' BHK'
            };

            towerCode += "<div class='detail-box show-details tSelected-view'>";
            towerCode += "<div class='line " + tooltipClass + "'>";
            towerCode += "<div class='dot-one'></div>";
            towerCode += "<div class='dot-two'></div>";


            towerCode += '<div class="tSelected-detail towerunit-detail-container ' + availabilityClass + '">';
            towerCode += '<div class="towerunit-name">' + details.address + '</div>';
            towerCode += '<div>' + details.type + '</div>';
            towerCode += '<div>' + details.size + '</div>';
            towerCode += '<div>' + details.price + '</div>';
            towerCode += '<div>Floor ' + details.floor + '</div>';
            towerCode += '<div class="' + details.color + '">' + details.availability + '</div>';
            towerCode += '</div></div>'
            towerCode += '</div></div>'


            if (this._elements && this._elements.towerDetailContainer) {
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", top + 'px');
            }

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity;
            document.getElementById('container-detail').style.opacity = "1";
        },
        rotateTower: function() {
            this._elements.towerSvgContainer.html('');
            var data = this._model.getData(),
                rootdata = this._model.getRootdata(),
                imageClass = this._model.getCurrentRotationAngle();
            var _this = this;
            $('.' + config.selectedTowerImagesClass).fadeOut(1000);
            $('.' + imageClass).fadeIn(1000, function() {
                // change unit availability svgs
                _this.towerSvgContainer(data, rootdata);
            });

        },
        towerRotationContainer: function() {
            var _this = this;
            _this._elements.towerRotationContainer.off('click').on('click', '.' + config.rotationButtonClass, function(event) {
                // notify controller about rotatebutton click
                _this._towerRotateClicked.notify();

            });

            var code = '<div class="rotation-btn-container left-btn"><div class="photo-thumb br50"><img src="/zip-file/img/tow-a-ang-0.jpg" class="br50"></div><button class="' + config.rotationButtonClass + '  tower-rotation-left-button br50" ><span class="icon icon-previous"></span></button><div class="rotation-title transition">Rotate Left</div></div>';
            code += '<div class="rotation-btn-container right-btn"><div class="photo-thumb br50"><img src="/zip-file/img/tow-a-ang-0.jpg" class="br50"></div><button class="' + config.rotationButtonClass + ' tower-rotation-right-button br50" ><span class="icon icon-next"></span></button><div class="rotation-title transition">Rotate Right</div></div>';
            if (this._elements && this._elements.towerRotationContainer) {
                this._elements.towerRotationContainer.html(code);
            }
        },
        filterMenuContainer: function(data, rootdata) {
            var url = rootdata.baseUrl;
            var filterdata = this._model.getSelectedFiltersData();
            var bhkFiltersData = filterdata.bhk,
                floorFiltersData = filterdata.floor,
                entranceFiltersData = filterdata.entrance,
                priceFiltersData = filterdata.price;

            var code = "<table><tr><td class='menu-header menu-icon'><a href='#" + url + "'><span class='icon icon-arrow_left fs20'></span></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-items'><table>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'>";
            code += this.displayFilterCount('bhk', bhkFiltersData.length);
            code += "<div class='menu-item'><span class='icon icon-bhk'></span></div>";
            code += this.getBHKMenuOptions(data, bhkFiltersData);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'>";
            code += this.displayFilterCount('floor', floorFiltersData.length);
            code += "<div class='menu-item'><span class='icon icon-floor'></span></div>";
            code += this.getFloorMenuOptions(data, floorFiltersData);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'>";
            code += this.displayFilterCount('entrance', entranceFiltersData.length);
            code += "<div class='menu-item'><span class='icon icon-door'></span></div>";
            code += this.getEntranceMenuOptions(data, entranceFiltersData);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'>";
            code += this.displayFilterCount('price', priceFiltersData.length);
            code += "<div class='menu-item'><span class='icon icon-price'></span></div>";
            code += this.getPriceMenuOptions(data, priceFiltersData);
            code += "</td></tr>";
            code += "<tr class='menu-item-container'><td class='menu-item-container-td'><div class='menu-item " + config.filters.resetClass + "'><span class='icon icon-reload'></span></div></td></tr>";
            code += "</table></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-call menu-icon'>&nbsp;</td></tr>";
            code += "</table>";
            this._elements.filterMenuContainer.html(code);
            this.filterMenuContainerEvents();
        },
        displayFilterCount: function(type, count) {
            var style = "";
            if (count <= 0) {
                style += "display:none;"
            }
            var code = "<div id='" + type + "-filter-count' class='filter-count' style='" + style + "'>" + count + "</div>";
            return code;
        },
        updateFilterCount: function() {
            var filterdata = this._model.getSelectedFiltersData();
            if (filterdata.bhk.length > 0) {
                $('#bhk-filter-count').show().html(filterdata.bhk.length);
            } else {
                $('#bhk-filter-count').hide();
            }
            if (filterdata.floor.length > 0) {
                $('#floor-filter-count').show().html(filterdata.floor.length);
            } else {
                $('#floor-filter-count').hide();
            }
            if (filterdata.entrance.length > 0) {
                $('#entrance-filter-count').show().html(filterdata.entrance.length);
            } else {
                $('#entrance-filter-count').hide();
            }
            if (filterdata.price.length > 0) {
                $('#price-filter-count').show().html(filterdata.price.length);
            } else {
                $('#price-filter-count').hide();
            }
        },
        filterMenuContainerEvents: function() {
            var _this = this;

            _this._elements.filterMenuContainer.off('mouseenter').on('mouseenter', '.' + config.menuItemContainerClass, function(event) {
                $(this).find('.' + config.menuItemOptionsClass).stop().fadeIn("fast", function() {});
            });

            _this._elements.filterMenuContainer.off('mouseleave').on('mouseleave', '.' + config.menuItemContainerClass, function(event) {
                $(this).find('.' + config.menuItemOptionsClass).stop().fadeOut("fast", function() {});
            });

            _this._elements.filterMenuContainer.off('click').on('click', '.' + config.filters.bhk, function(event) {
                // notify controller
                _this._bhkFilterOptionClick.notify(this); // this refers to element here
            });

            _this._elements.filterMenuContainer.on('click', '.' + config.filters.floor, function(event) {
                // notify controller
                _this._floorFilterOptionClick.notify(this); // this refers to element here
            });

            _this._elements.filterMenuContainer.on('click', '.' + config.filters.entrance, function(event) {
                // notify controller
                _this._entranceFilterOptionClick.notify(this); // this refers to element here
            });

            _this._elements.filterMenuContainer.on('click', '.' + config.filters.price, function(event) {
                // notify controller
                _this._priceFilterOptionClick.notify(this); // this refers to element here
            });

            _this._elements.filterMenuContainer.on('click', '.' + config.filters.resetClass, function(event) {
                // notify controller
                _this._resetFiltersClick.notify(this); // this refers to element here
            });
        },
        toggleFilterOption: function(element) {
            var index = element.dataset.index;
            var classList = element.classList;
            if ($.inArray(config.filters.selectedClass, classList) < 0) {
                $('#' + index).addClass(config.filters.selectedClass);
            } else {
                $('#' + index).removeClass(config.filters.selectedClass);
            }
        },
        resetFilterOption: function(element) {
            this._elements.filterMenuContainer.find('*').removeClass(config.filters.selectedClass);
        },
        getBHKMenuOptions: function(data, bhkFiltersData) {
            var code = "<div class='menu-item-options'><table>";
            var bhks = this.getBHKAvailability(data.listings);
            var sortedBhks = Object.keys(bhks).sort();
            for (var i in sortedBhks) {
                var bhk = sortedBhks[i],
                    id = config.filters.bhk + i;
                var availabilityClass = "apt-available-border-color";
                if (bhks[bhk] == 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = bhk;
                if (bhkFiltersData && bhkFiltersData.length && bhkFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<tr><td class='option-item " + config.filters.bhk + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-value='" + bhk + "'>" + bhk + " BHK</td></tr>";
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
        getFloorMenuOptions: function(data, floorFiltersData) {
            var code = "<div class='menu-item-options'><table>";
            var floors = this.getFloorAvailability(data.listings);
            var sortedFloors = Object.keys(floors).sort();
            for (var i in sortedFloors) {
                var floorGroup = sortedFloors[i],
                    id = config.filters.floor + i;
                var availabilityClass = "apt-available-border-color";
                if (floors[floorGroup].availability == 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = floors[floorGroup].sfloor + " " + floors[floorGroup].efloor;
                if (floorFiltersData && floorFiltersData.length && floorFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<tr><td class='option-item " + config.filters.floor + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-svalue='" + floors[floorGroup].sfloor + "' data-evalue='" + floors[floorGroup].efloor + "'>" + floorGroup + "</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getFloorAvailability: function(units) {
            var floors = {};
            for (var i in units) {
                var unit = units[i];
                var groupInterval = utils.getGroupInterval(unit.floor, config.filters.floorInterval);
                var sfloor = groupInterval.start;
                var efloor = groupInterval.end - 1;
                var floorGroup = sfloor + ' - ' + efloor;
                if (floors[floorGroup] == null) {
                    floors[floorGroup] = {
                        'sfloor': sfloor,
                        'efloor': efloor,
                        'availability': 0
                    };
                }
                if (unit.isAvailable) {
                    floors[floorGroup].availability++;
                }
            }
            return floors;
        },
        getEntranceMenuOptions: function(data, entranceFiltersData) {
            var code = "<div class='menu-item-options'><table>";
            var entrances = this.getEntranceAvailability(data.listings);
            var sortedEntrances = Object.keys(entrances).sort();
            for (var i in sortedEntrances) {
                var entrance = sortedEntrances[i],
                    id = config.filters.entrance + i;
                var availabilityClass = "apt-available-border-color";
                if (entrances[entrance] == 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = entrance;
                if (entranceFiltersData && entranceFiltersData.length && entranceFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<tr><td class='option-item " + config.filters.entrance + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-value='" + entrance + "'>" + entrance + "</td></tr>";
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
        getPriceMenuOptions: function(data, priceFiltersData) {
            var code = "<div class='menu-item-options'><table>";
            var prices = this.getPriceAvailability(data.listings);
            var sortedPrices = Object.keys(prices).sort();
            for (var i in sortedPrices) {
                var price = sortedPrices[i],
                    id = config.filters.price + i;
                var availabilityClass = "apt-available-border-color";
                if (prices[price].availability == 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = prices[price].sprice + " " + prices[price].eprice;
                if (priceFiltersData && priceFiltersData.length && priceFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<tr><td class='option-item " + config.filters.price + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-svalue='" + prices[price].sprice + "' data-evalue='" + prices[price].eprice + "'>" + price + "</td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getPriceAvailability: function(units) {
            var prices = {};
            var interval = config.filters.priceInterval;
            var denom = 100000;
            for (var i in units) {
                var unit = units[i];
                var groupInterval = utils.getGroupInterval(unit.price, config.filters.priceInterval);
                var sPrice = groupInterval.start;
                var ePrice = groupInterval.end;
                var priceGroup = Number(sPrice / denom) + ' L - ' + Number(ePrice / denom) + ' L';
                if (prices[priceGroup] == null) {
                    prices[priceGroup] = {
                        'sprice': sPrice,
                        'eprice': ePrice,
                        'availability': 0
                    };
                }
                if (unit.isAvailable) {
                    prices[priceGroup].availability++;
                }
            }
            return prices;
        }
    };

    return TowerselectedView;

})();