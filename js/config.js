var config = (function(){
	
	var config = {

		// Data
		backgroundImage: 'masterplan.png',
		projectDetail: {
			titleId: "project-title",
			addressId: "project-address"
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
			emailId: 'call-box-email',
			phoneId: 'call-box-phone'
		},
		
		// Common
		noPointerClass: 'no-pointer',
		hideClass: 'hidden',
		transitionClass: 'transition',
		selectedClass: 'selected',
		availabilityClass: {
			available: 'apt-available',
			unavailable: 'apt-unavailable'
		},
		mainContainerId : "main-container",
		baseContainerId:  "base-container",
		dynamicResizeClass: "dynamic-resize",

		towerDetailContainerId: "tower-detail-container",
		leftPanelButtonClass: 'left-panel-button',
		menuItemHoverClass: "menu-item-hover",
		compareBackButtonClass: "compare-back-button",
		compareUnitscontainerId: 'compare-units-container',
		unitCompareButtonId: 'unit-compare-button',
		
		// Masterplan
		imgContainerClass : "menu-mapped-image",
		towerImgSvgClass: 'tower-svg-path',
		fadeImageClass: "fade-image",
		amenityContainerClass: "amenities-container",
		amenityNotOnTopClass: "not-on-top",
		amenityIconClass: "amenity-icon",
		amenityPopupClass: "amenity-popup",
		amenityPopupTableClass: "photo-table",
		amenityPopupCloseClass: "amenity-popup-close",

		// Towerselected
		imgContainerId: 'img-container',
		svgContainerId: 'svg-container',
		towerRotationContainerId: 'tower-rotation-container',
		filterMenuContainerId: 'filter-menu-container',
		
		towerUnitSvgClass: 'tower-unit-svg-path',
		towerUnitSelectedSvgClass: 'tower-unit-selected-svg-path',
		selectedTowerImagesClass: 'selected-tower-image',
		rotationButtonClass: 'rotation-button',
		
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
		closeUnitContainerId: 'unit-close-container',
		unitDataContainer: 'unit-data-container',
		unitMenuLinkClass: 'unit-menu-link',
		sunlightImageClass: 'sunlight-img',
		sunlightMenuOptionClass: 'sunlight-menu-option',
		floorPlanMenuOptionClass: 'floor-plan-menu-option'
	};

	return config;

})(); 

