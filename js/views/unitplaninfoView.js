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
        'unitComponentDetailContainer': '<div class="tower-unit-detail-container fp-container ' + config.unitDataContainer + '" id="' + config.unitDetailContainerId + '"></div>',
        'clusterPlanContainer': '<div class="cluster-plan-container cp-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="cluster-plan-container"></div>',
        'priceBreakupContainer': '<div class="price-breakup-container pb-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="price-breakup-container"></div>',
        'specificationContainer': '<div class="specification-container sf-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="specification-container"></div>',
        'amenitiesContainer': '<div class="amenities-container fp-container ' + config.unitDataContainer + '" id="amenities-container"></div>'
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
            'amenitiesContainer': $('#amenities-container')
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
                    this[i](data, rotationdata, rootdata);
                }
            }
        },
        initView: function(data, rotationdata, rootdata) {
            if (!$('#' + config.selectedUnitContainerId).length) {
                $('#' + config.mainContainerId).append("<div class='selected-unit-container' id='" + config.selectedUnitContainerId + "'></div>");
                // Add resize event listener
                utils.addResizeEventListener(this.dynamicResizeContainers);
                window.getComputedStyle(document.getElementById(config.selectedUnitContainerId)).right;
                $('#' + config.selectedUnitContainerId).animate({
                    right: 0
                }, 900);
                $('#' + config.filterMenuContainerId).addClass(config.fadeOutClass);
            }
        },
        destroyView: function() {
            utils.dynamicResizeContainers(window.innerWidth);
            $('#' + config.towerRotationContainerId).css('width', window.innerWidth + config.imageResolution.unit);
            $('#' + config.selectedUnitContainerId).animate({
                right: '-67%'
            }, 900);
            $('#' + config.filterMenuContainerId).addClass(config.fadeInClass);
        },
        dynamicResizeContainers: function() {
            var width = config.imageResolution.width / config.imageResolution.height * window.innerHeight,
                selectedUnitContainerWidth = width * 0.6,
                towerContainerWidth = window.innerWidth - selectedUnitContainerWidth,
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

            var selectedClass = data.shortListed ? 'selected' : '';
            htmlCode += '<div class="unit-view-tabs">' + '<div class="special-offers">' + '<p><span class="icon icon-smiley"></span></p>' + '<p>No Pre-EMI offer and Discount Rs. 4,53,000/</p>' + '</div>' + '<div class="book-com-box">' + '<div class="like-box ' + selectedClass + ' ' + data.unitUniqueIdentifier + '-like-box" >' + '<a >' + '<span class="icon icon-fav"></span>' + '<label class="like-count br50"></label>' + '</a>' + '</div>' + '<div class="book-now">' + '<a >Book online now <span>Rs. ' + data.bookingAmount + '/- (Refundable)</span></a>' + '</div>' + '</div>' + '</div>';


            $('#' + config.selectedUnitContainerId).html(htmlCode);
            this._elements = getElements();

            $('#' + config.selectedUnitContainerId).off('click').on('click', '.like-box', function() {
                _this._likeBoxClick.notify(this); //this refers to element
            });

            // to show unit icon selected on tower
            utils.removeSVGClass(data.unitIdentifier + "-selected-path", config.hideClass);
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
            var code = "<table><tr><td class='header-item header-title'> " +
                "<span class='address'>" + data.listingAddress + "</span> " +
                "&nbsp;&nbsp;<span>" + data.bedrooms + "BHK</span> " +
                "- <span>" + data.size + " " + data.measure + "</span> " +
                "- <span>Rs. " + utils.getReadablePrice(data.price) + "* </span></td>" +
                "<td data-target='fp-container' class='header-item " + config.unitMenuLinkClass + " " + config.selectedClass + "'><div class='item-icon-box'><span class='icon fs16 icon-unitplan'></span></div>Floor Plan</td>" +
                "<td data-target='cp-container' class='header-item " + config.unitMenuLinkClass + "'><div class='item-icon-box'><span class='icon fs16  icon-clusterplan'></span></div>Cluster Plan</td>" +
                "<td data-target='pb-container' class='header-item " + config.unitMenuLinkClass + "'><div class='item-icon-box'><span class='icon fs16 icon-rupee'></span></div>Price Breakup</td>" +
                "<td data-target='sf-container' class='header-item " + config.unitMenuLinkClass + " right'><div class='item-icon-box'><span class='icon fs16 icon-specification'></span></div>Specification</td></tr></table>";
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
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " mor-image' src='" + unitTypeData.morningSunlightImageUrl + "'>"; ///zip-file/img/2bhk-type1-1105-1-mor.png
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " aft-image' src='" + unitTypeData.afternoonSunlightImageUrl + "'>"; ///zip-file/img/2bhk-type1-1105-1-aft.png
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + " eve-image' src='" + unitTypeData.eveningSunlightImageUrl + "'>"; ///zip-file/img/2bhk-type1-1105-1-eve.png

                code += "<div class='sunlight-menu'>";
                code += "<div data-target='mor-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-morning fs16'></span></div>";
                code += "<div data-target='aft-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-afternoon fs16'></span></div>";
                code += "<div data-target='eve-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'><span class='icon icon-night fs16'></span></div></div>";
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
            var code = "<table class='floor-plan-menu'><tr>";
            code += "<td data-target='fp2d-container' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + "' id='floor-plan2d'>2D</td>";
            code += "<td data-target='fp-container' class='" + config.floorPlanMenuOptionClass + " " + config.selectedClass + " " + config.transitionClass + "' id='floor-plan'>3D</td>";
            code += "<td data-target='fpwt-container' class='" + config.floorPlanMenuOptionClass + " " + config.transitionClass + " right' id='walkthrough'>Walkthrough</td>";
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
            var videoUrl = "http://d1vh6m45iog96e.cloudfront.net/4/2/5000168/106/2/supertech-capetown-floor-plan-2bhk-2t-930-sq-ft-5000168.mp4";
            var code = "<video class='fullView' controls poster='/images/walkthrough-cover.jpg'>";
            code += "<source src='" + videoUrl + "' type='video/mp4'>";
            code += "</video>";
            this._elements.walkthroughContainer.html(code);
        },
        unit3dSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(),
                svgCode = utils.getUnit3dSvgPolygonHtml(unitTypeData);
            this._elements.unit3dSvgContainer.html(svgCode);
            this.unit3dSvgContainerEvents();
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
                $('#container-detail').remove();
                //here this refers to element
                _this._unitComponentMouseLeave.notify();
            });
        },
        unit2dSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(),
                svgData = unitTypeData.svgs,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = '';
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                svgCode += "<polygon data-name='" + svgObj.name + "' data-type='" + svgObj.type + "' data-details='" + svgObj.details + "'   points=\"" + svgObj.svg2dPath + "\" />";
            }

            this._elements.unit2dSvgContainer.html(svgCode);
            this.unit2dSvgContainerEvents();
        },
        unit2dSvgContainerEvents: function() {
            var _this = this;
            this._elements.unit2dSvgContainer.off('mouseenter').on('mouseenter', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.unit2dSvgContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseLeave.notify();
            });
        },
        unitComponentMouseEnter: function(params) {
            if (this._elements && this._elements.unitComponentDetailContainer) {
                var pointX = $(params.element).attr('points').split(' ')[0];
                var pointY = $(params.element).attr('points').split(' ')[1];
                params.pointX = pointX;
                params.pointY = pointY;
                utils.unitComponentMouseEnter(params, this._elements.unitComponentDetailContainer);
            }
        },
        unitComponentMouseLeave: function() {
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
                code += "<div id='" + svgId + "' data-top='" + point[1] + "' data-left='" + point[0] + "' class='" + config.amenityIconClass + "' style='" + position + "'>+";
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
            code += "<span class='" + config.amenityPopupCloseClass + "'>X</span></td></tr>";
            code += "<tr><td class='amenity-image'><img src='" + amenityImg + "'></td></tr></table>";
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
            var code = "<div class='unit-content-wrapper'><ul class='specification-tabs'>"
						+'<li class="active">Price Breakup</li>'
						+'<li>Payment</li>'
					  +'</ul>'
					  +'<div><img src="" alt="" />gdgddg</div>'
			code += "<table class='base-table' cellpadding='0' cellspacing='0' border='0'>";
            for (var category in rootdata.specifications) {
                if (rootdata.specifications.hasOwnProperty(category)) {
                    var items = rootdata.specifications[category];
                    code += "<tr><td class='' width='50%'>" + category + "</td><td width='50%'>535636</td></tr>";
                    if (typeof items == "object") {
                        for (var subCategory in items) {
                            code += "<tr><td width='50%'>" + subCategory + ":" + items[subCategory] + "</td><td width='50%'>44353454</td></tr>";
                        }
                    } else {
                        code += "<tr><td>" + items + "</td><td></td></tr>";
                    }
                }
            }
            code += "</table></div>";
            this._elements.priceBreakupContainer.html(code);
        },

        specificationContainer: function(data, rotationdata, rootdata) {
			var code = "<div class='unit-content-wrapper'><ul class='specification-tabs'>"
						+'<li class="active">Project Specification</li>'
						+'<li>Project Amenities</li>'
					  +'</ul>'
					  +'<div class="project-amenities">'
					  		+'<ul>'
								+'<li>'
									+'<span class="icon  icon-gym"></span>'
									+'<label>Gymnaslum</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-swimming"></span>'
									+'<label>Swimming Pool</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-clubhouse"></span>'
									+'<label>Club House</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-intercom"></span>'
									+'<label>Intercom</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-security"></span>'
									+'<label>24 X 7 Security</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon"></span>'
									+'<label>Power Backup</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon"></span>'
									+'<label>Landscaped Gardens</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon"></span>'
									+'<label>Ample Parking Space</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-playarea"></span>'
									+'<label>Children Play area</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon"></span>'
									+'<label>Jogging Track</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon icon-harvesting"></span>'
									+'<label>Rain Water Harvesting</label>'
								+'</li>'
								+'<li>'
									+'<span class="icon"></span>'
									+'<label>Cafeteria</label>'
								+'</li>'
							+'</ul>'
							+'<div class="clear-fix"></div>'
					  +'</div>';
			code += "<table class='base-table'>";
            for (var category in rootdata.specifications) {
                if (rootdata.specifications.hasOwnProperty(category)) {
                    var items = rootdata.specifications[category];
                    code += "<tr><td class='heading'>" + category + "</td></tr>";
                    if (typeof items == "object") {
                        for (var subCategory in items) {
                            code += "<tr><td><strong>" + subCategory + ": </strong>" + items[subCategory] + "</td></tr>";
                        }
                    } else {
                        code += "<tr><td>" + items + "</td></tr>";
                    }
                }
            }
            code += "</table></div>";
            this._elements.specificationContainer.html(code);
        },
        selectUnitMenuOption: function(element, optionClass, containerClass) {
            // select unit menu option
            this.selectMenuOption(element, optionClass, containerClass);
            // reset floor plan menu option
            this.selectMenuOptionUI(document.getElementById('floor-plan'), config.floorPlanMenuOptionClass);
            this.selectMenuOption(null, config.sunlightMenuOptionClass, config.sunlightImageClass);
        },
        selectMenuOption: function(element, optionClass, containerClass) {
            this.selectMenuOptionUI(element, optionClass);
            $('.' + containerClass).addClass(config.hideClass);
            if (element) {
                var target = $(element).data('target');
                $('.' + target).removeClass(config.hideClass);
            }
        },
        selectMenuOptionUI: function(element, optionClass) {
            $('.' + optionClass).removeClass(config.selectedClass);
            if (element) {
                element.setAttribute('class', element.classList + " " + config.selectedClass);
            }
        }
    };

    return UnitplaninfoView;

})();