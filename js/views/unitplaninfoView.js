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
            $('#'+config.filterMenuContainerId).hide();
           // return;
            var i, data = this._model.getData(),
            rotationdata = this._model.getRotationdata(),
            rootdata = this._model.getRootdata();
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            for (i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i](data, rootdata);
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
            $('#'+config.mainContainerId).append(htmlCode);
            this._elements = getElements();
        }
    };

    return UnitplaninfoView;

})();