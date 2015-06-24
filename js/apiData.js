"use strict";
var getProjectData = (function() {

    var ajax = function(url, params) {
        var success_callback    =   typeof(params.success_callback) == 'function' ? params.success_callback : null;
        var error_callback      =   typeof(params.error_callback) == 'function' ? params.error_callback : null;
        var complete_callback   =   typeof(params.complete_callback) == 'function' ? params.complete_callback : null;

        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: 'JSON',           
            success: function(response) {
                if(response.statusCode == '2XX') {
                    if(success_callback == null) {                  
                        // default error callback handling
                    } else {
                        success_callback(response.data, params);
                    }
                } else {
                    if(error_callback == null) {
                        // default error callback handling
                    } else {
                        error_callback(response.data);
                    }
                }                       
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('ajax in error callback');
                console.log('error occured ' + errorThrown);
            },
            complete: function() {  
                if(complete_callback != null) {
                    complete_callback(params);
                }
            }
        });     
    }

    var zipPath = 'zip-file',
    zipImagePath = '/'+zipPath+'/img/';
    
    

    function getSvgData(url){

        return $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "text",
            success: function(data) {
                // register success callback in return promise
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('read csv error callback for: '+url);
                console.log('error occured ' + errorThrown);
                return false;
            }
        });
    }

    function processCsvDataToArray(allText) {
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];

      for (var i=1; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {

              var tarr = {};
              for (var j=0; j<headers.length; j++) {
                  tarr[headers[j]] = data[j];
              }
              lines.push(tarr);
          }
      }
      return lines;
    }

    /*for(amenity in jsonDetail.amenities){
            if(hasOwnProperty.call(jsonDetail.amenities, amenity)){
                //amenityData = _getAmenityByName(amenity);
                var amenityData = jsonDetail.amenities[amenity];
                projectData.amenities[amenityData.amenityName] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath+amenityData.imageName,
                    amenitySvg : amenityData.amenitySvg
                    
                };
            }
        }*/

    function processCsvDataToObject(allText, keyIdentifier) { //
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = {};

      for (var i=1; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {

              var tarr = {};
              for (var j=0; j<headers.length; j++) {
                  tarr[headers[j]] = data[j];
              }
              lines[tarr[keyIdentifier]] = tarr;
          }
      }
      return lines;
    }

    function useTowersCSVData(towers){
        for(var towerName in projectData.towers){
            if(hasOwnProperty.call(projectData.towers, towerName)){
                if(towerName && towers[towerName]){
                    projectData.towers[towerName].displayOrder = towers[towerName].displayOrder ? parseInt(towers[towerName].displayOrder, 10) : 0;
                    projectData.towers[towerName].hoverImageUrl = zipImagePath+towers[towerName].hoverImageName;
                    projectData.towers[towerName].towerHoverSvg   = towers[towerName].towerHoverSvg;
                    //projectData.towers[towerName].rotationAngle = _parseRotationAngle(jsonDetail.towers[towerName].rotationAngle);
                }
            }

        }
    }

    function useAmenitiesCSVData(amenities){
        projectData.amenities = {};
        for(var amenity in amenities){
            if(hasOwnProperty.call(amenities, amenity)){
                var amenityData = amenities[amenity];
                projectData.amenities[amenityData.amenityName] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath+amenityData.imageName,
                    amenitySvg : amenityData.amenitySvg
                    
                };
            }
        }
    }

    function parseAllCSVData(){

        getSvgData(zipPath+'/'+config.csv.masterplanScreen).success(function(data){
            var towers = processCsvDataToObject(data, 'towerName');
            if(towers && projectData.towers && Object.keys(projectData.towers).length && Object.keys(towers).length){
                useTowersCSVData(towers);
            }
        });


        getSvgData(zipPath+'/'+config.csv.amenitiesHotspots).success(function(data){
            var amenities = processCsvDataToObject(data, 'amenityName');
            if(amenities && Object.keys(amenities).length){
                useAmenitiesCSVData(amenities);
            }
        });
    
        /*getSvgData(zipPath+'/'+config.csv.towerselectScreen).success(function(data){
            var flats = processCsvDataToArray(data);
            console.log('flats are: ');
            console.log(flats);
        });*/
        
    }

    

    var hasOwnProperty = Object.prototype.hasOwnProperty,
    projectData = {};

    var parseApiData = function(projectDetail){

        var facingMap = {
            "1" : "East",       "2" : "West",
            "3" : "North",      "4" : "South",
            "5" : "NorthEast",  "6" : "SouthEast",
            "7" : "NorthWest",  "8" : "SouthWest"
        }, towerMap = {},
        _getPropertyById =  function(data, propertyId){
            var i, length = data.length, response = {};
            if(data && data.length){
                for(i = 0; i < length; i += 1){
                   if(data[i] && data[i].propertyId == propertyId){
                        return data[i];
                   }
                }
            }
            return response;
        };

        if(!(projectDetail && Object.keys(projectDetail).length)){
            return;
        }

        var towers_length = projectDetail.towers ? projectDetail.towers.length : 0,
        listings_length = projectDetail.listings ? projectDetail.listings.length : 0,
        i = 0, towers = {}, tower;

        projectData.projectId = projectDetail.projectId;
        projectData.projectUrl = '#/new-project/slice-view/projectname-'+projectDetail.projectId+'/building_group/all';
        projectData.baseUrl = '#/new-project/slice-view/projectname-'+projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.address = projectDetail.address;

        var towersUnitInfo = {};
        for(i = 0; i < towers_length; i += 1){
            
            tower = projectDetail.towers[i];
            towers[tower.towerName] = {};
            towerMap[tower.towerId] = tower.towerName;
            towers[tower.towerName].towerId = tower.towerId;
            towers[tower.towerName].towerName = tower.towerName;
            towers[tower.towerName].listings  = {};
            
            towersUnitInfo[tower.towerName] = {};
            towers[tower.towerName].unitInfo = [];
        }


        projectData.towers = towers;

        for(i = 0; i < listings_length; i += 1){
            var towerId     = projectDetail.listings[i].towerId;
            var towerName   = towerMap[towerId];
            var listing     = projectDetail.listings[i],
            flatUnit = {};
            flatUnit.listingAddress = listing.flatNumber;
            flatUnit.listingId = listing.id;
            flatUnit.floor  = listing.floor;
            flatUnit.isAvailable = (listing.bookingStatusId == 1 ? true : false ); // available if bookingStatusId = 1
            flatUnit.facing = facingMap[listing.facingId];
            flatUnit.bookingAmount = listing.bookingAmount;
            flatUnit.price = listing.bookingAmount*1000;

            var propertyDetail = _getPropertyById(projectDetail.properties, listing.propertyId);

            flatUnit.bedrooms = propertyDetail.bedrooms;
            flatUnit.size     = propertyDetail.size;
            flatUnit.measure  = propertyDetail.measure;
            
            if(towerName){
                projectData.towers[towerName].listings[listing.flatNumber] = flatUnit;
            }

            // keep unitInfo in local variable towersUnitInfo
            if(towersUnitInfo[towerName] && flatUnit.bedrooms){
                var unitTypeIndex = flatUnit.bedrooms+'BHK';
                if(flatUnit.isAvailable && hasOwnProperty.call(towersUnitInfo[towerName], unitTypeIndex)){ // 
                   towersUnitInfo[towerName][unitTypeIndex] += 1;
                }else if(flatUnit.isAvailable){
                    towersUnitInfo[towerName][unitTypeIndex] = 1;
                }else {
                    towersUnitInfo[towerName][unitTypeIndex] = 0;
                }
            }


        }

        // calculate unitInfo for each tower
        for(var towerName in towersUnitInfo){
            if(hasOwnProperty.call(towersUnitInfo, towerName)){
                var tower = projectData.towers[towerName];
                for(var unitBedroom in towersUnitInfo[towerName]){
                    if(hasOwnProperty.call(towersUnitInfo[towerName], unitBedroom)){
                        projectData.towers[towerName].unitInfo.push({
                            'type': unitBedroom,
                            'available': towersUnitInfo[towerName][unitBedroom] 
                        });
                    }
                }
            }
        }
        
    }

    

    var parseJsonData = function(jsonDetail, apiData){

        
        var /*_getAmenityByName = function(amenity){
            var i, length, response = {};
            if(apiData && apiData.images && apiData.images.length){
                length = apiData.images.length;
                for(i = 0; i < length; i += 1){
                   if(apiData.images[i] && apiData.images[i].title == amenity && apiData.images[i].imageType.type == 'amenities'){
                        response.imageUrl = apiData.images[i].absolutePath;
                        return response;
                   }
                }
            }
            return response;
        },*/
        _parseRotationAngle = function(rotationAngle){
            var key;
            for(key in rotationAngle) {
                if(hasOwnProperty.call(rotationAngle, key) && rotationAngle[key].towerImageName){
                    rotationAngle[key].towerImageUrl = zipImagePath+rotationAngle[key].towerImageName;
                }
            };
            return rotationAngle;
        };

        if(!(apiData && jsonDetail && Object.keys(apiData).length && Object.keys(jsonDetail).length)){
            return;
        }

        var i, amenity, json_towers_length = jsonDetail.towers.length, amenityData;
        projectData.bgImage = zipImagePath+jsonDetail.backgroundImage;
        

        /*for(var towerName in projectData.towers){
            if(hasOwnProperty.call(projectData.towers, towerName)){
                if(towerName && jsonDetail.towers[towerName]){
                    projectData.towers[towerName].displayOrder = jsonDetail.towers[towerName].displayOrder;
                    projectData.towers[towerName].hoverImageUrl = zipImagePath+jsonDetail.towers[towerName].hoveImageName;
                    projectData.towers[towerName].towerHoverSvg   = jsonDetail.towers[towerName].towerHoverSvg;
                    projectData.towers[towerName].rotationAngle = _parseRotationAngle(jsonDetail.towers[towerName].rotationAngle);
                }
            }

        }*/

        /*
        projectData.amenities = {};
        for(amenity in jsonDetail.amenities){
            if(hasOwnProperty.call(jsonDetail.amenities, amenity)){
                //amenityData = _getAmenityByName(amenity);
                var amenityData = jsonDetail.amenities[amenity];
                projectData.amenities[amenityData.amenityName] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath+amenityData.imageName,
                    amenitySvg : amenityData.amenitySvg
                    
                };
            }
        }*/

    }


    function getProjectData(projectId) {
       
        var url1  = "http://192.168.1.8:8080/app/v4/project-detail/"+projectId+"?selector={%22fields%22:[%22projectId%22,%22images%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22primaryOnline%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22]}";
        var url2 = zipPath+'/data.json';
        var apiData, jsonData;
        var params2 = {success_callback: function(response){
            jsonData = response;
        }};
        var params1 = {success_callback: function(response){
            apiData = response;
            ajax(url2, params2);
        }};

        ajax(url1, params1);

        parseApiData(apiData);
        parseAllCSVData();
        parseJsonData(jsonData, apiData);

        console.log('projectData is: ');
        console.log(projectData);

        /*var projectData = {
            "title": "Umang Winter Hills",
            "address": "Sector 77, Gurgaon",
            "name": "Buildings",
            "image_url": "images/background.png",
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
                    "available": 0,
                    "unavailable": 39

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
            },{
                "name": "Building C",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingC.png",
                "class": "c-tower",
                "id": "c-tower",
                "url": "#/new-project/slice-view/1/building/C",
                "path": "63.18 54.11 65 51.33 65.43 51.77 67.06 33.66 66.5 32.88 66.93 29 62 23.88 58.31 28.55 58.12 33.77 57 35.44 57.81 36.33 57 37.33 57.75 38.33 57.43 48.88 58.18 49.55 58.25 50.44 58.75 50.88 59.12 50.11 59.37 50.33 59.37 51.11 61.87 54.11 62.43 53.33 63.18 54",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building D",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingD.png",
                "class": "d-tower",
                "id": "d-tower",
                "url": "#/new-project/slice-view/1/building/D",
                "path": "56.06 47.22 56.5 46.22 57.25 46.88 58.81 43.88 59.25 44.33 59.81 33.33 59.18 32.77 59.12 31.22 59.06 30.55 58.25 29.66 57.93 30.44 57 29.88 57.06 27.55 56.5 27.11 55.62 28.33 54.62 27.66 54.56 27.22 53.5 26.33 53 27.11 52.12 26.44 50.56 29.33 50.56 42.22 54.18 45.33 54.25 46.33 54.68 46.66 55 46 56.06 47.11",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]

            },{
                "name": "Building E",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingE.png",
                "class": "e-tower",
                "id": "e-tower",
                "url": "#/new-project/slice-view/1/building/E",
                "path": "48.31 33.66 48.68 32.11 49.25 32.11 50 28.77 49.81 10.66 49.43 10.66 49.37 7.33 41.5 5.44 39.87 11.66 39.87 15.55 38.87 19.44 40.06 19.55 40.56 29.88 40.87 30.11 40.93 31.77 41.81 31.88 41.93 31.44 48.18 33.55",
                "details": [{
                    "type": "2 BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "2.5 BHK",
                    "available": 0,
                    "unavailable": 30
                }]

            },{
                "name": "Building F",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingF.png",
                "class": "f-tower",
                "id": "f-tower",
                "url": "#/new-project/slice-view/1/building/F",
                "path": "39.75 31.33 39.93 29.88 40.5 30 41 26.33 40.43 15.55 40.12 15.44 40.06 14.22 40 13.77 39.06 13.55 38.93 14.55 37.75 14.55 37.68 13.66 36.5 13.44 36.31 12.33 35.75 12.33 35.56 13.22 34.68 13.22 34.56 14.22 33.31 14 33.43 13.55 32.37 13.44 32.06 14.11 31.43 14.11 30.87 18.22 31.81 29.11 32.18 30.55 39.68 31.33",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building G",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingG.png",
                "class": "g-tower",
                "id": "g-tower",
                "url": "#/new-project/slice-view/1/building/G",
                "path": "28.87 43.55 27.68 33.33 28.12 32.55 26.81 27.33 26.43 23.66 23.87 14.66 17.93 17.66 19.81 29.11 19.62 29.44 21.25 38.66 23.31 46.77 24.31 46.22 24.62 46.77 25 46.66 25.12 47.55 27.68 45.55 27.68 44.11 28.87 43.55",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building H",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingH.png",
                "class": "h-tower",
                "id": "h-tower",
                "url": "#/new-project/slice-view/1/building/H",
                "path": "30.12 58.77 32.37 56 32.56 55.44 32.43 54.44 33.43 53.77 32.25 43.11 31.5 41.44 31 42 30.75 40.33 30.12 39.11 29.93 37.55 29.43 36.55 28.87 37 28.5 35.44 28 33.88 27.12 34.44 27.12 35.11 26.93 35.11 26.56 34.33 23.43 36.88 23.43 37.33 22.56 38.33 24 49.88 24.31 50.55 24.93 50.33 27.87 58.55 28.06 58.44 29.06 57.66 29.43 58.33 29.75 58.11 30.06 58.77",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building I",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingI.png",
                "class": "i-tower",
                "id": "i-tower",
                "url": "#/new-project/slice-view/1/building/I",
                "path": "34.87 69.88 35 69.66 35.25 69.88 35.93 69.11 35.81 68.66 36 68.33 36.56 69.33 37.37 68.33 37.25 65.55 38.18 67 39.12 66 39 65 39.62 63.66 38.31 44.11 32.06 35.44 26.75 41.66 27.37 46.77 26.43 48.11 27.93 50.66 27.5 51.44 28.12 52.77 29.06 61.44 29.68 62.44 30.18 61.88 34.75 70",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building J",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingJ.png",
                "class": "j-tower",
                "id": "j-tower",
                "url": "#/new-project/slice-view/1/building/J",
                "path": "48.56 63.66 49.25 64.44 51 61 51.68 61.88 51.87 51.33 51.5 50.66 52.37 48.77 51.68 48.44 52.37 46.88 51.37 45.77 51.18 38.77 45.06 32.88 41.43 38.77 42.31 58.66 44.87 61.33 45.12 60.77 45.37 61.11 45.37 61.77 45.87 62.33 46.06 61.77 46.43 62.11 46.12 62.55 46.06 64.22 46.62 64.88 47.25 63.77 48 64.55 48.5 63.55",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{ 
                "name": "Building K",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingK.png",
                "class": "K-tower",
                "id": "k-tower",
                "url": "#/new-project/slice-view/1/building/K",
                "path": "53.62 73.33 54.31 72.44 54.93 73.55 56.18 72 56.18 71.11 56.5 71.44 57.68 69.77 58.18 59.66 58 59.66 58.06 57.55 57.18 55.66 56.81 56.22 56.18 55.55 56.18 53.11 55.5 51.88 54.5 53 54.43 52.11 53.68 50.33 52.5 51.88 52.31 51 49.37 54.22 49.37 66.33 51 69 51.25 68.33 51.37 69.55 52.25 70.22 51.93 70.88 51.93 72.44 52.37 73.11 52.93 72.22 53.62 73.22",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            },{
                "name": "Building L",
                "image_url": "images/singleBuilding.jpg",
                "hover_imageUrl": "images/buildingL.png",
                "class": "l-tower",
                "id": "l-tower",
                "url": "#/new-project/slice-view/1/building/L",
                "path": "58.93 85.88 60.18 84.77 60.75 86.11 60.81 85.88 61.06 86.33 61.68 85.77 61.81 84.22 62.25 84.88 63.06 84.22 63.25 81.88 63.68 81.55 65.62 62.44 60.75 52.22 55.5 56.55 55.31 61.22 54.31 62.11 54.87 63.77 54.37 64.44 55.18 66.55 54.87 75.88 55.5 77.44 55.87 77.22 56.5 78.44 56.43 79.66 56.87 80.33 57.31 80.77 57.06 81 58.93 85.77",
                "details": [{
                    "type": "2BHK",
                    "available": 10,
                    "unavailable": 29
                }, {
                    "type": "3BHK",
                    "available": 3,
                    "unavailable": 19
                }]
            }],
            "amenities": [{
                "image_url": "zip-file/img/carpark.jpg",
                "top": 85,
                "left": 43,
                "name": "Car Parking",
                "id": "car-parking"
            }, {
                "image_url": "zip-file/img/swimmingpool.jpg",
                "top": 65,
                "left": 85,
                "name": "Swimming Pool",
                "id": "swimming-pool"
            }]
        };*/
        return projectData;
    };

    return getProjectData;
})();