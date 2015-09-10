/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";

function allowDrop(x) {
    x.preventDefault();
}

var BaseView = (function() {

    var containerMap = {
        'bottomFormGroupContainer': '<div class="bottom-form-group" id="bottom-form-group"></div>',
        'compareUnitsContainer': '<div  class="compare-units-container" id="' + config.compareUnitscontainerId + '"></div>',
        'promptLeadFormContainer': '<div class="promptLeadFormBox" id="prompt-lead-form"></div>'
    };

    function getElements() {
        var elements = {
            'bottomFormGroupContainer': $('#bottom-form-group'),
            'compareUnitsContainer': $('#' + config.compareUnitscontainerId),
            'promptLeadFormContainer': $('#prompt-lead-form')
        };
        return elements;
    }

    function BaseView(model) {
        this._model = model;
        this._elements = null;

        this._bottomGroupButtonClick = new Event(this);
        this._formPopupCloseClick = new Event(this);
        this._showLoaderComplete = new Event(this);

        // Get Call back
        this._getCallbackClick = new Event(this);

        // Compare popup
        this._unitCompareButtonClick = new Event(this);
        this._removeShortlistClick = new Event(this);

        // Compare page
        this._compareBackButtonClick = new Event(this);
        this._unitComponentMouseEnter = new Event(this);
        this._unitComponentMouseLeave = new Event(this);
        this._bookingClick = new Event(this);
    }

    BaseView.prototype = {
        buildView: function() {
            var rootdata = this._model.getRootdata(),
                _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.init(rootdata);
            for (var i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this._elements[i].empty();
                    this[i]();
                }
            }

            $('.' + config.notificationTooltipClass).off('click').on('click', '.icon-cross', function() {
                utils.hideNotificationTooltip();
            });
        },
        init: function(rootdata) {
            $('.project-title').html('<a href="https://www.proptiger.com/' + rootdata.projectUrl + '" target="_blank">' + rootdata.projectName + '</a>');
            $('.project-address').html(rootdata.address);
            $('.project-desc').html(rootdata.description);
        },
        reinit: function() {
            $('.pro-contact-actions ul.conect-tab').css({
                bottom: '-45px'
            });
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#' + config.baseContainerId).html(htmlCode);
            this._elements = getElements();
        },
        compareUnitsContainerReady: false,
        prepareCompareUnitsContainer: function(flag) {
            if (this.compareUnitsContainerReady && !flag) {
                return;
            }

            var compareList = this._model.getCompareList(),
                compareList_length = Object.keys(compareList).length;
            var rootdata = this._model.getRootdata();
            var compareKeys = Object.keys(compareList);
            var indexOfCurrentUnit = compareKeys.indexOf(utils.unitUniqueAdd);
            var htmlCode = '',
                firstUniqueIdentifier;

            htmlCode += '<div class="title-text"><div class="compare-back-button"><span class="icon icon-cross"></span></div>Compare Unit Plans</div>';

            htmlCode += '<div class="compare-container"><div class="drag-info">Please Drag &amp; Drop from the list into the box to compare unit plans</div>';
            for (var uniqueIdentifier in compareList) {
                var item = compareList[uniqueIdentifier];
                firstUniqueIdentifier = uniqueIdentifier;
                var imageUrl = item[item.unitTypeIdentifier].unitImageUrl;
                htmlCode += '<div class="' + config.compareBottomBox + '" id="' + config.compareBottomBox + '-' + uniqueIdentifier + '" data-uniqueidentifier="' + uniqueIdentifier + '">' +
                    '<p >' + compareList[uniqueIdentifier].unitName + '</p>' +
                    '<img class="' + config.lazyloadClass + '" src="' + imageUrl + '" />' +
                    '</div>';
            }
            htmlCode += '</div>';

            for (var i = 0; i < 2; i++) {
                var borderClass = !i ? 'compare-unit-box-right-border' : 'compare-unit-box-right';
                htmlCode += '<div  class="compare-unit-box ' + borderClass + '" ondragover="allowDrop(event);">';

                htmlCode += '<div class="compare-unit-box-detail top-right-component"><span>Drag & drop to select unit and compare it.</span></div>' +
                    '<div class="img-svg-container drag-drop">' +
                    '<img class="compare-unit-img ' + config.lazyloadClass + '"  src="images/compare_drag.jpg"/></div>';

                htmlCode += '</div>';
            }

            this._elements.compareUnitsContainer.html(htmlCode);
            if (compareList_length == 2) {
                this.addToCompareBox($('.compare-unit-box')[1], compareKeys[1]);
                this.addToCompareBox($('.compare-unit-box')[0], compareKeys[0]);

            } else {
                if (indexOfCurrentUnit && indexOfCurrentUnit > -1) {
                    this.addToCompareBox($('.compare-unit-box')[0], compareKeys[indexOfCurrentUnit]);
                } else if (compareList_length > 1) {
                    this.addToCompareBox($('.compare-unit-box')[0], compareKeys[0]);
                }
            }

            this.compareUnitsContainerEvents();
            this.compareUnitsContainerReady = true;
        },
        compareUnitsContainerEvents: function() {
            var _this = this;
            this._elements.compareUnitsContainer.off('click').on('click', '.' + config.compareBackButtonClass, function(event) {
                _this._compareBackButtonClick.notify(this); //this refers to element here
            });

            this._elements.compareUnitsContainer.on('click', '.book-now a', function(event) {
                _this._bookingClick.notify(this); //this refers to element here
            });

            this._elements.compareUnitsContainer.on('click', '.close-compare-box', function(event) {
                _this.removeFromCompareBox(this); // this represents to element here
            });

            $('.' + config.compareBottomBox).draggable({
                helper: 'clone',
                start: function() {
                    $(this).addClass('drag-over');
                },
                stop: function() {
                    $(this).removeClass('drag-over');
                }
            });

            $('.compare-unit-box').droppable({
                over: function(event, ui) {
                    $(this).addClass('drag-over');
                },
                out: function(event, ui) {
                    $(this).removeClass('drag-over');
                },
                drop: function(event, ui) {
                    $(this).removeClass('drag-over');
                    var uniqueIdentifier = $(ui.draggable).data('uniqueidentifier');
                    var isSelected = $(ui.draggable).hasClass('selected');
                    if (!isSelected) { // add if dragged is not selected already
                        _this.removeSelectedClassFromComProBox(this);
                        _this.addToCompareBox(this, uniqueIdentifier);
                    }
                }
            });

        },
        addToCompareBox: function(compareBox, uniqueIdentifier) {
            var compareList = this._model.getCompareList(),
                rootdata = this._model.getRootdata(),
                item = compareList[uniqueIdentifier],
                unitTypeArr = item.unitTypeIdentifierArr || [],
                isDuplex = (unitTypeArr.length == 2) ? true : false,
                imageUrl = item ? (isDuplex ? [item[unitTypeArr[0]].unitImageUrl, item[unitTypeArr[1]].unitImageUrl] : item[item.unitTypeIdentifier].unitImageUrl ) : undefined,
                link = rootdata.baseUrl + '/' + item.towerIdentifier + '/' + item.rotationAngle + '/' + item.unitIdentifier + '/booking',
                htmlCode = '<div class="tower-unit-detail-container ' + config.unitDataContainer + '"></div>';
            htmlCode += '<span class="icon fs14 icon-cross close-compare-box"></span><div class="compare-unit-box-detail top-right-component"><span>' + item.unitName + '</span> | <span>' + item.bedrooms + '</span> | <span>' + item.size + '</span> | <span>' + item.price + '</span> | <span>' + item.floor + '</span></div>';
            htmlCode += '<div class="top-right-component">' +
                        '<div class="book-now" >' +
                        '<a data-url="' + link + '">Book now</a><span><span class="icon icon-rupee fs10"></span>' + utils.getReadablePrice(item.bookingAmount) + '/- <br>(No Cancellation Charges)</span>' +
                        '</div>';

            if(isDuplex) {
                    htmlCode += '<div id="slider" class="slider"><a class="control_next">></a> <a class="control_prev"><</a>'+
                                '<ul>'+
                                ' <li> <div class="img-svg-container"> <svg class="svg-container unit-svg-container" id="unit-compare-svg-container' + unitTypeArr[0] + '" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>' +
                                '     <img data-uniqueIdentifier="' + item.unitUniqueIdentifier + '" class="compare-unit-img ' + config.lazyloadClass + '"  src="' + imageUrl[0] + '"> </div></li>'+
                                ' <li> <div class="img-svg-container"> <svg class="svg-container unit-svg-container" id="unit-compare-svg-container' + unitTypeArr[1] + '" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>' +
                                '     <img data-uniqueIdentifier="' + item.unitUniqueIdentifier + '" class="compare-unit-img ' + config.lazyloadClass + '"  src="' + imageUrl[1] + '"> </div></li>'+
                                '</ul></div>';
            } else {
              htmlCode += '<div class="slider"><ul><li><div class="img-svg-container"> <svg class="svg-container unit-svg-container" id="unit-compare-svg-container' + item.unitTypeIdentifier + '" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>' +
                  '<img data-uniqueIdentifier="' + item.unitUniqueIdentifier + '" class="compare-unit-img ' + config.lazyloadClass + '"  src="' + imageUrl + '"> </div></li></ul></div>';

            }

            $('#' + config.compareBottomBox + '-' + uniqueIdentifier + ' ').addClass('selected');

            $(compareBox).html(htmlCode);
            this.compareBoxSliderEvents();
            if(isDuplex) {
              this.unit3dSvgContainer(uniqueIdentifier, unitTypeArr[0], unitTypeArr[0]);
              this.unit3dSvgContainer(uniqueIdentifier, unitTypeArr[1], unitTypeArr[1]);
            } else {
              this.unit3dSvgContainer(uniqueIdentifier, item.unitTypeIdentifier, item.unitTypeIdentifier);
            }
        },
        compareBoxSliderEvents: function() {
          var slideCount = $('#slider ul li').length;
          var slideWidth = $('#slider ul li div').width();
          var slideHeight = $('#slider ul li div').height();
          var sliderUlWidth = slideCount * slideWidth;

          function moveLeft() {
            console.log("mocing left");
              $('#slider ul').animate({
                  left: + slideWidth
              }, 200, function () {
                  $('#slider ul li:last-child').prependTo('#slider ul');
                  $('#slider ul').css('left', '');
              });
          }

          function moveRight() {
              $('#slider ul').animate({
                  left: - slideWidth
              }, 200, function () {
                  $('#slider ul li:first-child').appendTo('#slider ul');
                  $('#slider ul').css('left', '');
              });
          }

          $('a.control_prev').click(function () {
              moveLeft();
          });

          $('a.control_next').click(function () {
              moveRight();
          });
        },
        removeFromCompareBox: function(element) {
            var parentElement = $(element).parent();
            this.removeSelectedClassFromComProBox(parentElement);
            var htmlCode = '<div class="compare-unit-box-detail top-right-component"><span>Drag & drop to select unit and compare it.</span></div>' +
                '<div class="img-svg-container drag-drop">' +
                '<img class="compare-unit-img"  src="images/compare_drag.jpg"/></div>';
            parentElement.html(htmlCode);
        },
        removeSelectedClassFromComProBox: function(parentElement) {
            var unitUniqueIdentifier = $(parentElement).find('img.compare-unit-img').data('uniqueidentifier');
            if (unitUniqueIdentifier && $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier)) {
                $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier + ' ').removeClass('selected');
            }
        },
        unit3dSvgContainer: function(uniqueIdentifier, unitTypeDataName, idName) {
            var compareList = this._model.getCompareList();
            var unitTypeData;
            if(unitTypeDataName) {
               unitTypeData = compareList[uniqueIdentifier][unitTypeDataName];
            } else {
               unitTypeData = compareList[uniqueIdentifier].unitTypeData;
            }
            var svgElements = utils.getUnit3dSvgPolygonElements(unitTypeData);
            var id = idName || uniqueIdentifier;
            $('#unit-compare-svg-container' + id).empty();
            if (svgElements && svgElements.length) {
                console.log(idName);
                for (var i = 0; i < svgElements.length; i++) {
                    $('#unit-compare-svg-container' + id).append(svgElements[i]);
                }
                this.unit3dSvgContainerEvents();
            }

        },
        unit3dSvgContainerEvents: function() {
            var _this = this;
            this._elements.compareUnitsContainer.off('mousemove').on('mousemove', 'polygon', function(event) {

                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.compareUnitsContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                $('#container-detail').remove();
                //here this refers to element
                _this._unitComponentMouseLeave.notify();
            });
        },
        unitComponentMouseEnter: function(params) {
            var reference = $(params.element).parents('.compare-unit-box').children('.tower-unit-detail-container');
            var pointX = $(params.element).attr('points').split(' ')[0];
            var pointY = $(params.element).attr('points').split(' ')[1];
            params.pointX = pointX;
            params.pointY = pointY;
            if (reference) {
                utils.unitComponentMouseEnter(params, reference);
            }
        },
        unitComponentMouseLeave: function() {
            $('.tower-unit-detail-container').html('');
        },
        compareBackButtonClicked: function() {
            $('#' + config.compareUnitscontainerId).fadeOut(800);
        },
        bottomFormGroupContainer: function() {
            var _this = this;
            var chatdisabled = config.chatEnabled ? '' : 'disabled';
            var htmlCode = '<div class="pro-contact-actions">' +
                '<div class="form-pop-up transition">' +
                '   <span class="close-form icon icon-cross fs12"></span>' +
                '   <div class="call-box">' +
                '       <p>Get callback from our property advisor<br></p>' +
                //'     <div class="chat-tab-box">' +
                //'         <a href="/" class="transition">Start Chatting</a>' +
                //'         <a href="/" class="transition active">We will Call</a>' +
                //'     </div>' +
                '       <form id="call-box-form" name="call-box-form" novalidate onSubmit="return false;"  >' +
                '           <div class="form-input-box"><input class="text" id="' + config.callBox.nameId + '" name="name" placeholder="enter your name" type="text" required /><div class="error-box ' + config.errorMsgClass + '">This field is required</div></div> ' +
                '           <div class="form-input-box"><input class="text" id="' + config.callBox.emailId + '" name="email" placeholder="enter your email id" type="email" required /><div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' +
                '           <div class="phone-no-holder"><div class="form-input-box fleft c-code">' +
                '           <input id="' + config.callBox.countryCodeId + '" class="text" name="' + config.callBox.phoneId + '" type="text" value="+91" readonly/> ' +
                '           <span class="icon icon-arrow_btm fs12 transition dropdown-arrow"></span><ul class="country-dropDown" style="display:none;"></ul></div> ' +
                '           <div class="form-input-box fright mobile-number-field"><input class="text" id="' + config.callBox.phoneId + '" name="phone" placeholder="enter your phone number" type="text" minlength="10" maxlength="15" required data-countryid="1" data-countrycode="+91"/>' +
                '           <div class="error-box ' + config.errorMsgClass + '">This field is required</div></div><div class="clear-fix"></div></div>' +
                '           <div class="submit" id="' + config.callBox.submitButtonId + '">Get Instant Callback' +
                '           <input type="submit" />' +
                '           </div>' +
                '       </form>' +
                '   </div>' +
                '   <div class="compare-box">' +
                '       <p>Shortlisted Units are listed below</p>' +
                '       <div class="unit-box fleft" id="' + config.shortListedUnitListId + '"></div>' +
                '       <div class="clear-fix"></div>' +
                '       <div id="' + config.unitCompareButtonId + '" class="submit"><input type="submit" />Compare Unit Plans</div>' +
                '   </div>' +
                '   <div class="share-box">' +
                '       <p>Share details with family / friends</p>' +
                '       <div class="share-social">' +
                '           <a href="javascript:void(0);" onclick="utils.socialClicked(\'facebook\')" ><span class="icon icon-facebook"></span>Facebook</a>' +
                //'         <div class="fb-share-button" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo" data-layout="button_count"></div>' +
                '           <span class="social-or">or</span>' +
                //'         <div class="g-plus" data-action="share"  data-annotation="bubble" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo"></div>' +
                '           <a href="javascript:void(0);" onclick="utils.socialClicked(\'googleplus\')" ><span class="icon icon-googleplus"></span>Goggle+</a>' +
                '       </div>' +
                '       <form id="share-box-form" novalidate name="share-box-form" onSubmit="return false;"  >' +
                '           <div class="form-input-box"><input class="text" id="' + config.emailBox.nameId + '" placeholder="enter your name" type="text" required />' +
                '           <div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' +
                '           <div class="form-input-box"><input class="text" id="' + config.emailBox.emailId + '" placeholder="enter your friend\'s email id" type="email" required />' +
                '           <div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' +
                '           <div class="submit" id="share-box-submit-id"><input type="submit" />Share</div>' +
                '       </form>' +
                '   </div>' +
                '   <div class="live-chat">' +
                '       <div id="' + config.tawkApiId + '"></div>' +
                '   </div>' +
                '</div>' +
                '<ul class="conect-tab transition">' +
                '<li><a href="javascript:void(0);"  data-name="call-box">' +
                '   <p>Need Clarification?</br>Get in touch</p>' +
                '   <span class="icon icon-phone"></span>' +
                '   </a>' +
                '</li>' +
                '<li>' +
                '   <a href="javascript:void(0);" id="heart-added" data-name="compare-box">' +
                '   <p>Compare among</br> shortlisted flats</p>' +
                '   <span class="icon icon-heart ' + config.blinkElementClass + '">' +
                '   <label class="like-count br50" id="' + config.likeCountId + '">0</label>' +
                '   </span>' +
                '   </a>' +
                '</li>' +
                '<li>' +
                '   <a href="javascript:void(0);" data-name="share-box">' +
                '   <p>Share with</br> friends' +
                //' <span>Sign In Now!</span>'+
                '   </p>' +
                '   <span class="icon icon-share"></span>' +
                '   </a>' +
                '</li>' +
                '<li>' +
                '   <a href="javascript:void(0);" data-name="live-chat" class="chat-widget ' + chatdisabled + '">' +
                '   <p>Live support' +
                '   </p>' +
                '   <span class="icon icon-chat"></span>' +
                '   </a>' +
                '</li>' +
                '</ul>' +
                '</div>';

            this._elements.bottomFormGroupContainer.html(htmlCode);
            utils.updateShortListedList();
            this.bottomFormGroupContainerEvents();

            ajaxUtils.getCountries({
                successCallback: this.getCountriesList,
                self: this
            });
        },

        promptLeadFormContainer: function() {
            var _this = this;
            var htmlCode = '<div class="form">' +
                '<img src="images/form-gift-icon.jpg" alt="">' +
                '<h1>Hurry! 2 days left</h1>' +
                '<p>Looking for more details?<span>Get expert opinion</span></p>' +
                '<form action="">' +
                '   <div class="formField"><input type="text" placeholder="Name..."></div>' +
                '   <div class="formField"><input type="text" placeholder="Email ID..."></div>' +
                '   <div class="formField">' +
                '       <div class="col">' +
                '           <select>' +
                '               <option>India</option>' +
                '               <option>United Arab Emirates</option>' +
                '           </select>' +
                '       </div>' +
                '       <div class="mobile col"><input type="text" placeholder="Mobile No..."><span>+91 <i class="icon icon-arrow_btm"></i></span></div><div class="clear-fix"></div>' +
                '   </div>' +
                '   <input type="button" class="payment-btn" value="Get Call Back">' +
                '</form>' +
                '<span class="close">X</span>' +
                '</div>';

            this._elements.promptLeadFormContainer.html(htmlCode);
        },

        getCountriesList: function(countries, params) {
            var htmlCode = '',
                totalCountries = countries ? countries.length : 0;
            if (countries && totalCountries) {
                for (var i = 0; i < totalCountries; i++) {
                    htmlCode += '<li class="country-list-item" data-countryid="' + countries[i].countryId + '" data-countrycode="' + countries[i].countryCode + '"><a class="transition">' + countries[i].countryCode + ' <span>' + countries[i].label + '</span></a></li>';
                }
            }
            $('.' + config.callBox.countryDropdownClass).html(htmlCode);
            params.self.countryDropdownEvents();
        },
        countryDropdownEvents: function() {
            $('.phone-no-holder').off('click').on('click', '.country-list-item', function() {
                var countryId = $(this).data('countryid');
                var countryCode = $(this).data('countrycode');
                $('#' + config.callBox.countryCodeId).attr('value', countryCode);

                // For validation
                $('#' + config.callBox.phoneId).data('countryid', countryId);
                $('#' + config.callBox.phoneId).data('countrycode', countryCode);
            });
        },
        bottomFormGroupContainerEvents: function() {

            var _this = this;

            $('#' + config.parentContainerId).off('click').on('click', function() {
                // close form if opened
                _this.formPopupCloseClicked();
            });

            this._elements.bottomFormGroupContainer.off('click').on('click', '.' + config.bottomFormGroup.tabLinkClass, function(event) {
                _this._bottomGroupButtonClick.notify(this); //this refers to element here
            });

            this._elements.bottomFormGroupContainer.on('click', function(event) {
                event.stopPropagation();
            });

            this._elements.bottomFormGroupContainer.on('click', '#' + config.callBox.submitButtonId, function(event) {
                if (!$(this).hasClass(config.disabledClass)) {
                    _this._getCallbackClick.notify(this);
                }
            });

            this._elements.bottomFormGroupContainer.on('keyup', '#call-box-form', function(event) {
                var callBoxForm = $('#call-box-form');
                utils.validateForm(callBoxForm, false);
            });

            this._elements.bottomFormGroupContainer.on('click', '#share-box-submit-id', function(event) {
                var shareBoxForm = $('#share-box-form');
                _this.shareOnEmailSubmit(shareBoxForm);
            });

            this._elements.bottomFormGroupContainer.on('keyup', '#share-box-form', function(event) {
                var shareBoxForm = $('#share-box-form');
                utils.validateForm(shareBoxForm, false);
            });

            this._elements.bottomFormGroupContainer.on('click', '.close-form', function() {
                _this._formPopupCloseClick.notify(this);
            });

            this._elements.bottomFormGroupContainer.on('click', '#' + config.unitCompareButtonId, function(event) {
                _this._unitCompareButtonClick.notify(this);
            });

            this._elements.bottomFormGroupContainer.on('click', '.' + config.shortlistedUnitRemoveClass, function(event) {
                var unitIdentifier = $(this).data('unitidentifier'),
                    unitUniqueIdentifier = $(this).data('uniqueidentifier');
                _this._removeShortlistClick.notify({
                    element: this,
                    unitIdentifier: unitIdentifier,
                    unitUniqueIdentifier: unitUniqueIdentifier
                });
            });

            // Country code dropdown
            _this._elements.bottomFormGroupContainer.on('click', '.' + config.callBox.countryDropdownArrowClass, function(event) {
                event.stopPropagation();
                $('.' + config.callBox.countryDropdownClass).show();
            });
            _this._elements.bottomFormGroupContainer.on('click', function() {
                //close country dropdown when clicked outside anywhere
                $('.' + config.callBox.countryDropdownClass).hide();
            });

            this._elements.bottomFormGroupContainer.on('click', '.chat-widget', function(event) {
                if (config.chatEnabled) {
                    // window.Tawk_API.maximize();
                }
            });
        },
        getValidatedCallBackData: function() {
            var form = $('#call-box-form');
            var validationFlag = utils.validateForm(form, true);
            if (!validationFlag) {
                return null;
            }

            var name = $('#' + config.callBox.nameId).val(),
                email = $('#' + config.callBox.emailId).val(),
                phone = $('#' + config.callBox.countryCodeId).val() + $('#' + config.callBox.phoneId).val(),
                countryId = $('#' + config.callBox.countryId).val();

            var data = {
                'name': name,
                'phone': phone,
                'email': email,
                'countryId': countryId,
                'projectId': utils.projectId
            };

            return data;
        },
        callBackFormSubmit: function(data) {
            var form = $('#call-box-form');

            // Disable submit button until we get a response from api
            $('#' + config.callBox.submitButtonId).addClass(config.disabledClass);

            var params = {
                successCallback: this.submitLeadSuccessCallback,
                errorCallback: this.submitLeadErrorCallback,
                formRef: form
            };
            ajaxUtils.submitLead(data, params);
        },
        submitLeadSuccessCallback: function(response, params) {
            params.formRef[0].reset();
            $('#' + config.callBox.submitButtonId).removeClass(config.disabledClass);
            $('.callback-message').remove();
            $('.call-box').append('<div class="callback-message form-msg-success">You will get a call back shortly.</div>');
        },
        submitLeadErrorCallback: function(response, params) {
            $('#' + config.callBox.submitButtonId).removeClass(config.disabledClass);
            $('.callback-message').remove();
            $('.call-box').append('<div class="callback-message form-msg-failure">Something went wrong. Please contact +91-11-66764181 for assistance.</div>');
        },
        shareOnEmailSubmit: function(form) {
            var rootdata = this._model.getRootdata();
            var validationFlag = utils.validateForm(form, true);
            if (!validationFlag) {
                return false;
            }

            var name = $('#' + config.emailBox.nameId).val();
            var email = $('#' + config.emailBox.emailId).val();

            var data = {
                notificationType: 'online_buying_share',
                email: email,
                payloadMap: {
                    senderName: name,
                    email: email,
                    projectName: rootdata.projectName,
                    shareUrl: window.location.href,
                    imageUrl: rootdata.mainImage
                }
            };

            var params = {
                successCallback: this.shareOnEmailSuccessCallback,
                errorCallback: this.shareOnEmailErrorCallback,
                formRef: form
            };
            ajaxUtils.sendEmail(data, params);
        },
        shareOnEmailSuccessCallback: function(response, params) {
            params.formRef[0].reset();
            $('.share-message').remove();
            $('.share-box').append('<div class="share-message form-msg-success">Your friend will receive an email shortly.</div>');
        },
        shareOnEmailErrorCallback: function(response, params) {
            $('.share-message').remove();
            $('.share-box').append('<div class="share-message form-msg-failure">Please try again later.</div>');
        },
        formPopupCloseClicked: function() {
            $('form input').parent('div').removeClass('error');
            $('.' + config.bottomFormGroup.tabLinkClass).removeClass('active');
            $('.' + config.bottomFormGroup.formPopUpClass).removeClass('out');
        },
        bottomGroupButtonClicked: function(element) {
            if ($(element).hasClass('active') || $(element).hasClass('disabled')) { // if opened return to stop flickr
                return;
            }

            $('form input').parent('div').removeClass('error');
            $('.' + config.bottomFormGroup.tabLinkClass).removeClass('active');
            var anchorName = $(element).data('name');
            $('.' + config.bottomFormGroup.formPopUpClass).addClass('out');
            $('.' + config.bottomFormGroup.formPopUpClass + '>div').hide();
            $('.' + anchorName).fadeIn(300);
            $(element).addClass('active');
        },
        unitCompareButtonClicked: function() {

            var comparedItems = utils.getComparedItems('shortlistedItems'),
                length = Object.keys(comparedItems).length;

            if (!length) {
                return;
            }
            utils.removeNotificationTooltip();
            this.formPopupCloseClicked();
            this.prepareCompareUnitsContainer(true);
            $('#' + config.compareUnitscontainerId).fadeIn(900);
        },
        changeChatCss: function(data) {
            $('.live-chat').find('iframe').contents().find('style').append(data);
            var chatWidget = $('.live-chat').find('iframe').contents();
            $(chatWidget).find('#formInnerHeight').find("fieldset").each(function(index, d) {
                var label = $(d).find("label").text();
                $(d).find("input").attr("placeholder", label);
                $(d).find("textarea").attr("placeholder", label);
            });
        }
    };

    return BaseView;
})();
