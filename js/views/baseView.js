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
        'compareUnitsContainer': '<div  class="hidden compare-units-container" id="'+config.compareUnitscontainerId+'"></div>'
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
        compareUnitsContainer: function(){
            var compareList = this._model.getCompareList();
            var rootdata = this._model.getRootdata();
            
            var htmlCode = '';
        
            htmlCode += '<div class="compare-back-button">Back</div>';

            for(var i=0; i<2; i++){
                var borderClass = !i ? 'compare-unit-box-right-border' : '';
                var imageUrl = compareList[i] ? compareList[i].unitTypeData.unitImageUrl : undefined; ///zip-file/img/2bhk-type1-1105-2.jpg
                htmlCode += '<div  class="compare-unit-box '+borderClass+'">'
                    +'<img class="compare-unit-img"  src="'+imageUrl+'">'
                +'</div>';
            }
        
            this._elements.compareUnitsContainer.html(htmlCode);
            this.compareUnitsContainerEvents();
        },
        compareUnitsContainerEvents: function(){
            var _this = this;
            this._elements.compareUnitsContainer.off('click').on('click', '.'+config.compareBackButtonClass, function(event){
                _this._compareBackButtonClick.notify(this); //this refers to element here                
            });
        },
        compareBackButtonClicked: function(){
            $('#'+config.compareUnitscontainerId).addClass('hidden');
        },
        bottomFormGroupContainer: function(){
            var _this = this;
            var htmlCode = '<div class="pro-contact-actions">'
                +'<div class="form-pop-up">'
					+'<span class="close-form">x</span>'
                    +'<div class="call-box">'
                        +'<p>Our advisor will call you in next 15 mins*<br>'
                        +'Please provide your details'
                        +'</p>'
                        +'<form id="call-box-form"  name="call-box-form" onsubmit="return callBackFormSubmit(this)" >'
                            +'<input class="text" id="call-box-email" name="email" placeholder="enter email id*" type="email" required />'
                            +'<input class="text" id="call-box-phone" name="phone" placeholder="enter cell phone number*" type="number" minlength="10" maxlength="10" required />'
                            +'<input type="submit" id="call-box-submit-id" />'
                            //+'<div class="submit" id="call-box-submit-id">Submit <span>&rarr;</span></div>'
                        +'</form>'
                    +'</div>'
                    +'<div class="compare-box">'
                        +'<p>Unit plans you like &amp; shortlisted'
                        +'</p>'
                        +'<div class="unit-box fleft">'
                            +'<ul>'
                                +'<li>A - 1109</li>'
                                +'<li>A - 1109</li>'
                                +'<li>A - 1109</li>'
                                +'<li>A - 1109</li>'
                            +'</ul>'
                        +'</div>'
                        +'<div class="clear-fix"></div>'
                        +'<div id="'+config.unitCompareButtonId+'" class="submit"><input type="submit" />View Liked Plans <span>&rarr;</span></div>'
                    +'</div>'
                    +'<div class="share-box">'
                        +'<p>Share details with family / friedns via</br> Email / Facebook / Google+</p>'
                        +'<div class="share-social">'
                            //+'<a href="javascript:void(0);"><span class="icon icon-facebook"></span>Facebook</a>'
                            +'<div class="fb-share-button" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo" data-layout="button_count"></div>'
                            +'<span>or</span>'
                            +'<div class="g-plus" data-action="share"  data-annotation="bubble" data-href="https://www.youtube.com/watch?v=ajxyYf3PENo"></div>'
                            //+'<a href="javascript:void(0);"><span class="icon icon-google-plus"></span>Goggle+</a>'
                        +'</div>'
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
                                +'<label class="like-count br50">2</label>'
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

        },
        formPopupCloseClicked: function(){
            $('.'+config.bottomFormGroup.tabLinkClass).removeClass('active');
            $('.'+config.bottomFormGroup.formPopUpClass).removeClass('out');
            $('.'+config.bottomFormGroup.formPopUpClass+'>div').hide();
        },
        bottomGroupButtonClicked: function(element){
            $('.'+config.bottomFormGroup.tabLinkClass).removeClass('active');
            var anchorName = element.dataset.name;
            $('.'+config.bottomFormGroup.formPopUpClass).addClass('out');
            $('.'+config.bottomFormGroup.formPopUpClass+'>div').hide();
            $('.'+anchorName).fadeIn(300);
            $(element).addClass('active');
        },
        unitCompareButtonClicked: function(){
            this.formPopupCloseClicked();
            $('#'+config.compareUnitscontainerId).removeClass('hidden');
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
