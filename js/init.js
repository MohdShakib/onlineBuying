
"use strict";
(function(d, w){
    
    function resizeMainContainerHeight() {
        var imageResolutionHeight   = config.imageResolution.height || 600;
        var imageResolutionWidth    = config.imageResolution.width || 1320;
        var imageResolutionUnit     = config.imageResolution.unit || 'px';
        var imageResolutionRatio    = imageResolutionHeight/imageResolutionWidth;
        var mainContainerElement    = d.getElementById(config.mainContainerId);
        var divWidth = document.getElementById(config.mainContainerId).offsetWidth;
        mainContainerElement.style.height = (imageResolutionRatio * divWidth) + imageResolutionUnit;
    };

    resizeMainContainerHeight();
    w.addEventListener('resize', resizeMainContainerHeight);

    d.addEventListener('DOMContentLoaded', function() {

          var projectData =  {"name": "Buildings", "image_url": "images/buildings.jpg", "id":"buildings", "class":"buildings", "url":"#/new-project/slice-view/1/building_group/all",
                            "subItems": [
                                {"name": "Building A", "image_url": "images/singleBuilding.jpg", "hover_imageUrl": "images/buildingA.jpg", "class": "a-tower", "id":"a-tower",  "url":"#/new-project/slice-view/1/building/A",
                                    "path": "35 30 42 27 49 40 49 70 45 73 43 68 42 71 39 72 35 63 35 30",
                                    "details": [{
                                        "type": "2BHK",
                                        "available": 15,
                                        "unavailable": 22
                                    }, {
                                        "type": "3BHK",
                                        "available": 18,
                                        "unavailable": 9

                                    }],
                                    "subItems": [
                                        {   "name": "Floor A1 - A5", "image_url": "images/lowerHalf.jpg", "hover_imageUrl": "images/lowerHalf.jpg", "class":"building_A1_A5", "id":"building_A1_A5", "url":"#/new-project/slice-view/1/section/A_lowerHalf",
                                            "path": "34 81 34 58 34 55 43 56 56 57 57 55 62 55 61 73 57 73 57 81 56 81 56 85 55 87 52 87 50 85 48 86 45 86 41 83 38 83 38 81 34 81",
                                            "details": [{
                                                "type": "2BHK",
                                                "available": 5,
                                                "unavailable": 13
                                            }, {
                                                "type": "3BHK",
                                                "available": 8,
                                                "unavailable": 6

                                            }],
                                            "subItems": [
                                                { "name": "Floor A1", "id":"building_A1"},
                                                { "name": "Floor A2", "id":"building_A2"},
                                                { "name": "Floor A3", "id":"building_A3"},
                                                { "name": "Floor A4", "id":"building_A4"},
                                                { "name": "Floor A5", "id":"building_A5"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/A"}
                                        },
                                        {   "name": "Floor A6 - A10", "image_url": "images/upperHalf.jpg", "hover_imageUrl": "images/upperHalf.jpg", "class":"building_A6_A10", "id":"building_A6_A10", "url":"#/new-project/slice-view/1/section/A_upperHalf",
                                            "path": "34 54 34 54 56 55 58 53 61 53 62 24 61 18 62 18 62 16 61 16 60 12 57 12 57 15 54 14 54 13 51 14 46 13 46 14 44 14 44 13 39 13 38 10 37 10 36 15 37 16 37 19 35 18 35 22 33 22 33 26 33 27 33 54 ",
                                            "details": [{
                                                "type": "2BHK",
                                                "available": 10,
                                                "unavailable": 9
                                            }, {
                                                "type": "3BHK",
                                                "available": 10,
                                                "unavailable": 3
                                            }],
                                            "subItems": [
                                                { "name": "Floor A6", "id":"building_A6"},
                                                { "name": "Floor A7", "id":"building_A7"},
                                                { "name": "Floor A8", "id":"building_A8"},
                                                { "name": "Floor A9", "id":"building_A9"},
                                                { "name": "Floor A10", "id":"building_A10"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/A"} 
                                        }
                                    ],
                                    "parent": {"url": "#/new-project/slice-view/1/building_group/all"} 
                                },  
                                {"name": "Building B", "image_url": "images/singleBuilding.jpg", "hover_imageUrl": "images/buildingB.jpg", "class": "b-tower", "id":"b-tower", "url":"#/new-project/slice-view/1/building/B",
                                    "path": "41 43 45 46 46 44 46 42 48 39 48 39 53 44 55 43 56 45 56 78 53 83 53 86 51 88 51 90 50 91 40 80 40 45 41 43",
                                    "details": [{
                                        "type": "2BHK",
                                        "available": 10,
                                        "unavailable": 29
                                    }, {
                                        "type": "3BHK",
                                        "available": 3,
                                        "unavailable": 19
                                    }],
                                    "subItems": [
                                        {   "name": "Floor B1 - B5", "image_url": "images/lowerHalf.jpg", "hover_imageUrl": "images/lowerHalf.jpg", "class":"building_B1_B5", "id":"building_B1_B5", "url":"#/new-project/slice-view/1/section/B_lowerHalf",
                                            "path": "34 81 34 58 34 55 43 56 56 57 57 55 62 55 61 73 57 73 57 81 56 81 56 85 55 87 52 87 50 85 48 86 45 86 41 83 38 83 38 81 34 81",
                                            "details": [{
                                                "type": "2BHK",
                                                "available": 5,
                                                "unavailable": 14
                                            }, {
                                                "type": "3BHK",
                                                "available": 1,
                                                "unavailable": 10

                                            }],
                                            "subItems": [
                                                { "name": "Floor B1", "id":"building_B1"},
                                                { "name": "Floor B2", "id":"building_B2"},
                                                { "name": "Floor B3", "id":"building_B3"},
                                                { "name": "Floor B4", "id":"building_B4"},
                                                { "name": "Floor B5", "id":"building_B5"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/B"} 
                                        },
                                        {   "name": "Floor B6 - B10", "image_url": "images/upperHalf.jpg", "hover_imageUrl": "images/upperHalf.jpg", "class":"building_B6_B10", "id":"building_B6_B10", "url":"#/new-project/slice-view/1/section/B_upperHalf",
                                            "path": "34 54 34 54 56 55 58 53 61 53 62 24 61 18 62 18 62 16 61 16 60 12 57 12 57 15 54 14 54 13 51 14 46 13 46 14 44 14 44 13 39 13 38 10 37 10 36 15 37 16 37 19 35 18 35 22 33 22 33 26 33 27 33 54 ",
                                            "details": [{
                                                "type": "2BHK",
                                                "available": 5,
                                                "unavailable": 15
                                            }, {
                                                "type": "3BHK",
                                                "available": 2,
                                                "unavailable": 9

                                            }],
                                            "subItems": [
                                                { "name": "Floor B6", "id":"building_B6"},
                                                { "name": "Floor B7", "id":"building_B7"},
                                                { "name": "Floor B8", "id":"building_B8"},
                                                { "name": "Floor B9", "id":"building_B9"},
                                                { "name": "Floor B10", "id":"building_B10"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/B"} 
                                        }
                                    ],
                                    "parent": {"url": "#/new-project/slice-view/1/building_group/all"} 
                                }
                            ],
                            amenities: [{
                                image_url: "images/carpark.jpg",
                                top: 85,
                                left: 43,
                                name: "Car Parking"
                            }, {
                                image_url: "images/swimmingpool.jpg",
                                top: 65,
                                left: 85,
                                name: "Swimming Pool"
                            }]
                          };
        

            var model = new DataModel(projectData),
            view = new DataView(model),
            controller = new DataController(model, view);
        
            initializeRoutes(projectData, controller);

    });

})(document, window);