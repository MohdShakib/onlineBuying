"use strict";
var getProjectData = (function() {

    var zipPath = 'zip-file',
        zipImagePath = '/' + zipPath + '/img/';

    function getIdentifier(string) {
        var identifier = '';
        if (string) {
            identifier = string.toLowerCase().replace(' ', '-');
        }
        return identifier;
    }

    function processCsvDataToArray(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var tarr = {};
                for (var j = 0; j < headers.length; j++) {
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

        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var tarr = {};
                for (var j = 0; j < headers.length; j++) {
                    tarr[headers[j]] = data[j];
                }
                lines[tarr[keyIdentifier]] = tarr;
            }
        }
        return lines;
    }

    function unitUniqueIdentifier(unitIdentifier, towerIdentifier) {
        return unitIdentifier + '-' + towerIdentifier;
    }

    function useTowerUnitsCSVData(listing) {
        var i, towerIdentifier, unitInfo, tower, unitTowerIdentifier, unitIdentifier, unit;
        for (var towerIdentifier in projectData.towers) {
            if (hasOwnProperty.call(projectData.towers, towerIdentifier)) {
                for (i = 0; i < listing.length; i++) {
                    unitInfo = listing[i];
                    unitIdentifier = getIdentifier(unitInfo.unitName);
                    unitInfo.unitIdentifier = unitIdentifier;
                    unitInfo.unitTypeIdentifier = unitInfo.unitType ? getIdentifier(unitInfo.unitType) : null;
                    unitTowerIdentifier = getIdentifier(unitInfo.towerName);

                    if (unitTowerIdentifier !== towerIdentifier) { // If listing does not belong to towerIdentifier then skip
                        continue;
                    }

                    unitInfo.unitUniqueIdentifier = unitUniqueIdentifier(unitIdentifier, unitTowerIdentifier);

                    unitInfo.towerIdentifier = unitTowerIdentifier;
                    delete unitInfo.towerName;

                    tower = projectData.towers[unitTowerIdentifier];

                    if (tower.listings[unitIdentifier]) { // get unit availability status
                        unitInfo.isAvailable = tower.listings[unitIdentifier].isAvailable;
                    }

                    var unitSvgOnTower = unitInfo.unitSvgOnTower ? unitInfo.unitSvgOnTower.split(' ') : null;
                    unitInfo.unitSvgOnTower = unitSvgOnTower;
                    if (tower && tower.rotationAngle[unitInfo.rotationAngle] && unitInfo.rotationAngle) {
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier] = unitInfo;
                    } else if (tower && tower.rotationAngle && unitInfo.rotationAngle) {
                        tower.rotationAngle[unitInfo.rotationAngle] = {};
                        tower.rotationAngle[unitInfo.rotationAngle].towerImageUrl = zipImagePath + unitInfo.towerImageName;
                        tower.rotationAngle[unitInfo.rotationAngle].listing = {};
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier] = unitInfo;
                    }
                    delete unitInfo.towerImageName;
                }
            }
        }
    }

    function useTowersCSVData(towers) {
        for (var towerIdentifier in projectData.towers) {
            if (hasOwnProperty.call(projectData.towers, towerIdentifier)) {
                var towerName = projectData.towers[towerIdentifier].towerName;
                if (towerIdentifier && towers[towerName]) {
                    projectData.towers[towerIdentifier].displayOrder = towers[towerName].displayOrder ? parseInt(towers[towerName].displayOrder, 10) : 0;
                    projectData.towers[towerIdentifier].hoverImageUrl = zipImagePath + towers[towerName].hoverImageName;
                    projectData.towers[towerIdentifier].towerHoverSvg = towers[towerName].towerHoverSvg;
                }
            }

        }
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function parseDetailsField(details) {
        var response = '',
            length = details.length;
        if (details && details.length && details[0] == '"' && details[length - 1] == '"') {
            details = details.substring(1, length - 1);
            length = details.length;
            for (var i = 0; i < length; i++) {
                if (!(details[i] == '"' && details[i + 1] == '"')) {
                    response += details[i];
                }
            }
        }
        response = htmlEntities(response);
        return response;
    }

    function processUnitSvgs(unitInfo, type) {
        var response = (type == 'link') ? {} : [],
            details;

        for (var i = 1; i <= 1000; i++) {
            var partial = 'view' + i + '-';
            if (hasOwnProperty.call(unitInfo, partial + 'svg') && unitInfo[partial + 'svg'].length) {
                details = unitInfo[partial + 'details'];
                var item = {
                    name: unitInfo[partial + 'name'],
                    svgPath: unitInfo[partial + 'svg'],
                    svg2dPath: unitInfo[partial + 'svg-2d'],
                    type: unitInfo[partial + 'type']
                }

                if (type == 'link' && item.type == 'link') {
                    item.details = zipImagePath + details;
                    var identifier = getIdentifier(item.name);
                    response[identifier] = item;
                } else if (type != 'link' && item.type != 'link') {
                    item.details = parseDetailsField(details);
                    response.push(item);
                }

            } else {
                return response;
            }
        }

        return response;
    }

    function useUnitplanInfoCSVData(unitplanInfo) {
        var unitsInfo = {},
            singleUnitInfo = {},
            singleUnitInfoIdentifier;
        if (unitplanInfo && Object.keys(unitplanInfo).length) {
            for (var unitPlankey in unitplanInfo) {
                singleUnitInfo = {};
                singleUnitInfoIdentifier = getIdentifier(unitPlankey);
                if (hasOwnProperty.call(unitplanInfo, unitPlankey)) {
                    singleUnitInfo.unitType = unitplanInfo[unitPlankey].unitName;
                    singleUnitInfo.unitIdentifier = singleUnitInfoIdentifier;
                    singleUnitInfo.unitImageUrl = zipImagePath + unitplanInfo[unitPlankey].unitImageName;
                    singleUnitInfo.unitImage2dUrl = zipImagePath + unitplanInfo[unitPlankey].unitImageName2d;
                    singleUnitInfo.clusterplanImageUrl = unitplanInfo[unitPlankey].clusterplan ? zipImagePath + unitplanInfo[unitPlankey].clusterplan : undefined;
                    singleUnitInfo.morningSunlightImageUrl = unitplanInfo[unitPlankey]['sun-mor'] && unitplanInfo[unitPlankey]['sun-mor'].length ? zipImagePath + unitplanInfo[unitPlankey]['sun-mor'] : undefined;
                    singleUnitInfo.afternoonSunlightImageUrl = unitplanInfo[unitPlankey]['sun-aft'] && unitplanInfo[unitPlankey]['sun-aft'].length ? zipImagePath + unitplanInfo[unitPlankey]['sun-aft'] : undefined;
                    singleUnitInfo.eveningSunlightImageUrl = unitplanInfo[unitPlankey]['sun-eve'] && unitplanInfo[unitPlankey]['sun-eve'].length ? zipImagePath + unitplanInfo[unitPlankey]['sun-eve'] : undefined;
                    singleUnitInfo.svgs = processUnitSvgs(unitplanInfo[unitPlankey]);
                    singleUnitInfo.linkSvgs = processUnitSvgs(unitplanInfo[unitPlankey], 'link');
                    unitsInfo[singleUnitInfoIdentifier] = singleUnitInfo;
                }
            }
        }
        projectData.unitTypes = unitsInfo;
    }

    function useAmenitiesCSVData(amenities) {
        projectData.amenities = {};
        for (var amenity in amenities) {
            if (hasOwnProperty.call(amenities, amenity)) {
                var amenityData = amenities[amenity];
                projectData.amenities[amenityData.amenityName] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath + amenityData.imageName,
                    amenitySvg: amenityData.amenitySvg

                };
            }
        }
    }

    function parseAllCSVData() {
        utils.getSvgData(zipPath + '/' + config.csv.masterplanScreen).success(function(data) {
            var towers = processCsvDataToObject(data, 'towerName');
            if (towers && projectData.towers && Object.keys(projectData.towers).length && Object.keys(towers).length) {
                useTowersCSVData(towers);
            }
        });

        utils.getSvgData(zipPath + '/' + config.csv.amenitiesHotspots).success(function(data) {
            var amenities = processCsvDataToObject(data, 'amenityName');
            if (amenities && Object.keys(amenities).length) {
                useAmenitiesCSVData(amenities);
            }
        });

        utils.getSvgData(zipPath + '/' + config.csv.towerselectScreen).success(function(data) {
            var listing = processCsvDataToArray(data);
            useTowerUnitsCSVData(listing);
        });

        utils.getSvgData(zipPath + '/' + config.csv.unitplanInfo).success(function(data) {
            var data = processCsvDataToObject(data, 'unitName');
            useUnitplanInfoCSVData(data);
        });

    }



    var hasOwnProperty = Object.prototype.hasOwnProperty,
        projectData = {};

    var parseApiData = function(projectDetail) {

        if (!projectDetail) {
            return;
        }

        var facingMap = {
                "1": "East",
                "2": "West",
                "3": "North",
                "4": "South",
                "5": "NorthEast",
                "6": "SouthEast",
                "7": "NorthWest",
                "8": "SouthWest"
            },
            towerMap = {},
            _getPropertyById = function(data, propertyId) {
                var i, length = data.length,
                    response = {};
                if (data && data.length) {
                    for (i = 0; i < length; i += 1) {
                        if (data[i] && data[i].propertyId == propertyId) {
                            return data[i];
                        }
                    }
                }
                return response;
            };

        if (!(projectDetail && Object.keys(projectDetail).length)) {
            return;
        }

        var towers_length = projectDetail.towers ? projectDetail.towers.length : 0,
            listings_length = projectDetail.listings ? projectDetail.listings.length : 0,
            i = 0,
            towers = {},
            tower;


        projectData.projectId = projectDetail.projectId;
        projectData.baseUrl = 'projectname-' + projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.address = projectDetail.address;
        projectData.bgImage = zipImagePath + config.backgroundImage;

        var towersUnitInfo = {},
            towerIdentifier;
        for (i = 0; i < towers_length; i += 1) {

            tower = projectDetail.towers[i];
            towerIdentifier = getIdentifier(tower.towerName);
            towers[towerIdentifier] = {};
            towerMap[tower.towerId] = tower.towerName;
            towers[towerIdentifier].towerId = tower.towerId;
            towers[towerIdentifier].towerIdentifier = towerIdentifier;
            towers[towerIdentifier].towerName = tower.towerName;
            towers[towerIdentifier].listings = {};
            towers[towerIdentifier].rotationAngle = {};
            towersUnitInfo[towerIdentifier] = {};
            towers[towerIdentifier].unitInfo = [];
        }


        projectData.towers = towers;
        projectData.unitTypes = {};
        projectData.specifications = projectDetail.specifications || {};

        for (i = 0; i < listings_length; i += 1) {
            var towerId = projectDetail.listings[i].towerId;
            var towerName = towerMap[towerId];
            var towerIdentifier = getIdentifier(towerName);
            var listing = projectDetail.listings[i],
                unitIdentifier = getIdentifier(listing.flatNumber),
                flatUnit = {};
            flatUnit.listingAddress = listing.flatNumber;
            flatUnit.unitIdentifier = unitIdentifier;
            flatUnit.unitUniqueIdentifier = unitUniqueIdentifier(unitIdentifier, towerIdentifier);
            flatUnit.listingId = listing.id;
            flatUnit.towerIdentifier = towerIdentifier;
            flatUnit.floor = listing.floor;
            flatUnit.isAvailable = (listing.bookingStatusId == 1 ? true : false); // available if bookingStatusId = 1
            flatUnit.bookingStatusId = listing.bookingStatusId;
            flatUnit.facing = facingMap[listing.facingId];
            flatUnit.bookingAmount = listing.bookingAmount;
            flatUnit.price = listing.bookingAmount * 1000;

            var propertyDetail = _getPropertyById(projectDetail.properties, listing.propertyId);

            flatUnit.bedrooms = propertyDetail.bedrooms;
            flatUnit.size = propertyDetail.size;
            flatUnit.measure = propertyDetail.measure;

            if (towerIdentifier) {
                projectData.towers[towerIdentifier].listings[unitIdentifier] = flatUnit;
            }

            // keep unitInfo in local variable towersUnitInfo
            if (towersUnitInfo[towerIdentifier] && flatUnit.bedrooms) {
                var unitTypeIndex = flatUnit.bedrooms + 'BHK';
                if (flatUnit.isAvailable && hasOwnProperty.call(towersUnitInfo[towerIdentifier], unitTypeIndex)) { // 
                    towersUnitInfo[towerIdentifier][unitTypeIndex] += 1;
                } else if (flatUnit.isAvailable) {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 1;
                } else if (!towersUnitInfo[towerIdentifier][unitTypeIndex]) {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 0;
                }
            }


        }

        // calculate unitInfo for each tower
        for (var towerIdentifier in towersUnitInfo) {
            if (hasOwnProperty.call(towersUnitInfo, towerIdentifier)) {
                var tower = projectData.towers[towerIdentifier];
                for (var unitBedroom in towersUnitInfo[towerIdentifier]) {
                    if (hasOwnProperty.call(towersUnitInfo[towerIdentifier], unitBedroom)) {
                        projectData.towers[towerIdentifier].unitInfo.push({
                            'type': unitBedroom,
                            'available': towersUnitInfo[towerIdentifier][unitBedroom]
                        });
                    }
                }
            }
        }

        var isAvailable = false;
        for (var towerIdentifier in projectData.towers) {
            tower = projectData.towers[towerIdentifier];
            isAvailable = false;
            for (var unitKey in tower.listings) {
                if (hasOwnProperty.call(tower.listings, unitKey) && tower.listings[unitKey].bookingStatusId == 1) {
                    isAvailable = true;
                }
            };
            tower.isAvailable = isAvailable;
        }

    }


    function getProjectData(projectId) {
        if (projectData && Object.keys(projectData).length) {
            return projectData;
        }

        var apiUrl = "http://192.168.1.8:8080/app/v4/project-detail/" + projectId + "?selector={%22paging%22:{%22start%22:0,%22rows%22:100},%22fields%22:[%22projectId%22,%22images%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22primaryOnline%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22,%22specifications%22]}";
        var apiUrl = "apiData.json";
        var apiData,
            params = {
                success_callback: function(response) {
                    apiData = response;
                }
            };

        utils.ajax(apiUrl, params);
        parseApiData(apiData);
        parseAllCSVData();

        console.log(projectData);
        return projectData;
    };

    return getProjectData;
})();