var config = (function() {

    var config = {


        urlAppName : '/4d-view',

        // Independent App
        apisJson: false,
        cityJson: true, // to read cities from json
        localZip: false,
        setJsonDataPriorityForTest: false,
        builderSetUp: false,


        // Flags
        showCarAnimation: true,
        showTowerRotation: true,
        enablePayment: true,
        useSpecifiedTowerTooltipSvg: true,
        allUnitsAvailable: false, // keep it true only for testing purpose
        polyHoverFlag: false,
        chatEnabled: true,
        readDataFromJson: true,
        removeFacingFilter: true,


        // Variables
        towerRotationSpeed: 100, // delay between 2 consecutive frames in miliseconds
        towerMenuItemHeight: 90,
        maxShortlistCount: 6,
        tawkApiId: 'tawk_55e5498bfc2b363371225aaa',
        errorMsg: 'Something went wrong. Please contact 1800-103-104-1 for assistance.',
        projectConfig: {
            "501448": {
                ivrsData: "+91-7930641590"
            },
            "640926": {
                ivrsData: "+91-7930641590"
            },
            "513534": {
                ivrsData: "+91-8049202151"
            },
            "656047": {
                ivrsData: "+91-8049202151"
            },
            "668509": {
                ivrsData: "+91-4439942696"
            },
            "672575": {
                ivrsData: "+91-1166764112"
            },
            "501639": {
                ivrsData: "+91-3330566486"
            },
            "669434": {
                ivrsData: "+91-2261739689"
            },
            "655929": {
                ivrsData: "+91-2039520706"
            },
            "667404": {
                ivrsData: "+91-2039520706"
            },
            "674457": { // artha neo
                ivrsData : "+91-7676888222",
                cancellationEnabled : false
            },
            "668243": { // artha serene
                ivrsData : "+91-7676888222",
                cancellationEnabled : false
            }
        },
        helpline: '1800-103-104-1',
        cancellationEnabled: true,
        emailId: 'sales@umangrealtech.com',
        gaCategory: '4d-view',

        // Data
        backgroundImage: 'masterplan.jpg',
        projectDetail: {
            titleId: "project-title",
            towerId: "project-tower",
            unitId: "project-unit",
            addressId: "project-address",
            availabilityCountId: "project-count"
        },
        imageResolution: {
            height: 630,
            width: 1365,
            unit: 'px'
        },
        dataFiles: {
            masterplanScreen: 'masterplanScreen',
            towerselectScreen: 'towerselectScreen',
            amenitiesHotspots: 'amenitiesHotspots',
            unitplanInfo: 'unitplanInfo',
            towerRotation: 'towerRotation'
        },
        bottomFormGroup: {
            'tabLinkClass': 'conect-tab li a',
            'formPopUpClass': 'form-pop-up'
        },
        callBox: {
            nameId: 'call-box-name',
            emailId: 'call-box-email',
            countryCodeId: 'call-box-country-code',
            countryId: 'call-box-country-id',
            phoneId: 'call-box-phone',
            countryDropdownArrowClass: 'dropdown-arrow',
            countryDropdownClass: 'country-dropDown',
            submitButtonId: 'call-box-submit-id'
        },
        emailBox: {
            nameId: 'email-box-name',
            emailId: 'email-box-email',
            submitButtonId: 'share-box-submit-id'
        },
        notificationTooltipClass: 'notification-tooltip',
        notificationMessageClass: 'notification-message',


        // Common
        noPointerClass: 'no-pointer',
        hideClass: 'hidden',
        fadeInClass: 'fade-in',
        fadeOutClass: 'fade-out',
        transitionClass: 'transition',
        slowTransitionClass: 'slow-transition',
        selectedClass: 'selected',
        availabilityClass: {
            available: 'apt-available',
            unavailable: 'apt-unavailable'
        },
        countAvailabilityClass: {
            available: 'apt-available-count-color',
            unavailable: 'apt-unavailable-count-color'
        },
        parentContainerId: "parent-container",
        mainContainerId: "main-container",
        baseContainerId: "base-container",
        dynamicResizeClass: "dynamic-resize",
        errorMsgClass: "error-msg",
        disabledClass: "disabled",
        popupClass: "popup",
        videoClass: "video",

        towerDetailContainerId: "tower-detail-container",
        leftPanelButtonClass: 'left-panel-button',
        menuItemHoverClass: "menu-item-hover",
        compareBackButtonClass: "compare-back-button",
        compareUnitscontainerId: 'compare-units-container',
        unitCompareButtonId: 'unit-compare-button',
        compareUnitComponentDetailContainer: 'compare-unit-component-detail-container',
        shortListedUnitListId: 'shortlisted-unit-list',
        compareBottomBox: 'com-pro-box',
        likeCountId: 'like-count',
        shortlistedUnitRemoveClass: 'remove-shortlist',
        smallLeftArea: 'small-left',
        beepEffectClass: 'heart-beep-effect',
        textBlinkClass: 'blink-effect',
        lazyloadClass: 'lazy-load',
        imageLazyloadedClass: 'lazy-loaded',

        // Masterplan
        imgContainerClass: "menu-mapped-image",
        towerImgSvgClass: 'tower-svg-path',
        fadeImageClass: "fade-image",
        amenityContainerClass: "amenities-container",
        amenityNotOnTopClass: "not-on-top",
        amenityIconClass: "amenity-icon",
        amenityPopupClass: "amenity-popup",
        amenityPopupTableClass: "photo-table",
        amenityPopupCloseClass: "amenity-popup-close",
        towerMenuClass: "master-tower-menu",

        //google map view
        initialZoomLevel: 17,
        maxZoomLevel: 18,
        openProjectRadius: 200,
        nearbySearchDistance: 3000,
        nearbySearchAmenities: ['hospital','school','shopping_mall','grocery_or_supermarket','gas_station','doctor','department_store'],

        // Towerselected
        imgContainerId: 'img-container',
        svgContainerId: 'svg-container',
        towerRotationContainerId: 'tower-rotation-container',
        filterMenuContainerId: 'filter-menu-container',

        towerUnitSvgClass: 'tower-unit-svg-path',
        towerUnitSvgHoverClass: 'tower-unit-svg-hover-path',
        towerUnitSvgSelectedClass: 'tower-unit-svg-selected-path',
        selectedTowerImagesClass: 'selected-tower-image',
        rotationButtonClass: 'rotation-button',

        menuItemContainerClass: 'menu-item-container',
        menuItemOptionsClass: 'menu-item-options',
        filters: {
            bhk: 'bhk-option',
            floor: 'floor-option',
            entrance: 'entrance-option',
            price: 'price-option',
            selectedClass: 'selected',
            resetClass: 'reset-filters',
            floorInterval: 6,
            priceInterval: 1000000
        },

        minMapToggleClass: 'toggle-arrow',

        // Unitplan
        selectedUnitContainerId: 'selected-unit-container',
        unitDetailContainerId: "unit-component-detail-container",
        closeUnitContainerId: 'unit-close-container',
        unitDataContainer: 'unit-data-container',
        unitMenuLinkClass: 'unit-menu-link',
        sunlightImageClass: 'sunlight-img',
        sunlightMenuOptionClass: 'sunlight-menu-option',
        floorPlanMenuOptionClass: 'floor-plan-menu-option',
        unitSlideInClass: 'unit-slide-in',
        blinkElementClass: 'blink',
        totalAmountClass: 'total-sum',
        subTotalAmountClass: 'sub-total-sum',
        optionalPriceClass: 'optional-price',

        // Booking
        termsConditionPopupId: 'terms-condition-popup',
        paymentBreakupPopupId: 'payment-breakup-popup',
        bookingInputDivClass: 'booking-input-div',
        bookingSelectionDivClass: 'booking-selection-div',
        bookingDropdownClass: 'booking-dropdown',
        nationalityDropdownClass: 'nationalty-drop-down',
        activeBookingInputClass: 'active'
    };

    return config;

})();
