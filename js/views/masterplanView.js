/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var MasterplanView = (function () {

    var containerMap = {
        'buildingImgContainer': '<div class="img-container opacity-control ' + config.dynamicResizeClass + '" id="img-container" style="display:none;"></div>',
        'buildingSvgContainer': '<svg class="svg-container ' + config.dynamicResizeClass + '" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'buildingMenuContainer': '<div class="tower-menu-container master-page" id="tower-menu-container"></div>',
        'towerDetailContainer': '<div class="tower-detail-container" id="tower-detail-container"></div>',
        'amenitiesContainer': '<div class="amenities-container ' + config.dynamicResizeClass + '" id="amenities-container"></div>',
        'cloudContainer': '<div class="cloud-container" id="cloud-container"></div>',
        'carAnimation': '<svg class="car-animation transition-left ' + config.dynamicResizeClass + '" id="car-animation" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'googleMapContainer': '<div class="map-container"><div id="google-map-container" class="google-map-container"></div></div>',
        'mapTooltip': '<div class="map-tooltip" id=map-tooltip></div>',
        'openGoogleMapView': '<div id="open-google-map-view" style="padding: 10px 20px; color: #000; position: absolute; top: 20%; right: 20px; z-index: 100001; background-color: yellow;">Open Google Map View</div>',
        'bottomFilterContainer': '<div id="bottom-filter-container" class="bottom-filter-container transition"></div>'
    };

    var curruntFilter = '', isClicked = false;
    function getElements() {
        var elements = {
            'buildingImgContainer': $('#img-container'),
            'buildingSvgContainer': $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'amenitiesContainer': $('#amenities-container'),
            'cloudContainer': $('#cloud-container'),
            'carAnimation': $('#car-animation'),
            'googleMapContainer': $('#google-map-container'),
            'openGoogleMapView': $('#open-google-map-view'),
            'bottomFilterContainer': $('#bottom-filter-container'),
            'buildingMenuContainer': $('#tower-menu-container')
        };
        return elements;
    }

    function MasterplanView(model, baseView) {
        this._model = model;
        this._elements = null;
        this._baseView = baseView;
        var _this = this;

        // Menu Events
        this._menuMouseEnter = new Event(this);
        this._menuMouseLeave = new Event(this);
        this._menuClick = new Event(this);
        this._menuUp = new Event(this);
        this._menuDown = new Event(this);

        // Svg Events
        this._towerSvgMouseEnter = new Event(this);
        this._towerSvgMouseLeave = new Event(this);
        this._towerSvgClick = new Event(this);

        // Amenity Events
        this._amenityClick = new Event(this);
        this._amenityClose = new Event(this);

        // Google Map Events
        this._googleMapProjectClick = new Event(this);
        this._googleMapViewChanged = new Event(this);
        this._openGoogleMapClicked = new Event(this);


        this._applyfilter = new Event(this);
        this._removeFilter = new Event(this);
        this._mouseenterFilter = new Event(this);
        this._mouseleaveFilter = new Event(this);

        // For dynamic height of tower menu
        utils.masterPlanModel = this._model;
    }

    MasterplanView.prototype = {
        buildView: function () {
            var i, data = this._model.getData();
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.renderInitialData(data);
            for (i in this._elements) {
                this._elements[i].empty();
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data);
                }
            }
        },
        buildSkeleton: function (containerList) {
            var key, mainContainerHtml = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    mainContainerHtml += containerMap[containerList[key]];
                }
            }
            document.getElementById(config.mainContainerId).innerHTML = mainContainerHtml;
            this._elements = getElements();
        },
        renderInitialData: function (data) {
            document.getElementById(config.projectDetail.titleId).innerHTML = (config.builderSetUp ? '' : '<a href="https://www.proptiger.com/' + data.projectUrl + '" target="_blank">') + data.builderName + ' ' + data.projectName + (config.builderSetUp ? '' : '</a>');
            document.getElementById(config.projectDetail.addressId).innerHTML = data.address;
            document.getElementById(config.projectDetail.availabilityCountId).innerHTML = '';
        },
        // to render the google map container
        googleMapContainer: function () {
            var data = this._model.getData(),
                googleMapData = data.googleMapData,
                _this = this;
            var center = {
                lat: (googleMapData.upperEnd.lat + googleMapData.lowerEnd.lat) / 2,
                lng: (googleMapData.upperEnd.lng + googleMapData.lowerEnd.lng) / 2
            };
            var city = new google.maps.LatLng(center.lat, center.lng);
            var imageBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(googleMapData.upperEnd.lat, googleMapData.upperEnd.lng),
                new google.maps.LatLng(googleMapData.lowerEnd.lat, googleMapData.lowerEnd.lng));
            var mapStyles = [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                }
            ];
            var mapOptions = {
                zoom: config.maxZoomLevel,
                center: city,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                styles: mapStyles
            };
            var map = new google.maps.Map(this._elements.googleMapContainer[0],
                mapOptions);
            var places = new google.maps.places.PlacesService(map);
            places.nearbySearch({
                location: center,
                radius: config.nearbySearchDistance,
                types: config.nearbySearchAmenities
            }, function (results, status, next) {
                next.nextPage();
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        _this.createMarker(results[i], map);
                    }
                }
            });

            var infowindow = new google.maps.InfoWindow();

            var imageOverlay = new google.maps.GroundOverlay(googleMapData.imagePath,
                imageBounds);

            this.googleMapContainerEvents(map, imageOverlay, center);

        },
        createMarker: function (place, map, masterplanView) {
            var placeLoc = place.geometry.location,
                _this = this;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'mouseover', function () {
                $('#map-tooltip').html(place.name);
                $('#map-tooltip').show();
                var pixelLocation = _this.fromLatLngToPoint(place.geometry.location, map);
                $('#map-tooltip').css({top: pixelLocation.y, left: pixelLocation.x});
            });
            google.maps.event.addListener(marker, 'mouseout', function () {
                $('#map-tooltip').hide();
            });
        },
        fromLatLngToPoint: function (latLng, map) {
            var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            var scale = Math.pow(2, map.getZoom());
            var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
            return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
        },
        // to attach events related to google maps view
        googleMapContainerEvents: function (map, imageOverlay, center) {
            var _this = this;

            var elements = {
                map: map,
                center: center,
                visible: false
            };

            this._elements.openGoogleMapView.off('click').on('click', function () {
                _this._openGoogleMapClicked.notify(elements);
            });

            google.maps.event.addListener(map, 'center_changed', function (event) {
                _this._googleMapViewChanged.notify(elements);
            });

            google.maps.event.addListener(map, 'zoom_changed', function (event) {
                _this._googleMapViewChanged.notify(elements);
            });

            google.maps.event.addListenerOnce(map, 'idle', function () {
                imageOverlay.setMap(map);
            });

            google.maps.event.addListener(imageOverlay, 'click', function (event) {
                _this._googleMapProjectClick.notify(elements);
            });
        },
        // to decide whether masterplan view has to be opened
        removeGoogleMapView: function (elements) {
            if (elements.map.getZoom() > config.initialZoomLevel && elements.visible) {
                var projectCenter = new google.maps.LatLng(elements.center.lat, elements.center.lng);
                if (google.maps.geometry.spherical.computeDistanceBetween(projectCenter, elements.map.center) < config.openProjectRadius) {
                    elements.map.setZoom(config.initialZoomLevel);
                    this._elements.buildingImgContainer.removeClass('zoomOutMasterPlan');
                    this._elements.buildingImgContainer.addClass('zoomInMasterPlan');
                    this.hideGoogleMap(elements);
                }
            }
        },
        // to hide the google map
        hideGoogleMap: function (elements) {
            var _this = this;
            elements.visible = false;
            elements.map.setCenter(elements.center);
            //elements.map.setZoom(config.maxZoomLevel);
            this._elements.googleMapContainer.parent().css('z-index', '-10');     //do this using class
            setTimeout(function () {
                _this._elements.amenitiesContainer.show();
                _this._elements.carAnimation.show();
                _this._elements.buildingMenuContainer.show();
                _this._elements.openGoogleMapView.show();
                _this._elements.cloudContainer.show();
            }, 3000);

        },
        // to show the google map view
        showGoogleMap: function (elements) {
            this._elements.googleMapContainer.parent().css('z-index', '100001');     //do this using class
            this._elements.openGoogleMapView.hide();
            //elements.map.setZoom(config.initialZoomLevel);
            elements.visible = true;
        },
        // to make open map view icon
        openGoogleMapView: function () {
            var text = "Open Google Map View";
            this._elements.openGoogleMapView.html(text);
        },
        startAnimation: function (model) {

            model._baseView._showLoaderComplete.notify();

            // Images
            $('.opacity-control').fadeIn(500);

            // Clouds
            $('.top-left-cloud').animate({
                right: '90%'
            }, 8000);
            $('.top-right-cloud').animate({
                left: '90%'
            }, 8000);
            $('.bottom-left-cloud').animate({
                right: '90%'
            }, 8000);
            $('.bottom-right-cloud').animate({
                left: '90%'
            }, 8000);

            // Amenities
            var time = 5000;
            $('.amenity-icon span').each(function () {
                var _this = this;
                setTimeout(function () {
                    $(_this).removeClass('fs0');
                }, time);
                time += 200;
            });

            // Tower Menu
            setTimeout(function () {
                $('.tower-menu-container').css({
                    visibility: 'visible'
                });
                $('.tower-menu-container').animate({
                    left: '80px'
                }, 500);
            }, 7000);

            // Connect tabs
            setTimeout(function () {
                $('.pro-contact-actions ul.conect-tab').css({
                    bottom: '0px'
                });
            }, 7000);

            // Notification tooltip
            setTimeout(function () {
                viewUtils.showNotificationTooltip('Click on a tower to explore further');
            }, 9000);

            // bottom container
            setTimeout(function () {
                $('.bottom-filter-container').addClass('show-up');
            }, 7000);

        },
        displayWithoutAnimation: function () {
            // Images
            $('.opacity-control').fadeIn(500);

            // Clouds
            $('.top-left-cloud').css({
                right: '90%'
            });
            $('.top-right-cloud').css({
                left: '90%'
            });
            $('.bottom-left-cloud').css({
                right: '90%'
            });
            $('.bottom-right-cloud').css({
                left: '90%'
            });

            // Amenities
            $('.amenity-icon span').removeClass('fs0');

            // Tower Menu
            $('.tower-menu-container').css({
                left: '80px',
                visibility: 'visible'
            });

            //bottom-filter-container
            $('.bottom-filter-container').addClass('show-up');

            if(curruntFilter !== ''){
                this.applyFilter();
            }

            // Connect tabs
            $('.pro-contact-actions ul.conect-tab').css({
                bottom: '0px'
            });

            viewUtils.showNotificationTooltip('Click on a tower to explore further');
        },
        dynamicResizeContainers: function () {
            utils.defaultDynamicResizeContainers();
            var parentWidth = $('.master-menu .menu-items').parent().width(),
                count = parseInt((parentWidth) / config.towerMenuItemHeight),
                width = count * config.towerMenuItemHeight;
            utils.masterPlanModel.updateTowerMenuEnd(count);
            $('.master-menu .menu-items').css('width', width);
        },
        sortTowersObject: function (towers) {
            var towerName, towerValues = [];
            for (towerName in towers) {
                if (hasOwnProperty.call(towers, towerName)) {
                    towerValues.push(towers[towerName]);
                }
            }
            return towerValues.sort(function (t1, t2) {
                return t1.displayOrder - t2.displayOrder;
            });
        },
        carAnimation: function (data) {
            if (!config.showCarAnimation || data.projectId != "501660") {
                return;
            }
            var carCode = "",
                ratio = config.imageResolution.height / config.imageResolution.width,
                imageResolutionHeight = config.imageResolution.height,
                sizeMultiplier = 0.3,
                cars = [{
                    path: 'M52 105 105 60',
                    imageURL: 'images/car-a1.png',
                    imageWidth: 70,
                    imageHeight: 46,
                    begin: 8,
                    duration: 16
                }, {
                    path: 'M56 105 105 63',
                    imageURL: 'images/car-a2.png',
                    imageWidth: 70,
                    imageHeight: 46,
                    begin: 15,
                    duration: 12
                }, {
                    path: 'M105 66 60 105',
                    imageURL: 'images/car-b1.png',
                    imageWidth: 72,
                    imageHeight: 46,
                    begin: 10,
                    duration: 12
                }, {
                    path: 'M105 68 63 105',
                    imageURL: 'images/car-b2.png',
                    imageWidth: 72,
                    imageHeight: 46,
                    begin: 15,
                    duration: 14
                }, {
                    path: 'M105 68 63 105',
                    imageURL: 'images/car-b3.png',
                    imageWidth: 72,
                    imageHeight: 46,
                    begin: 20,
                    duration: 14
                }];

            for (var i in cars) {
                var height = cars[i].imageHeight / imageResolutionHeight * 100 * sizeMultiplier,
                    width = cars[i].imageWidth / cars[i].imageHeight * height * ratio;
                carCode += "<path d='" + cars[i].path + "' id='path" + i + "'/>";
                carCode += "<image class='car' id='car" + i + "' xlink:href='" + cars[i].imageURL + "' id='car" + i + "' width='" + width + "' height='" + height + "' preserveAspectRatio='none'/>";
                carCode += "<animateMotion xlink:href='#car" + i + "' dur='" + cars[i].duration + "s' begin='" + cars[i].begin + "s' repeatCount='indefinite' fill='freeze'>";
                carCode += "<mpath xlink:href='#path" + i + "'/>";
                carCode += "</animateMotion>";

                // Hack for hiding cars
                setTimeout(function (i) {
                    $('#car' + i).css('visibility', 'visible');
                }, cars[i].begin * 1000, i); // jshint ignore:line
            }

            this._elements.carAnimation.html(carCode);
        },
        buildingImgContainer: function (data) {
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
        buildingMenuContainer: function (data, filteredTower) {
            data = data || this._model.getData();
            var towersData = utils.ascendingOrder(data.towers);
            if(filteredTower && filteredTower.length > 0){
                towersData = filteredTower;
            }
            var code = "<div class='master-menu'>";

            code += "<div class='menu-sep'></div>";
            code += "<div class='menu-items'><div class='scrollup-menu scroll-down transition'><span class='icon icon-arrow_btm fs14'></span></div><div class='scrollup-menu scroll-up top-stick transition'><span class='icon icon-arrow_top fs14'></span></div><div class='scroll-box'><div class='menu-scroll'><div class='master-tower-menu transition'>";
            for (var i = 0; i < towersData.length; i++) {
                var towerIdentifier = towersData[i];
                var tower = data.towers[towerIdentifier],
                    towerUrl = tower.isAvailable ? data.baseUrl + "/" + tower.towerIdentifier : 'undefined';
                code += "<div class='menu-item-container-td'><div class='menu-item " + config.leftPanelButtonClass +
                    "' id='" + towerIdentifier + "-menu' data-index='" + towerIdentifier +
                    "' data-imageid='" + tower.towerId +
                    "' data-url='" + towerUrl +
                    "'><label class='transition'>" + tower.shortName + "</label></div></div>";
                    // Image name can get via "tower.displayImage" to show instead of sort name
                    // avilable count  can get via "tower.totalAvailableCount" to show
            }
            code += "</div></div></div></div>";
            code += "</div>";
            this._elements.buildingMenuContainer.html(code);
            if($('#inside-tower-menu-container').html){
                $('#inside-tower-menu-container').html(code);
            }
            this.buildingMenuContainerEvents();
        },
        buildingMenuContainerEvents: function () {
            var _this = this;
// todo delete these events when we remove upper buildingMenuContainer

            _this._elements.buildingMenuContainer.off('click').on('click', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuClick.notify(this); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseenter').on('mouseenter', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuMouseEnter.notify({
                    element: this,
                    event: event
                }); // this refers to element here
            });

            _this._elements.buildingMenuContainer.off('mouseleave').on('mouseleave', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuMouseLeave.notify(this); // this refers to element here
            });

            _this._elements.buildingMenuContainer.on('click', '.scroll-up', function (event) {
                // notify controller
                _this._menuUp.notify(this); // this refers to element here
            });
            _this._elements.buildingMenuContainer.on('click', '.scroll-down', function (event) {
                // notify controller
                _this._menuDown.notify(this); // this refers to element here
            });

// events binding after menu creation into bottomFilterContainer  todo click is not working yet

            _this._elements.bottomFilterContainer.off('click').on('click', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuClick.notify(this); // this refers to element here
            });

            _this._elements.bottomFilterContainer.off('mouseenter').on('mouseenter', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuMouseEnter.notify({
                    element: this,
                    event: event
                }); // this refers to element here
            });

            _this._elements.bottomFilterContainer.off('mouseleave').on('mouseleave', '.' + config.leftPanelButtonClass, function (event) {
                // notify controller
                _this._menuMouseLeave.notify(this); // this refers to element here
            });


            _this._elements.bottomFilterContainer.on('click', '.scroll-up', function (event) {
                // notify controller
                _this._menuUp.notify(this); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.scroll-down', function (event) {
                // notify controller
                _this._menuDown.notify(this); // this refers to element here
            });
            this.bottomFilterContainerEvents();

        },
        menuUpHandler: function () {
            var originalMargin = parseInt($('.' + config.towerMenuClass).css('margin-left'));
            if ((originalMargin % config.towerMenuItemHeight !== 0) ||
                (this._model.getTowerMenu().start <= 0)) {
                return;
            }
            var margin = originalMargin + config.towerMenuItemHeight;
            this._model.slideUpTowerMenu();
            $('.' + config.towerMenuClass).css('margin-left', margin + 'px');
        },
        menuDownHandler: function () {
            var originalMargin = parseInt($('.' + config.towerMenuClass).css('margin-left'));
            if ((originalMargin % config.towerMenuItemHeight !== 0) ||
                (this._model.getTowerMenu().end >= this._model.getTowerCount() - 1)) {
                return;
            }
            var margin = originalMargin - config.towerMenuItemHeight;
            this._model.slideDownTowerMenu();
            $('.' + config.towerMenuClass).css('margin-left', margin + 'px');
        },
        buildingSvgContainer: function (data) {
            var i, tower, towerUrl,
                towers = this.sortTowersObject(data.towers),
                tower_length = towers.length;

            for (i = 0; i < tower_length; i++) {
                tower = towers[i];
                if (tower.towerHoverSvg) {
                    towerUrl = tower.isAvailable ? data.baseUrl + "/" + tower.towerIdentifier : 'undefined';
                    var svgClass = tower.isAvailable ? '' : 'no-pointer';
                    var attrs = {
                        'class': config.towerImgSvgClass + " " + svgClass,
                        id: tower.towerId + "-path",
                        'data-index': tower.towerIdentifier,
                        'data-url': towerUrl,
                        'data-imageid': tower.towerId,
                        points: tower.towerHoverSvg
                    };
// add specific class on each Polygon  like pool-view, park-view etc.

                    if (tower.totalEastFacingAvailableCount > 0) {
                        attrs['class'] += ' east-facing';
                    }

                    if (tower.viewDirections) {
                        for (var direction in tower.viewDirections) {
                            attrs['class'] += ' ' + tower.viewDirections[direction];
                        }
                    }

                    var eachPolygon = viewUtils.makeSVG('polygon', attrs);
                    this._elements.buildingSvgContainer.append(eachPolygon);
                }
            }
            this.buildingSvgContainerEvents();
        },
        buildingSvgContainerEvents: function () {
            var _this = this;

            _this._elements.buildingSvgContainer.off('click').on('click', '.' + config.towerImgSvgClass, function (event) {
                // notify controller
                var jsonString = JSON.stringify(this.classList);
                if (jsonString .indexOf("deactive") == -1){
                    _this._towerSvgClick.notify(this); // this refers to element here
                }
            });

            _this._elements.buildingSvgContainer.off('mouseenter').on('mouseenter', '.' + config.towerImgSvgClass, function (event) {
                 //notify controller
                var jsonString = JSON.stringify(this.classList);
                if (jsonString .indexOf("deactive") == -1){
                    _this._towerSvgMouseEnter.notify({
                        element: this,
                        event: event     // this refers to element here
                    });
                }
            });

            _this._elements.buildingSvgContainer.off('mouseleave').on('mouseleave', '.' + config.towerImgSvgClass, function (event) {
                // notify controller
                var jsonString = JSON.stringify(this.classList);
                if (jsonString .indexOf("deactive") == -1){
                    _this._towerSvgMouseLeave.notify(this); // this refers to element here
                }
            });
        },
        // filter methods
        applyFilter: function (filter) {
            var _this = this;
            isClicked = true;
            filter = filter || curruntFilter;
            var filterClass = '';
            $('img.' + config.imgContainerClass).stop().fadeTo("0", 0.25, function () {});
            $('.bottom-filter-container .tower-filter-wrap').addClass('slide-out');
            $('.bottom-filter-container .after-filter-apply').addClass('slide-in');
            $('.filter-active').removeClass('filter-active');


            function filterTowers(){
                var filteredPolygon = $(filterClass);
                var allPolygon = $('.tower-svg-path');
                for(var j = 0; j < allPolygon.length; j++){
                    allPolygon[j].classList.add('deactive');
                }
                var filteredTower = [];
                for (var i = 0; i < filteredPolygon.length; i++) {
                    console.log(filteredPolygon[i]);
                    filteredPolygon[i].classList.remove('deactive');
                    filteredTower.push(filteredPolygon[i].attributes[2].nodeValue);
                    var imageid = filteredPolygon[i].id.split('-')[0];
                    var targetImage = $('img#' + imageid);
                    targetImage.fadeTo("100", 1, function () {});
                    console.log('filteredPolygon[i]', filteredPolygon[i])
                }
                _this.buildingMenuContainer(_this._model.getData(), filteredTower.sort());
            }

            switch (filter) {
                case 'pool-facing' :
                {
                    filterClass = '.pool-facing';
                    $('.bottom-filter-container .tower-filter-wrap .pool-facing-filter-button').addClass('filter-active');
                    filterTowers();
                    break;
                }
                case 'park-facing' :
                {
                    filterClass = '.park-facing';
                    $('.bottom-filter-container .tower-filter-wrap .park-facing-filter-button').addClass('filter-active');
                    filterTowers();
                    break;
                }
                case 'road-facing' :
                {
                    filterClass = '.road-facing';
                    $('.bottom-filter-container .tower-filter-wrap .road-facing-filter-button').addClass('filter-active');
                    filterTowers();
                    break;
                }
                default : {
                    $('img.' + config.imgContainerClass).stop().fadeTo("0", 1, function () {});
                    $('.bottom-filter-container .tower-filter-wrap .all-tower-button').addClass('filter-active');
                    var allPolygon = $('.tower-svg-path');
                    for(var j = 0; j < allPolygon.length; j++){
                        allPolygon[j].classList.remove('deactive');
                    }
                }
            }
        },
        removeFilter : function () {
            isClicked = false;
            $('img.' + config.imgContainerClass).stop().fadeTo("0", 1, function () {});
            $('.bottom-filter-container .tower-filter-wrap').removeClass('slide-out');
            $('.bottom-filter-container .after-filter-apply').removeClass('slide-in');
            this.buildingMenuContainer();
            //this.buildingSvgContainerEvents();

        },
        mouseenterFilter:function(filter){
            filter = filter || '';
            var filterClass = '';
            $('img.' + config.imgContainerClass).stop().fadeTo("0", 0.25, function () {});

            switch (filter) {
                case 'pool-facing' :
                {
                    filterClass = '.pool-facing';
                    break;
                }
                case 'park-facing' :
                {
                    filterClass = '.park-facing';
                    break;
                }
                case 'road-facing' :
                {
                    filterClass = '.road-facing';
                    break;
                }
                default : {
                    $('img.' + config.imgContainerClass).stop().fadeTo("0", 1, function () {});
                }
            }
            var allpolygon = $(filterClass);
            for (var i = 0; i < allpolygon.length; i++) {
                var imageid = allpolygon[i].id.split('-')[0];
                var targetImage = $('img#' + imageid);
                targetImage.fadeTo("100", 1, function () {});
            }
        },
        mouseleaveFilter:function(){
            if(!isClicked){
                $('img.' + config.imgContainerClass).stop().fadeTo("0", 1, function () {});
            }
        },
        bottomFilterContainerEvents: function () {
            var _this = this;
            this._elements.bottomFilterContainer.on('click', '.all-tower-button', function (event) {
                // notify controller
                curruntFilter = '';
                _this._applyfilter.notify(''); // this refers to element here
            });
            this._elements.bottomFilterContainer.on('click', '.pool-facing-filter-button', function (event) {
                // notify controller
                curruntFilter = 'pool-facing';
                _this._applyfilter.notify('pool-facing'); // this refers to element here
            });
            this._elements.bottomFilterContainer.on('mouseenter', '.pool-facing-filter-button', function (event) {
                // notify controller
                _this._mouseenterFilter.notify('pool-facing');
            });
            this._elements.bottomFilterContainer.on('mouseleave', '.pool-facing-filter-button', function (event) {
                // notify controller
                _this._mouseleaveFilter.notify('');

            });
            this._elements.bottomFilterContainer.on('click', '.park-facing-filter-button', function (event) {
                // notify controller
                curruntFilter = 'park-facing';
                _this._applyfilter.notify('park-facing'); // this refers to element here
            });
            this._elements.bottomFilterContainer.on('mouseenter', '.park-facing-filter-button', function (event) {
                // notify controller
                _this._mouseenterFilter.notify('park-facing');
            });
            this._elements.bottomFilterContainer.on('mouseleave', '.park-facing-filter-button', function (event) {
                // notify controller
                _this._mouseleaveFilter.notify('');

            });
            this._elements.bottomFilterContainer.on('click', '.road-facing-filter-button', function (event) {
                // notify controller
                _this._applyfilter.notify('road-facing'); // this refers to element here
            });
            this._elements.bottomFilterContainer.on('mouseenter', '.road-facing-filter-button', function (event) {
                // notify controller
                curruntFilter = 'road-facing';
                _this._mouseenterFilter.notify('road-facing');
            });
            this._elements.bottomFilterContainer.on('mouseleave', '.road-facing-filter-button', function (event) {
                // notify controller
                _this._mouseleaveFilter.notify('');

            });
            this._elements.bottomFilterContainer.on('click', '.back-to-filter', function (event) {
                // notify controller
                curruntFilter = '';
                _this._removeFilter.notify(); // this refers to element here
            });

        },
        bottomFilterContainer: function (data) {
            console.log('craeteBottomFilterContainer', data);
            var allTower = $('img.' + config.imgContainerClass).length,
                poolFacing = $('.pool-facing').length,
                parkFacing = $('.park-facing').length,
                roadFacing = $('.road-facing').length,
                code = "";

                code += "<div class='tower-filter-wrap transition'><div class='filter-wrap transition tower-filter'>";
                code += "<div class='filter all-tower-button transition'><div class='ico-wrap transition'><img src='images/all-tower.png'></div><span>All Towers "+ allTower+"</span></div>";
                code += "<div class='filter pool-facing-filter-button transition'><div class='ico-wrap transition'><img src='images/pool-facing.png'></div><span>Pool Facing "+ poolFacing+"</span></div>";
                code += "<div class='filter park-facing-filter-button transition'><div class='ico-wrap transition'><img src='images/park-facing.png'></div><span>Park Facing "+ parkFacing+"</span></div>";
                code += "<div class='filter road-facing-filter-button transition'><div class='ico-wrap transition'><img src='images/road-facing.png'></div><span>Road Facing "+ roadFacing+"</span></div>";
                code += "</div></div>";

                code += "<div class='after-filter-apply transition'>";
                code += "<div class='left'><div class='back-to-filter'><i class='icon icon-arrow_left'></i></div></div>";
                code += "<div class='center'><div class='filter-wrap'><div class='filter item'>";
                code += '<div class="tower-menu-container master-page" id="inside-tower-menu-container">';
                code += "</div></div></div></div>";
                code += "<div class='right'></div>";
                code += "</div>";

            this._elements.bottomFilterContainer.html(code);
            this.bottomFilterContainerEvents();
        },
        towerMouseEnterEvent: function (obj) {
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

            $('img.' + config.imgContainerClass).not(targetImage).stop().fadeTo("500", 0.25, function () {
            });
            $('.' + config.amenityContainerClass).addClass(config.amenityNotOnTopClass);

            if (towerData && towerData.towerTooltipSvg && config.useSpecifiedTowerTooltipSvg) {
                var point = towerData.towerTooltipSvg.split(' ');
                this.showTowerDetailContainer(towerData, point[0], point[1], '%');
            } else if (towerData && svgpath) {
                var svgpathClient = svgpath.getBoundingClientRect();
                var diff = (window.innerWidth > config.imageResolution.width) ? (window.innerWidth - config.imageResolution.width) / 2 : 0;
                this.showTowerDetailContainer(towerData, (svgpathClient.left - diff + svgpathClient.width / 2), svgpathClient.top + 30, 'px');
            }

            $('#' + index + '-menu').addClass(config.menuItemHoverClass);
            $('#' + index + '-menu span').addClass(availabilityStatusClass);
        },
        towerMouseLeaveEvent: function (element) {
            $('.detail-box').removeClass('show-details');
            $('.detail-box').addClass('hide-details');
            if(curruntFilter !== ''){
                this.applyFilter(curruntFilter);
            }else{
                $('img.' + config.imgContainerClass).stop().fadeTo("500", 1, function () {});
            }
            $('.' + config.amenityContainerClass).removeClass(config.amenityNotOnTopClass);
            var removeClasses = config.menuItemHoverClass + ' ' + config.availabilityClass.available + ' ' + config.availabilityClass.unavailable;
            $('.' + config.leftPanelButtonClass).removeClass(removeClasses);

            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        showTowerDetailContainer: function (data, left, top, unit) {
            if (!(data && data.unitInfo)) {
                return;
            }

            var tooltipClass = utils.getTooltipPosition({
                pageX: left,
                pageY: top,
                unit: unit
            });
            tooltipClass = tooltipClass ? tooltipClass : 'bottom-right';

            var availabilityClassSuffix = '-border-right';
            if (tooltipClass == 'top-left' || tooltipClass == 'bottom-left') {
                availabilityClassSuffix = '-border-left';
            }

            var towerCode = "",
                dotClass = !data.isAvailable ? 'sold' : '',
                bookingText = (data.bookingStatus == 'OnHold') ? 'On Hold' : 'Sold Out';
            towerCode += "<div id='container-detail' class='tooltip-detail'>";
            towerCode += "<div class='detail-box show-details'>" + "<div class='tooltip-title'>" + data.shortName + "</div>" + "<div class='line " + tooltipClass + "''>" + "<div class='dot-one'></div>" + "<div class='dot-two " + dotClass + "'></div>" + "<div class='detail-container master-details'>";
            towerCode += "<div class='tolltip-tower-name'>" + data.longName + "</div>";
            towerCode += "<table>";
            if (!data.isAvailable) {
                towerCode += "<tr><td colspan='2' class='" + config.availabilityClass.unavailable + "'>" + bookingText + "</td></tr>";
            } else {
                for (var j in data.unitInfo) {
                    var aptType = data.unitInfo[j];
                    var availabilityClass = config.availabilityClass.available + availabilityClassSuffix;
                    var availabilityText = aptType.available + " Available";
                    if (aptType.available === 0) {
                        availabilityClass = config.availabilityClass.unavailable + availabilityClassSuffix;
                        availabilityText = 'Sold Out';
                    }
                    towerCode += "<tr class='" + availabilityClass + "'>";
                    towerCode += "<td>" + aptType.type + "</td>";
                    towerCode += config.builderSetUp ? "<td>Apartment</td></tr>" : "<td>" + availabilityText + "</td> <td><td></tr>";
                }
            }
            towerCode += "</table>";
            towerCode += "</div>" + "</div>" + "</div>";

            if (this._elements && this._elements.towerDetailContainer) {
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left + unit);
                $('#container-detail').css("top", top + unit);
            }

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity; // jshint ignore:line
            document.getElementById('container-detail').style.opacity = "1";
        },
        amenitiesContainer: function (data) {
            var code = "";
            for (var amenityKey in data.amenities) {
                if (hasOwnProperty.call(data.amenities, amenityKey)) {
                    var amenity = data.amenities[amenityKey];
                    var point = data.amenities[amenityKey].amenitySvg.split(' ');
                    var position = "top:" + point[1] + "%; left:" + point[0] + "%;";
                    code += "<div data-top='" + point[1] + "' data-left='" + point[0] + "' id='" + amenityKey + "' class='" + config.amenityIconClass + "' style='" + position + "'><span class='icon icon-location transition fs0'></span>";
                    code += "<div class='name'><img class='amenity-img' src=" + amenity.imageUrl + "></div>";
                    code += "</div>";
                }
            }
            this._elements.amenitiesContainer.html(code);
            this.amenitiesContainerEvents();
        },
        amenitiesContainerEvents: function () {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.' + config.amenityIconClass, function (event) {
                // notify controller
                _this._amenityClick.notify(this); // this refers to element here
            });
        },
        amenityClickEvent: function (element) {
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
        amenitiesPopupEvents: function () {
            var _this = this;
            _this._elements.amenitiesContainer.off('click').on('click', '.' + config.amenityPopupClass, function (event) {
                // notify controller
                _this._amenityClose.notify(this); // this refers to element here
            });
            _this._elements.amenitiesContainer.on('click', '.' + config.amenityPopupTableClass, function (event) {
                event.stopPropagation();
            });
            _this._elements.amenitiesContainer.on('click', '.' + config.amenityPopupCloseClass, function (event) {
                // notify controller
                _this._amenityClose.notify(this); // this refers to element here
            });
        },
        amenityCloseEvent: function () {
            $('.photo-table').removeClass('pop-up-in');
            $('.photo-table').addClass('pop-up-out');
            setTimeout(function () {
                $("." + config.amenityPopupClass).remove();
            }, 1000);
            this.amenitiesContainerEvents();
        },
        cloudContainer: function (data) {
            var code = '<div class="top-left-cloud"></div><div class="top-right-cloud"></div><div class="bottom-left-cloud"></div><div class="bottom-right-cloud"></div>';
            this._elements.cloudContainer.html(code);
        }
    };

    return MasterplanView;

})();
