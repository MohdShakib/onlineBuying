var utils = (function() {

    return {
        projectId: null,
        masterPlanModel: null, // For dynamic height of tower menu
        log: function(obj) {
            if (envConfig.showLogs) {
                console.log(obj);
            }
        },
        validateForm: function(form, strict, ignoreFields) {
            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            function validatePhone(phoneNumber, countryCode) {
                var re = /^\d{5,15}$/,
                    sre = /^\d{10}$/;
                if (countryCode == '+91') {
                    return sre.test(phoneNumber);
                }
                return re.test(phoneNumber);
            }

            var fields = $(form).find('input[type=text],input[type=password],input[type=email],input[type=checkbox]');
            var total_fields = fields.length;

            var emailRequiredMessage = 'Email is required';
            var mobileRequiredMessage = 'Mobile is required';
            var requiredCheckboxMessage = 'Please read and agree to Terms & Conditions';
            var invalidEmailMessage = 'Invalid email address';
            var invalidNumberMessage = 'Invalid phone number';

            var validationFlag = true;
            for (var i = 0; i < total_fields; i++) {

                var this_field = $(fields[i]),
                    id = $(this_field).attr('id'),
                    data = $(this_field).data(),
                    value = $(this_field).val(),
                    type = $(this_field).attr('type'),
                    name = $(this_field).attr('name'),
                    isRequired = $(this_field).attr('required'),
                    hasError = false;

                if (ignoreFields && ignoreFields.indexOf(id) >= 0) {
                    continue;
                }

                if (!$(this_field).parent('div').hasClass('error') && !strict) {
                    continue;
                }
                $(this_field).parent('div').removeClass('error');

                if (isRequired && !value && type == 'email') {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(emailRequiredMessage);
                } else if (isRequired && !value) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(mobileRequiredMessage);
                } else if (isRequired && type == 'checkbox' && !$(this_field).is(":checked")) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(requiredCheckboxMessage);
                } else if (isRequired && type == 'email' && !validateEmail(value)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    $(this_field).siblings('.' + config.errorMsgClass).text(invalidEmailMessage);
                } else if (isRequired && name == 'phone' && !validatePhone(value, data.countrycode)) {
                    validationFlag = false;
                    $(this_field).parent('div').addClass('error');
                    var updatedNumberMessage = invalidNumberMessage;
                    if (data.countryname) {
                        updatedNumberMessage += " for " + data.countryname;
                    }
                    $(this_field).siblings('.' + config.errorMsgClass).text(updatedNumberMessage);
                }

            }
            return validationFlag;
        },

        addResizeEventListener: function(listenerFunction) {
            listenerFunction();
            $(window).off('resize').on('resize', listenerFunction);
        },
        defaultDynamicResizeContainers: function() {
            utils.dynamicResizeContainers(window.innerWidth);
        },
        dynamicResizeContainers: function(containerWidth) {
            var imageResolutionHeight = config.imageResolution.height;
            var imageResolutionWidth = config.imageResolution.width;
            var imageResolutionUnit = config.imageResolution.unit || 'px';
            var windowHeight = window.innerHeight, windowWidth = window.innerWidth;

            if (windowWidth < 1024) {
                $('.top-message').show();
            } else {
                $('.top-message').hide();
            }

            var parentContainerElement = document.getElementById(config.parentContainerId);
            var parentContainerWidth = windowWidth;

            var dynamicResizeElement = $('.' + config.dynamicResizeClass);

            if (containerWidth === null || containerWidth == 'undefined') {
                containerWidth = windowWidth;
            }

            // For max height and width of containers
            var height = (windowHeight < imageResolutionHeight) ? windowHeight : imageResolutionHeight;
            var width = imageResolutionWidth / imageResolutionHeight * height;
            var diff = (width - containerWidth) / -2;
            var parentDiff = (width - windowWidth) / -2;
            var parentContainerElementTop = (windowHeight / 2) - (height / 2);

            if (!(parentContainerElement && parentContainerElement.style)) {
                return;
            }

            parentContainerElement.style.width = (width > parentContainerWidth) ? (parentContainerWidth + imageResolutionUnit) : (width + imageResolutionUnit);
            parentContainerElement.style.height = height + imageResolutionUnit;
            parentContainerElement.style.left = (parentDiff > 0) ? (parentDiff + imageResolutionUnit) : 0;
            parentContainerElement.style.top = (parentContainerElementTop > 0) ? parentContainerElementTop + 'px' : 0 + 'px';

            dynamicResizeElement.css('height', height + imageResolutionUnit);
            dynamicResizeElement.css('width', width + imageResolutionUnit);
            dynamicResizeElement.css('left', (diff < 0) ? (diff + imageResolutionUnit) : 0);

        },
        getGroupInterval: function(n, interval) {
            var start = Math.floor(n / interval) * interval;
            var end = start + interval;
            return {
                start: start,
                end: end
            };
        },
        addLeadingZeros: function(n, length) {
            var str = (n > 0 ? n : -n) + "";
            var zeros = "";
            for (var i = length - str.length; i > 0; i--) {
                zeros += "0";
            }
            zeros += str;
            return n >= 0 ? zeros : "-" + zeros;
        },
        getReadablePrice: function(price) {
            var rem = price % 1000;
            price = Math.floor(price / 1000);
            var readablePrice = (price === 0) ? rem : this.addLeadingZeros(rem, 3);
            while (price > 0) {
                rem = price % 100;
                price = Math.floor(price / 100);
                var prefix = (price === 0) ? rem : this.addLeadingZeros(rem, 2);
                readablePrice = prefix + "," + readablePrice;
            }
            return readablePrice;
        },
        getReadablePriceInWord: function(price) {
            if (price / 10000000 >= 1) {
                return Math.floor(price / 100000) / 100 + " Cr";
            } else if (price / 100000 >= 1) {
                return Math.floor(price / 1000) / 100 + " Lacs";
            } else if (price / 1000 >= 1) {
                return Math.floor(price / 10) / 100 + " K";
            } else {
                return price;
            }
        },
        getIdentifier: function(string) {
            var identifier = '';
            if (string) {
                identifier = string.toLowerCase().replace(/ /g, '-');
            }
            return identifier;
        },

        getTooltipPosition: function(event) {

            if (!event) {
                return 'top-right';
            }

            var positionClass,
                screenWidth = $(window).width(),
                screenHeight = $(window).height(),
                x = event.pageX,
                y = event.pageY;

            x = parseFloat(x);
            y = parseFloat(y);

            if(!(event.unit && event.unit == '%')){
                x = (x / screenWidth) * 100;
                y = (y / screenHeight) * 100;
            }
            positionClass = y < 50 ? 'top-' : 'bottom-';
            positionClass += x > 50 ? 'left' : 'right';

            return positionClass;
        },

        getComparedItems: function() {
            var comparedItems = localStorage.getItem('shortlistedItems');
            var projectId = utils.projectId;

            if (!comparedItems) {
                return {};
            }

            if (comparedItems) {
                comparedItems = JSON.parse(comparedItems);
            } else {
                comparedItems = {};
            }

            if (!(comparedItems[projectId] && Object.keys(comparedItems[projectId]).length)) {
                return {};
            }

            return comparedItems[projectId];
        },
        updateShortListInStorage: function(updatedComparedItems) {
            var comparedItems = localStorage.getItem('shortlistedItems');
            var projectId = utils.projectId;

            if (comparedItems) {
                comparedItems = JSON.parse(comparedItems);
            } else {
                comparedItems = {};
            }

            comparedItems[projectId] = updatedComparedItems;
            comparedItems = JSON.stringify(comparedItems);
            localStorage.setItem('shortlistedItems', comparedItems);
        },
        likeBoxClicked: function(element, unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier) {
            if ($(element).hasClass('selected')) {
                $(element).removeClass('selected');
                utils.removeFromShortListed(unitIdentifier, unitUniqueIdentifier);
                viewUtils.hideShortlistText();
            } else {
                var comparedItems = utils.getComparedItems('shortlistedItems');
                if (Object.keys(comparedItems).length < config.maxShortlistCount) {
                    $(element).addClass('selected');
                    utils.addToShortListed(unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier);
                    viewUtils.showShortlistText(false);
                } else {
                    utils.log("Max shortlist count reached.");
                    viewUtils.showShortlistText(true);
                }
            }
        },
        removeFromShortListed: function(unitIdentifier, unitUniqueIdentifier) {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = comparedItems.length,
                found = 0;

            for (var uniqueIdentifier in comparedItems) {
                if (uniqueIdentifier == unitUniqueIdentifier) {
                    found = uniqueIdentifier;
                    break;
                }
            }

            if (found) {
                if ($('.' + unitUniqueIdentifier + '-like-box')) {
                    $('.' + unitUniqueIdentifier + '-like-box').removeClass('selected');
                }

                if ($('#' + config.compareBottomBox + '-' + unitUniqueIdentifier)) {
                    $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier).remove();
                }
                delete comparedItems[found];
                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        removeShortlistedUnit: function(unitUniqueIdentifier) {
             var comparedItems = utils.getComparedItems('shortlistedItems');
             delete comparedItems[unitUniqueIdentifier];
             utils.updateShortListInStorage(comparedItems);
             utils.updateShortListedList();
        },
        addToShortListed: function(unitIdentifier, unitName, towerIdentifier, rotationAngle, unitUniqueIdentifier) {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = comparedItems.length;

            if (!comparedItems[unitUniqueIdentifier]) {
                comparedItems[unitUniqueIdentifier] = {
                    unitIdentifier: unitIdentifier,
                    unitName: unitName,
                    towerIdentifier: towerIdentifier,
                    rotationAngle: rotationAngle,
                    unitUniqueIdentifier: unitUniqueIdentifier
                };

                utils.updateShortListInStorage(comparedItems);
            }
            utils.updateShortListedList();
        },
        updateShortListedList: function() {
            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = Object.keys(comparedItems).length,
                htmlCode = '';
            if (length) {
                htmlCode = '<ul>';

                for (var uniqueIdentifier in comparedItems) {
                    htmlCode += '<li >' + comparedItems[uniqueIdentifier].unitName + '<span class="icon icon-cross ' + config.shortlistedUnitRemoveClass + '" data-unitidentifier="' + comparedItems[uniqueIdentifier].unitIdentifier + '" data-uniqueidentifier="' + uniqueIdentifier + '"></span></li>';
                }
                htmlCode += '</ul>';
            } else {
                htmlCode += '<p>Please shortlist items to compare</p>';
            }

            $('#' + config.unitCompareButtonId).addClass('disable');
            if (length > 1) {
                $('#' + config.unitCompareButtonId).removeClass('disable');
            }

            $('#' + config.shortListedUnitListId).html(htmlCode);
            $('#' + config.likeCountId).html(length);
            $('.' + config.blinkElementClass).addClass(config.beepEffectClass);
            setTimeout(function() {
                $('.' + config.blinkElementClass).removeClass(config.beepEffectClass);
            }, 500);
        },

        changeUrl: function(element) {
            element = $(element);
            var hash = element.data('url') ? element.data('url') : null;
            if (hash && hash != "undefined") {
                router.setRoute(hash);
            }
            return;
        },

        tracking: function(category, action, label) {
            if (envConfig.env !== 'local') {
                ga('send', 'event', category, action, label);
            }
        },
        executeTrackingCode: function(hide) {
            var $ = window.vwo_$ || window.$ || window.jQuery;
            $('.vwo_loaded').removeClass('vwo_loaded');
            window._vwo_code = (function(){
            var account_id=193637,
            settings_tolerance=2000,
            library_tolerance=2500,
            url =  window._vis_opt_url || document.URL,
            use_existing_jquery=false,
            // DO NOT EDIT BELOW THIS LINE
            f = false, d = document;
            return {
              use_existing_jquery: function() {
                  return use_existing_jquery;
              },
              library_tolerance: function() {
                  return library_tolerance;
              },
              finish: function() {
                  if (!f) {
                      f = true;
                      var a = d.getElementById('_vis_opt_path_hides');
                      if (a) {
                          a.parentNode.removeChild(a);
                      }
                  }
              },
              finished: function() {
                  return f;
              },
              load: function(a) {
                  var b = d.createElement('script');
                  b.src = a;
                  b.type = 'text/javascript';
                  b.innerText = '';
                  b.onerror = function() {
                      window._vwo_code.finish();
                  };
                  d.getElementsByTagName('head')[0].appendChild(b);
              },
              init: function() {
                  var settings_timer = setTimeout(window._vwo_code.finish(), settings_tolerance);
                  this.load('//dev.visualwebsiteoptimizer.com/j.php?a=' + account_id + '&u=' + encodeURIComponent(url) + '&r=' + Math.random());
                  var a = d.createElement('style'),
                      b = hide ? hide + '{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}' : '',
                      h = d.getElementsByTagName('head')[0];
                  a.setAttribute('id', '_vis_opt_path_hides');
                  a.setAttribute('type', 'text/css');
                  if (a.styleSheet) {
                    a.styleSheet.cssText = b;
                    } else {
                    a.appendChild(d.createTextNode(b));
                    }
                  h.appendChild(a);
                  return settings_timer;
              }
            };
            }());
            window._vwo_settings_timer = window._vwo_code.init();
      },
      ascendingOrder: function(towers) {
          towers = Object.keys(towers);
          return towers.sort();
      }

    };

})();
