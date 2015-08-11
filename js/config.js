var config = (function() {

    var config = {

        // Variables
        mockProjectData: true,
        showLogs: true,
        showCarAnimation: true,
        showTowerRotation: true,
        towerRotationSpeed: 100, // delay between 2 consecutive frames in miliseconds
        towerMenuItemHeight: 44,

        // Data
        backgroundImage: 'masterplan.jpg',
        projectDetail: {
            titleId: "project-title",
            addressId: "project-address",
            availabilityCountId: "project-count"
        },
        imageResolution: {
            height: 630,
            width: 1365,
            unit: 'px'
        },
        csv: {
            masterplanScreen: 'masterplanScreen.csv',
            towerselectScreen: 'towerselectScreen.csv',
            amenitiesHotspots: 'amenitiesHotspots.csv',
            unitplanInfo: 'unitplanInfo.csv'
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
            countryDropdownClass: 'country-dropDown'
        },
        emailBox: {
            nameId: 'email-box-name',
            emailId: 'email-box-email'
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
        parentContainerId: "parent-container",
        mainContainerId: "main-container",
        baseContainerId: "base-container",
        dynamicResizeClass: "dynamic-resize",
        errorMsgClass: "error-msg",

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
            floorInterval: 3,
            priceInterval: 1000000
        },

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