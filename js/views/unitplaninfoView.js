/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var UnitplaninfoView = (function() {

    var containerMap = {
        'unitCloseContainer': '<div class="unit-close-container" id="' + config.closeUnitContainerId + '"></div>',
        'unitHeaderContainer': '<div class="unit-header-container" id="unit-header-container"></div>',
        'unitPriceContainer': '<div class="unit-price-container" id="unit-price-container"></div>',
        'unitMenuContainer': '<div class="unit-menu-container" id="unit-menu-container"></div>',
        'floorPlanMenuContainer': '<div class="floor-plan-menu-container fp-container fp2d-container fpwt-container ' + config.unitDataContainer + '" id="floor-plan-menu-container"></div>',
        'floorPlanContainer': '<div class="floor-plan-container fp-container ' + config.unitDataContainer + '" id="floor-plan-container"></div>',
        'floorPlan2dContainer': '<div class="floor-plan2d-container fp2d-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="floor-plan2d-container"></div>',
        'walkthroughContainer': '<div class="walkthrough-container fpwt-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="walkthrough-container"></div>',
        'unit3dSvgContainer': '<div class="fp-container ' + config.unitDataContainer + '"><svg class="svg-container unit-svg-container" id="unit-3d-svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg></div>',
        'unit2dSvgContainer': '<div class="' + config.hideClass + ' fp2d-container ' + config.unitDataContainer + '"><svg class="svg-container unit-svg-container" id="unit-2d-svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg></div>',
        'unitComponentDetailContainer': '<div class="tower-unit-detail-container fp-container fp2d-container ' + config.unitDataContainer + '" id="' + config.unitDetailContainerId + '"></div>',
        'clusterPlanContainer': '<div class="cluster-plan-container cp-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="cluster-plan-container"></div>',
        'priceBreakupContainer': '<div class="price-breakup-container pb-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="price-breakup-container"></div>',
        'specificationContainer': '<div class="specification-container sf-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="specification-container"></div>',
        'amenitiesContainer': '<div class="amenities-container fp-container ' + config.unitDataContainer + '" id="amenities-container"></div>',
        'unitViewTabs': '<div class="unit-view-tabs" id="unit-view-tabs"></div>',
        'termsConditionPopup': '<div class="terms-condition-popup ' + config.popupClass + '" id="terms-condition-popup" style="display:none;"></div>'
    };

    function getElements() {
        var elements = {
            'unitCloseContainer': $('#' + config.closeUnitContainerId),
            'unitHeaderContainer': $('#unit-header-container'),
            'unitPriceContainer': $('#unit-price-container'),
            'unitMenuContainer': $('#unit-menu-container'),
            'floorPlanMenuContainer': $('#floor-plan-menu-container'),
            'floorPlanContainer': $('#floor-plan-container'),
            'floorPlan2dContainer': $('#floor-plan2d-container'),
            'walkthroughContainer': $('#walkthrough-container'),
            'unit3dSvgContainer': $('#unit-3d-svg-container'),
            'unit2dSvgContainer': $('#unit-2d-svg-container'),
            'unitComponentDetailContainer': $('#' + config.unitDetailContainerId),
            'clusterPlanContainer': $('#cluster-plan-container'),
            'priceBreakupContainer': $('#price-breakup-container'),
            'specificationContainer': $('#specification-container'),
            'amenitiesContainer': $('#amenities-container'),
            'unitViewTabs': $('#unit-view-tabs'),
            'termsConditionPopup': $('#terms-condition-popup')
        };
        return elements;
    }

    function UnitplaninfoView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;

        this._unitCloseClick = new Event(this);
        this._unitComponentMouseEnter = new Event(this);
        this._unitComponentMouseLeave = new Event(this);
        this._unitMenuClick = new Event(this);
        this._sunlightMenuClick = new Event(this);
        this._floorPlanMenuClick = new Event(this);
        this._likeBoxClick = new Event(this);
        this._bookingClick = new Event(this);

        // Amenity Events
        this._amenityClick = new Event(this);
        this._amenityClose = new Event(this);

        //Selected floor view
        this._selectedFloor = 0;

    }

    UnitplaninfoView.prototype = {
        buildView: function(is2d) {
            var i, data = this._model.getData(),
                rotationdata = this._model.getRotationdata(),
                rootdata = this._model.getRootdata(),
                _this = this;
            this.initView(data, rotationdata, rootdata);
            this.buildSkeleton(Object.keys(containerMap));
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this._elements[i].empty();
                    this[i](data, rotationdata, rootdata, is2d);
                }
            }

            setTimeout(function() {
                _this.unitComponentMouseEnter({
                    element: $("#unit-3d-svg-container.svg-container.unit-svg-container polygon:first")[0],
                    event: null
                });
            }, 1000);
        },
        initView: function(data, rotationdata, rootdata) {
            if (!$('#' + config.selectedUnitContainerId).length) {
                $('.bottom-filter-wrapper').removeClass('show-up');
                $('.bottom-filter-wrapper').removeClass('show-bottom');

                $('#' + config.mainContainerId).append("<div class='selected-unit-container' id='" + config.selectedUnitContainerId + "'></div>");
                // Add resize event listener
                utils.addResizeEventListener(this.dynamicResizeContainers);
                window.getComputedStyle(document.getElementById(config.selectedUnitContainerId)).right; // jshint ignore:line
                $('#' + config.selectedUnitContainerId).animate({
                    right: 0
                }, 900);
                $('#' + config.svgContainerId).hide();

                $('#' + config.filterMenuContainerId).css({
                    left: '-65px'
                });
                $('#' + config.towerRotationContainerId).addClass(config.smallLeftArea);
                $('#' + config.towerRotationContainerId).find('.rotation-btn-container').hide();
                setTimeout(function() {
                    $('#' + config.towerRotationContainerId).find('.rotation-btn-container').show();
                    $('#' + config.svgContainerId).show();
                }, 900);


                // to show unit icon selected on tower
                viewUtils.removeSVGClass(data.unitIdentifier + "-selected-path", config.hideClass);

                // hide notification tool tip
                $('.' + config.notificationTooltipClass).hide();

                document.getElementById(config.projectDetail.towerId).innerHTML = (config.builderSetUp ? '':'<a href="#" onClick="return false;">') + rootdata.towers[data.towerIdentifier].longName + (config.builderSetUp ? '':'</a> &nbsp &gt');
                document.getElementById(config.projectDetail.unitId).innerHTML = data.unitIdentifier;
                this.renderInitialDataEvents();
            }
        },
        renderInitialDataEvents : function (){
            var _this = this;
            $('.' + config.projectDetail.towerId).off('click').on('click', function (event) {
                _this.destroyView();
                setTimeout(function() {
                    _this._unitCloseClick.notify();
                }, 1000);
            });
        },
        destroyView: function() {
            utils.dynamicResizeContainers(window.innerWidth);
            var width = window.innerWidth > config.imageResolution.width ? config.imageResolution.width : window.innerWidth;
            $('#' + config.towerRotationContainerId).css('width', width + config.imageResolution.unit);
            $('#' + config.selectedUnitContainerId).animate({
                right: '-67%'
            }, 900);
            $('#' + config.filterMenuContainerId).css({
                left: '0px',
                visibility: 'visible'
            });
            $('#' + config.towerRotationContainerId).removeClass(config.smallLeftArea);
            $('#' + config.towerRotationContainerId).find('.rotation-btn-container').hide();
            $('#' + config.svgContainerId).hide();

            // hide selected unit
            var svgElements = $('.' + config.towerUnitSvgSelectedClass);
            viewUtils.addSVGClassToElements(svgElements, config.hideClass);

            // show notification tool tip
            viewUtils.removeNotificationTooltip();
            $('.' + config.notificationTooltipClass).show();
            $('.bottom-filter-wrapper').removeClass('show-bottom');
            $('.bottom-filter-wrapper').addClass('show-up');
            $('.' + config.projectDetail.towerId).off('click');
        },
        dynamicResizeContainers: function() {
            var parentContainerHeight = (window.innerHeight > config.imageResolution.height ? config.imageResolution.height : window.innerHeight),
                parentContainerWidth = config.imageResolution.width / config.imageResolution.height * parentContainerHeight,
                parentContainerWidth = (parentContainerWidth > window.innerWidth ? window.innerWidth : parentContainerWidth),
                selectedUnitContainerWidth = parentContainerWidth * 0.6,
                towerContainerWidth = parentContainerWidth - selectedUnitContainerWidth,
                imageResolutionUnit = config.imageResolution.unit;
            $('#' + config.selectedUnitContainerId).css('width', selectedUnitContainerWidth + imageResolutionUnit);
            $('#' + config.towerRotationContainerId).css('width', towerContainerWidth + imageResolutionUnit);
            utils.dynamicResizeContainers(towerContainerWidth);
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '',
                data = this._model.getData(),
                _this = this;
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }

            $('#' + config.selectedUnitContainerId).html(htmlCode);
            this._elements = getElements();
        },
        unitViewTabs: function(data, rotationdata, rootdata) {
            var offerDiv = '';

            var htmlCode = offerDiv,
                link = rootdata.baseUrl + '/' + data.towerIdentifier + '/' + rotationdata.rotationAngle + '/' + data.unitIdentifier + '/booking';
            if (data.bookingStatus == 'Available' && rootdata.fairEnabled && !config.builderSetUp) {
                htmlCode += '<div class="book-now"><a  data-url="' + link + '">Book Now</a>';
                htmlCode += '<span><span class="icon icon-rupee fs10"></span>' + utils.getReadablePrice(data.bookingAmount) + '/- (No Cancellation Charges)</span>';
            }
            else if (data.bookingStatus == 'Available' && !rootdata.fairEnabled && !config.builderSetUp) {
                htmlCode += '<div class="book-now"><a  data-url="' + link + '">Proceed</a>';
            }
            else if(!config.builderSetUp) {
                htmlCode += '<div class="book-now fade-image"><a>Sold out</a>';
            }
            htmlCode += '</div>';

            this._elements.unitViewTabs.html(htmlCode);
            this.unitViewTabsEvents();
        },
        unitViewTabsEvents: function() {
            var _this = this;
            $('#' + config.selectedUnitContainerId).off('click').on('click', '.like-box', function() {
                _this._likeBoxClick.notify(this); //this refers to element
                if ($(this).hasClass('selected')) { //this refers to element
                    viewUtils.flyToShortlist(this); //this refers to element
                }

            });
            $('#' + config.selectedUnitContainerId).on('click', '.book-now a', function() {
                _this._bookingClick.notify(this); //this refers to element
            });
        },

        unitCloseContainer: function(data, rotationdata, rootdata) {
            var code = '<span class="icon icon-cross fs20"></span>';
            this._elements.unitCloseContainer.html(code);
            this.unitCloseContainerEvents();
        },

        unitHeaderContainer: function(data, rotationdata, rootdata) {
            var selectedClass = data.shortListed ? 'selected' : '';
            var code = "<div class='header-item header-title'> " +
                "<span>" + data.bedrooms + "BHK Apartment</span> " +
                "- <span>" + utils.getReadablePrice(data.size) + " " + data.measure + "</span> " +
                "<div class='floor-info'><span class='address'>" + data.listingAddress + "</span> <span>(" + data.floor + " Floor)</span></div></div>";
                code += '<div class="like-box ' + selectedClass + ' ' + data.unitUniqueIdentifier + '-like-box">';
                code += '<a><span class="icon icon-heart-1 heart-clone"></span><p class="click-txt"></p><p class="shortlisted" style="display:none;"></p></a></div>';
            this._elements.unitHeaderContainer.html(code);
        },

        unitPriceContainer: function(data, rotationdata, rootdata) {
            var code =  "<div class='price-wrap'><div class='unit-price fleft'>";

                var price = utils.getReadablePriceInWord(data.price),
                    discountedPrice = utils.getReadablePriceInWord(data.price - data.discount);

                if(!config.builderSetUp){
                    code += "<span class='big-size'><span class='icon icon-rupee fs16'></span> " + discountedPrice + "</span>";
                    if (price != discountedPrice) {
                        code += "<span class='total-amount'><span class='icon icon-rupee'></span>" + price + "</span>";
                    }
                }

                code += "</div>";
                if (!config.builderSetUp && data.discountDescription && data.discountDescription !== "") {
                    code += '<div class="special-offers"><span><i class="icon icon-gift"></i> Deal</span> <p>' + data.discountDescription + '</p></div>';
                }
                code += "</div>";
            this._elements.unitPriceContainer.html(code);
        },

        unitCloseContainerEvents: function() {
            var _this = this;
            _this._elements.unitCloseContainer.off('click').on('click', function(event) {
                // notify controller
                _this.destroyView();
                setTimeout(function() {
                    _this._unitCloseClick.notify();
                }, 1000);
            });
        },
        unitMenuContainer: function(data, rotationdata, rootdata) {
            var code = "<div class='uit-header-menu'><div data-target='fp-container' data-menu='unitPlanMenu' class='header-item " + config.unitMenuLinkClass + " " + config.selectedClass + "'>Unit Plan</div>" +
                "<div data-target='cp-container' data-menu='floorPlanMenu' class='header-item " + config.unitMenuLinkClass + "'>Floor Plan</div>";
                if(rootdata.fairEnabled && !config.builderSetUp) {
                  code += "<div data-target='pb-container' data-menu='unitPricingMenu' class='header-item " + config.unitMenuLinkClass + "'>Pricing</div>";
                }
                code += "<div data-target='sf-container' data-menu='unitAmenitiesMenu' class='header-item " + config.unitMenuLinkClass + "'>Amenities</div></div></div></div>";
            this._elements.unitMenuContainer.html(code);
            this.unitMenuContainerEvents();
        },
        unitMenuContainerEvents: function() {
            var _this = this;
            _this._elements.unitMenuContainer.off('click').on('click', '.' + config.unitMenuLinkClass, function(event) {
                // notify controller
                _this._unitMenuClick.notify(this); // this refers to element here
            });
        },
        floorPlanContainer: function(data, rotationdata, rootdata) {
            var unitTypeIdentifierArr = rotationdata.unitTypeIdentifierArr;
            var unitTypeData = rootdata.unitTypes[unitTypeIdentifierArr[this._selectedFloor]];
            var _this = this;
            var isActive = function(floor) {
                if (floor == _this._selectedFloor) {
                    return "active";
                } else {
                    return "";
                }
            };
            var unitTypeDataArr = [];
            for (var i = 0; i < unitTypeIdentifierArr.length; i++) {
                unitTypeDataArr[i] = rootdata.unitTypes[rotationdata.unitTypeIdentifierArr[i]];
            }
            var isDuplex = (unitTypeIdentifierArr && unitTypeIdentifierArr.length && unitTypeIdentifierArr.length == 2) ? true : false;
            var imageUrl = unitTypeData.unitImageUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            if (unitTypeData.morningSunlightImageUrl) {
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " mor-image' src='" + unitTypeData.morningSunlightImageUrl + "'>";
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " aft-image' src='" + unitTypeData.afternoonSunlightImageUrl + "'>";
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " eve-image' src='" + unitTypeData.eveningSunlightImageUrl + "'>";

                code += "<div class='sunlight-menu'>";
                code += "<div data-target='mor-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-cloudsun-o opaque'></span><span class='icon-cloudsun-fill filled'>";
                code += "<span class='path1'></span><span class='path2'></span><span class='path3'></span><span class='path4'></span><span class='path5'></span></span><label>Morning</label></div>";
                code += "<div data-target='aft-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-sun-o opaque'></span><span class='icon-sun-fill filled'>";
                code += "<span class='path1'></span><span class='path2'></span><span class='path3'></span><span class='path4'></span></span><label>Noon</label></div>";
                code += "<div data-target='eve-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-cloudmoon-o opaque'></span><span class='icon-cloudmoon-fill filled'>";
                code += "<span class='path1'></span><span class='path2'></span><span class='path3'></span><span class='path4'></span><span class='path5'></span></span><label>Evening</label></div></div>";

            }
            if (isDuplex) {
                code += "<div class='duplexBox'><h4>Duplex</h4>";
                code += "<ul>";
                code += "<li class='" + isActive(1) + "'><span>Upper</span><div class='thumb' data-floor='1'><img class='minmap' src='" + unitTypeDataArr[1].unitImageUrl + "'></div></li>";
                code += "<li class='" + isActive(0) + "'><span>Lower</span><div class='thumb' data-floor='0'><img class='minmap' src='" + unitTypeDataArr[0].unitImageUrl + "'></div></li>";
                code += "</ul></div>";
            }
            this._elements.floorPlanContainer.html(code);
            this.floorPlanContainerEvents();
        },
        floorPlanContainerEvents: function() {
            var _this = this;
            _this._elements.floorPlanContainer.off('click').on('click', '.' + config.sunlightMenuOptionClass, function(event) {
                // notify controller
                _this._sunlightMenuClick.notify(this); // this refers to element here
            });
            _this._elements.floorPlanContainer.on('click', '.thumb', function(event) {
                _this._selectedFloor = $(this).data('floor');
                _this.buildView();
            });
        },
        floorPlanMenuContainer: function(data, rotationdata, rootdata) {
            var code = "<div class='floor-plan-menu' cellpadding='0' cellspacind='0' border='0'><div>";
            code += "<div data-target='fp-container' data-menu='3d-button' class='" + config.floorPlanMenuOptionClass + " " + config.selectedClass + " " + config.transitionClass + "' ><span id='floor-plan'>3D</span></div>";
            if(data.walkthrough.video) {
                code += "<div data-target='fpwt-container' data-menu='walkthrough-button' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + " right'><span  id='walkthrough'>Video Tour</span></div>";
            }
            code += "<div data-target='fp2d-container' data-menu='2d-button' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + "'><span  id='floor-plan2d'>2D</span></div>";
            code += "</div></div>";
            this._elements.floorPlanMenuContainer.html(code);
            this.floorPlanMenuContainerEvents();
        },
        floorPlanMenuContainerEvents: function() {
            var _this = this;
            _this._elements.floorPlanMenuContainer.off('click').on('click', '.' + config.floorPlanMenuOptionClass, function(event) {
                // notify controller
                _this._floorPlanMenuClick.notify(this); // this refers to element here
            });
        },
        floorPlan2dContainer: function(data, rotationdata, rootdata, is2d) {
            var unitTypeIdentifierArr = rotationdata.unitTypeIdentifierArr;
            var _this = this;
            var isActive = function(floor) {
                if (floor == _this._selectedFloor) {
                    return "active";
                } else {
                    return "";
                }
            };
            var unitTypeDataArr = [];
            for (var i = 0; i < unitTypeIdentifierArr.length; i++) {
                unitTypeDataArr[i] = rootdata.unitTypes[rotationdata.unitTypeIdentifierArr[i]];
            }
            var isDuplex = (unitTypeIdentifierArr && unitTypeIdentifierArr.length && unitTypeIdentifierArr.length == 2) ? true : false;

            var imageUrl = rootdata.unitTypes[unitTypeIdentifierArr[this._selectedFloor]].unitImage2dUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            if (isDuplex) {
                code += "<div class='duplexBox'><h4>Duplex</h4>";
                code += "<ul>";
                code += "<li class='" + isActive(1) + "'><span>Upper</span><div class='thumb' data-floor='1'><img class='minmap' src='" + unitTypeDataArr[1].unitImageUrl + "'></div></li>";
                code += "<li class='" + isActive(0) + "'><span>Lower</span><div class='thumb' data-floor='0'><img class='minmap' src='" + unitTypeDataArr[0].unitImageUrl + "'></div></li>";
                code += "</ul></div>";
            }
            this._elements.floorPlan2dContainer.html(code);
            this.floorPlan2dContainerEvents(data, rotationdata, rootdata);
            if (is2d) {
                $("#floor-plan2d").trigger('click');
            }
        },
        floorPlan2dContainerEvents: function(data, rotationdata, rootdata) {
            var _this = this;
            _this._elements.floorPlan2dContainer.off('click').on('click', '.thumb', function(event) {
                _this._selectedFloor = $(this).data('floor');
                _this.buildView(true);
            });
        },
        walkthroughContainer: function(data, rotationdata, rootdata) {
            var videoUrl = data.walkthrough.video;
            var imageUrl = data.walkthrough.image;
            var code = "<video controls poster='" + imageUrl + "' class='" + config.videoClass + "'>";
            code += "<source src='" + videoUrl + "' type='video/mp4'>";
            code += "</video>";
            this._elements.walkthroughContainer.html(code);
        },
        unit3dSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(this._selectedFloor),
                svgElements = viewUtils.getUnit3dSvgPolygonElements(unitTypeData);

            if (svgElements && svgElements.length) {
                for (var i = 0; i < svgElements.length; i++) {
                    this._elements.unit3dSvgContainer.append(svgElements[i]);
                }
                this.unit3dSvgContainerEvents();
            }

        },
        unit3dSvgContainerEvents: function() {
            var _this = this;
            this._elements.unit3dSvgContainer.off('mousemove').on('mousemove', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.unit3dSvgContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseLeave.notify({
                    element: this,
                    event: event
                });
            });
        },
        unit2dSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(this._selectedFloor),
                svgData = unitTypeData.svgs,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var eachPolygon = '',
                attrs;
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                attrs = {
                    'id': utils.getIdentifier('comp-' + svgObj.name),
                    'class': config.transitionClass,
                    'data-name': svgObj.name,
                    'data-type': svgObj.type,
                    'data-details': svgObj.details,
                    points: svgObj.svg2dPath
                };
                eachPolygon = viewUtils.makeSVG('polygon', attrs);
                this._elements.unit2dSvgContainer.append(eachPolygon);
            }

            this.unit2dSvgContainerEvents();
        },
        unit2dSvgContainerEvents: function() {
            var _this = this;
            this._elements.unit2dSvgContainer.off('mousemove').on('mousemove', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.unit2dSvgContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseLeave.notify({
                    element: this,
                    event: event
                });
            });
        },
        unitComponentMouseEnter: function(params) {
            var hoveredComps = $("#unit-3d-svg-container.svg-container.unit-svg-container .hover");
            viewUtils.removeSVGClasses(hoveredComps, 'hover');
            viewUtils.addSVGClass(params.element.id, 'hover');
            if (this._elements && this._elements.unitComponentDetailContainer) {
                var pointX = $(params.element).attr('points').split(' ')[0];
                var pointY = $(params.element).attr('points').split(' ')[1];
                params.pointX = pointX;
                params.pointY = pointY;
                viewUtils.unitComponentMouseEnter(params, this._elements.unitComponentDetailContainer);
            }
        },
        unitComponentMouseLeave: function(params) {
            viewUtils.removeSVGClass(params.element.id, 'hover');
            document.getElementById(config.unitDetailContainerId).innerHTML = '';
        },
        amenitiesContainer: function(data, rotationdata, rootdata) {
            var unitTypeData = this._model.getUnitTypeData(this._selectedFloor),
                svgData = unitTypeData ? unitTypeData.linkSvgs : null;

            var code = '';
            for (var svgId in svgData) {
                var svgObj = svgData[svgId];
                var point = svgObj.svgPath.split(' ');
                var position = "top:" + point[1] + "%; left:" + point[0] + "%;";
                var hoverImageClass = '';
                if(point[0] > 80){
                    hoverImageClass += 'fixed-image-right';
                }
                code += "<div id='" + svgId + "' data-top='" + point[1] + "' data-left='" + point[0] + "' class='" + config.amenityIconClass + "' style='" + position + "'><span class='icon icon-location'></span>";
                code += "<div class='name " + hoverImageClass+"'><img class='amenity-img' src=" + svgObj.details + "><span>" + svgObj.name + "</span></div>";
                code += "</div>";
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
            var rotationdata = this._model.getRotationdata(),
                rootdata = this._model.getRootdata(),
                unitTypeIdentifier = rotationdata.unitTypeIdentifier,
                unitType = rootdata.unitTypes[unitTypeIdentifier],
                amenityId = element.id,
                amenity = unitType.linkSvgs[amenityId],
                amenityImg = amenity.details;

            //changed by jaswant for image pop up animation
            var position = "top:" + element.dataset.top + "%; left:" + element.dataset.left + "%;";
            var code = "<div class='" + config.amenityPopupClass + "'><table class='photo-table pop-up-in' style='" + position + "'><tr>";
            code += "<td class='amenity-heading'>" + amenity.name;
            code += "<span class='icon icon-cross fs14 " + config.amenityPopupCloseClass + "'></span></td></tr>";
            code += "<tr><td class='amenity-image'><div><img src='" + amenityImg + "'></div></td></tr></table>";
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
        clusterPlanContainer: function(data, rotationdata, rootdata) {
            var unitTypeIdentifierArr = rotationdata.unitTypeIdentifierArr;
            var imageUrl = rootdata.unitTypes[unitTypeIdentifierArr[this._selectedFloor]].clusterplanImageUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            this._elements.clusterPlanContainer.html(code);
        },
        priceBreakupContainer: function(data, rotationdata, rootdata) {
            var code = viewUtils.getPriceBreakupHtml(data, rotationdata, rootdata, true);
            this._elements.priceBreakupContainer.html(code);
            this.priceBreakupContainerEvents();
        },
        priceBreakupContainerEvents: function() {
            var _this = this;
            _this._elements.priceBreakupContainer.off('click').on('click', '.pricebreakup-tabs li', function() {
                var type = $(this).data('type');
                $('.pricebreakup-tabs li').removeClass('active');
                $(this).addClass('active');

                $('.unit-content-wrapper  .pricebreakup-tabs-content').addClass(config.hideClass);
                $('.unit-content-wrapper  .pricebreakup-tabs-content.' + type).removeClass(config.hideClass);
            });
            _this._elements.priceBreakupContainer.on('click', '.price-terms', function() {
                $('#' + config.termsConditionPopupId).show();
            });
            _this._elements.priceBreakupContainer.on('click', '.' + config.optionalPriceClass, function() {
                viewUtils.updateTotalPrice(_this._model.getData());
            });
        },
        getAmenityClass: function(rootdata, key) {
            var ameneties = Object.keys(rootdata.projectAmeneties);
            if (ameneties.indexOf(key) > -1) {
                return '';
            } else {
                return 'class="disable"';
            }
        },
        specificationContainer: function(data, rotationdata, rootdata) {
            var code = '<div class="unit-content-wrapper">' +
                '<div class="project-amenities specification-tabs-content" ><h3>Amenities</h3>' +
                '<ul>' +
                '<li ' + this.getAmenityClass(rootdata, 'Gym') + '>'+ viewUtils.getAmenitiesIconHtml("Gymnasium","gym") +'<label>Gymnasium</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Swi') + '> '+ viewUtils.getAmenitiesIconHtml("Swimming Pool","swimming") +'<label>Swimming Pool</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Clu') + '>'+ viewUtils.getAmenitiesIconHtml("Club House","clubhouse") +'<label>Club House</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Int') + '>'+ viewUtils.getAmenitiesIconHtml("Intercom","intercom") +'<label>Intercom</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Sec') + '>'+ viewUtils.getAmenitiesIconHtml("24X7 Security","security") +'<label>24 X 7 Security</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Pow') + '>'+ viewUtils.getAmenitiesIconHtml("Power Backup","powerbackup-1") +'<label>Power Backup</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Lan') + '>'+ viewUtils.getAmenitiesIconHtml("Garden View","garden") +'<label>Landscaped Gardens</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Car') + '>'+ viewUtils.getAmenitiesIconHtml("Car Parking","parking") +'<label>Ample Parking Space</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Chi') + '>'+ viewUtils.getAmenitiesIconHtml("Kids Play","playarea") +'<label>Children Play area</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Jog') + '>'+ viewUtils.getAmenitiesIconHtml("Jogging","jogging") +'<label>Jogging Track</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Rai') + '>'+ viewUtils.getAmenitiesIconHtml("Rain Water Harvesting","harvesting") +'<label>Rain Water Harvesting</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Caf') + '>'+ viewUtils.getAmenitiesIconHtml("Cafeteria","cafe") +'<label>Cafeteria</label></li>' +
                '</ul>' +
                '<div class="clear-fix"></div></div>';
            code += "<h3>Specifications</h3><table class='base-table specification-tabs-content specifications'>";
            for (var category in rootdata.specifications) {
                if (rootdata.specifications.hasOwnProperty(category)) {
                    var items = rootdata.specifications[category];
                    code += "<tr><td></td></tr><tr><td class='heading'>" + category + "</td></tr>";
                    if (typeof items == "object") {
                        for (var subCategory in items) {
                            code += "<tr><td>" + subCategory + ": " + items[subCategory] + "</td></tr>";
                        }
                    } else {
                        code += "<tr><td>" + items + "</td></tr>";
                    }
                }
            }
            code += "</table></div>";
            this._elements.specificationContainer.html(code);
            this.specificationContainerEvents();
        },
        specificationContainerEvents: function() {

            this._elements.specificationContainer.off('click').on('click', '.specification-tabs li', function() {
                var type = $(this).data('type');
                $('.specification-tabs li').removeClass('active');
                $(this).addClass('active');

                $('.unit-content-wrapper  .specification-tabs-content').addClass(config.hideClass);
                $('.unit-content-wrapper  .specification-tabs-content.' + type).removeClass(config.hideClass);
            });
        },
        selectUnitMenuOption: function(element, optionClass, containerClass) {
            // select unit menu option
            this.selectMenuOption(element, optionClass, containerClass);
            // reset floor plan menu option
            this.selectMenuOptionUI(document.getElementById('floor-plan'), config.floorPlanMenuOptionClass);
            this.selectMenuOption(null, config.sunlightMenuOptionClass, config.sunlightImageClass);
        },
        selectMenuOption: function(element, optionClass, containerClass, toggle) {
            var isSelected = $(element).hasClass(config.selectedClass);
            this.selectMenuOptionUI(element, optionClass);
            $('.' + containerClass).addClass(config.hideClass);

            if (toggle && isSelected) {
                $('.' + optionClass).removeClass(config.selectedClass);
            } else if (element) {
                var target = $(element).data('target');
                $('.' + target).removeClass(config.hideClass);
            }
        },
        selectMenuOptionUI: function(element, optionClass) {
            $('.' + optionClass).removeClass(config.selectedClass);
            if (element) {
                element.setAttribute('class', element.classList + " " + config.selectedClass);
            }
        },
        termsConditionPopup: function(data, rotationdata, rootdata) {
            var code ='<div class="tc-container"><h3>Terms &amp; Conditions</h3>'+
                '<a class="close-payment"><span class="icon icon-cross fs22"></span></a>' +
                '<div class="terms-and-conditions">'+
                viewUtils.getTermsConditionsHtml(data, rootdata) +
                '</div></div>';
            this._elements.termsConditionPopup.html(code);
            this.termsConditionPopupEvents();
        },
        termsConditionPopupEvents: function() {
            var _this = this;

            _this._elements.termsConditionPopup.off('click').on('click', '.close-payment', function(event) {
                $('#' + config.termsConditionPopupId).hide();
            });
        }
    };

    return UnitplaninfoView;

})();
