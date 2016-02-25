/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var TowerselectedView = (function() {

    var containerMap = {
        'towerImgContainer': '<div class="img-container opacity-control transition-left ' + config.dynamicResizeClass + '" id="img-container" style="display:none;"></div>',
        'towerSvgContainer': '<svg class="svg-container opacity-control fast-transition-left ' + config.dynamicResizeClass + '" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>',
        'towerDetailContainer': '<div class="tower-unit-detail-container" id="tower-detail-container"></div>',
        'towerRotationContainer': '<div class="tower-rotation-container" id="' + config.towerRotationContainerId + '" style="display:none;"></div>',
        'filterMenuContainer': '<div class="tower-menu-container tower-selected-menu ' + config.transitionClass + '" id="' + config.filterMenuContainerId + '"></div>',
        'minMapView': '<div id="minMap"></div>',
        'bottomFilterContainer': '<div class="bottom-filter-wrapper transition"><span class="toggle-arrow"></span><div id="bottom-filter-container" class="bottom-filter-container"></div></div>',
        'helpContainer': '<div id="helpContainer" class="help-container hide transition"></div>'
    };

    function getElements() {
        var elements = {
            'helpContainer': $('#helpContainer'),
            'towerImgContainer': $('#img-container'),
            'towerSvgContainer': $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'towerRotationContainer': $('#tower-rotation-container'),
            //'filterMenuContainer': $('#filter-menu-container'),    // todo remove this container later
            'minMapView': $('#minMap'),
            'bottomFilterContainer': $('#bottom-filter-container')
        };
        return elements;
    }

    function TowerselectedView(model, baseView) {
        this._model = model;
        this._elements = null;
        this._baseView = baseView;
        var _this = this;

        // Svg Events
        this._towerUnitSvgMouseEnter = new Event(this);
        this._towerUnitSvgMouseLeave = new Event(this);
        this._towerUnitSvgClick = new Event(this);

        this._towerRotateClicked = new Event(this);

        // Filter Events
        this._goBackButtonClick = new Event(this);
        this._bhkFilterOptionClick = new Event(this);
        this._floorFilterOptionClick = new Event(this);
        if(!config.removeFacingFilter){
            this._entranceFilterOptionClick = new Event(this);
        }
        this._priceFilterOptionClick = new Event(this);
        this._resetFiltersClick = new Event(this);

        //minimap event
        this._minMapClicked = new Event(this);

        //filter events
        this._filterApply = new Event(this);
        this._backToFilter = new Event(this);
        this._resetFilter = new Event(this);
        this._bottomFilterToggle = new Event(this);

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
                    this._elements[i].empty();
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
        updateAvailableCount: function() {
            var availabilityCountElement = $('#' + config.projectDetail.availabilityCountId);
            availabilityCountElement.removeClass('apt-unavailable-color');
            var totalAvailableCount = this._model.getFilteredAvailableCount();
            if (!totalAvailableCount) {
                availabilityCountElement.addClass('apt-unavailable-color');
            }
            availabilityCountElement.find('label').html(totalAvailableCount);
            $('.project-count').addClass(config.textBlinkClass);
            setTimeout(function() {
                $('.project-count').removeClass(config.textBlinkClass);
            }, 500);
        },
        renderInitialData: function(data, rootdata) {
            document.getElementById(config.projectDetail.titleId).innerHTML = (config.builderSetUp ? '':'<a href="' + rootdata.baseUrl + '">') + rootdata.builderName + ' ' + rootdata.projectName + (config.builderSetUp ? '':'</a> &nbsp &gt');
            document.getElementById(config.projectDetail.towerId).innerHTML = data.longName;
            document.getElementById(config.projectDetail.unitId).innerHTML = '';
            document.getElementById(config.projectDetail.addressId).innerHTML = '';
            if(!config.builderSetUp){
                document.getElementById(config.projectDetail.availabilityCountId).innerHTML = '<label class="count"></label> Available';
                this.updateAvailableCount();
            }
        },
        startAnimation: function(model) {

            model._baseView._showLoaderComplete.notify();

            // lazy load rotation images
            model.lazyLoadContent();

            // Tower Menu
            setTimeout(function() {
                if (!$('#' + config.selectedUnitContainerId).length) {
                    $('.tower-menu-container').css({
                        left: '0px',
                        visibility: 'visible'
                    });
                }
            }, 700);

            // Images
            $('.opacity-control').fadeIn(500);

            setTimeout(function() {
                $('.tower-rotation-container').fadeIn(500);
            },1000);

            // Connect tabs
            setTimeout(function() {
                $('.pro-contact-actions ul.conect-tab').css({
                    bottom: '0px'
                });
            }, 700);

            //viewUtils.showNotificationTooltip('Click on unit spot <span class="pointer"></span> to view its floor plan');
        },
        displayWithoutAnimation: function(fromUnitInfoView) {
            // lazy load rotation images
            this.lazyLoadContent();

            // Tower Menu
            $('.tower-menu-container').css({
                left: '0px',
                visibility: 'visible'
            });

            // Images
            if (fromUnitInfoView) {
                $('.opacity-control').show();
                $('.tower-rotation-container').show();
            } else {
                $('.opacity-control').stop().fadeIn(500);
                $('.tower-rotation-container').fadeIn(500);
            }

            // Connect tabs
            $('.pro-contact-actions ul.conect-tab').css({
                bottom: '0px'
            });

            //viewUtils.showNotificationTooltip('Click on unit spot <span class="pointer"></span> to view its floor plan');
        },
        overviewImgContainer: function(data, rootdata) {
            var code = "<img src='" + data.image_url + "'/>";
            this._elements.overviewImgContainer.html(code);
        },
        towerImgContainer: function(data, rootdata) {
            var currentRotationAngle = this._model.getCurrentRotationAngle(),
                towerImageUrl, imageClass, imgCode = '';
            for (var rotationAngle in data.rotationAngle) {
                var isStableState = false;
                if (data.rotationAngle[rotationAngle].listing) {
                    isStableState = true;
                }
                if (hasOwnProperty.call(data.rotationAngle, rotationAngle) && isStableState) {
                    towerImageUrl = data.rotationAngle[rotationAngle].towerImageUrl;
                    imageClass = (rotationAngle != this._model.getCurrentRotationAngle()) ? 'hidden' : '';
                    imgCode += "<img class='" + imageClass + " " + rotationAngle + " " + config.selectedTowerImagesClass + "' width='100%' src='" + towerImageUrl + "' />";
                }
            }
            this._elements.towerImgContainer.html(imgCode);
        },
        lazyLoadContent: function() {
            var currentRotationAngle = this._model.getCurrentRotationAngle(),
                data = this._model.getData(),
                towerImageUrl, imageClass, imgCode = '';
            var allAngles = Object.keys(data.rotationAngle);
            var lazyLoadSequence = viewUtils.reOrderFrames(allAngles);
            for(var i=0; i<lazyLoadSequence.length; i++){
                var rotationAngle = lazyLoadSequence[i];
                var isStableState = false;
                if (data.rotationAngle[rotationAngle].listing) {
                    isStableState = true;
                }
                if (hasOwnProperty.call(data.rotationAngle, rotationAngle) && config.showTowerRotation && !isStableState) {
                    towerImageUrl = data.rotationAngle[rotationAngle].towerImageUrl;
                    imageClass = (rotationAngle != this._model.getCurrentRotationAngle()) ? 'hidden' : '';
                    imgCode += "<img class='" + imageClass + " " + rotationAngle + " " + config.selectedTowerImagesClass + " " + config.lazyloadClass + "' width='100%' src='" + towerImageUrl + "' />";
                }
            }
            this._elements.towerImgContainer.append(imgCode);
            var arrayOfImageUrls = $('img.' + config.lazyloadClass);
            $.each(arrayOfImageUrls, function(index, value) {
                $('<img>').attr('src', value.src) //load image
                    .load(function() {
                        $(value).addClass(config.imageLazyloadedClass);
                    });
            });

        },
        towerSvgContainer: function(data, rootdata) {
            var currentRotationAngle = this._model.getCurrentRotationAngle(),
                selectedListing = this._model.getSelectedListing();
            var listings = (data && data.rotationAngle[currentRotationAngle] && Object.keys(data.rotationAngle[currentRotationAngle].listing).length) ? data.rotationAngle[currentRotationAngle].listing : null;
            if (!listings) {
                return;
            }
            this._elements.towerSvgContainer.empty(); // need to remove to update for filters applied to re-render

            var unitIdentifier, unitInfo, svgClass,
                filteredListingKeys = this._model.getFilteredListings(),
                baseUrl = rootdata.baseUrl + "/" + data.towerIdentifier + "/";

            for (unitIdentifier in listings) {
                unitInfo = listings[unitIdentifier];
                if (hasOwnProperty.call(listings, unitIdentifier) &&
                    hasOwnProperty.call(unitInfo, 'isAvailable') &&
                    unitInfo.unitSvgOnTower &&
                    (filteredListingKeys === null || filteredListingKeys.indexOf(unitIdentifier) > -1)
                ) {
                    var rotationAngle = this._model.getCurrentRotationAngle(),
                        url = listings[unitIdentifier].isAvailable ? baseUrl + rotationAngle + '/' + unitIdentifier : "undefined",
                        selectedClass = (selectedListing == unitIdentifier) ? "" : config.hideClass;
                    svgClass = listings[unitIdentifier].isAvailable ? 'apt-available' : 'apt-unavailable';
                    var attrs = {},
                        eachEllipse,
                        eachPolygon;

                    attrs = {
                        'class': config.towerUnitSvgSelectedClass + " " + selectedClass,
                        id: unitIdentifier + "-selected-path",
                        cx: unitInfo.unitSvgOnTower[0],
                        cy: unitInfo.unitSvgOnTower[1],
                        ry: '1.7',
                        rx: '.78'
                    };
                    eachEllipse = viewUtils.makeSVG('ellipse', attrs);
                    this._elements.towerSvgContainer.append(eachEllipse);
                    attrs = {
                        'class': config.towerUnitSvgHoverClass + " " + config.hideClass,
                        id: unitIdentifier + "-hover-path",
                        cx: unitInfo.unitSvgOnTower[0],
                        cy: unitInfo.unitSvgOnTower[1],
                        ry: '1.7',
                        rx: '.78'
                    };
                    eachEllipse = viewUtils.makeSVG('ellipse', attrs);
                    this._elements.towerSvgContainer.append(eachEllipse);

                    if(config.polyHoverFlag){
                        attrs = {
                        'class': config.towerUnitSvgClass + " " + svgClass,
                        'data-index': unitIdentifier,
                        'data-url': url,
                        id: unitIdentifier + "-poly-path",
                        points: unitInfo.unitHoverSvg
                        };
                        eachPolygon = viewUtils.makeSVG('polygon', attrs);
                        this._elements.towerSvgContainer.append(eachPolygon);
                    }

                    attrs = {
                        'class': config.towerUnitSvgClass + " " + svgClass,
                        id: unitIdentifier + "-path",
                        'data-index': unitIdentifier,
                        'data-url': url,
                        cx: unitInfo.unitSvgOnTower[0],
                        cy: unitInfo.unitSvgOnTower[1],
                        ry: '1.2',
                        rx: '0.55'
                    };
                    eachEllipse = viewUtils.makeSVG('ellipse', attrs);
                    this._elements.towerSvgContainer.append(eachEllipse);

                }
            }
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
                _this._towerUnitSvgMouseLeave.notify(this); // this refers to element here
            });
        },
        towerUnitMouseEnterEvent: function(obj) {
            var element = obj.element;
            var data = this._model.getData();
            var index = $(element).data('index');
            // show svg hover circle
            viewUtils.removeSVGClass(index + "-hover-path", config.hideClass);

            // show tooltip
            var toolTipData = data && data.listings ? data.listings[index] : null;
            if (toolTipData) {
                var svgpathClient = element.getBoundingClientRect();
                var parentContainer = $('#' + config.parentContainerId).offset();
                var diff = (window.innerWidth > config.imageResolution.width) ? (window.innerWidth - config.imageResolution.width) / 2 : 0;
                var topOffset = parentContainer.top || 0;
                this.showTowerUnitDetailContainer(toolTipData, (svgpathClient.right - diff), (svgpathClient.top + svgpathClient.height / 2 - topOffset));
            }
        },
        towerUnitMouseLeaveEvent: function(element) {
            var index = $(element).data('index');

            // hide svg hover circle
            viewUtils.addSVGClass(index + "-hover-path", config.hideClass);

            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        towerUnitMouseClickEvent: function(element) {
            this.towerUnitMouseLeaveEvent(element);
            var dataset = $(element).data();
            if (dataset.url != 'undefined') {
                var svgElements = $('.' + config.towerUnitSvgSelectedClass);
                viewUtils.addSVGClassToElements(svgElements, config.hideClass);
                viewUtils.removeSVGClass(dataset.index + "-selected-path", config.hideClass);
            }
        },
        showTowerUnitDetailContainer: function(unitInfo, left, top) {
            if (!(unitInfo && Object.keys(unitInfo).length)) {
                return;
            }
            var towerCode = "";
            towerCode += "<div id='container-detail' class='tooltip-detail'>";

            var availabilityClass = 'apt-available',
                dotClass = '',
                bookingText = (unitInfo.bookingStatus == 'OnHold') ? 'On Hold' : 'Sold Out';
            if (!unitInfo.isAvailable) {
                availabilityClass = 'apt-unavailable';
                dotClass = 'sold';
            }

            var tooltipClass = utils.getTooltipPosition({
                pageX: 50, // to keep tooltip always on the right
                pageY: top
            });
            tooltipClass = tooltipClass ? tooltipClass : 'bottom-right';

            var details = {
                'address': unitInfo.listingAddress,
                'size': utils.getReadablePrice(unitInfo.size) + ' ' + unitInfo.measure,
                'floor': unitInfo.floor ? unitInfo.floor : 'Ground',
                'color': unitInfo.isAvailable ? 'apt-available-color' : 'apt-unavailable-color',
                'availability': unitInfo.isAvailable ? 'Available' : bookingText,
                'price': utils.getReadablePriceInWord(unitInfo.price - unitInfo.discount),
                'type': unitInfo.bedrooms > 1 ? unitInfo.bedrooms + 'BHK Apartments': unitInfo.bedrooms + 'BHK Apartment'
            };

            towerCode += "<div class='detail-box show-details tSelected-view'>";
            towerCode += "<div class='line " + tooltipClass + "'>";
            towerCode += "<div class='dot-two " + dotClass + "'></div>";

            towerCode += '<div class="tSelected-detail towerunit-detail-container ' + availabilityClass + '"><div class="top-info">';
            if(!config.builderSetUp){
                towerCode += '<div class="fleft ' + details.color + '">' + details.availability + '</div>';
            }
            if(!config.builderSetUp){
                towerCode += '<div class="fright price"><span class="icon icon-rupee"></span>' + details.price + '</div>';
            }
            towerCode += '</div>';
            towerCode += '<div class="floor-item"><div>' + details.type + '</div>';
            towerCode += '<div>' + details.size + '</div></div>';
            towerCode += '<div class="floor-item"><div>Floor ' + details.floor + '</div>';
            towerCode += '<div class="towerunit-name">Unit No. ' + details.address + '</div>';
            towerCode += '</div></div></div>';
            towerCode += '</div></div>';


            if (this._elements && this._elements.towerDetailContainer) {
                this._elements.towerDetailContainer.html(towerCode);
                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", top + 'px');
            }

            // animate
            window.getComputedStyle(document.getElementById('container-detail')).opacity; // jshint ignore:line
            document.getElementById('container-detail').style.opacity = "1";
        },
        rotateTower: function(currentRotationAngle, newRotationAngle, isAntiClockwise) {

            var _this = this,
                data = this._model.getData(),
                rootdata = this._model.getRootdata(),
                finalImageClass = this._model.getCurrentRotationAngle();

            // Getting intemediate angles
            var intermediateAngles = [],
                rotationAngles = Object.keys(data.rotationAngle),
                currentIndex = rotationAngles.indexOf(currentRotationAngle),
                finalIndex = rotationAngles.indexOf(newRotationAngle);
            if(!isAntiClockwise) {
                if (currentIndex < finalIndex) {
                    $.merge(intermediateAngles, rotationAngles.slice(currentIndex + 1, finalIndex - 1));
                } else {
                    if (currentIndex + 1 <= rotationAngles.length) {
                        $.merge(intermediateAngles, rotationAngles.slice(currentIndex + 1, rotationAngles.length));
                    }
                    if (finalIndex - 1 >= 0) {
                        $.merge(intermediateAngles, rotationAngles.slice(0, finalIndex - 1));
                    }
                }
            } else {
                if (currentIndex < finalIndex) {
                    if (currentIndex - 1 >= 0) {
                        $.merge(intermediateAngles, rotationAngles.slice(0, currentIndex - 1).reverse());
                    }
                    if (finalIndex + 1 <= rotationAngles.length) {
                        $.merge(intermediateAngles, rotationAngles.slice(finalIndex + 1, rotationAngles.length).reverse());
                    }
                } else {
                    $.merge(intermediateAngles, rotationAngles.slice(finalIndex + 1, currentIndex - 1).reverse());
                }
            }

            if (config.showTowerRotation && intermediateAngles.length > 0) {

                this._elements.towerSvgContainer.hide(); // Hide towerSvgContainer
                this._elements.towerRotationContainer.hide(); // Hide Rotation buttons

                var totalFramesLoaded = 0, lastShownImageRef;
                for (var i = 0; i < intermediateAngles.length; i++) {
                    var nextImageClass = intermediateAngles[i],
                        timeout, nextImageRef = $('.' + nextImageClass);

                    if(!nextImageRef.hasClass(config.imageLazyloadedClass)){ // if image not loaded skip
                        continue;
                    }

                    lastShownImageRef = nextImageRef;
                    timeout = (totalFramesLoaded + 1) * config.towerRotationSpeed;
                    totalFramesLoaded++;
                    (function(nextImageRef, timeout) {
                        setTimeout(function() {
                            _this._elements.towerImgContainer.addClass('blurRotationImage');
                            $('.' + config.selectedTowerImagesClass).hide();
                            nextImageRef.show();
                        }, timeout);
                    })(nextImageRef, timeout); // jshint ignore:line
                }

                setTimeout(function() {
                    if(lastShownImageRef){
                        lastShownImageRef.hide();
                    }
                    _this._elements.towerImgContainer.removeClass('blurRotationImage');
                    $('.' + config.selectedTowerImagesClass).hide();
                    $('.' + rotationAngles[finalIndex]).show();
                    _this._elements.towerSvgContainer.show();
                    _this._elements.towerRotationContainer.show();
                    _this.towerSvgContainer(data, rootdata);
                    _this.minMapView(data);
                }, (totalFramesLoaded + 1) * config.towerRotationSpeed);

            } else {
                this._elements.towerSvgContainer.empty();
                $('.' + config.selectedTowerImagesClass).fadeOut(1000);
                $('.' + finalImageClass).fadeIn(1000, function() {
                    _this.towerSvgContainer(data, rootdata);
                });
                _this.minMapView(data);
            }
        },
        towerRotationContainer: function() {
            var _this = this;
            _this._elements.towerRotationContainer.off('click').on('click', '.' + config.rotationButtonClass, function(event) {
                // notify controller about rotatebutton click
                _this._towerRotateClicked.notify(this);

            });

            var code = '';
            if(this._model.showRotationButton){
                code += '<div class="rotation-btn-container left-btn transition"><div class="photo-thumb br50"><img src="images/tower-thumb.jpg" class="br50"></div><button class="' + config.rotationButtonClass + '  tower-rotation-left-button br50" data-anticlockwise="false"><span class="icon icon-rotate-1 fs48"></span></button><div class="rotation-title transition">Rotate Left</div></div>';
                code += '<div class="rotation-btn-container right-btn transition"><div class="photo-thumb br50"><img src="images/tower-thumb.jpg" class="br50"></div><button class="' + config.rotationButtonClass + ' tower-rotation-right-button br50" data-anticlockwise="true"><span class="icon icon-rotate-2 fs48"></span></button><div class="rotation-title transition">Rotate Right</div></div>';
            }

            if (this._elements && this._elements.towerRotationContainer) {
                this._elements.towerRotationContainer.html(code);
            }
        },
        filterMenuContainer: function(data, rootdata) {
            var url = rootdata.baseUrl;
            var code = "<table><tr><td class='menu-header menu-icon transition go-back'><a><span class='icon icon-arrow_left'></span></a></td></tr>"; //href='#"+url+"'
            code += "</table>";
            this._elements.filterMenuContainer.html(code);
            this.filterMenuContainerEvents();
        },
        displayFilterCount: function(type, count) {
            var style = "";
            if (count <= 0) {
                style += "display:none;";
            }
            var code = "<div id='" + type + "-filter-count' class='filter-count' style='" + style + "'>" + count + "</div>";
            return code;
        },
        updateFilterCount: function() {
            var filterdata = this._model.getSelectedFiltersData();
            var filterExist = false;
            if (filterdata.bhk.length > 0) {
                filterExist = true;
                $('.bedroom-tick').addClass('active');
            } else {
                $('.bedroom-tick').removeClass('active');
            }
            if (filterdata.floor.length > 0) {
                filterExist = true;
                $('.floor-tick').addClass('active');
            } else {
                $('.floor-tick').removeClass('active');
            }
            if (filterdata.entrance.length > 0) {
                filterExist = true;
                $('#entrance-filter-count').show().html(filterdata.entrance.length);
            } else {
                $('#entrance-filter-count').hide();
            }
            if (filterdata.price.length > 0) {
                filterExist = true;
                $('.budget-tick').addClass('active');
            } else {
                $('.budget-tick').removeClass('active');
            }

            if (filterExist) {
                $('.reset-filter-button').removeClass('disabled');
            } else {
                $('.reset-filter-button').addClass('disabled');
            }
        },
        filterMenuContainerEvents: function() {
            var _this = this;
            _this._elements.filterMenuContainer.off('click').on('click', '.go-back', function(event) {
                // notify controller
                _this._goBackButtonClick.notify(this); // this refers to element here
            });
        },
        toggleFilterOption: function(element) {
            var index = $(element).data('index');
            var classList = element.classList;
            if ($.inArray(config.filters.selectedClass, classList) < 0) {
                $('#' + index).addClass(config.filters.selectedClass);
            } else {
                $('#' + index).removeClass(config.filters.selectedClass);
            }
        },
        resetFilterOption: function(element) {
            this._elements.bottomFilterContainer.find('*').removeClass(config.filters.selectedClass);
            this.updateFilterCount();
        },
        getBHKMenuOptions: function(data, bhkFiltersData) {
            var code = "<div class='options'><table><tr>";
            var bhks = this.getBHKAvailability(data.listings);
            var sortedBhks = Object.keys(bhks).sort();
            for (var i in sortedBhks) {
                var bhk = sortedBhks[i],
                    id = config.filters.bhk + i;
                var availabilityClass = "apt-available-border-color";
                if (bhks[bhk] === 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = bhk;
                if (bhkFiltersData && bhkFiltersData.length && bhkFiltersData.indexOf(parseFloat(checkForValue)) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<td class='option-item " + config.filters.bhk + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-value='" + bhk + "'><span>" + bhk + "</span>" + bhk + " BHK</td>";
            }
            code += "</tr></table></div>";
            return code;
        },
        getBHKAvailability: function(units) {
            var bhks = {};
            for (var i in units) {
                var unit = units[i];
                if (bhks[unit.bedrooms] === null) {
                    bhks[unit.bedrooms] = 0;
                }
                if (unit.isAvailable) {
                    bhks[unit.bedrooms]++;
                }
            }
            return bhks;
        },
        getFloorMenuOptions: function(data, floorFiltersData) {
            var code = "<div class='options'><table><tr>";
            var floors = this.getFloorAvailability(data.listings);
            var sortedFloors = Object.keys(floors).sort();
            for (var i in sortedFloors) {
                var floorGroup = sortedFloors[i],
                    id = config.filters.floor + i;
                var availabilityClass = "apt-available-border-color";
                if (floors[floorGroup].availability === 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = floors[floorGroup].sfloor + " " + floors[floorGroup].efloor;
                if (floorFiltersData && floorFiltersData.length && floorFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }
                var readableFloorGrp = floors[floorGroup].sfloor + " - " + floors[floorGroup].efloor + " Floor";
                code += "<td class='option-item " + config.filters.floor + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-svalue='" + floors[floorGroup].sfloor + "' data-evalue='" + floors[floorGroup].efloor + "'><span>" + readableFloorGrp + "</span></td>";
            }
            code += "</tr></table></div>";
            return code;
        },
        getFloorAvailability: function(units) {
            var floors = {};
            for (var i in units) {
                var unit = units[i];
                var groupInterval = utils.getGroupInterval(unit.floor, config.filters.floorInterval);
                var sfloor = groupInterval.start;
                var efloor = groupInterval.end - 1;
                var floorGroup = utils.addLeadingZeros(sfloor, 3) + " " + utils.addLeadingZeros(efloor, 3);
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
            var code = "<div class='options'><table><tr><td class='filter-title'>Entrance</td></tr>";
            var entrances = this.getEntranceAvailability(data.listings);
            var sortedEntrances = Object.keys(entrances).sort();
            for (var i in sortedEntrances) {
                var entrance = sortedEntrances[i],
                    id = config.filters.entrance + i;
                var availabilityClass = "apt-available-border-color";
                if (entrances[entrance] === 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = entrance;
                if (entranceFiltersData && entranceFiltersData.length && entranceFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }

                code += "<tr><td class='option-item " + config.filters.entrance + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-value='" + entrance + "'><span>" + entrance + "</span></td></tr>";
            }
            code += "</table></div>";
            return code;
        },
        getEntranceAvailability: function(units) {
            var entrances = {};
            for (var i in units) {
                var unit = units[i];
                if (entrances[unit.facing] === null) {
                    entrances[unit.facing] = 0;
                }
                if (unit.isAvailable) {
                    entrances[unit.facing]++;
                }
            }
            return entrances;
        },
        getPriceMenuOptions: function(data, priceFiltersData) {
            var code = "<div class='options'><table><tr>";
            var prices = this.getPriceAvailability(data.listings);
            var sortedPrices = Object.keys(prices).sort();
            for (var i in sortedPrices) {
                var price = sortedPrices[i],
                    id = config.filters.price + i;
                var availabilityClass = "apt-available-border-color";
                if (prices[price].availability === 0) {
                    availabilityClass = "apt-unavailable-border-color";
                }

                //check if value is preselected
                var checkForValue = prices[price].sprice + " " + prices[price].eprice;
                if (priceFiltersData && priceFiltersData.length && priceFiltersData.indexOf(checkForValue) > -1) {
                    availabilityClass += ' ' + config.filters.selectedClass;
                }
                var readablePriceGrp = utils.getReadablePriceInWord(prices[price].sprice) + ' - ' + utils.getReadablePriceInWord(prices[price].eprice);
                code += "<td class='option-item " + config.filters.price + " " + availabilityClass + "' ";
                code += "id='" + id + "' data-index='" + id + "' data-svalue='" + prices[price].sprice + "' data-evalue='" + prices[price].eprice + "'><span>" + readablePriceGrp + "</span></td>";
            }
            code += "</tr></table></div>";
            return code;
        },
        getPriceAvailability: function(units) {
            var prices = {};
            var interval = config.filters.priceInterval;
            for (var i in units) {
                var unit = units[i];
                var groupInterval = utils.getGroupInterval(unit.price, config.filters.priceInterval);
                var sPrice = groupInterval.start;
                var ePrice = groupInterval.end;
                var priceGroup = utils.addLeadingZeros(sPrice, 12) + ' ' + utils.addLeadingZeros(ePrice, 12);
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
        },
        minMapView: function(data) {
            if(!data){ return; }
            var currentRotationAngle = this._model.getCurrentRotationAngle();
            var towerMinimap = data.rotationAngle[currentRotationAngle].towerMinimapUrl;
            var img;
            if(towerMinimap){
                img = '<span class='+config.minMapToggleClass+'></span><img src="'+ towerMinimap +'" />';
                this._elements.minMapView.html(img);
                this.minMapEvents();
            }
        },
        minMapEvents: function(){
            var _this = this;
            _this._elements.minMapView.off('click').on('click', '.' + config.minMapToggleClass, function(event) {
                _this._minMapClicked.notify($(this).parent());
            });
        },
        minMapToggle: function(element) {
            $(element).toggleClass('hideMinMap');
        },
        helpContainer: function (data, rootdata) {
            var helpContainerCode = "<div class='help-info transition'><img src='images/help-screen-img.png' alt='' /></div>";
            this._elements.helpContainer.html(helpContainerCode);
            this.helpContainerEvents();
        },
        helpContainerEvents: function () {
            // write event here

        },
        bottomFilterContainer: function (data, rootdata) {
            var url = rootdata.baseUrl;
            var filterdata = this._model.getSelectedFiltersData();
            var bhkFiltersData = filterdata.bhk,
                floorFiltersData = filterdata.floor,
                entranceFiltersData = filterdata.entrance,
                priceFiltersData = filterdata.price,
                code = "";


            code += "<div class='tower-filter-wrap transition'><div class='filter-wrap transition unit-filter'>";

            code += "<div class='filter left-text transition'><div class=''><p>Filters</p></div></div>";
            code += "<div class='filter budget-filter-button transition'><div class='ico-wrap transition'><em></em><small class='budget-tick transition'><i class='icon icon-tick'></i></small></div><div></div><span>Budget</span></div>";
            code += "<div class='filter bedroom-filter-button transition'><div class='ico-wrap transition'><em></em><small class='bedroom-tick transition'><i class='icon icon-tick'></i></small></div><span>Bedroom</span></div>";
            code += "<div class='filter floor-filter-button transition'><div class='ico-wrap transition'><em></em><small class='floor-tick transition'><i class='icon icon-tick'></i></small></div><span>Floor</span></div>";
            code += "<div class='filter reset-filter-button transition'><div class='ico-wrap transition'><em></em></div><span>Reset</span></div>";
            code += "</div></div>";

            code += "<div class='after-filter-apply transition'>";
            code += "<div class='left'><div class='back-to-filter'><i class='icon icon-arrow_left'></i><span>Filters</span></div></div>";
            code += "<div class='center'><div class='filter-wrap'><div class='item'>";
            code += '<div class="tower-menu-container floor-filters-wrap" id="inside-tower-menu-container">';
// Code for floor options
            code +='<div class="floor-plan-filter">';
            code += this.getFloorMenuOptions(data, floorFiltersData);
            code += '</div>';
// Code for bhk options
            code +='<div class="bhk-plan-filter">';
            code += this.getBHKMenuOptions(data, bhkFiltersData);
            code += '</div>';
// Code for budget options
            code +='<div class="budget-plan-filter">';
            code +=  this.getPriceMenuOptions(data, priceFiltersData);
            code += '</div>';
            code += "</div></div></div></div>";
            code += "<div class='right'></div>";
            code += "</div>";

            $('.bottom-filter-wrapper').addClass('show-up');
            this._elements.bottomFilterContainer.html(code);
            this.bottomFilterContainerEvents();
            this.updateFilterCount();
        },
        bottomFilterContainerEvents: function () {
            var _this = this;
            $('.bottom-filter-wrapper').on('click', '.toggle-arrow', function (event) {
                // notify controller
                _this._bottomFilterToggle.notify(this); // this refers to element here

            });
            this._elements.bottomFilterContainer.on('click', '.back-to-filter', function (event) {
                // notify controller
                _this._backToFilter.notify(''); // this refers to element here

            });
            _this._elements.bottomFilterContainer.on('click', '.budget-filter-button div', function (event) {
                // notify controller
                _this._filterApply.notify('budget'); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.bedroom-filter-button div', function (event) {
                // notify controller
                _this._filterApply.notify('bedroom'); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.floor-filter-button div', function (event) {
                // notify controller
                _this._filterApply.notify('floor'); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.reset-filter-button:not(.disabled) div', function (event) {
                // notify controller
                _this._resetFiltersClick.notify(this); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.' + config.filters.floor, function(event) {
                // notify controller
                _this._floorFilterOptionClick.notify(this); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.' + config.filters.bhk, function(event) {
                // notify controller
                _this._bhkFilterOptionClick.notify(this); // this refers to element here
            });
            _this._elements.bottomFilterContainer.on('click', '.' + config.filters.price, function(event) {
                // notify controller
                _this._priceFilterOptionClick.notify(this); // this refers to element here
            });

        },
        bottomFilterToggle: function (element){
            if($('.bottom-filter-wrapper').hasClass('show-up')){
                $('.bottom-filter-wrapper').removeClass('show-up');
                $('.bottom-filter-wrapper').addClass('show-bottom');
            }else{
                $('.bottom-filter-wrapper').removeClass('show-bottom');
                $('.bottom-filter-wrapper').addClass('show-up');
            }
        },
        applyFilter: function (filter) {
            var _this = this;
            filter = filter;
            $('.bottom-filter-container .tower-filter-wrap').addClass('slide-out');
            $('.bottom-filter-container .after-filter-apply').addClass('slide-in');
            $('.filter-active').removeClass('filter-active');
            $('#inside-tower-menu-container').children().hide();
            switch (filter) {
                case 'budget' :
                {
                    $('.bottom-filter-container .tower-filter-wrap .budget-filter-button').addClass('filter-active');
                    $('.tower-menu-container .budget-plan-filter').show();
                    break;
                }
                case 'bedroom' :
                {
                    $('.bottom-filter-container .tower-filter-wrap .bedroom-filter-button').addClass('filter-active');
                    $('.tower-menu-container .bhk-plan-filter').show();
                    break;
                }
                case 'floor' :
                {
                    $('.bottom-filter-container .tower-filter-wrap .floor-filter-button').addClass('filter-active');
                    $('.tower-menu-container .floor-plan-filter').show();
                    break;
                }
                default : {
                }
            }
        },
        backToFilter : function () {
            $('.bottom-filter-container .tower-filter-wrap').removeClass('slide-out');
            $('.bottom-filter-container .after-filter-apply').removeClass('slide-in');
            console.log('No need to write any code on this click');
            //this.buildingSvgContainerEvents();
        }

    };

    return TowerselectedView;

})();
