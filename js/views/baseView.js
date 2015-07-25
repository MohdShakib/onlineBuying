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
        'compareUnitsContainer': '<div  class="compare-units-container" id="' + config.compareUnitscontainerId + '"></div>'
    };


    function getElements() {
        var elements = {
            'bottomFormGroupContainer': $('#bottom-form-group'),
            'compareUnitsContainer': $('#' + config.compareUnitscontainerId)
        };
        return elements;
    }

    function BaseView(model) {
        this._model = model;
        this._elements = null;
        this._bottomGroupButtonClick = new Event(this);
        this._compareBackButtonClick = new Event(this);
        this._unitCompareButtonClick = new Event(this);
        this._formPopupCloseClick = new Event(this);
        this._unitComponentMouseEnter = new Event(this);
        this._unitComponentMouseLeave = new Event(this);
        this._removeShortlistClick = new Event(this);
        this._bookingClick = new Event(this);
        this._closeClick = new Event(this);
    }

    BaseView.prototype = {
        buildView: function() {
            var rootdata = this._model.getRootdata(),
                _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            this.init(rootdata);
            for (var i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i]();
                }
            }
        },
        init: function(rootdata) {
            $('.project-title').html(rootdata.projectName);
            $('.project-address').html(rootdata.address);
            $('.project-desc').html(rootdata.description);
        },
        reinit: function() {
            $('.pro-contact-actions ul.conect-tab').css({bottom: '-45px'});
        },
        compareUnitsContainer: function() {
            var compareList = this._model.getCompareList(),
                compareList_length = Object.keys(compareList).length;
            var rootdata = this._model.getRootdata();

            var htmlCode = '',
                firstUniqueIdentifier;

            htmlCode += '<div class="title-text"><div class="compare-back-button"><span class="icon icon-arrow_left"></span></div>Compare Screen</div>';

            htmlCode += '<div class="compare-container"><div class="drag-info">Please Drag &amp; Drop from the list into the box to compare</div>';
            for (var uniqueIdentifier in compareList) {
                firstUniqueIdentifier = uniqueIdentifier;
                var imageUrl = compareList[uniqueIdentifier].unitTypeData.unitImageUrl;
                htmlCode += '<div class="' + config.compareBottomBox + '" id="' + config.compareBottomBox + '-' + uniqueIdentifier + '" data-uniqueidentifier="' + uniqueIdentifier + '">' + '<p >' + compareList[uniqueIdentifier].unitName + '</p>' + '<img src="' + imageUrl + '" />' + '</div>';
            }
            htmlCode += '</div>';

            for (var i = 0; i < 2; i++) {
                var borderClass = !i ? 'compare-unit-box-right-border' : 'compare-unit-box-right';
                htmlCode += '<div  class="compare-unit-box ' + borderClass + '" ondragover="allowDrop(event);">'

                htmlCode += '<div class="compare-unit-box-detail top-right-component"><span>Drag & drop to select unit and compare it.</span></div>' + '<div class="img-svg-container drag-drop">' + '<img class="compare-unit-img"  src="images/compare_drag.jpg"/></div>';

                htmlCode += '</div>';
            }

            this._elements.compareUnitsContainer.html(htmlCode);
            if (compareList_length > 1) {
                this.addToCompareBox($('.compare-unit-box')[0], Object.keys(compareList)[0]);
            }
            if (compareList_length == 2) {
                this.addToCompareBox($('.compare-unit-box')[1], Object.keys(compareList)[1]);
            }
            this.compareUnitsContainerEvents();
        },
        compareUnitsContainerEvents: function() {
            var _this = this;
            this._elements.compareUnitsContainer.off('click').on('click', '.' + config.compareBackButtonClass, function(event) {
                _this._compareBackButtonClick.notify(this); //this refers to element here                
            });

            this._elements.compareUnitsContainer.on('click', '.book-now', function(event) {
                _this._bookingClick.notify(this); //this refers to element here                
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
                    var unitUniqueIdentifier = $(this).find('img.compare-unit-img').data('uniqueidentifier');
                    if (unitUniqueIdentifier && $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier)) {
                        $('#' + config.compareBottomBox + '-' + unitUniqueIdentifier + ' ').removeClass('selected');
                    }
                    var uniqueIdentifier = $(ui.draggable).data('uniqueidentifier');
                    _this.addToCompareBox(this, uniqueIdentifier);
                }
            });

        },
        addToCompareBox: function(compareBox, uniqueIdentifier) {
            var compareList = this._model.getCompareList(),
                rootdata = this._model.getRootdata(),
                item = compareList[uniqueIdentifier],
                imageUrl = item ? item.unitTypeData.unitImageUrl : undefined,
                link = rootdata.baseUrl + '/' + item.towerIdentifier + '/' + item.rotationAngle + '/' + item.unitIdentifier + '/booking',
                htmlCode = '<div class="tower-unit-detail-container ' + config.unitDataContainer + '"></div>';

            htmlCode += '<span class="icon fs14 icon-cross close-compare-box"></span><div class="compare-unit-box-detail top-right-component"><span>' + item.unitName + '</span> | <span>' + item.bedrooms + '</span> | <span>' + item.size + '</span> | <span>' + item.price + '</span> | <span>' + item.floor + '</span></div>';
            htmlCode += '<div class="top-right-component">' + '<div class="book-now" data-url="' + link + '">' + '<a>Book now</a><span>Rs. ' + item.bookingAmount + '/- (Refundable)</span>' + '</div>';
            htmlCode += '<div class="img-svg-container"> <svg class="svg-container unit-svg-container" id="unit-compare-svg-container' + uniqueIdentifier + '" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>' + '<img data-uniqueIdentifier="' + item.unitUniqueIdentifier + '" class="compare-unit-img"  src="' + imageUrl + '"> </div>';

            $('#' + config.compareBottomBox + '-' + uniqueIdentifier + ' ').addClass('selected');

            $(compareBox).html(htmlCode);
            this.unit3dSvgContainer(uniqueIdentifier);
        },
        unit3dSvgContainer: function(uniqueIdentifier) {
            var compareList = this._model.getCompareList();
            var unitTypeData = compareList[uniqueIdentifier].unitTypeData;
            var svgCode = utils.getUnit3dSvgPolygonHtml(unitTypeData);
            $('#unit-compare-svg-container' + uniqueIdentifier).html(svgCode);
            this.unit3dSvgContainerEvents();
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
            $('#' + config.compareUnitscontainerId).animate({
                right: '-110%'
            }, 800);
        },
        bottomFormGroupContainer: function() {
            var _this = this;
            var htmlCode = '<div class="pro-contact-actions">' + '<div class="form-pop-up transition">' + '<span class="close-form icon icon-cross fs12"></span>' + '<div class="call-box">' + '<p>Get instant call back from our property advisor*<br>' + 'Please provide your details' + '</p>'
                //+'<div class="chat-tab-box">'
                //+'<a href="#" class="transition">Start Chatting</a>'
                //+'<a href="#" class="transition active">We will Call</a>'
                //+'</div>'
                + '<form id="call-box-form"  name="call-box-form" novalidate onSubmit="return false;"  >' + '<div class="form-input-box"><input class="text" id="' + config.callBox.emailId + '" name="email" placeholder="enter email id*" type="email" required />' + '<div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' + '<div class="form-input-box"><input class="text" id="' + config.callBox.phoneId + '" name="phone*" placeholder="enter cell phone number*" type="text" minlength="10" maxlength="10" required />' + '<div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' + '<div class="submit" id="call-box-submit-id">Get Call Back <span  class="icon icon-arrow_right"></span>' + '<input type="submit" id="call-box-submit-id" />' + '</div>' + '</form>' + '</div>' + '<div class="compare-box">' + '<p>Shortlisted Units are listed below' + '</p>' + '<div class="unit-box fleft" id="' + config.shortListedUnitListId + '">' + '</div>' + '<div class="clear-fix"></div>' + '<div id="' + config.unitCompareButtonId + '" class="submit"><input type="submit" />Compare Floor Plans <span class="icon icon-arrow_right"></span></div>' + '</div>' + '<div class="share-box">' + '<p>Share details with family / friends via</br> Email / Facebook / Google+</p>' + '<div class="share-social">' + '<a href="javascript:void(0);" onclick="utils.socialClicked(\'facebook\')" ><span class="icon icon-facebook"></span>Facebook</a>'
                //+'<div class="fb-share-button" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo" data-layout="button_count"></div>'
                + '<span>or</span>'
                //+'<div class="g-plus" data-action="share"  data-annotation="bubble" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo"></div>'
                + '<a href="javascript:void(0);" onclick="utils.socialClicked(\'googleplus\')" ><span class="icon icon-googleplus"></span>Goggle+</a>' + '</div>' + '<form id="share-box-form" novalidate name="share-box-form" onSubmit="return false;"  >' + '<div class="form-input-box"><input class="text" id="' + config.emailBox.nameId + '" placeholder="enter name*" type="text" required />' + '<div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' + '<div class="form-input-box"><input class="text" id="' + config.emailBox.emailId + '" placeholder="enter email id*" type="email" required />' + '<div class="error-box ' + config.errorMsgClass + '">This field is required</div></div>' + '<div class="submit" id="share-box-submit-id"><input type="submit" />Share <span  class="icon icon-arrow_right"></span></div>' + '</form>' + '</div>' + '</div>' + '<ul class="conect-tab transition">' + '<li>' + '<a href="javascript:void(0);"  data-name="call-box">' + '<p>Need Clarification?</br>' + 'Get in touch' + '</p>' + '<span class="icon icon-phone"></span>' + '</a>' + '</li>' + '<li>' + '<a href="javascript:void(0);" data-name="compare-box">' + '<p>Compare among</br> shortlisted flats</p>' + '<span class="icon icon-heart '+config.blinkElementClass+'">' + '<label class="like-count br50" id="' + config.likeCountId + '">0</label>' + '</span>' + '</a>' + '</li>' + '<li>' + '<a href="javascript:void(0);" data-name="share-box">' + '<p>Share with</br> friends'
                //+'<span>Sign In Now!</span>'
                + '</p>' + '<span class="icon icon-email"></span>' + '</a>' + '</li>' + '</ul>' + '</div>';

            this._elements.bottomFormGroupContainer.html(htmlCode);
            utils.updateShortListedList();
            this.bottomFormGroupContainerEvents();
        },
        bottomFormGroupContainerEvents: function() {

            var _this = this;

            this._elements.bottomFormGroupContainer.off('click').on('click', '.' + config.bottomFormGroup.tabLinkClass, function(event) {
                _this._bottomGroupButtonClick.notify(this); //this refers to element here                
            });

            this._elements.bottomFormGroupContainer.on('click', '#call-box-submit-id', function(event) {
                var callBoxForm = $('#call-box-form');
                _this.callBackFormSubmit(callBoxForm)
            });

            this._elements.bottomFormGroupContainer.on('click', '#share-box-submit-id', function(event) {
                var shareBoxForm = $('#share-box-form');
                _this.shareOnEmailSubmit(shareBoxForm)
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

        },
        callBackFormSubmit: function(form) {
            var validationFlag = utils.validateForm(form);
            if (!validationFlag) {
                return false;
            }

            var email = $('#' + config.callBox.emailId).val();
            var phone = $('#' + config.callBox.phoneId).val();

            var data = {
                'phone': phone,
                'email': email,
                'projectId': utils.projectId
            }

            ajaxUtils.submitLead(data);
        },
        shareOnEmailSubmit: function(form) {
            var validationFlag = utils.validateForm(form);
            if (!validationFlag) {
                return false;
            }

            var name = $('#' + config.emailBox.nameId).val();
            var email = $('#' + config.emailBox.emailId).val();

            var data = {
                'name': name,
                'email': email,
            }

            ajaxUtils.sendEmail(data);
        },
        formPopupCloseClicked: function() {
            $('.' + config.bottomFormGroup.tabLinkClass).removeClass('active');
            $('.' + config.bottomFormGroup.formPopUpClass).removeClass('out');
        },
        bottomGroupButtonClicked: function(element) {
            if ($(element).hasClass('active')) { // if opened return to stop flickr
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

            this.formPopupCloseClicked();
            this.compareUnitsContainer();
            $('#' + config.compareUnitscontainerId).animate({
                right: 0
            }, 900);
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
        }
    };

    return BaseView;
})();