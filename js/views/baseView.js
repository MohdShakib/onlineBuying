/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

"use strict";
var BaseView = (function() {

    var containerMap = {
        'bottomFormGroupContainer': '<div class"bottom-form-group" id="bottom-form-group"></div>'
    };


    function getElements() {
        var elements = {
            'bottomFormGroupContainer': $('#bottom-form-group')
        };
        return elements;
    }

    function BaseView() {
        this._elements = null;
        this._bottomGroupButtonClick = new Event(this);
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
        bottomFormGroupContainer: function(){
            var htmlCode = '<div class="pro-contact-actions">'
                        +'<div class="form-pop-up">'
                            +'<div class="call-box">'
                                +'<p>Our advisor will call you in next 15 mins*<br>'
                                +'Please provide your details'
                                +'</p>'
                                +'<input class="text" placeholder="enter email id*" type="text" />'
                                +'<input class="text" placeholder="enter cell phone number*" type="text" />'
                                +'<div class="submit"><input type="submit" />Sbmit <span>&rarr;</span></div>'
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
                                +'<div class="unit-box fright">'
                                    +'<ul>'
                                        +'<li>A - 1109</li>'
                                        +'<li>A - 1109</li>'
                                        +'<li>A - 1109</li>'
                                        +'<li>A - 1109</li>'
                                    +'</ul>'
                                +'</div>'
                                +'<div class="clear-fix"></div>'
                                +'<div class="submit"><input type="submit" />View Liked Plans <span>&rarr;</span></div>'
                            +'</div>'
                            +'<div class="share-box">'
                                +'<p>Share details with family / friedns via</br> Email / Facebook / Google+</p>'
                                +'<div class="share-social">'
                                    +'<a href="javascript:void(0);"><span class="icon icon-facebook"></span>Facebook</a>'
                                    +'<span>or</span>'
                                    +'<a href="javascript:void(0);"><span class="icon icon-google-plus"></span>Goggle+</a>'
                                +'</div>'
                                +'<input class="text" placeholder="enter email id*" type="text" />'
                                +'<div class="submit"><input type="submit" />Sbmit <span>&rarr;</span></div>'
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
        },
        bottomGroupButtonClicked: function(element){
            $('.'+config.bottomFormGroup.tabLinkClass).removeClass('active');
            var anchorName = element.dataset.name;
            $('.'+config.bottomFormGroup.formPopUpClass).addClass('out');
            $('.'+config.bottomFormGroup.formPopUpClass+'>div').hide();
            $('.'+anchorName).fadeIn(300);
            $(element).addClass('active');
        },
        buildSkeleton: function(containerList) {
            var key, htmlCode = '';
            for (key in containerList) {
                if (containerList.hasOwnProperty(key) && containerMap[containerList[key]]) {
                    htmlCode += containerMap[containerList[key]];
                }
            }
            $('#'+config.mainContainerId).append(htmlCode);
            this._elements = getElements();
        }
    };

    return BaseView;

})();