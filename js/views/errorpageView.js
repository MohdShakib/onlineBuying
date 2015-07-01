/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var ErrorPageView = (function() {

    var containerMap = {
        'errorPageViewContainer': '<div style="background:white; height:100%;" class="error-view-container" id="error-view-container"></div>'
    };


    function getElements() {
        var elements = {
            'errorPageViewContainer': $('#error-view-container')
        };
        return elements;
    }

    function ErrorPageView() {
        this._elements = null;
    }

    ErrorPageView.prototype = {
        buildView: function() {
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            for (var i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i]();
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
        },
        errorPageViewContainer: function(){
            var htmlCode = '';
            htmlCode = '<div style="font-size: xx-large; text-align:center;">404</div>';
            this._elements.errorPageViewContainer.html(htmlCode);
        }
    };

    return ErrorPageView;

})();