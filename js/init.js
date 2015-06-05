
"use strict";
(function(){

    document.addEventListener('DOMContentLoaded', function() {

          var listData =  {"name": "Buildings", "image_url": "images/buildings.jpg", "id":"buildings", "class":"buildings", "url":"#/new-project/slice-view/1/building_group/all",
                            "subItems": [
                                {"name": "Building A", "image_url": "images/singleBuilding.jpg", "hover_imageUrl": "images/buildingA.jpg", "class": "a-tower", "id":"a-tower",  "url":"#/new-project/slice-view/1/building/A",
                                    "path": "35 30 42 27 49 40 49 70 45 73 43 68 42 71 39 72 35 63 35 30",
                                    "subItems": [
                                        { "name": "Floor A1 - A5", "image_url": "images/lowerHalf.jpg", "hover_imageUrl": "images/lowerHalf.jpg", "class":"building_A1_A5", "id":"building_A1_A5", "url":"#/new-project/slice-view/1/section/A_lowerHalf",
                                          "subItems": [
                                                { "name": "Floor A1", "id":"building_A1"},
                                                { "name": "Floor A2", "id":"building_A2"},
                                                { "name": "Floor A3", "id":"building_A3"},
                                                { "name": "Floor A4", "id":"building_A4"},
                                                { "name": "Floor A5", "id":"building_A5"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/A"}
                                        },
                                        { "name": "Floor A6 - A10", "image_url": "images/upperHalf.jpg", "hover_imageUrl": "images/upperHalf.jpg", "class":"building_A6_A10", "id":"building_A6_A10", "url":"#/new-project/slice-view/1/section/A_lowerHalf",
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
                                {"name": "Building B", "image_url": "images/singleBuilding.jpg", "hover_imageUrl": "images/buildingB.jpg", "class": "a-tower", "id":"a-tower", "url":"#/new-project/slice-view/1/building/B",
                                    "path": "41 43 45 46 46 44 46 42 48 39 48 39 53 44 55 43 56 45 56 78 53 83 53 86 51 88 51 90 50 91 40 80 40 45 41 43",
                                    "subItems": [
                                        { "name": "Floor B1 - B5", "image_url": "images/lowerHalf.jpg", "hover_imageUrl": "images/lowerHalf.jpg", "class":"building_B1_B5", "id":"building_B1_B5", "url":"#/new-project/slice-view/1/section/B_lowerHalf",
                                          "subItems": [
                                                { "name": "Floor B1", "id":"building_B1"},
                                                { "name": "Floor B2", "id":"building_B2"},
                                                { "name": "Floor B3", "id":"building_B3"},
                                                { "name": "Floor B4", "id":"building_B4"},
                                                { "name": "Floor B5", "id":"building_B5"}
                                            ],
                                            "parent": {"url": "#/new-project/slice-view/1/building/B"} 
                                        },
                                        { "name": "Floor B6 - B10", "image_url": "images/upperHalf.jpg", "hover_imageUrl": "images/upperHalf.jpg", "class":"building_B6_B10", "id":"building_B6_B10", "url":"#/new-project/slice-view/1/section/B_lowerHalf",
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
                            ]
                          };
        


        
          initializeRoutes(listData);

    });

})();