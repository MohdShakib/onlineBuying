"use strict";
var getProjectData = (function() {

    var zipPath = './zip-file/',
        zipImagePath = zipPath + 'img/';

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
                    unitIdentifier = utils.getIdentifier(unitInfo.unitName);
                    unitInfo.unitIdentifier = unitIdentifier;
                    unitInfo.unitTypeIdentifier = unitInfo.unitType ? utils.getIdentifier(unitInfo.unitType) : null;
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

                    // adding tower rotation intermediate images
                    var rotationImages = {
                        5: 'A_0031.jpg',
                        10: 'A_0032.jpg',
                        15: 'A_0033.jpg',
                        20: 'A_0034.jpg',
                        25: 'A_0035.jpg',
                        30: 'A_0036.jpg',
                        35: 'A_0037.jpg',
                        40: 'A_0038.jpg',
                        45: 'A_0039.jpg',
                        50: 'A_0040.jpg',
                        55: 'A_0041.jpg',
                        60: 'A_0042.jpg',
                        65: 'A_0043.jpg',
                        70: 'A_0044.jpg',
                        75: 'A_0045.jpg',
                        80: 'A_0046.jpg',
                        85: 'A_0047.jpg',
                        90: 'A_0048.jpg',
                        95: 'A_0000.jpg',
                        100: 'A_0001.jpg',
                        105: 'A_0002.jpg',
                        110: 'A_0003.jpg',
                        115: 'A_0004.jpg',
                        
                        185: 'A_0005.jpg',
                        190: 'A_0006.jpg',
                        195: 'A_0007.jpg',
                        200: 'A_0008.jpg',
                        205: 'A_0009.jpg',
                        210: 'A_0010.jpg',
                        215: 'A_0011.jpg',
                        220: 'A_0012.jpg',
                        225: 'A_0013.jpg',
                        230: 'A_0014.jpg',
                        235: 'A_0015.jpg',
                        240: 'A_0016.jpg',
                        245: 'A_0017.jpg',
                        250: 'A_0018.jpg',
                        255: 'A_0019.jpg',
                        260: 'A_0020.jpg',
                        265: 'A_0021.jpg',
                        270: 'A_0022.jpg',
                        275: 'A_0023.jpg',
                        280: 'A_0024.jpg',
                        285: 'A_0025.jpg',
                        290: 'A_0026.jpg',
                        295: 'A_0027.jpg',
                        300: 'A_0028.jpg',
                        305: 'A_0029.jpg',
                        310: 'A_0030.jpg'
                    };
                    for (var j in rotationImages) {
                        tower.rotationAngle[j] = {};
                        tower.rotationAngle[j].towerImageUrl = zipImagePath + rotationImages[j];
                    }

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
                };

                if (type == 'link' && item.type == 'link') {
                    item.details = zipImagePath + details;
                    var identifier = utils.getIdentifier(item.name);
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
                projectData.amenities[amenityData.amenityName] = {
                    amenityName: amenityData.amenityName,
                    imageUrl: zipImagePath + amenityData.imageName,
                    amenitySvg: amenityData.amenitySvg

                };
            }
        }
    }

    function parseAllCSVData() {
        utils.getSvgData(zipPath + config.csv.masterplanScreen).success(function(data) {
            var towers = processCsvDataToObject(data, 'towerName');
            if (towers && projectData.towers && Object.keys(projectData.towers).length && Object.keys(towers).length) {
                useTowersCSVData(towers);
            }
        });

        utils.getSvgData(zipPath + config.csv.amenitiesHotspots).success(function(data) {
            var amenities = processCsvDataToObject(data, 'amenityName');
            if (amenities && Object.keys(amenities).length) {
                useAmenitiesCSVData(amenities);
            }
        });

        utils.getSvgData(zipPath + config.csv.towerselectScreen).success(function(data) {
            var listing = processCsvDataToArray(data);
            useTowerUnitsCSVData(listing);
        });

        utils.getSvgData(zipPath + config.csv.unitplanInfo).success(function(data) {
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


        var projectIdentifier = utils.getIdentifier(projectDetail.name);
        projectData.projectId = projectDetail.projectId;
        projectData.projectUrl = projectDetail.URL;
        projectData.baseUrl = projectIdentifier + '-' + projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.builderName = projectDetail.builder.name;
        projectData.address = projectDetail.address;
        projectData.bgImage = zipImagePath + config.backgroundImage;
        projectData.description = "With 22 years of experience, 17 successfully completed projects and 14 under construction projects, Paradise Sai has become a reputed name in the industry. Paradise Sai has introduced its new project 'World City' in Panvel, Navi&nbsp; Mumbai. World City is set amidst lush green surroundings and offers 2 and 3 BHK apartments. The apartments will cost you between 75.9 lakh and 1.19 crore.&nbsp; There are 777 units on offer with their sizes ranging between 1,245 and 1,955 sq. ft. Amenities such as jogging track, swimming pool, club house, children&rsquo;s play area, power backup and round the clock security are provided. Situated at a prime location, World City gives easy access to major landmarks in and around the area."; //projectDetail.description;

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

        // Payment plan image
        for (i in projectDetail.images) {
            if (projectDetail.images[i].imageType.type == 'paymentPlan') {
                projectData.paymentPlanImage = projectDetail.images[i].absolutePath;
            }
            if (projectDetail.images[i].imageType.type == 'main') {
                projectData.mainImage = projectDetail.images[i].absolutePath;
            }
        }

        // Media
        for (i in projectDetail.media) {
            if (projectDetail.media[i].objectMediaType.type == 'ListingOnlineSale') {
                var url = projectDetail.media[i].absoluteUrl;
                if (url) {
                    projectData.assetsUrl = url.substr(0, url.lastIndexOf('/') + 1);
                }
                if (config.loadDynamicAssets && projectData.assetsUrl) {
                    zipPath = projectData.assetsUrl;
                    zipImagePath = zipPath + 'img/';
                }
            }
        }

        var towersUnitInfo = {},
            towerIdentifier;
        for (var i = 0; i < towers_length; i += 1) {

            tower = projectDetail.towers[i];
            towerIdentifier = utils.getIdentifier(tower.towerName);
            towers[towerIdentifier] = {};
            towerMap[tower.towerId] = tower.towerName;
            towers[towerIdentifier].towerId = tower.towerId;
            towers[towerIdentifier].towerIdentifier = towerIdentifier;
            towers[towerIdentifier].towerName = tower.towerName;
            towers[towerIdentifier].listings = {};
            towers[towerIdentifier].rotationAngle = {};
            towers[towerIdentifier].totalAvailableCount = 0; //contains count for total flats available in the tower
            towers[towerIdentifier].bookingStatus = bookingStatusMap['1'];
            towersUnitInfo[towerIdentifier] = {};
            towers[towerIdentifier].unitInfo = [];
        }


        projectData.towers = towers;
        projectData.unitTypes = {};
        projectData.pricingSubcategories = {};
        projectData.specifications = projectDetail.specifications || {};

        for (i = 0; i < listings_length; i += 1) {
            if (projectDetail.listings[i].isDeleted) {
                continue;
            }
            var towerId = projectDetail.listings[i].towerId;

            var towerName = towerMap[towerId];
            var towerIdentifier = utils.getIdentifier(towerName);
            var listing = projectDetail.listings[i],
                unitIdentifier = utils.getIdentifier(listing.flatNumber),
                flatUnit = {};
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

            var propertyDetail = _getPropertyById(projectDetail.properties, listing.propertyId);

            // Walkthrough video
            flatUnit.walkthrough = {};
            for (var i in propertyDetail.video) {
                var video = propertyDetail.video[i];
                if (video.objectMediaType.type == "VideoWalkthrough") {
                    flatUnit.walkthrough.video = video.url;
                    flatUnit.walkthrough.image = video.imageUrl;
                }
            }

            if (!flatUnit.walkthrough.video) {
                flatUnit.walkthrough.video = "http://d1vh6m45iog96e.cloudfront.net/4/2/5000168/106/2/supertech-capetown-floor-plan-2bhk-2t-930-sq-ft-5000168.mp4";
                flatUnit.walkthrough.image = "https://im.proptiger.com/4/2/5000168/106/2/supertech-capetown-floor-plan-2bhk-2t-930-sq-ft-5000168.jpg";
            }

            flatUnit.bedrooms = propertyDetail.bedrooms;
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
                bookingStatus = 'SoldOut';
            for (var unitKey in tower.listings) {
                if (hasOwnProperty.call(tower.listings, unitKey) && tower.listings[unitKey].bookingStatus == 'Available') {
                    isAvailable = true;
                    totalAvailableCount += 1;
                    bookingStatus = 'Available';
                } else if (bookingStatus == 'SoldOut' && tower.listings[unitKey].bookingStatus == 'OnHold') {
                    bookingStatus = 'OnHold';
                }
            }
            tower.isAvailable = isAvailable;
            tower.totalAvailableCount = totalAvailableCount; // keeps count for flats available after applying fitler etc
            tower.bookingStatus = bookingStatus;
        }

    };


    function getProjectData(projectId) {
        if (projectData && Object.keys(projectData).length) {
            return projectData;
        }

        var apiData,
            params = {
                successCallback: function(response) {
                    apiData = response;
                }
            };

        ajaxUtils.getProjectData(projectId, params);
        parseApiData(apiData);
        parseAllCSVData();

        console.log(projectData);

        return projectData;
    }

    return getProjectData;
})();