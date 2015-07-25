"use strict";
var getProjectData = (function() {

    var zipPath = 'zip-file',
        zipImagePath = './' + zipPath + '/img/';

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


        var projectIdentifier = utils.getIdentifier(projectDetail.name);
        projectData.projectId = projectDetail.projectId;
        projectData.baseUrl = projectIdentifier + '-' + projectDetail.projectId;
        projectData.projectName = projectDetail.name;
        projectData.address = projectDetail.address;
        projectData.bgImage = zipImagePath + config.backgroundImage;
        projectData.description = "With 22 years of experience, 17 successfully completed projects and 14 under construction projects, Paradise Sai has become a reputed name in the industry. Paradise Sai has introduced its new project 'World City' in Panvel, Navi&nbsp; Mumbai. World City is set amidst lush green surroundings and offers 2 and 3 BHK apartments. The apartments will cost you between 75.9 lakh and 1.19 crore.&nbsp; There are 777 units on offer with their sizes ranging between 1,245 and 1,955 sq. ft. Amenities such as jogging track, swimming pool, club house, children&rsquo;s play area, power backup and round the clock security are provided. Situated at a prime location, World City gives easy access to major landmarks in and around the area.";//projectDetail.description;

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
        for(var i in projectDetail.images) {
            if(projectDetail.images[i].imageType.type == 'paymentPlan') {
                projectData.paymentPlanImage = projectDetail.images[i].absolutePath;
            }
        }

        var towersUnitInfo = {},
            towerIdentifier;
        for (i = 0; i < towers_length; i += 1) {

            tower = projectDetail.towers[i];
            towerIdentifier = utils.getIdentifier(tower.towerName);
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
        projectData.pricingSubcategories = {};
        projectData.specifications = projectDetail.specifications || {};

        for (i = 0; i < listings_length; i += 1) {
            var towerId = projectDetail.listings[i].towerId;

            if (projectDetail.listings[i].flatNumber == 'A0104') {
                projectDetail.listings[i].flatNumber = 'A-0104';
            } else if (projectDetail.listings[i].flatNumber == 'A0402') {
                projectDetail.listings[i].flatNumber = 'A-0402';
            } else if (projectDetail.listings[i].flatNumber == 'A0103') {
                projectDetail.listings[i].flatNumber = 'A-0103';
            } else if (projectDetail.listings[i].flatNumber == 'A-0104' || projectDetail.listings[i].flatNumber == 'A-0103' || projectDetail.listings[i].flatNumber == 'A-0402') {
                continue;
            }


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
            flatUnit.bookingStatusId = listing.bookingStatusId;
            flatUnit.facing = facingMap[listing.facingId];
            flatUnit.bookingAmount = listing.bookingAmount;
            flatUnit.discount = listing.discount ? listing.discount : undefined;
            flatUnit.discountDescription = listing.discountDescription;

            var propertyDetail = _getPropertyById(projectDetail.properties, listing.propertyId);

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
                        price: utils.getReadablePrice(subCategory.price)
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

        var apiData,
            params = {
                success_callback: function(response) {
                    apiData = response;
                }
            };

        ajaxUtils.getProjectData(projectId, params);
        parseApiData(apiData);
        parseAllCSVData();

        console.log(projectData);
        return projectData;
    };

    return getProjectData;
})();