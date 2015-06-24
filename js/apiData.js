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

    function getIdentifier(string){
        var identifier = '';
        if(string){
            identifier = string.toLowerCase().replace(' ', '-');
        }
        return identifier;
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

    function useTowerUnitsCSVData(listing){
        var i, towerIdentifier, unitInfo, tower, unitTowerIdentifier, unitIdentifier, unit;
        for(var towerIdentifier in projectData.towers){
            if(hasOwnProperty.call(projectData.towers, towerIdentifier)){
                for(i = 0; i < listing.length; i++){
                    unitInfo = listing[i];
                    unitIdentifier = getIdentifier(unitInfo.unitName);
                    unitTowerIdentifier = getIdentifier(unitInfo.towerName);
                    
                    if(unitTowerIdentifier !== towerIdentifier){ // If listing does not belong to towerIdentifier then skip
                        continue;
                    }

                    tower = projectData.towers[unitTowerIdentifier];
                    
                    if(tower && tower.rotationAngle[unitInfo.rotationAngle] && unitInfo.rotationAngle){
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier] = unitInfo;
                        delete unitInfo.rotationAngle;
                    }else if(tower && tower.rotationAngle && unitInfo.rotationAngle){
                        tower.rotationAngle[unitInfo.rotationAngle] = {};  
                        tower.rotationAngle[unitInfo.rotationAngle].towerImageUrl = zipImagePath+'/'+unitInfo.towerImageName;
                        tower.rotationAngle[unitInfo.rotationAngle].listing = {};
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier]  = unitInfo;
                    }
                }
            }
        }
    }

    function useTowersCSVData(towers){
        for(var towerIdentifier in projectData.towers){
            if(hasOwnProperty.call(projectData.towers, towerIdentifier)){
                var towerName = projectData.towers[towerIdentifier].towerName;
                if(towerIdentifier && towers[towerName]){
                    projectData.towers[towerIdentifier].displayOrder = towers[towerName].displayOrder ? parseInt(towers[towerName].displayOrder, 10) : 0;
                    projectData.towers[towerIdentifier].hoverImageUrl = zipImagePath+towers[towerName].hoverImageName;
                    projectData.towers[towerIdentifier].towerHoverSvg   = towers[towerName].towerHoverSvg;
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
    
        getSvgData(zipPath+'/'+config.csv.towerselectScreen).success(function(data){
            var listing = processCsvDataToArray(data);
            useTowerUnitsCSVData(listing); 
        });

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
        projectData.baseUrl = '#/projectname-'+projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.address = projectDetail.address;
        projectData.bgImage = zipImagePath+config.backgroundImage;

        var towersUnitInfo = {}, towerIdentifier;
        for(i = 0; i < towers_length; i += 1){
            
            tower = projectDetail.towers[i];
            towerIdentifier = getIdentifier(tower.towerName);
            towers[towerIdentifier] = {};
            towerMap[tower.towerId] = tower.towerName;
            towers[towerIdentifier].towerId = tower.towerId;
            towers[towerIdentifier].towerIdentifier = towerIdentifier;
            towers[towerIdentifier].towerName = tower.towerName;
            towers[towerIdentifier].listings  = {};
            towers[towerIdentifier].rotationAngle = {};
            towersUnitInfo[towerIdentifier] = {};
            towers[towerIdentifier].unitInfo = [];
        }


        projectData.towers = towers;

        for(i = 0; i < listings_length; i += 1){
            var towerId     = projectDetail.listings[i].towerId;
            var towerName   = towerMap[towerId];
            var towerIdentifier = getIdentifier(towerName);
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
            
            if(towerIdentifier){
                var unitIdentifier = getIdentifier(listing.flatNumber);
                projectData.towers[towerIdentifier].listings[unitIdentifier] = flatUnit;
            }

            // keep unitInfo in local variable towersUnitInfo
            if(towersUnitInfo[towerIdentifier] && flatUnit.bedrooms){
                var unitTypeIndex = flatUnit.bedrooms+'BHK';
                if(flatUnit.isAvailable && hasOwnProperty.call(towersUnitInfo[towerIdentifier], unitTypeIndex)){ // 
                   towersUnitInfo[towerIdentifier][unitTypeIndex] += 1;
                }else if(flatUnit.isAvailable){
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 1;
                }else {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 0;
                }
            }


        }

         // calculate unitInfo for each tower
        for(var towerIdentifier in towersUnitInfo){
            if(hasOwnProperty.call(towersUnitInfo, towerIdentifier)){
                var tower = projectData.towers[towerIdentifier];
                for(var unitBedroom in towersUnitInfo[towerIdentifier]){
                    if(hasOwnProperty.call(towersUnitInfo[towerIdentifier], unitBedroom)){
                        projectData.towers[towerIdentifier].unitInfo.push({
                            'type': unitBedroom,
                            'available': towersUnitInfo[towerIdentifier][unitBedroom] 
                        });
                    }
                }
            }
        }
        
    }


    function getProjectData(projectId) {
        if(projectData && Object.keys(projectData).length) {
            return projectData;
        }

        var apiUrl  = "http://192.168.1.8:8080/app/v4/project-detail/"+projectId+"?selector={%22fields%22:[%22projectId%22,%22images%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22primaryOnline%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22]}";
        var apiData,
        params = {success_callback: function(response){
            apiData = response;
        }};

        ajax(apiUrl, params);
        parseApiData(apiData);
        parseAllCSVData();

        return projectData;
    };

    return getProjectData;
})();