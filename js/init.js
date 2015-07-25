"use strict";
(function(d, w) {

    d.addEventListener('DOMContentLoaded', function() {
        initializeRoutes();
        showLoader();
    });

    function showLoader() {
        var percentCounter = 0,
            count = 0,
            arrayOfImageUrls = document.images;
        $.each(arrayOfImageUrls, function(index, value) {
            $('<img></img>').attr('src', value.src) //load image
                .load(function() {
                    count++;
                    percentCounter = (count / arrayOfImageUrls.length) * 100; //set the percentCounter after this image has loaded
                    var percentage = Math.floor(percentCounter) + '%';
                    $('.loading-bar span').width(percentage);
                    $('.loading-persentage').html(percentage);
                    console.log(percentage);
                });
        });
    }

    $(window).load(function() {
        $('.show-loading').hide();
    });

})(document, window);