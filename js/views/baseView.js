/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";

function callBackFormSubmit(form){
    var email = $('#'+config.callBox.emailId).val();
    var phone = $('#'+config.callBox.phoneId).val();
    $(form)[0].reset();
    return false;
}

var BaseView = (function() {

    var containerMap = {
        'bottomFormGroupContainer': '<div class"bottom-form-group" id="bottom-form-group"></div>',
        'compareUnitsContainer': '<div  class="compare-units-container" id="'+config.compareUnitscontainerId+'"></div>'
    };


    function getElements() {
        var elements = {
            'bottomFormGroupContainer': $('#bottom-form-group'),
            'compareUnitsContainer': $('#'+config.compareUnitscontainerId)
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
    }

    BaseView.prototype = {
        buildView: function() {
            var _this = this;
            this.buildSkeleton(Object.keys(containerMap));
            for (var i in this._elements) {
                if (this._elements.hasOwnProperty(i) && this[i]) {
                    this[i]();
                }
            }
        },
        updateCompareUnitBox: function(){
            var compareList = this._model.getCompareList(), htmlCode =  '';
            for(var i=0; i<compareList.length; i++){
                var imageUrl = compareList[i].unitTypeData.unitImageUrl;
                htmlCode += '<div class="com-pro-box">'
                    +'<p class="selected">'+compareList[i].unitName+'</p>'
                    +'<img src="'+imageUrl+'" />'
                +'</div>';
            }
            $('.compare-unit-box').html(htmlCode);
        },
        compareUnitsContainer: function(){
            var compareList = this._model.getCompareList(),
            compareList_length = compareList.length;
            var rootdata = this._model.getRootdata();
            
            var htmlCode = '';
        
            htmlCode += '<div class="compare-back-button">&larr; Back</div>';

            htmlCode +='<div class="compare-container">';
            for(var i=0; i<compareList.length; i++){
                var imageUrl = compareList[i].unitTypeData.unitImageUrl;
                htmlCode += '<div class="com-pro-box">'
                    +'<p class="selected">'+compareList[i].unitName+'</p>'
                    +'<img src="'+imageUrl+'" />'
                +'</div>';
            }
            htmlCode +='</div>';
       
            for(var i=0; i<2; i++){
                
                var borderClass = !i ? 'compare-unit-box-right-border' : 'compare-unit-box-right';
                htmlCode += '<div  class="compare-unit-box '+borderClass+'">'
                
                if(!i && compareList_length){
                    var item = compareList[i],
                    imageUrl = item ? item.unitTypeData.unitImageUrl : undefined;
                    htmlCode += '<div class="tower-unit-detail-container ' + config.unitDataContainer + '"></div>';
                    htmlCode += '<div class="compare-unit-box-detail top-right-component"><span>'+item.unitName+' Av</span>-<span>'+item.bedrooms+'</span>-<span>'+item.size+'</span>-<span>'+item.price+'</span>-<span>'+item.floor+'</span></div>';
                    htmlCode += '<div class="unit-view-tabs top-view top-right-component">'
                                    +'<div class="book-com-box">'
                                        +'<div class="like-box '+item.unitIdentifier+'-like-box selected" >'
                                            +'<a >'
                                                +'<span class="icon icon-heart"></span>'
                                                +'<label class="like-count br50"></label>'
                                            +'</a>'
                                        +'</div>'
                                        +'<div class="book-now">'
                                            +'<a >Book online now <span>Rs. '+item.bookingAmount+'/- (Refundable)</span></a>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>';
                    htmlCode += '<div class="img-svg-container"> <svg class="svg-container unit-svg-container" id="unit-compare-svg-container'+i+'" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>'
                                +'<img class="compare-unit-img"  src="'+imageUrl+'"> </div>';
                
                }else{
                    htmlCode += '<div class="compare-unit-box-detail top-right-component"><span>Drag & drop to select unit and compare it.</span></div>'
                                +'<div class="img-svg-container drag-drop">'
                                +'<img class="compare-unit-img"  src="compare_drag.jpg"></div>';
                }

                htmlCode += '</div>';
            }
        
            this._elements.compareUnitsContainer.html(htmlCode);
            //this.updateCompareUnitBox();
            this.compareUnitsContainerEvents();
            if(compareList_length){
                this.unit3dSvgContainer(0);
                /*this.unit3dSvgContainer(1);*/
            }
        },
        compareUnitsContainerEvents: function(){
            var _this = this;
            this._elements.compareUnitsContainer.off('click').on('click', '.'+config.compareBackButtonClass, function(event){
                _this._compareBackButtonClick.notify(this); //this refers to element here                
            });
        },
        unit3dSvgContainer: function(index) {
            var compareList = this._model.getCompareList();
            var unitTypeData = compareList[index].unitTypeData;
            var svgCode = utils.getUnit3dSvgPolygonHtml(unitTypeData);
            $('#unit-compare-svg-container'+index).html(svgCode);
            this.unit3dSvgContainerEvents();
        },
        unit3dSvgContainerEvents: function(){
            var _this = this;
            this._elements.compareUnitsContainer.off('mouseenter').on('mouseenter', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseEnter.notify({
                    element: this,
                    event: event
                });
            });

            this._elements.compareUnitsContainer.off('mouseleave').on('mouseleave', 'polygon', function(event) {
                //here this refers to element
                _this._unitComponentMouseLeave.notify();
            });
        },
        unitComponentMouseEnter: function(params) {
            var reference = $(params.element).parents('.compare-unit-box').children('.tower-unit-detail-container');
            if(reference){
                utils.unitComponentMouseEnter(params, reference);
            }
        },
        unitComponentMouseLeave: function() {
            $('.tower-unit-detail-container').html('');
        },
        compareBackButtonClicked: function(){
            //$('#'+config.compareUnitscontainerId).addClass('hidden');
			$('#'+config.compareUnitscontainerId).animate({ right:'-110%'},800);
        },
        bottomFormGroupContainer: function(){
            var _this = this;
            var htmlCode = '<div class="pro-contact-actions">'
                +'<div class="form-pop-up transition">'
					+'<span class="close-form">x</span>'
                    +'<div class="call-box">'
                        +'<p>Our advisor will call you in next 15 mins*<br>'
                        +'Please provide your details'
                        +'</p>'
						+'<div class="chat-tab-box">'
							+'<a href="#" class="transition">Start Chatting</a>'
							+'<a href="#" class="transition active">We will Call</a>'
						+'</div>'
                        +'<form id="call-box-form"  name="call-box-form" onsubmit="return callBackFormSubmit(this)" >'
                            +'<input class="text" id="call-box-email" name="email" placeholder="enter email id*" type="email" required />'
                            +'<input class="text" id="call-box-phone" name="phone" placeholder="enter cell phone number*" type="number" minlength="10" maxlength="10" required />'
                            +'<div class="submit" id="call-box-submit-id">Submit <span>&rarr;</span>'
								+'<input type="submit" id="call-box-submit-id" />'
							+'</div>'
                        +'</form>'
                    +'</div>'
                    +'<div class="compare-box">'
                        +'<p>Unit plans you like &amp; shortlisted'
                        +'</p>'
                        +'<div class="unit-box fleft" id="'+config.shortListedUnitListId+'">'
                        +'</div>'
                        +'<div class="clear-fix"></div>'
                        +'<div id="'+config.unitCompareButtonId+'" class="submit"><input type="submit" />View Liked Plans <span>&rarr;</span></div>'
                    +'</div>'
                    +'<div class="share-box">'
                        +'<p>Share details with family / friedns via</br> Email / Facebook / Google+</p>'
                        +'<div class="share-social">'
                            +'<a href="javascript:void(0);" lass="fb-share-button" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo" data-layout="button_count"><span class="icon icon-facebook"></span>Facebook</a>'
                            //+'<div class="fb-share-button" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo" data-layout="button_count"></div>'
                            +'<span>or</span>'
                            //+'<div class="g-plus" data-action="share"  data-annotation="bubble" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo"></div>'
                            +'<a href="javascript:void(0);" class="" data-action="share"  data-annotation="bubble" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo"><span class="icon icon-google-plus"></span>Goggle+</a>'
                        +'</div>'
                        +'<input class="text" placeholder="enter name id*" type="text" />'
						+'<input class="text" placeholder="enter email id*" type="text" />'
                        +'<div class="submit"><input type="submit" />Submit <span>&rarr;</span></div>'
                    +'</div>'
                +'</div>'
                +'<ul class="conect-tab">'
                    +'<li>'
                        +'<a href="javascript:void(0);"  data-name="call-box">'
                        +'<p>Quick Call?</br>'
                        +'We will call you!'
                        +'</p>'
                        +'<span class="icon icon-phone"></span>'
                        +'</a>'
                    +'</li>'
                    +'<li>'
                        +'<a href="javascript:void(0);" data-name="compare-box">'
                            +'<p>Compare Plans</br> Once you Liked</p>'
                            +'<span class="icon icon-heart-o">'
                                +'<label class="like-count br50" id="'+config.likeCountId+'">0</label>'
                            +'</span>'
                        +'</a>'
                    +'</li>'
                    +'<li>'
                        +'<a href="javascript:void(0);" data-name="share-box">'
                            +'<p>Email &amp; Share'
                                +'<span>Sign In Now!</span>'
                            +'</p>'
                            +'<span class="icon icon-envelope"></span>'
                        +'</a>'
                    +'</li>'
                +'</ul>'
            +'</div>';

            this._elements.bottomFormGroupContainer.html(htmlCode);
            utils.updateShortListedList();
            this.bottomFormGroupContainerEvents();
        },
        bottomFormGroupContainerEvents: function(){

            var _this = this;

            this._elements.bottomFormGroupContainer.off('click').on('click', '.'+config.bottomFormGroup.tabLinkClass, function(event){
                _this._bottomGroupButtonClick.notify(this); //this refers to element here                
            });

            this._elements.bottomFormGroupContainer.on('click', '#call-box-submit-id', function(event){
                console.log('submit button clicked');             
            });

            this._elements.bottomFormGroupContainer.on('click', '.close-form', function(){
                _this._formPopupCloseClick.notify(this);
            });

            this._elements.bottomFormGroupContainer.on('click', '#'+config.unitCompareButtonId, function(event){
                _this._unitCompareButtonClick.notify(this);
            });

            this._elements.bottomFormGroupContainer.on('click', '.'+config.shortlistedUnitRemoveClass, function(event){
                var unitIdentifier = this.dataset.unitidentifier;
                _this._removeShortlistClick.notify({
                    element: this,
                    unitIdentifier: unitIdentifier
                });
            });

        },
        formPopupCloseClicked: function(){
            $('.'+config.bottomFormGroup.tabLinkClass).removeClass('active');
            $('.'+config.bottomFormGroup.formPopUpClass).removeClass('out');
        },
        bottomGroupButtonClicked: function(element){
            if($(element).hasClass('active')){ // if opened return to stop flickr
                return;
            }
            $('.'+config.bottomFormGroup.tabLinkClass).removeClass('active');
            var anchorName = element.dataset.name;
            $('.'+config.bottomFormGroup.formPopUpClass).addClass('out');
            $('.'+config.bottomFormGroup.formPopUpClass+'>div').hide();
            $('.'+anchorName).fadeIn(300);
            $(element).addClass('active');
        },
        unitCompareButtonClicked: function(){

            var comparedItems = utils.getComparedItems('shortlistedItems'),
            length = comparedItems.length;

            if(!(comparedItems && comparedItems.length > 1)){
                return;
            }

            this.formPopupCloseClicked();
            this.compareUnitsContainer();
            //$('#'+config.compareUnitscontainerId).removeClass('hidden');
			$('#'+config.compareUnitscontainerId).animate({ right:0},900);
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#'+config.baseContainerId).html(htmlCode);
            this._elements = getElements();
        }
    };

    return BaseView;
})();
