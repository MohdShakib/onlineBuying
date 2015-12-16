/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var GoogleMapView = (function() {

    var containerMap = {
        'googleMapContainer': '<div class="" style="height: 100%; width: 100%; position:fixed;"><div id="google-map-container" style="height:100%; width: 100%;"></div></div>'
    };

    function getElements() {
        var elements = {
            'googleMapContainer': $('#google-map-container')
        };
        return elements;
    }

    function GoogleMapView(model) {
        this._model = model;
        this._elements = null;

        // Menu Events
        // this._menuMouseEnter = new Event(this);
    }

    GoogleMapView.prototype = {
        buildView: function() {
            var data = this._model.getLatLongData();
            this.buildSkeleton(Object.keys(containerMap));
            this.renderGoogleMap(data);
            // this.renderInitialData(data);
            // for (i in this._elements) {
            //     this._elements[i].empty();
            //     if (this._elements.hasOwnProperty(i) && this[i]) {
            //         this[i](data);
            //     }
            // }
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
        renderGoogleMap: function(data){
            var gurgoan = new google.maps.LatLng(28.381136, 76.979350);
            var imageBounds = new google.maps.LatLngBounds(
                            new google.maps.LatLng(28.379743, 76.978000),
                            new google.maps.LatLng(28.382616, 76.980592));
            var mapOptions = {
                zoom: 17,
                center: gurgoan,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };

            var map = new google.maps.Map(document.getElementById('google-map-container'),
                    mapOptions);

            var imageOverlay = new google.maps.GroundOverlay('images/IMAGE.png',
                                imageBounds);
            
            // google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //     //this part runs when the mapobject is created and rendered
            //     google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //         //this part runs when the mapobject shown for the first time
            //         $('.show-loading').hide();
            //     });
            // });
            google.maps.event.addListenerOnce(map, 'idle', function(){
                // do something only the first time the map is loaded
                $('.show-loading').hide();
                imageOverlay.setMap(map);
            });
        }
    };

    return GoogleMapView;

})();
