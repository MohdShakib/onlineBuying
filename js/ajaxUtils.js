var ajaxUtils = (function() {

    return {
        ajax: function(url, params, type, async, data) {
            var successCallback = typeof(params.successCallback) === 'function' ? params.successCallback : null;
            var errorCallback = typeof(params.errorCallback) === 'function' ? params.errorCallback : null;
            var completeCallback = typeof(params.completeCallback) === 'function' ? params.completeCallback : null;

            var ajaxObj = {
                method: type,
                url: url,
                async: async,
                data: data,
                success: function(response) {
                    console.log(response);
                    if (response.statusCode === '2XX') {
                        if (successCallback === null) {
                            // default errorCallback handling
                        } else {
                            successCallback(response.data, params);
                        }
                    } else {
                        if (errorCallback === null) {
                            // default errorCallback handling
                        } else {
                            errorCallback(response.data);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
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
                ajaxObj.contentType = "application/json";
            }

            $.ajax(ajaxObj);
        },

        getProjectData: function(projectId, params) {
            var apiUrl = "http://192.168.1.8:8080/app/v4/project-detail/" + projectId + "?selector={%22paging%22:{%22start%22:0,%22rows%22:100},%22fields%22:[%22projectId%22,%22value%22,%22images%22,%22abbreviation%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22hasPrimaryExpandedListing%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22,%22specifications%22,%22floorNumber%22,%22mandatory%22,%22otherPricingSubcategoryId%22,%22effectiveDate%22,%22status%22,%22listingId%22,%22pricePerUnitArea%22,%22objectId%22,%22objectTypeId%22,%22otherPricingDetails%22,%22propertyOtherPricingSubcategoryMappings%22,%22discount%22,%22discountDescription%22,%22otherPricingValueType%22,%22otherPricingValueType%22,%22otherPricingSubcategory%22,%22component%22,%22name%22,%22masterOtherPricingCategory%22,%22currentListingPrice%22]}";
                apiUrl = "apiData.json";
            this.ajax(apiUrl, params, 'GET', false, null);
        },

        submitLead: function(data) {
            var url = 'https://www.proptiger.com/data/v1/entity/enquiry';
            var params = {
                successCallback: function() {
                    $('form')[0].reset();
                }
            };
            this.ajax(url, params, 'POST', true, data);
        },

        sendEmail: function(data) {
            var req = {},
                user = {},
                emailDetails = {};
            user.email = data.email;
            emailDetails.mediumType = "Email";
            emailDetails.subject = "this is subject";
            emailDetails.body = "this is body";
            emailDetails.from = "PropGuide <no-reply@proptiger.com>";
            req.notificationType = 'default';
            req.users = [user];
            req.mediumDetails = [emailDetails];

            console.log(req);

            var url = 'http://192.168.0.208:5000/email-notification';
            var params = {
                successCallback: function() {
                    console.log("Hurreeyyyyy");
                }
            };

            this.ajax(url, params, 'POST', true, JSON.stringify(req));
        },

        getCountries: function(params){
            params = params || null;
            var url = "https://www.proptiger.com/data/v1/entity/country";
            this.ajax(url, params, 'GET', false, null);
        },

        bookListing: function(data) {
            var req = {},
                user = {},
                attrib = {},
                contact = {};
            contact.contactNumber = data.phone;
            attrib.id = 0;
            attrib.attributeName = "PAN";
            attrib.attributeValue = data.pan;
            user.fullName = data.firstName + ' ' + data.lastName;
            user.email = data.email;
            user.attributes = [attrib];
            user.contactNumbers = [contact];
            user.countryId = data.countryId;
            req.productId = data.listingId;
            req.productType = 'PrimaryOnline';
            req.amount = data.amount;
            req.user = user;


            console.log(req);

            var url = "/data/v1/transaction/coupon?debug=true";
            var params = {
                successCallback: function(data, params) {
                    window.location.href = data;
                }
            };

            this.ajax(url, params, 'POST', true, JSON.stringify(req));
        }
    };

})();