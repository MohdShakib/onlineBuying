/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var UnitplaninfoView = (function() {

    var containerMap = {
        'unitCloseContainer': '<div class="unit-close-container" id="unit-close-container"></div>',
        'unitMenuContainer': '<div class="unit-menu-container" id="unit-menu-container"></div>',
        'unitDataContainer': '<div class="unit-data-container" id="unit-data-container"></div>'
    };

    function getElements() {
        var elements = {
            'unitCloseContainer': $('#unit-close-container'),
            'unitMenuContainer': $('#unit-menu-container'),
            'unitDataContainer': $('#unit-data-container')
        };
        return elements;
    }

    function UnitplaninfoView(model) {
        this._model = model;
        this._elements = null;
        var _this = this;
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
            $('#' + config.mainContainerId).append("<div class='selected-unit-container' id='selected-unit-container'></div>");
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#' + config.selectedUnitContainerId).append(htmlCode);
            this._elements = getElements();
        },
        /*selectedUnitContainer: function(data, rotationdata, rootdata) {
            var imageUrl = rootdata.unitTypes[rotationdata.unitTypeIdentifier].unitImageUrl;
            var code = "<div class='unit-close'> X </div>" +
                "<div class='unit-header'>" +
                "<table><tr><td class='header-item header-title'> " +
                "<span class='address'>" + data.listingAddress + "</span> " +
                "&nbsp;&nbsp;<span>" + data.bedrooms + "BHK</span> " +
                "- <span>" + data.size + " " + data.measure + "</span> " +
                "- <span>Rs. " + utils.getReadablePrice(data.price) + "* </span></td>" +
                "<td class='header-item'><span>@</span>Floor Plan</td>" +
                "<td class='header-item'><span>#</span>Cluster Plan</td>" +
                "<td class='header-item'><span>$</span>Price Breakup</td>" +
                "<td class='header-item right'><span>&</span>Specification</td></tr></table></div>" +
                "<div class='unit-body'><img src='" + imageUrl + "'></div>";
            this._elements.selectedUnitContainer.html(code);
        },*/
        unitCloseContainer: function(data, rotationdata, rootdata) {
            var code = 'X';
            this._elements.unitCloseContainer.html(code);
        }
    };

    return UnitplaninfoView;

})();