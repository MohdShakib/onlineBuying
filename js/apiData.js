"use strict";
var getProjectData = (function() {

    function getProjectData(projectId) {
        var projectData = {
            "title": "Umang Winter Hills",
            "address": "Sector 77, Gurgaon",
            "name": "Buildings",
            "image_url": "images/buildings.png",
            "id": "buildings",
            "class": "buildings",
            "url": "#/new-project/slice-view/1/building_group/all",
            "subItems": [{
                "name": "Building A",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingA.png",
                "class": "a-tower",
                "id": "a-tower",
                "url": "#/new-project/slice-view/1/building/A",
                "path": "64.93 36.33 69.18 32.11 73.75 38.77 73.06 45.44 73.93 47.11 73.68 48.77 72.62 50.11 71.37 60.33 68.81 62.88 68.12 62.33 67.43 62.77 63.31 56.66 64.87 36.55",
                "details": [{
                    "type": "2BHK",
                    "available": 15,
                    "unavailable": 22
                }, {
                    "type": "3BHK",
                    "available": 18,
                    "unavailable": 9

                }],
                "subItems": [{
                    "name": "Floor A1 - A5",
                    "image_url": "images/lowerHalf.jpg",
                    "hover_imageUrl": "images/lowerHalf.jpg",
                    "class": "building_A1_A5",
                    "id": "building_A1_A5",
                    "url": "#/new-project/slice-view/1/section/A_lowerHalf",
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
                    "subItems": [{
                        "name": "Floor A1",
                        "id": "building_A1"
                    }, {
                        "name": "Floor A2",
                        "id": "building_A2"
                    }, {
                        "name": "Floor A3",
                        "id": "building_A3"
                    }, {
                        "name": "Floor A4",
                        "id": "building_A4"
                    }, {
                        "name": "Floor A5",
                        "id": "building_A5"
                    }],
                    "parent": {
                        "url": "#/new-project/slice-view/1/building/A"
                    }
                }, {
                    "name": "Floor A6 - A10",
                    "image_url": "images/upperHalf.jpg",
                    "hover_imageUrl": "images/upperHalf.jpg",
                    "class": "building_A6_A10",
                    "id": "building_A6_A10",
                    "url": "#/new-project/slice-view/1/section/A_upperHalf",
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
                    "subItems": [{
                        "name": "Floor A6",
                        "id": "building_A6"
                    }, {
                        "name": "Floor A7",
                        "id": "building_A7"
                    }, {
                        "name": "Floor A8",
                        "id": "building_A8"
                    }, {
                        "name": "Floor A9",
                        "id": "building_A9"
                    }, {
                        "name": "Floor A10",
                        "id": "building_A10"
                    }],
                    "parent": {
                        "url": "#/new-project/slice-view/1/building/A"
                    }
                }],
                "parent": {
                    "url": "#/new-project/slice-view/1/building_group/all"
                }
            }, {
                "name": "Building B",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingB.png",
                "class": "b-tower",
                "id": "b-tower",
                "url": "#/new-project/slice-view/1/building/B",
                "path": "70.12 53.22 72.62 50.11 73.5 51.44 74.5 50.66 75.81 53.11 76.5 52.66 76.87 53.55 76.75 56 79.31 60.22 77.12 73.44 74.87 74.88 74.25 73.66 73.12 74.33 68.62 65.44 70.12 53.44",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }],
                "subItems": [{
                    "name": "Floor B1 - B5",
                    "image_url": "images/lowerHalf.jpg",
                    "hover_imageUrl": "images/lowerHalf.jpg",
                    "class": "building_B1_B5",
                    "id": "building_B1_B5",
                    "url": "#/new-project/slice-view/1/section/B_lowerHalf",
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
                    "subItems": [{
                        "name": "Floor B1",
                        "id": "building_B1"
                    }, {
                        "name": "Floor B2",
                        "id": "building_B2"
                    }, {
                        "name": "Floor B3",
                        "id": "building_B3"
                    }, {
                        "name": "Floor B4",
                        "id": "building_B4"
                    }, {
                        "name": "Floor B5",
                        "id": "building_B5"
                    }],
                    "parent": {
                        "url": "#/new-project/slice-view/1/building/B"
                    }
                }, {
                    "name": "Floor B6 - B10",
                    "image_url": "images/upperHalf.jpg",
                    "hover_imageUrl": "images/upperHalf.jpg",
                    "class": "building_B6_B10",
                    "id": "building_B6_B10",
                    "url": "#/new-project/slice-view/1/section/B_upperHalf",
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
                    "subItems": [{
                        "name": "Floor B6",
                        "id": "building_B6"
                    }, {
                        "name": "Floor B7",
                        "id": "building_B7"
                    }, {
                        "name": "Floor B8",
                        "id": "building_B8"
                    }, {
                        "name": "Floor B9",
                        "id": "building_B9"
                    }, {
                        "name": "Floor B10",
                        "id": "building_B10"
                    }],
                    "parent": {
                        "url": "#/new-project/slice-view/1/building/B"
                    }
                }],
                "parent": {
                    "url": "#/new-project/slice-view/1/building_group/all"
                }
            }],
            "amenities": [{
                "image_url": "images/carpark.jpg",
                "top": 85,
                "left": 43,
                "name": "Car Parking"
            }, {
                "image_url": "images/swimmingpool.jpg",
                "top": 65,
                "left": 85,
                "name": "Swimming Pool"
            }]
        };
        return projectData;
    };

    return getProjectData;
})();