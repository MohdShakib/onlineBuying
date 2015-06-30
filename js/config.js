var config = (function(){
	
	var config = {
		backgroundImage: 'masterplan.png',
		projectDetail: {
			titleId: "project-title",
			addressId: "project-address"
		},
		mainContainerId : "main-container",
		imgContainerClass : "menu-mapped-image",
		leftPanelButtonClass: 'left-panel-button',
		towerImgSvgClass: 'tower-svg-path',
		towerUnitSvgClass: 'tower-unit-svg-path',
		imageResolution: {
			height: 630,
			width: 1365,
			unit: 'px'
		},
		selectedTowerImagesClass: 'selected-tower-image',
		towerDetailContainerId: "tower-detail-container",
		fadeImageClass: "fade-image",
		menuItemHoverClass: "menu-item-hover",
		amenityIconClass: "amenity-icon",
		amenityPopupClass: "amenity-popup",
		amenityPopupCloseClass: "amenity-popup-close",
		csv: {
			masterplanScreen: 'masterplanScreen.csv',
			towerselectScreen: 'towerselectScreen.csv',
			amenitiesHotspots: 'amenitiesHotspots.csv',
			unitplanInfo: 'unitplanInfo.csv'
		},
		availabilityClass: {
			available: 'apt-available',
			unavailable: 'apt-unavailable'
		},
		filters: {
			bhk: 'bhk-option',
			floor: 'floor-option',
			entrance: 'entrance-option',
			price: 'price-option',
			selectedClass: 'selected',
			resetClass: 'reset-filters',
			floorInterval: 3,
			priceInterval: 1000000
		}
	};

	return config;

})(); 

