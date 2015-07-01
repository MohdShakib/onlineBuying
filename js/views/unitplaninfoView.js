/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var UnitplaninfoView = (function() {

    var containerMap = {
        'selectedUnitContainer': '<div class="selected-unit-container" id="selected-unit-container"></div>'
    };


    function getElements() {
        var elements = {
            'selectedUnitContainer': $('#selected-unit-container')
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
                rootdata = this._model.getRootdata();
            var _this = this;

            $('#' + config.filterMenuContainerId).hide();
            $('#' + config.imgContainerId).addClass(config.shiftLeftClass);
            $('#' + config.towerRotationContainerId).addClass(config.shrinkClass);

            var originalClasses = document.getElementById(config.svgContainerId).className.baseVal;
            $('#' + config.svgContainerId).attr('class', originalClasses + ' ' + config.shiftLeftClass);

            // var svgCode = "<ellipse  class=\"" + config.towerUnitSelectedSvgClass + "\" " +
            //     "id=\"" + data.unitIdentifier + "-selected-path\" " +
            //     "cx='" + rotationdata.unitSvgOnTower[0] + "' cy='" + rotationdata.unitSvgOnTower[1] + "' ry='1.7' rx='0.8' />";
            // $('#' + config.svgContainerId).append(svgCode);

            this.buildSkeleton(Object.keys(containerMap));
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data, rotationdata, rootdata);
                }
            }
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#' + config.mainContainerId).append(htmlCode);
            this._elements = getElements();
        },
        selectedUnitContainer: function(data, rotationdata, rootdata) {
            var code = "<div class='unit-close'> X </div>" +
                "<table><tr><td class='unit-header'>" +
                "<table><tr><td class='header-item header-title'> " + 
                "<span class='address'>" + data.listingAddress + "</span> " +
                "&nbsp;&nbsp;<span>" + data.bedrooms + "BHK</span> " +
                "- <span>" + data.size + " " + data.measure + "</span> " +
                "- <span>Rs. " + utils.getReadablePrice(data.price) + "* </span></td>" +
                "<td class='header-item'><span>@</span>2D Unit Plan</td>" +
                "<td class='header-item'><span>#</span>Cluster Plan</td>" +
                "<td class='header-item'><span>$</span>Price Breakup</td>" +
                "<td class='header-item right'><span>&</span>Specification</td></tr></table></td></tr>" +
                "<tr><td class='unit-body'></td></tr></table>";
            this._elements.selectedUnitContainer.html(code);
        }
    };

    return UnitplaninfoView;

})();