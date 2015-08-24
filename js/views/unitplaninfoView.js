/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var UnitplaninfoView = (function() {

    var containerMap = {
        'unitCloseContainer': '<div class="unit-close-container" id="' + config.closeUnitContainerId + '"></div>',
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
        'termsConditionPopup': '<div class="terms-condition-popup" id="terms-condition-popup" style="display:none;"></div>'
    };

    function getElements() {
        var elements = {
            'unitCloseContainer': $('#' + config.closeUnitContainerId),
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
    }

    UnitplaninfoView.prototype = {
        buildView: function() {
            var i, data = this._model.getData(),
                rotationdata = this._model.getRotationdata(),
                rootdata = this._model.getRootdata(),
                _this = this;
            this.initView(data, rotationdata, rootdata);
            this.buildSkeleton(Object.keys(containerMap));
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this._elements[i].empty();
                    this[i](data, rotationdata, rootdata);
                }
            }

            var firstComp = $("#unit-3d-svg-container.svg-container.unit-svg-container").children("polygon:first")[0];
            setTimeout(function() {
            utils.addSVGClass(firstComp.id,'hover');
            _this.unitComponentMouseEnter({
                    element: firstComp,
                    event: null
                });
            }, 1000);
        },
        initView: function(data, rotationdata, rootdata) {
            if (!$('#' + config.selectedUnitContainerId).length) {
                $('#' + config.mainContainerId).append("<div class='selected-unit-container' id='" + config.selectedUnitContainerId + "'></div>");
                // Add resize event listener
                utils.addResizeEventListener(this.dynamicResizeContainers);
                window.getComputedStyle(document.getElementById(config.selectedUnitContainerId)).right; // jshint ignore:line
                $('#' + config.selectedUnitContainerId).animate({
                    right: 0
                }, 900);
                $('#' + config.filterMenuContainerId).css({
                    left: '-65px'
                });
                $('#' + config.towerRotationContainerId).addClass(config.smallLeftArea);

                // to show unit icon selected on tower
                utils.removeSVGClass(data.unitIdentifier + "-selected-path", config.hideClass);

                // hide notification tool tip
                $('.' + config.notificationTooltipClass).hide();
            }
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

            // hide selected unit
            var svgElements = $('.' + config.towerUnitSvgSelectedClass);
            utils.addSVGClassToElements(svgElements, config.hideClass);

            // show notification tool tip
            utils.removeNotificationTooltip();
            $('.' + config.notificationTooltipClass).show();
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

            if (data.discount) {
                offerDiv = '<div class="special-offers">' + '<span></span>' + '<p>Save <strong><label class="icon fs14 icon-rupee"></label>' + utils.getReadablePrice(data.discount) + '</strong> ' + data.discountDescription + '</p>' + '</div>';
            }

            var htmlCode = offerDiv,
                selectedClass = data.shortListed ? 'selected' : '',
                link = rootdata.baseUrl + '/' + data.towerIdentifier + '/' + rotationdata.rotationAngle + '/' + data.unitIdentifier + '/booking';

            htmlCode += '<div class="like-box ' + selectedClass + ' ' + data.unitUniqueIdentifier + '-like-box">';
            htmlCode += '<a><span class="icon icon-heart fs26 heart-clone"><label></label></span><p class="transition click-txt"></p><p class="shortlisted" style="display:none;"></p></a></div>';
            htmlCode += '<div class="book-now"><a  data-url="' + link + '">Book now</a><span><span class="icon icon-rupee fs10"></span>' + utils.getReadablePrice(data.bookingAmount) + '/- <br>(No Cancellation Charges)</span>';
            htmlCode += '</div>';

            this._elements.unitViewTabs.html(htmlCode);
            this.unitViewTabsEvents();
        },
        unitViewTabsEvents: function() {
            var _this = this;
            $('#' + config.selectedUnitContainerId).off('click').on('click', '.like-box', function() {
                _this._likeBoxClick.notify(this); //this refers to element
				if($(this).hasClass('selected')){//this refers to element
					utils.flyToShortlist(this); //this refers to element
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
            var code = "<div class='unit-header'><div class='unit-header-container'><div class='header-item header-title'> " +
                "<span class='address'>" + data.listingAddress + "</span> " +
                "&nbsp;&nbsp;<span>" + data.bedrooms + "BHK</span> " +
                ", <span>" + data.size + " " + data.measure + "</span> " +
                ", <span>Floor " + data.floor + "</span> " +
                "<span class='fright big-size'><span class='icon icon-rupee fs16'></span> " + utils.getReadablePriceInWord(data.price - data.discount) + "</span>" +
                "<span class='total-amount fright'><span class='icon icon-rupee'></span>" + utils.getReadablePriceInWord(data.price) + "</span></div>" +
                "<div class='uit-header-menu'><div data-target='fp-container' class='header-item " + config.unitMenuLinkClass + " " + config.selectedClass + "'><div class='item-icon-box'><span class='icon icon-unitplan fs18'></span></div>Unit Plan</div>" +
                "<div data-target='cp-container' class='header-item " + config.unitMenuLinkClass + "'><div class='item-icon-box'><span class='icon icon-clusterplan fs18'></span></div>Floor Plan</div>" +
                "<div data-target='pb-container' class='header-item " + config.unitMenuLinkClass + "'><div class='item-icon-box'><span class='icon icon-rupee fs18'></span></div>Pricing</div>" +
                "<div data-target='sf-container' class='header-item " + config.unitMenuLinkClass + " right'><div class='item-icon-box'><span class='icon icon-specification fs18'></span></div>Amenities</div></div></div></div>";
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
            var unitTypeData = rootdata.unitTypes[rotationdata.unitTypeIdentifier];
            var imageUrl = unitTypeData.unitImageUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";

            if (unitTypeData.morningSunlightImageUrl) {
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " mor-image' src='" + unitTypeData.morningSunlightImageUrl + "'>"; 
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " aft-image' src='" + unitTypeData.afternoonSunlightImageUrl + "'>"; 
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " eve-image' src='" + unitTypeData.eveningSunlightImageUrl + "'>"; 

                code += "<div class='sunlight-menu'>";
                code += "<div data-target='mor-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-morning fs16'></span><label>Morning View</label></div>";
                code += "<div data-target='aft-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-afternoon fs16'></span><label>Noon View</label></div>";
                code += "<div data-target='eve-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-night fs16'></span><label>Evening View</label></div></div>";
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
        },
        floorPlanMenuContainer: function(data, rotationdata, rootdata) {
            var code = "<table class='floor-plan-menu' cellpadding='0' cellspacind='0' border='0'><tr>";
            code += "<td data-target='fp2d-container' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + "' id='floor-plan2d'>2D</td>";
            code += "<td data-target='fp-container' class='" + config.floorPlanMenuOptionClass + " " + config.selectedClass + " " + config.transitionClass + "' id='floor-plan'>3D</td>";
            code += "<td data-target='fpwt-container' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + " right' id='walkthrough'>Video Tour</td>";
            code += "</tr></table>";
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
        floorPlan2dContainer: function(data, rotationdata, rootdata) {
            var imageUrl = rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImage2dUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            this._elements.floorPlan2dContainer.html(code);
        },
        walkthroughContainer: function(data, rotationdata, rootdata) {
            var videoUrl = data.walkthrough.video;
            var imageUrl = data.walkthrough.image;
            var code = "<video controls poster='" + imageUrl + "'>";
            code += "<source src='" + videoUrl + "' type='video/mp4'>";
            code += "</video>";
            this._elements.walkthroughContainer.html(code);
        },
        unit3dSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(),
                svgElements = utils.getUnit3dSvgPolygonElements(unitTypeData);

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
            var unitTypeData = this._model.getUnitTypeData(),
                svgData = unitTypeData.svgs,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var eachPolygon = '',
                attrs;
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                attrs = {
                    'class': config.transitionClass,
                    'data-name': svgObj.name,
                    'data-type': svgObj.type,
                    'data-details': svgObj.details,
                    points: svgObj.svg2dPath
                };
                eachPolygon = utils.makeSVG('polygon', attrs);
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
            var defaultComp = $("#unit-3d-svg-container.svg-container.unit-svg-container").children("polygon:first")[0];
            utils.removeSVGClass(defaultComp.id,'hover');
            utils.addSVGClass(params.element.id, 'hover');
            if (this._elements && this._elements.unitComponentDetailContainer) {
                var pointX = $(params.element).attr('points').split(' ')[0];
                var pointY = $(params.element).attr('points').split(' ')[1];
                params.pointX = pointX;
                params.pointY = pointY;
                utils.unitComponentMouseEnter(params, this._elements.unitComponentDetailContainer);
            }
        },
        unitComponentMouseLeave: function(params) {
            utils.removeSVGClass(params.element.id, 'hover');
            document.getElementById(config.unitDetailContainerId).innerHTML = '';
        },
        amenitiesContainer: function(data, rotationdata, rootdata) {
            var unitTypeData = this._model.getUnitTypeData(),
                svgData = unitTypeData ? unitTypeData.linkSvgs : null;

            var code = '';
            for (var svgId in svgData) {
                var svgObj = svgData[svgId];
                var point = svgObj.svgPath.split(' ');
                var position = "top:" + point[1] + "%; left:" + point[0] + "%;";
                code += "<div id='" + svgId + "' data-top='" + point[1] + "' data-left='" + point[0] + "' class='" + config.amenityIconClass + "' style='" + position + "'><span class='icon icon-location'></span>";
                code += "<div class='name'><span>" + svgObj.name + "</span></div>";
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
            var imageUrl = rootdata.unitTypes[rotationdata.unitTypeIdentifier].clusterplanImageUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            this._elements.clusterPlanContainer.html(code);
        },
        priceBreakupContainer: function(data, rotationdata, rootdata) {
            var code = utils.getPriceBreakupHtml(data, rotationdata, rootdata, true);
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
                utils.updateTotalPrice(_this._model.getData());
            });
        },
        getAmenityClass: function(rootdata, key) {
            var ameneties = Object.keys(rootdata.projectAmeneties);
            if (ameneties.indexOf(key) > -1) {
                return 'class="disable"';
            } else {
                return '';
            }
        },
        specificationContainer: function(data, rotationdata, rootdata) {
            var code = '<ul class="specification-tabs">' +
                '<li class="active" data-type="project-amenities">Amenities</li>' +
                '<li data-type="specifications">Specification</li>' +
                '</ul><div class="unit-content-wrapper">' +
                '<div class="project-amenities specification-tabs-content" >' +
                '<ul>' +
                '<li ' + this.getAmenityClass(rootdata, 'Gym') + '><span class="icon icon-gym"></span><label>Gymnasium</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Swi') + '><span class="icon icon-swimming"></span><label>Swimming Pool</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Clu') + '><span class="icon icon-clubhouse"></span><label>Club House</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Int') + '><span class="icon icon-intercom"></span><label>Intercom</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Sec') + '><span class="icon icon-security"></span><label>24 X 7 Security</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Pow') + '><span class="icon icon-powerbackup-1"></span><label>Power Backup</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Lan') + '><span class="icon icon-garden"></span><label>Landscaped Gardens</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Car') + '><span class="icon icon-parking"></span><label>Ample Parking Space</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Chi') + '><span class="icon icon-playarea"></span><label>Children Play area</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Jog') + '><span class="icon icon-jogging"></span><label>Jogging Track</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Rai') + '><span class="icon icon-harvesting"></span><label>Rain Water Harvesting</label></li>' +
                '<li ' + this.getAmenityClass(rootdata, 'Caf') + '><span class="icon icon-cafe"></span><label>Cafeteria</label></li>' +
                '</ul>' +
                '<div class="clear-fix"></div></div>';
            code += "<table class='base-table " + config.hideClass + " specification-tabs-content specifications'>";
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
            var code = '<div class="tc-container">' +
                '<a class="close-payment"><span class="icon icon-cross fs24"></span></a>' +
                utils.getTermsConditionsHtml(data, rootdata) +
                '</div>';
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