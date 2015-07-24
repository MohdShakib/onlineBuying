/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var MasterplanView = (function() {

    var containerMap = {
        'buildingImgContainer': '<div class="img-container ' + config.dynamicResizeClass + '" id="img-container"></div>',
        'buildingSvgContainer': '<svg class="svg-container ' + config.dynamicResizeClass + '" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'buildingMenuContainer': '<div class="tower-menu-container" id="tower-menu-container"></div>',
        'towerDetailContainer': '<div class="tower-detail-container" id="tower-detail-container"></div>',
        'amenitiesContainer': '<div class="amenities-container ' + config.dynamicResizeClass + '" id="amenities-container"></div>',
        'cloudContainer': '<div class="cloud-container" id="cloud-container"></div>'
    };

    function getElements() {
        var elements = {
            'buildingImgContainer': $('#img-container'),
            'buildingSvgContainer': $('#svg-container'),
            'buildingMenuContainer': $('#tower-menu-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'amenitiesContainer': $('#amenities-container'),
            'cloudContainer': $('#cloud-container')
        };
        return elements;
    }

    function MasterplanView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        // Menu Events
        this._menuMouseEnter = new Event(this);
        this._menuMouseLeave = new Event(this);
        this._menuClick = new Event(this);

        // Svg Events
        this._towerSvgMouseEnter = new Event(this);
        this._towerSvgMouseLeave = new Event(this);
        this._towerSvgClick = new Event(this);

        // Amenity Events
        this._amenityClick = new Event(this);
        this._amenityClose = new Event(this);
    }

    MasterplanView.prototype = {
        buildView: function() {
            var i, data = this._model.getData();
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.renderInitialData(data);
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data);
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
        sortTowersObject: function(towers) {
            var towerName, towerValues = [];
            for (towerName in towers) {
                if (hasOwnProperty.call(towers, towerName)) {
                    towerValues.push(towers[towerName]);
                }
            }
            return towerValues.sort(function(t1, t2) {
                return t1.displayOrder - t2.displayOrder;
            });
        },
        buildingImgContainer: function(data) {
            var imgCode = "<img id=\"main-image\" width='100%' src=\"" + data.bgImage + "\"/>";
            var tower, i,
                towers = this.sortTowersObject(data.towers),
                tower_length = towers.length;

            for (i = 0; i < tower_length; i++) {
                tower = towers[i];
                if (tower.hoverImageUrl) {
                    imgCode += "<img class=\"" + config.imgContainerClass + "\" id=\"" + tower.towerId + "\" width='100%' src=\"" + tower.hoverImageUrl + "\" />";
                }
            }
            this._elements.buildingImgContainer.html(imgCode);
        },
        buildingMenuContainer: function(data) {
            var code = "<table><tr><td class='menu-header menu-icon transition'><span class='icon icon-arrow_left'></span></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-items'><div class='menu-scroll'><table>";
            for (var towerIdentifier in data.towers) {
                var tower = data.towers[towerIdentifier],
                    towerUrl = tower.isAvailable ? data.baseUrl + "/" + tower.towerIdentifier : 'undefined';
                code += "<tr><td class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass +
                    "' id='" + towerIdentifier + "-menu' data-index='" + towerIdentifier +
                    "' data-imageid='" + tower.towerId +
                    "' data-url='" + towerUrl +
                    "'><span class='tower-menu-text transition'>Tower</span> " + tower.towerName.split(' ')[1] + "</div></td></tr>";
            }
            code += "</table></div></td></tr>";
            code += "<tr><td class='menu-sep'></td></tr>";
            code += "<tr><td class='menu-call menu-icon'>&nbsp;</td></tr>";
            code += "</table>";
            this._elements.buildingMenuContainer.html(code);
            this.buildingMenuContainerEvents();
        },
        buildingMenuContainerEvents: function() {
            var _this = this;

            _this._elements.buildingMenuContainer.off('click').on('click', '.' + config.leftPanelButtonClass, function(event) {
                // notify controller
                _this._menuClick.notify(this); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseenter').on('mouseenter', '.' + config.leftPanelButtonClass, function(event) {
                // notify controller
                _this._menuMouseEnter.notify({
                    element: this,
                    event: event
                }); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseleave').on('mouseleave', '.' + config.leftPanelButtonClass, function(event) {
                // notify controller
                _this._menuMouseLeave.notify(this); // this refers to element here
            });
        },
        buildingSvgContainer: function(data) {
            var svgCode = "",
                i, tower, towerUrl,
                towers = this.sortTowersObject(data.towers),
                tower_length = towers.length;

            for (i = 0; i < tower_length; i++) {
                tower = towers[i];
                if (tower.towerHoverSvg) {
                    towerUrl = tower.isAvailable ? data.baseUrl + "/" + tower.towerIdentifier : 'undefined';
                    var svgClass = tower.isAvailable ? '' : 'no-pointer';
                    svgCode += "<polygon  class=\"" + config.towerImgSvgClass + " " + svgClass + "\" id=\"" + tower.towerId + "-path\" data-index=\"" + tower.towerIdentifier + "\" data-url=\"" + towerUrl + "\" data-imageid=\"" + tower.towerId + "\"  points=\"" + tower.towerHoverSvg + "\" />";
                }
            }

            this._elements.buildingSvgContainer.html(svgCode);
            this.buildingSvgContainerEvents();
        },
        buildingSvgContainerEvents: function() {
            var _this = this;

            _this._elements.buildingSvgContainer.off('click').on('click', '.' + config.towerImgSvgClass, function(event) {
                // notify controller
                _this._towerSvgClick.notify(this); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseenter').on('mouseenter', '.' + config.towerImgSvgClass, function(event) {
                // notify controller
                _this._towerSvgMouseEnter.notify({
                    element: this,
                    event: event
                }); // this refers to element here
            });

            _this._elements.buildingSvgContainer.off('mouseleave').on('mouseleave', '.' + config.towerImgSvgClass, function(event) {
                // notify controller
                _this._towerSvgMouseLeave.notify(this); // this refers to element here
            });
        },
        towerMouseEnterEvent: function(obj) {
            var element = $(obj.element);
            document.getElementById(config.towerDetailContainerId).innerHTML = '';
            var data = this._model.getData();
            var index = element.data('index');
            var towerData = data && data.towers ? data.towers[index] : null;
            var imageid = element.data('imageid') ? element.data('imageid') : 'main-image';
            var svgpath = document.getElementById(imageid + '-path');
            var targetImage = $('img#' + imageid);
            var availabilityStatusClass = towerData.isAvailable ? config.availabilityClass.available : config.availabilityClass.unavailable;
            if (!(targetImage && targetImage.length)) {
                return;
            }

            $('img.' + config.imgContainerClass).not(targetImage).stop().fadeTo("500", 0.3, function() {});
            $('.' + config.amenityContainerClass).addClass(config.amenityNotOnTopClass);

            if (towerData && svgpath) {
                var svgpathClient = svgpath.getBoundingClientRect();
                var diff = (window.innerWidth > config.imageResolution.width) ? (window.innerWidth - config.imageResolution.width) / 2 : 0;
                this.showTowerDetailContainer(towerData, (svgpathClient.left - diff + svgpathClient.width / 2), svgpathClient.top);
            }

            var menuElement = $('#' + index + '-menu');


            menuElement.addClass(config.menuItemHoverClass);
            menuElement.addClass(availabilityStatusClass);
        },
        towerMouseLeaveEvent: function(element) {
            var index = element.dataset.index;
            $('.detail-box').removeClass('show-details');
            $('.detail-box').addClass('hide-details');
            $('img.' + config.imgContainerClass).stop().fadeTo("500", 1, function() {});
            $('.' + config.amenityContainerClass).removeClass(config.amenityNotOnTopClass);
            var removeClasses = config.menuItemHoverClass + ' ' + config.availabilityClass.available + ' ' + config.availabilityClass.unavailable;
            $('.' + config.leftPanelButtonClass).removeClass(removeClasses);

            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        showTowerDetailContainer: function(data, left, top) {
            if (!(data && data.unitInfo)) {
                return;
            }

            var tooltipClass = utils.getTooltipPosition({
                pageX: left,
                pageY: top
            });
            tooltipClass = tooltipClass ? tooltipClass : 'bottom-right';

            var availabilityClassSuffix = '-border-right';
            if (tooltipClass == 'top-left' || tooltipClass == 'bottom-left') {
                availabilityClassSuffix = '-border-left';
            }

            var towerCode = "",
                dotClass = !data.isAvailable ? 'sold' : '';
            towerCode += "<div id='container-detail' class='tooltip-detail'>";
            towerCode += "<div class='detail-box show-details'>" + "<div class='tooltip-title'>" + data.towerName.split(' ')[1] + "</div>" + "<div class='line " + tooltipClass + "''>" + "<div class='dot-one'></div>" + "<div class='dot-two " + dotClass + "'></div>" + "<div class='detail-container'>";
            towerCode += "<table>";
            if (!data.isAvailable) {
                towerCode += "<tr><td colspan='2' class='" + config.availabilityClass.unavailable + "'>Sold</td></tr>";
            } else {
                for (var j in data.unitInfo) {
                    var aptType = data.unitInfo[j];
                    var availabilityClass = config.availabilityClass.available + availabilityClassSuffix;
                    var availabilityText = aptType.available + " Av";
                    if (aptType.available == 0) {
                        availabilityClass = config.availabilityClass.unavailable + availabilityClassSuffix;
                        availabilityText = 'Sold';
                    }
                    towerCode += "<tr class='" + availabilityClass + "'>";
                    towerCode += "<td>" + aptType.type + "</td>";
                    towerCode += "<td>" + availabilityText + "</td></tr>";
                }
            }
            towerCode += "</table>";
            towerCode += "</div>" + "</div>" + "</div>";

            if (this._elements && this._elements.towerDetailContainer) {
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", (top + 30) + 'px');
            }

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity;
            document.getElementById('container-detail').style.opacity = "1";
        },
        amenitiesContainer: function(data) {
            var code = "";
            for (var amenityKey in data.amenities) {
                if (hasOwnProperty.call(data.amenities, amenityKey)) {
                    var amenity = data.amenities[amenityKey];
                    var point = data.amenities[amenityKey].amenitySvg.split(' ');
                    var position = "top:" + point[1] + "%; left:" + point[0] + "%;";
                    code += "<div data-top='" + point[1] + "' data-left='" + point[0] + "' id='" + amenityKey + "' class='" + config.amenityIconClass + "' style='" + position + "'><span class='icon icon-location'></span>";
                    code += "<div class='name'><span>" + amenity.amenityName + "</span></div>";
                    code += "</div>";
                }
            }
            this._elements.amenitiesContainer.html(code);
            this.amenitiesContainerEvents();
        },
        amenitiesContainerEvents: function() {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.' + config.amenityIconClass, function(event) {
                // notify controller
                _this._amenityClick.notify(this); // this refers to element here
            });
        },
        amenityClickEvent: function(element) {
            var data = this._model.getData();
            var amenityId = element.id;
            var amenity = {};
            for (var amenityKey in data.amenities) {
                if (amenityKey == amenityId) {
                    amenity = data.amenities[amenityKey];
                }
            }
            //changed by jaswant for image pop up animation
            var position = "top:" + $(element).data('top') + "%; left:" + $(element).data('left') + "%;";
            var code = "<div class='" + config.amenityPopupClass + "'><table class='photo-table pop-up-in' style='" + position + "'><tr>";
            code += "<td class='amenity-heading'>" + amenity.amenityName;
            code += "<span class='icon icon-cross fs14 " + config.amenityPopupCloseClass + "'></span></td></tr>";
            code += "<tr><td class='amenity-image'><div><img src='" + amenity.imageUrl + "'></div></td></tr></table>";
            this._elements.amenitiesContainer.append(code);
            this.amenitiesPopupEvents();
        },
        amenitiesPopupEvents: function() {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.' + config.amenityPopupClass, function(event) {
                // notify controller
                _this._amenityClose.notify(this); // this refers to element here
            });
            _this._elements.amenitiesContainer.on('click', '.' + config.amenityPopupTableClass, function(event) {
                event.stopPropagation();
            });
            _this._elements.amenitiesContainer.on('click', '.' + config.amenityPopupCloseClass, function(event) {
                // notify controller
                _this._amenityClose.notify(this); // this refers to element here
            });
        },
        amenityCloseEvent: function() {
            $('.photo-table').removeClass('pop-up-in');
            $('.photo-table').addClass('pop-up-out');
            setTimeout(function() {
                $("." + config.amenityPopupClass).remove();
            }, 1000);
            this.amenitiesContainerEvents();
        },
        cloudContainer: function(data) {
            var code = '<div class="back-cloud"></div><div class="front-cloud"></div>';
            this._elements.cloudContainer.html(code);
            if (this._model.isFirstLoad()) {
                $('.back-cloud').animate({
                    right: '80%'
                }, 6000);
                $('.front-cloud').animate({
                    left: '80%'
                }, 6000);
                this._model.toggleFirstLoad();
            } else {
                $('.back-cloud').css({
                    right: '80%'
                });
                $('.front-cloud').css({
                    left: '80%'
                });
            }
        }
    };

    return MasterplanView;

})();