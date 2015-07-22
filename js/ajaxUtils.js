var ajaxUtils = (function() {

    return {
        ajax: function(url, params, type, async, data) {
            var success_callback = typeof(params.success_callback) == 'function' ? params.success_callback : null;
            var error_callback = typeof(params.error_callback) == 'function' ? params.error_callback : null;
            var complete_callback = typeof(params.complete_callback) == 'function' ? params.complete_callback : null;

            var ajaxObj = {
                type: type,
                url: url,
                async: async,
                contentType: "application/json",
                crossDomain: true,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                data: data,
                success: function(response) {
                    console.log(response);
                    if (response.statusCode == '2XX') {
                        if (success_callback == null) {
                            // default error callback handling
                        } else {
                            success_callback(response.data, params);
                        }
                    } else {
                        if (error_callback == null) {
                            // default error callback handling
                        } else {
                            error_callback(response.data);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ajax in error callback');
                    console.log('error occured ' + errorThrown);
                },
                complete: function() {
                    if (complete_callback != null) {
                        complete_callback(params);
                    }
                }
            }

            $.ajax(ajaxObj);
        },
        getProjectData: function(projectId, params) {
            var apiUrl = "http://192.168.1.8:8080/app/v4/project-detail/" + projectId + "?selector={%22paging%22:{%22start%22:0,%22rows%22:100},%22fields%22:[%22projectId%22,%22value%22,%22images%22,%22imageType%22,%22mediaType%22,%22objectType%22,%22title%22,%22type%22,%22absolutePath%22,%22properties%22,%22projectAmenities%22,%22amenityDisplayName%22,%22verified%22,%22amenityMaster%22,%22amenityId%22,%22towerId%22,%22amenityName%22,%22bedrooms%22,%22bathrooms%22,%22balcony%22,%22name%22,%22hasPrimaryExpandedListing%22,%22propertyId%22,%22towers%22,%22listings%22,%22floor%22,%22size%22,%22measure%22,%22bookingAmount%22,%22viewDirections%22,%22viewType%22,%22facingId%22,%22address%22,%22towerName%22,%22clusterPlans%22,%22id%22,%22flatNumber%22,%22bookingStatusId%22,%22clusterPlanId%22,%22price%22,%22specifications%22,%22floorNumber%22,%22mandatory%22,%22otherPricingSubcategoryId%22,%22effectiveDate%22,%22status%22,%22listingId%22,%22pricePerUnitArea%22,%22objectId%22,%22objectTypeId%22,%22otherPricingDetails%22,%22propertyOtherPricingSubcategoryMappings%22,%22discount%22,%22discountDescription%22,%22otherPricingValueType%22,%22otherPricingValueType%22,%22otherPricingSubcategory%22,%22component%22,%22name%22,%22masterOtherPricingCategory%22,%22currentListingPrice%22]}";
            var apiUrl = "apiData.json";
            this.ajax(apiUrl, params, 'GET', false, null);
        },
        submitLead: function(data) {
            var url = 'https://www.proptiger.com/data/v1/entity/enquiry';
            var params = {
                success_callback: function() {
                    $(form)[0].reset();
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

            var url = 'https://beta.proptiger-ws.com/data/v1/entity/notification/sender?debug=true';
            var params = {
                success_callback: function() {
                    console.log("Hurreeyyyyy");
                }
            };

            this.ajax(url, params, 'POST', true, req);
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
            req.productId = data.listingId;
            req.productType = 'PrimaryOnline';
            req.amount = data.amount;
            req.user = user;

            console.log(req);

            var url = "http://192.168.1.4:8080/data/v1/transaction/coupon";
            var params = {
                success_callback: function() {
                    console.log("Hurreeyyyyy");
                }
            };
            //            this.ajax(url, params, 'POST', true, req);

            function createCORSRequest(method, url) {
                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {

                    // Check if the XMLHttpRequest object has a "withCredentials" property.
                    // "withCredentials" only exists on XMLHTTPRequest2 objects.
                    xhr.open(method, url, true);

                } else if (typeof XDomainRequest != "undefined") {

                    // Otherwise, check if XDomainRequest.
                    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                    xhr = new XDomainRequest();
                    xhr.open(method, url);

                } else {

                    // Otherwise, CORS is not supported by the browser.
                    xhr = null;

                }
                return xhr;
            }

            var xhr = createCORSRequest('POST', url);
            if (!xhr) {
                throw new Error('CORS not supported');
            }
            xhr.setRequestHeader(
                'Content-Type', 'application/json');
            xhr.setRequestHeader(
                'Access-Control-Allow-Origin', '*');
            xhr.onload = function() {
                var responseText = xhr.responseText;
                console.log(responseText);
                // process the response.
            };

            xhr.onerror = function() {
                console.log('There was an error!');
            };
            xhr.send();
        }
    }

})();