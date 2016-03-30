var ajaxUtils = (function() {

    return {
        ajax: function(url, params, type, async, data) {
            var successCallback = typeof(params.successCallback) === 'function' ? params.successCallback : null;
            var errorCallback = typeof(params.errorCallback) === 'function' ? params.errorCallback : null;
            var completeCallback = typeof(params.completeCallback) === 'function' ? params.completeCallback : null;

            var ajaxObj = {
                type: type,
                url: url,
                async: async,
                success: function(response) {
                    utils.log(response);
                    if (response.statusCode === '2XX') {
                        if (successCallback === null) {
                            // default successCallback handling
                        } else {
                            successCallback(response.data, params);
                        }
                    } else {
                        if (errorCallback === null) {
                            // default errorCallback handling
                        } else {
                            errorCallback(response.data, params, response.statusCode);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                    if (errorCallback === null) {
                        // default errorCallback handling
                    } else {
                        errorCallback(textStatus, params);
                    }
                    console.log('ajax in errorCallback');
                    console.log('error occured ' + errorThrown);
                },
                complete: function() {
                    if (completeCallback !== null) {
                        completeCallback(params);
                    }
                }
            };

            if (type === "POST") {
                data = data ? data : {};
                ajaxObj.data = JSON.stringify(data);
                ajaxObj.contentType = "application/json";
            }

            utils.log(ajaxObj);
            $.ajax(ajaxObj);
        },

        getProjectData: function(projectId, params) {
            var apiUrl = envConfig.protocol + envConfig.apiURL + "app/v4/project-detail/" + projectId + "?selector={%22paging%22:{%22start%22:0,%22rows%22:100},%22fields%22:[%22projectId%22,%22studyRoom%22,%22offers%22,%22offerDesc%22,%22couponCatalogue%22,%22inventoryLeft%22,%22couponPrice%22,%22locality%22,%22suburb%22,%22city%22,%22label%22,%22video%22,%22resolution%22,%22bitRate%22,%22url%22,%22imageUrl%22,%22description%22,%22media%22,%22objectMediaType%22,%22absoluteUrl%22,%22mediaExtraAttributes%22,%22builder%22,%22value%22,%22images%22,%22abbreviation%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22URL%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22hasPrimaryExpandedListing%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22,%22specifications%22,%22floorNumber%22,%22mandatory%22,%22otherPricingSubcategoryId%22,%22effectiveDate%22,%22status%22,%22listingId%22,%22pricePerUnitArea%22,%22objectId%22,%22objectTypeId%22,%22otherPricingDetails%22,%22propertyOtherPricingSubcategoryMappings%22,%22discount%22,%22discountDescription%22,%22otherPricingValueType%22,%22otherPricingValueType%22,%22otherPricingSubcategory%22,%22component%22,%22name%22,%22masterOtherPricingCategory%22,%22currentListingPrice%22,%22totalInventory%22]}";

            if (config.setJsonDataPriorityForTest) {
                apiUrl = "apis-json/project-detail-test.json";
            }else if(config.apisJson){
                apiUrl = "apis-json/project-detail.json";
            }

            this.ajax(apiUrl, params, 'GET', true, null);
        },

        submitLead: function(data, params) {
            utils.log(data);
            var url = envConfig.protocol + envConfig.apiURL + 'data/v1/entity/enquiry';
            this.ajax(url, params, 'POST', true, data);
        },

        sendEmail: function(data, params) {
            utils.log(data);
            var url = envConfig.protocol + envConfig.apiURL + 'send-notification';
            this.ajax(url, params, 'POST', true, data);
        },

        getCountries: function(params) {
            params = params || null;
            var url = "https://www.proptiger.com/data/v1/entity/country";
            if (config.apisJson || config.cityJson) {
                url = "apis-json/countries.json";
            }
            this.ajax(url, params, 'GET', true, null);
        },

        bookListing: function(data, params) {
            var req = {},
                user = {},
                attrib = {},
                contact = {};
            contact.contactNumber = data.phone;
            attrib.attributeName = "PAN";
            attrib.attributeValue = data.pan;
            user.fullName = data.firstName + ' ' + data.lastName;
            user.email = data.email;
            user.attributes = [attrib];
            user.contactNumbers = [contact];
            user.countryId = data.countryId;
            req.productId = data.productId;
            req.productType = data.productType;
            req.amount = data.amount;
            req.user = user;

            var url = envConfig.protocol + envConfig.apiURL + "data/v1/transaction/coupon?debug=true";

            utils.log(req);
            this.ajax(url, params, 'POST', true, req);
        },

        getSvgData: function(url) {
            return $.ajax({
                type: "GET",
                url: url,
                async: true,
                dataType: "text",
                cache: true,
                success: function(data) {
                    // register success callback in return promise
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    utils.log('read csv error callback for: ' + url);
                    utils.log('error occured ' + errorThrown);
                    return false;
                }
            });
        },
        getJsonData: function(url, callback) {
            return $.ajax({
                type: 'GET',
                url: url,
                async: true,
                jsonpCallback: callback,
                contentType: "application/json",
                dataType: "jsonp",
                cache: true,
                success: function(data) {
                    // register success callback in return promise

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    utils.log('read json error callback for: ' + url);
                    utils.log('error occured ' + errorThrown);
                }
            });
        }
    };

})();
