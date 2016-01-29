"use strict";
var getProjectData = (function() {

    var zipPath = './zip-file/';
    var zipImagePath = zipPath + 'img/';

    var googleMapData = {
        upperEnd:{
            lat: 28.379743,
            lng: 76.978000
        },
        lowerEnd:{
            lat: 28.382616,
            lng: 76.980592
        },
        imagePath: zipImagePath+'501660.png'
    };

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

    function processCsvDataToObject(allText, keyIdentifier) {
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

    function processJsonArrayToObject(array, keyIdentifier) {
        var obj = {};
        for (var i in array) {
            var item = array[i];
            obj[item[keyIdentifier]] = item;
        }
        return obj;
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
                    unitIdentifier = utils.getIdentifier(unitInfo.unitName);
                    unitInfo.unitIdentifier = unitIdentifier;
                    unitInfo.unitTypeIdentifier = unitInfo.unitType ? utils.getIdentifier(unitInfo.unitType) : null;
                    unitInfo.unitTypeIdentifierArr = [];
                    unitInfo.unitTypeIdentifierArr.push(unitInfo.unitTypeIdentifier);
                    for(var k in unitInfo){
                      if(k.indexOf('unitType-') >  -1 && unitInfo[k] !== "") {
                        var unitTypeIdentifierI = utils.getIdentifier(unitInfo[k]);
                        unitInfo.unitTypeIdentifierArr.push(unitTypeIdentifierI);
                      }
                    }
                    unitTowerIdentifier = utils.getIdentifier(unitInfo.towerName);

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
                    var validUnitFlag = false;
                    unitInfo.unitSvgOnTower = unitSvgOnTower;
                    if (tower && unitInfo.rotationAngle && tower.rotationAngle[unitInfo.rotationAngle]) {
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier] = unitInfo;
                        validUnitFlag = true;
                    } else if (tower && tower.rotationAngle && unitInfo.rotationAngle) {
                        tower.rotationAngle[unitInfo.rotationAngle] = {};
                        tower.rotationAngle[unitInfo.rotationAngle].towerImageUrl = zipImagePath + unitInfo.towerImageName;
                        tower.rotationAngle[unitInfo.rotationAngle].listing = {};
                        tower.rotationAngle[unitInfo.rotationAngle].listing[unitIdentifier] = unitInfo;
                        validUnitFlag = true;
                        if(unitInfo.towerMinimap){
                            tower.rotationAngle[unitInfo.rotationAngle].towerMinimapUrl = zipImagePath + unitInfo.towerMinimap;
                        }
                    }

                    if(tower.stableViewAngles && (tower.stableViewAngles.indexOf(unitInfo.rotationAngle) == -1) && unitInfo.rotationAngle){
                        tower.stableViewAngles.push(unitInfo.rotationAngle);
                        tower.stableViewAngles.sort(function(a, b) {
                            return a - b;
                        });
                    }

                    if (tower.listings[unitIdentifier] && validUnitFlag) {
                        tower.listings[unitIdentifier].rotationAnglesAvailable = tower.listings[unitIdentifier].rotationAnglesAvailable;
                        tower.listings[unitIdentifier].rotationAnglesAvailable.push(unitInfo.rotationAngle);
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
                    projectData.towers[towerIdentifier].towerTooltipSvg = towers[towerName].towerTooltipSvg;
                }
            }
        }
    }

    function useTowerRotationData(towers) {
        for (var towerIdentifier in projectData.towers) {
            if (hasOwnProperty.call(projectData.towers, towerIdentifier)) {
                var towerName = projectData.towers[towerIdentifier].towerName;
                if (towerIdentifier && towers[towerName]) {
                    var numberOfFrames = parseInt(towers[towerName].numberOfFrames);
                    var imageTemplate = towers[towerName].imageName;

                    var keyFrame = {};
                    for (var i = 1; i < 100; i++) {
                        if (towers[towerName]['link' + i] && towers[towerName]['keyframe' + i] && towers[towerName]['link' + i].length && towers[towerName]['keyframe' + i]) {
                            var key = parseInt(towers[towerName]['link' + i]),
                                frame = parseInt(towers[towerName]['keyframe' + i]);
                            keyFrame[key] = frame;
                        } else {
                            break;
                        }

                    }

                    var keys = Object.keys(keyFrame);
                    keys.sort(function(a, b) {
                        return a - b;
                    });

                    // assign rotation angle and images for them
                    var newKeyFrame = projectData.towers[towerIdentifier].rotationAngle;
                    for (var j = 0; j < keys.length; j++) {

                        var max;
                        if (keyFrame[keys[j + 1]] === undefined) {
                            max = keyFrame[keys[0]];
                        } else {
                            max = keyFrame[keys[j + 1]];
                        }

                        var rotateAgainTill = 0;
                        if (max < keyFrame[keys[j]]) {
                            rotateAgainTill = max;
                            max = numberOfFrames;
                        }

                        var l = 1;
                        for (var k = keyFrame[keys[j]]; k < max; k++) {
                            var angle = parseInt(keys[j]) + l;
                            newKeyFrame[angle] = {
                                towerImageUrl: zipImagePath + imageTemplate.replace(/##/, utils.addLeadingZeros(k + 1, 2))
                            };
                            l++;
                        }

                        if (rotateAgainTill) {
                            for (var k = 0; k < rotateAgainTill; k++) {
                                var angle = parseInt(keys[j]) + l;
                                newKeyFrame[angle] = {
                                    towerImageUrl: zipImagePath + imageTemplate.replace(/##/, utils.addLeadingZeros(k + 1, 2))
                                };
                                l++;
                            }
                        }

                    }

                    projectData.towers[towerIdentifier].rotationAngle = newKeyFrame;

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
                };

                if (type == 'link' && item.type == 'link') {
                    item.details = zipImagePath + details;
                    var identifier = utils.getIdentifier(item.name + i);
                    response[identifier] = item;
                } else if (type != 'link' && item.type != 'link') {
                    item.details = details; //parseDetailsField(details);
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
                singleUnitInfoIdentifier = utils.getIdentifier(unitPlankey);
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
                projectData.amenities[utils.getIdentifier(amenityData.amenityName)] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath + amenityData.imageName,
                    amenitySvg: amenityData.amenitySvg

                };
            }
        }
    }

    function parseAllCSVData() {
        var csv = '.csv';
        ajaxUtils.getSvgData(zipPath + config.dataFiles.masterplanScreen + csv).success(function(data) {
            var towers = processCsvDataToObject(data, 'towerName');
            if (towers && projectData.towers && Object.keys(projectData.towers).length && Object.keys(towers).length) {
                useTowersCSVData(towers);
            }
        });

        ajaxUtils.getSvgData(zipPath + config.dataFiles.amenitiesHotspots + csv).success(function(data) {
            var amenities = processCsvDataToObject(data, 'amenityName');
            if (amenities && Object.keys(amenities).length) {
                useAmenitiesCSVData(amenities);
            }
        });

        ajaxUtils.getSvgData(zipPath + config.dataFiles.towerselectScreen + csv).success(function(data) {
            var listing = processCsvDataToArray(data);
            useTowerUnitsCSVData(listing);
        });

        ajaxUtils.getSvgData(zipPath + config.dataFiles.unitplanInfo + csv).success(function(data) {
            var data = processCsvDataToObject(data, 'unitName');
            useUnitplanInfoCSVData(data);
        });

        ajaxUtils.getSvgData(zipPath + config.dataFiles.towerRotation + csv).success(function(data) {
            var data = processCsvDataToObject(data, 'towerName');
            useTowerRotationData(data);
        });
    }

    function parseAllJSONData() {
        var json = '.json';

        var json1 = ajaxUtils.getJsonData(zipPath + config.dataFiles.masterplanScreen + json, config.dataFiles.masterplanScreen);

        var json2 = ajaxUtils.getJsonData(zipPath + config.dataFiles.amenitiesHotspots + json, config.dataFiles.amenitiesHotspots);

        var json3 = ajaxUtils.getJsonData(zipPath + config.dataFiles.towerselectScreen + json, config.dataFiles.towerselectScreen);

        var json4 = ajaxUtils.getJsonData(zipPath + config.dataFiles.unitplanInfo + json, config.dataFiles.unitplanInfo);

        var json5 = ajaxUtils.getJsonData(zipPath + config.dataFiles.towerRotation + json, config.dataFiles.towerRotation);

        return $.when(json1, json2, json3, json4, json5).done(function(data1, data2, data3, data4, data5){

            var towers = processJsonArrayToObject(data1[0], 'towerName');
            if (towers && projectData.towers && Object.keys(projectData.towers).length && Object.keys(towers).length) {
                useTowersCSVData(towers);
            }

            var amenities = processJsonArrayToObject(data2[0], 'amenityName');
            if (amenities && Object.keys(amenities).length) {
                useAmenitiesCSVData(amenities);
            }

            var listing = data3[0];
            useTowerUnitsCSVData(listing);

            var data = processJsonArrayToObject(data4[0], 'unitName');
            useUnitplanInfoCSVData(data);

            var data = processJsonArrayToObject(data5[0], 'towerName');
            useTowerRotationData(data);

            utils.log(projectData);
            projectData.googleMapData = googleMapData;
            return projectData;

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
            bookingStatusMap = {
                "1": "Available",
                "2": "SoldOut",
                "3": "OnHold"
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

        // Media
        for (i in projectDetail.media) {
            if (projectDetail.media[i].objectMediaType.type == 'ListingOnlineSale') {
                var url = projectDetail.media[i].absoluteUrl;
                if (url) {
                    projectData.assetsUrl = url.substr(0, url.lastIndexOf('/') + 1);
                }
                if (!config.localZip && projectData.assetsUrl) {
                    zipPath = projectData.assetsUrl;
                    zipImagePath = zipPath + 'img/';
                }
            }
        }

        var projectIdentifier = utils.getIdentifier(projectDetail.name);
        projectData.projectId = projectDetail.projectId;
        projectData.projectUrl = projectDetail.URL;
        projectData.baseUrl =    config.urlAppName+'/'+projectIdentifier + '-' + projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.projectIdentifier = utils.getIdentifier(projectDetail.name);
        projectData.builderName = projectDetail.builder.name;
        projectData.address = projectDetail.address;
        projectData.bgImage = zipImagePath + config.backgroundImage;
        projectData.description = projectDetail.description;
        projectData.totalEastFacingAvailableCount = 0;
        // projectData.fairEnabled = projectDetail.hasPrimaryExpandedListing ==  3 ? false : true;
        projectData.fairEnabled = true;

        // Project Ameneties
        projectData.projectAmeneties = {};
        for (var i in projectDetail.projectAmenities) {
            var projectAmenity = projectDetail.projectAmenities[i],
                amenity = {};
            amenity.displayName = projectAmenity.amenityDisplayName;
            amenity.name = projectAmenity.amenityMaster.amenityName;
            amenity.abbreviation = projectAmenity.amenityMaster.abbreviation;
            amenity.isVerified = projectAmenity.verified;
            projectData.projectAmeneties[projectAmenity.amenityMaster.abbreviation] = amenity;
        }

        // Project Properties
        projectData.properties = {};
        for (var i in projectDetail.properties) {
            var projectProperty = projectDetail.properties[i],
                property = {};
            property.propertyId = projectProperty.propertyId;
            property.bedrooms = projectProperty.bedrooms;
            if (projectProperty.studyRoom) {
                property.bedrooms += 0.5;
            }
            property.bathrooms = projectProperty.bathrooms;
            property.size = projectProperty.size;
            property.measure = projectProperty.measure;
            property.price = projectProperty.pricePerUnitArea * projectProperty.size;
            property.URL = projectProperty.URL;
            property.isPropertySoldOut = projectProperty.isPropertySoldOut;

            // Floor plan
            for (var j in projectProperty.images) {
                if (projectProperty.images[j].imageType.type == 'floorPlan') {
                    property.floorPlanImage = projectProperty.images[j].absolutePath;
                }
            }

            // Coupon Inventory
            property.bookingStatus = "SoldOut";
            property.bookingAmount = 20000;
            property.couponId = 0;
            if (projectProperty.couponCatalogue) {
                if(projectProperty.couponCatalogue.inventoryLeft) {
                    property.bookingStatus = "Available";
                }
                property.couponId = projectProperty.couponCatalogue.id;
                property.bookingAmount = projectProperty.couponCatalogue.couponPrice;
            }

            projectData.properties[projectProperty.propertyId] = property;
        }

        // Payment plan image
        for (i in projectDetail.images) {
            if (projectDetail.images[i].imageType.type == 'paymentPlan') {
                projectData.paymentPlanImage = projectDetail.images[i].absolutePath;
            }
            if (projectDetail.images[i].imageType.type == 'main') {
                projectData.mainImage = projectDetail.images[i].absolutePath;
            }
        }

        // Offer
        projectData.offer = "attractive discounts";
        if (projectDetail.offers && projectDetail.offers[0]) {
            projectData.offer = projectDetail.offers[0].offerDesc;
        }

        // City
        projectData.city = projectDetail.locality && projectDetail.locality.suburb && projectDetail.locality.suburb.city ? projectDetail.locality.suburb.city.label : '';
        projectData.cityId = projectDetail.locality && projectDetail.locality.suburb && projectDetail.locality.suburb.city ? projectDetail.locality.suburb.city.id : '';


        var towersUnitInfo = {},
            towerIdentifier;

        var allTowers = [];
        if(config.setJsonDataPriorityForTest){
            ajaxUtils.getJsonData(zipPath+config.dataFiles.masterplanScreen+ '.json', config.dataFiles.masterplanScreen).then(function(data){
                allTowers = data;
                towers_length = data.length;
            });
        }

        for (var i = 0; i < towers_length; i += 1) {

            if(config.setJsonDataPriorityForTest){
                tower = projectDetail.towers[0];
                tower.towerName = allTowers[i].towerName;
                tower.towerId = i+1;
            }else{
                tower = projectDetail.towers[i];
            }

            /** towername short and long name logic start **/
            var longName =  tower.towerName;
            var nameArray = tower.towerName.split(' ');
            var shortName = nameArray.reduce(function (a, b) { return a.length < b.length ? a : b; });

            if(shortName && shortName.length > 2){
                shortName = tower.towerName.substr(0,2);
                longName = tower.towerName;
            }

            if(longName.length <= 2){
                longName =  'Tower '+tower.towerName;
            }
            /** long short name  logic ends **/

            towerIdentifier = utils.getIdentifier(tower.towerName);
            towers[towerIdentifier] = {};
            towerMap[tower.towerId] = tower.towerName;
            towers[towerIdentifier].shortName = shortName;
            towers[towerIdentifier].longName = longName;
            towers[towerIdentifier].towerId = tower.towerId;
            towers[towerIdentifier].towerIdentifier = towerIdentifier;
            towers[towerIdentifier].towerName = tower.towerName;
            towers[towerIdentifier].listings = {};
            towers[towerIdentifier].rotationAngle = {};
            towers[towerIdentifier].totalAvailableCount = 0; //contains count for total flats available in the tower
            towers[towerIdentifier].totalEastFacingAvailableCount = 0; //contains count for total east facing flats available in the tower
            towers[towerIdentifier].stableViewAngles = [];
            towers[towerIdentifier].bookingStatus = bookingStatusMap['1'];
            towersUnitInfo[towerIdentifier] = {};
            towers[towerIdentifier].unitInfo = [];
        }


        projectData.towers = towers;
        projectData.unitTypes = {};
        projectData.pricingSubcategories = {};
        projectData.specifications = projectDetail.specifications || {};


        var allUnits = [];
        if(config.setJsonDataPriorityForTest){
            ajaxUtils.getJsonData(zipPath+config.dataFiles.towerselectScreen+'.json', config.dataFiles.towerselectScreen).then(function(data){
               allUnits = data;
               listings_length = data.length;
            });
        }


        for (i = 0; i < listings_length; i += 1) {
            if (!config.setJsonDataPriorityForTest && projectDetail.listings[i].isDeleted) {
                continue;
            }


            var towerName, listing, towerId;
            if(config.setJsonDataPriorityForTest){
                towerId = allUnits[i].towerId;
                towerName = allUnits[i].towerName;
                listing = projectDetail.listings[0];
                listing.flatNumber = allUnits[i].unitName;
            }else{
                towerId = projectDetail.listings[i].towerId;
                towerName = towerMap[towerId];
                listing = projectDetail.listings[i];
            }



            var towerIdentifier = utils.getIdentifier(towerName);
            var unitIdentifier = utils.getIdentifier(listing.flatNumber),
                flatUnit = {};



            if (config.allUnitsAvailable) {
                listing.bookingStatusId = 1;
            }

            flatUnit.listingAddress = listing.flatNumber;
            flatUnit.unitIdentifier = unitIdentifier;
            flatUnit.unitUniqueIdentifier = unitUniqueIdentifier(unitIdentifier, towerIdentifier);
            flatUnit.listingId = listing.id;
            flatUnit.towerIdentifier = towerIdentifier;
            flatUnit.towerId = towerId;
            flatUnit.floor = listing.floor;
            flatUnit.isAvailable = (listing.bookingStatusId == 1 ? true : false); // available if bookingStatusId = 1
            flatUnit.bookingStatus = bookingStatusMap[listing.bookingStatusId];
            flatUnit.facing = facingMap[listing.facingId];
            flatUnit.bookingAmount = listing.bookingAmount;
            flatUnit.discount = listing.discount ? listing.discount : undefined;
            flatUnit.discountDescription = listing.discountDescription;
            flatUnit.viewDirections = listing.viewDirections;
            flatUnit.rotationAnglesAvailable = [];


            var propertyDetail = _getPropertyById(projectDetail.properties, listing.propertyId);

            // Walkthrough video
            flatUnit.walkthrough = {};
            for (var j in propertyDetail.video) {
                var video = propertyDetail.video[j];
                if (video.objectMediaType.type == "VideoWalkthrough") {
                    var videoUrlDetails = video.mediaExtraAttributes.videoUrlDetails;
                    for (var k in videoUrlDetails) {
                        if (videoUrlDetails[k].resolution == 270 && videoUrlDetails[k].bitRate == 300) {
                            flatUnit.walkthrough.video = videoUrlDetails[k].url;
                            flatUnit.walkthrough.image = video.imageUrl;
                        }
                    }
                }
            }

            // if (!flatUnit.walkthrough.video) {
            //     flatUnit.walkthrough.video = "http://d1vh6m45iog96e.cloudfront.net/4/2/5000168/106/2/supertech-capetown-floor-plan-2bhk-2t-930-sq-ft-5000168.mp4";
            //     flatUnit.walkthrough.image = "https://im.proptiger.com/4/2/5000168/106/2/supertech-capetown-floor-plan-2bhk-2t-930-sq-ft-5000168.jpg";
            // }

            flatUnit.bedrooms = propertyDetail.bedrooms;
            if (propertyDetail.studyRoom) {
                flatUnit.bedrooms += 0.5;
            }
            flatUnit.bathrooms = propertyDetail.bathrooms;
            flatUnit.size = propertyDetail.size ? propertyDetail.size : 0;
            flatUnit.measure = propertyDetail.measure;

            flatUnit.price = listing.currentListingPrice ? listing.currentListingPrice.price : undefined;
            flatUnit.formattedPrice = flatUnit.price ? utils.getReadablePrice(listing.currentListingPrice.price) : undefined;
            flatUnit.basePrice = undefined;
            if (listing.currentListingPrice && listing.currentListingPrice.pricePerUnitArea && flatUnit.size) {
                flatUnit.basePrice = listing.currentListingPrice.pricePerUnitArea * flatUnit.size;
                flatUnit.basePrice = utils.getReadablePrice(flatUnit.basePrice);
            }

            flatUnit.unitPricingSubcategories = [];

            var propertyOtherPricingSubcategoryMappingsLength = listing.propertyOtherPricingSubcategoryMappings ? listing.propertyOtherPricingSubcategoryMappings.length : 0;
            if (propertyOtherPricingSubcategoryMappingsLength) {
                for (var j = 0; j < propertyOtherPricingSubcategoryMappingsLength; j++) {
                    var subCategory = listing.propertyOtherPricingSubcategoryMappings[j];
                    flatUnit.unitPricingSubcategories.push({
                        id: subCategory.otherPricingSubcategoryId,
                        price: subCategory.price
                    });
                }
            }

            if (towerIdentifier && projectData.towers[towerIdentifier]) {
                projectData.towers[towerIdentifier].listings[unitIdentifier] = flatUnit;
            }

            // keep unitInfo in local variable towersUnitInfo
            if (towersUnitInfo[towerIdentifier] && flatUnit.bedrooms) {
                var unitTypeIndex = flatUnit.bedrooms + 'BHK';
                if (flatUnit.isAvailable && hasOwnProperty.call(towersUnitInfo[towerIdentifier], unitTypeIndex)) {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] += 1;
                } else if (flatUnit.isAvailable) {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 1;
                } else if (!towersUnitInfo[towerIdentifier][unitTypeIndex]) {
                    towersUnitInfo[towerIdentifier][unitTypeIndex] = 0;
                }
            }


        }



        var otherPricingDetailsLength = projectDetail.otherPricingDetails ? projectDetail.otherPricingDetails.length : 0;
        for (var k = 0; k < otherPricingDetailsLength; k++) {
            var pricingDetail = projectDetail.otherPricingDetails[k];
            var otherPricingSubcategory = pricingDetail.otherPricingSubcategory;
            var key = otherPricingSubcategory.id;
            if (pricingDetail.towerId && pricingDetail.floorNumber) {
                key += "-" + pricingDetail.towerId + "-" + pricingDetail.floorNumber;
            }

            projectData.pricingSubcategories[key] = {
                id: otherPricingSubcategory.id,
                name: otherPricingSubcategory.component,
                masterName: otherPricingSubcategory.masterOtherPricingCategory.name,
                type: pricingDetail.otherPricingValueType.type,
                isMandatory: pricingDetail.mandatory
            };
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

        for (var towerIdentifier in projectData.towers) {
            tower = projectData.towers[towerIdentifier];
            var isAvailable = false,
                totalAvailableCount = 0,
                totalEastFacingAvailableCount = 0,
                viewDirections = 0,
                bookingStatus = 'SoldOut';
            for (var unitKey in tower.listings) {
                if (hasOwnProperty.call(tower.listings, unitKey) && tower.listings[unitKey].bookingStatus == 'Available') {
                    isAvailable = true;
                    totalAvailableCount += 1;
                    bookingStatus = 'Available';
                    if(tower.listings[unitKey].viewDirections.length>0){
                        viewDirections = tower.listings[unitKey].viewDirections;
                    }
                    if(tower.listings[unitKey].facing == 'East'){
                        totalEastFacingAvailableCount +=1;
                    }
                } else if (bookingStatus == 'SoldOut' && tower.listings[unitKey].bookingStatus == 'OnHold') {
                    bookingStatus = 'OnHold';
                }
            }
            tower.isAvailable = isAvailable;
            tower.totalAvailableCount = totalAvailableCount; // keeps count for flats available after applying fitler etc
            tower.totalEastFacingAvailableCount = totalEastFacingAvailableCount; // keeps count for east facing flats available after applying fitler etc
            tower.bookingStatus = bookingStatus;
            tower.viewDirections = viewDirections;
        }

    };


    function getProjectData(projectId, isPropertyPaymentUrl, callback) {

        if(config.setJsonDataPriorityForTest){
            zipPath = './zip-file-test/';
        }
        zipImagePath = zipPath + 'img/';

        if (projectData && Object.keys(projectData).length) {
            return callback(projectData);
        }

        var apiData,
            params = {
                successCallback: function(response) {
                    apiData = response;
                }
            };

        ajaxUtils.getProjectData(projectId, params);
        parseApiData(apiData);

        if(isPropertyPaymentUrl){ // to skip json read for property buying
           return callback(projectData);
        }

        if (config.readDataFromJson) {
            return parseAllJSONData().done(function(){
                console.log(projectData);
                callback(projectData);
                return;
            });
        } else {
            parseAllCSVData();
            callback(projectData);
            console.log(projectData);
        }

        return projectData;
    }

    return getProjectData;
})();
