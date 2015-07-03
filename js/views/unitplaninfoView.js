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
        'floorPlanContainer': '<div class="floor-plan-container fp-container ' + config.unitDataContainer + '" id="floor-plan-container"></div>',
        'unitSvgContainer': '<div class="fp-container ' + config.unitDataContainer + '"><svg class="svg-container" id="unit-svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg></div>',
        'unitComponentDetailContainer': '<div class="tower-unit-detail-container fp-container ' + config.unitDataContainer + '" id="tower-detail-container"></div>',
        'clusterPlanContainer': '<div class="cluster-plan-container cp-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="cluster-plan-container"></div>',
        'priceBreakupContainer': '<div class="price-breakup-container pb-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="price-breakup-container"></div>',
        'specificationContainer': '<div class="specification-container sf-container ' + config.unitDataContainer + ' ' + config.hideClass + '" id="specification-container"></div>'        
    };

    function getElements() {
        var elements = {
            'unitCloseContainer': $('#' + config.closeUnitContainerId),
            'unitMenuContainer': $('#unit-menu-container'),
            'unitSvgContainer': $('#unit-svg-container'),
            'unitComponentDetailContainer': $('#tower-detail-container'),
            'floorPlanContainer': $('#floor-plan-container'),
            'clusterPlanContainer': $('#cluster-plan-container'),
            'priceBreakupContainer': $('#price-breakup-container'),
            'specificationContainer': $('#specification-container')
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
            $('#' + config.filterMenuContainerId).hide();
            $('#' + config.imgContainerId).addClass(config.shiftLeftClass);
            $('#' + config.towerRotationContainerId).addClass(config.shrinkClass);

            var originalClasses = document.getElementById(config.svgContainerId).className.baseVal;
            $('#' + config.svgContainerId).attr('class', originalClasses + ' ' + config.shiftLeftClass);

            var svgCode = "<ellipse  class=\"" + config.towerUnitSelectedSvgClass + "\" " +
                "id=\"" + data.unitIdentifier + "-selected-path\" " +
                "cx='" + rotationdata.unitSvgOnTower[0] + "' cy='" + rotationdata.unitSvgOnTower[1] + "' ry='1.7' rx='0.8' />";
            $('#' + config.svgContainerId).append(svgCode);
            if (!$('#' + config.selectedUnitContainerId).length) {
                $('#' + config.mainContainerId).append("<div class='selected-unit-container' id='" + config.selectedUnitContainerId + "'></div>");
            }
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#' + config.selectedUnitContainerId).html(htmlCode);
            this._elements = getElements();
        },
        unitCloseContainer: function(data, rotationdata, rootdata) {
            var code = 'X';
            this._elements.unitCloseContainer.html(code);
            this.unitCloseContainerEvents();
        },
        unitCloseContainerEvents: function() {
            var _this = this;
            _this._elements.unitCloseContainer.off('click').on('click', function(event) {
                // notify controller
                _this._unitCloseClick.notify(); // this refers to element here
            });
        },
        unitMenuContainer: function(data, rotationdata, rootdata) {
            var code = "<table><tr><td class='header-item header-title'> " +
                "<span class='address'>" + data.listingAddress + "</span> " +
                "&nbsp;&nbsp;<span>" + data.bedrooms + "BHK</span> " +
                "- <span>" + data.size + " " + data.measure + "</span> " +
                "- <span>Rs. " + utils.getReadablePrice(data.price) + "* </span></td>" +
                "<td data-container='fp-container' class='header-item " + config.unitMenuLinkClass + " " + config.selectedClass + "'><span>@</span>Floor Plan</td>" +
                "<td data-container='cp-container' class='header-item " + config.unitMenuLinkClass + "'><span>#</span>Cluster Plan</td>" +
                "<td data-container='pb-container' class='header-item " + config.unitMenuLinkClass + "'><span>$</span>Price Breakup</td>" +
                "<td data-container='sf-container' class='header-item " + config.unitMenuLinkClass + " right'><span>&</span>Specification</td></tr></table>";
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
        selectMenuOption: function(element) {
            $('.' + config.unitMenuLinkClass).removeClass(config.selectedClass);
            element.setAttribute('class', element.classList + " " + config.selectedClass);
            var container = element.dataset.container;
            $('.' + config.unitDataContainer).addClass(config.hideClass);
            $('.' + container).removeClass(config.hideClass);
        },
        floorPlanContainer: function(data, rotationdata, rootdata) {
            var imageUrl = rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImageUrl;
            var code = "<img class='fullView' src='" + imageUrl + "'>";
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + "' id='sunrise-image' src='/zip-file/img/yellow-sunlight.png'>";
                code += "<img class='fullView " + config.sunlightImageClass + " " + config.hideClass + "' id='sunset-image' src='/zip-file/img/blue-sunlight.png'>";
                
                code += "<div class='sunlight-menu'>";
                code += "<div data-target='sunrise-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'>@</div>";
                code += "<div data-target='sunset-image' class='" + config.sunlightMenuOptionClass + " " + config.transitionClass + "'>#</div></div>";
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
        selectSunlightMenuOption: function(element) {
            $('.' + config.sunlightMenuOptionClass).removeClass(config.selectedClass);
            element.setAttribute('class', element.classList + " " + config.selectedClass);
            var target = element.dataset.target;
            $('.' + config.sunlightImageClass).addClass(config.hideClass);
            $('#' + target).removeClass(config.hideClass);
        },
        unitSvgContainer: function() {
            var unitTypeData = this._model.getUnitTypeData(),
                svgData = unitTypeData.svgs,
                svgs_count = svgData && svgData.length ? svgData.length : 0;

            var svgCode = '';
            for (var i = 0; i < svgs_count; i++) {
                var svgObj = svgData[i];
                svgCode += "<polygon data-name='" + svgObj.name + "' data-type='" + svgObj.type + "' data-details='" + svgObj.details + "'   points=\"" + svgObj.svgPath + "\" />";
            }

            this._elements.unitSvgContainer.html(svgCode);
            this.unitSvgContainerEvents();
        },
        unitSvgContainerEvents: function() {
            var _this = this;
            this._elements.unitSvgContainer.off('mouseenter').on('mouseenter', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.unitSvgContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseLeave.notify();
            });
        },
        unitComponentMouseEnter: function(params) {
            var dataset = params.element.dataset,
                towerCode = "<div id='container-detail' class='tooltip-detail'>";

            var info = {
                'name': dataset.name,
                'type': dataset.type,
                'details': dataset.details
            };

            towerCode += '<div class="towerunit-detail-container">';
            towerCode += '<div class="towerunit-name">' + info.name + '</div>';
            towerCode += '<div class="towerunit-detail">' + info.details + '</div>';

            if (this._elements && this._elements.unitComponentDetailContainer) {
                this._elements.unitComponentDetailContainer.html(towerCode);
                var offset = this._elements.unitComponentDetailContainer.offset();
                var left = params.event.clientX - offset.left;
                var top = params.event.clientY - offset.top;

                $('#container-detail').css("left", left + 'px');
                $('#container-detail').css("top", top + 'px');
                // animate
                window.getComputedStyle(document.getElementById('container-detail')).opacity;
                document.getElementById('container-detail').style.opacity = "1";
            }
        },
        unitComponentMouseLeave: function() {
            document.getElementById(config.towerDetailContainerId).innerHTML = '';
        },
        clusterPlanContainer: function(data, rotationdata, rootdata) {
            var imageUrl = '/zip-file/img/dummy-cluster-plan.jpeg';
            var code = "<img class='fullView' src='" + imageUrl + "'>";
            this._elements.clusterPlanContainer.html(code);
        },
        priceBreakupContainer: function(data, rotationdata, rootdata) {
            var code = "<br><br><br><br><br><br>Price Breakup";
            this._elements.priceBreakupContainer.html(code);
        },
        specificationContainer: function(data, rotationdata, rootdata) {
            var code = "<table class='base-table'>";
            for(var category in rootdata.specifications){
                if(rootdata.specifications.hasOwnProperty(category)){
                    var items = rootdata.specifications[category];
                    code += "<tr><td class='heading'>"+category+"</td></tr>";
                    if(typeof items == "object"){
                        for(var subCategory in items){
                            code += "<tr><td><strong>"+subCategory+": </strong>"+items[subCategory]+"</td></tr>";
                        }
                    }else{
                        code += "<tr><td>"+items+"</td></tr>";
                    }
                }
            }
            code += "</table>";
            this._elements.specificationContainer.html(code);
        }
    };

    return UnitplaninfoView;

})();