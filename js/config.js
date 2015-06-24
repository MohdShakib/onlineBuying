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
		imgSvgClass: 'image-svg-path',
		imageResolution: {
			height: 630,
			width: 1365,
			unit: 'px'
		},
		towerDetailContainerId: "tower-detail-container",
		fadeImageClass: "fade-image",
		menuItemHoverClass: "menu-item-hover",
		amenityIconClass: "amenity-icon",
		amenityPopupClass: "amenity-popup",
		amenityPopupCloseClass: "amenity-popup-close",
		csv: {
			masterplanScreen: 'masterplanScreen.csv',
			towerselectScreen: 'towerselectScreen.csv',
			amenitiesHotspots: 'amenitiesHotspots.csv'
		}
	};

	return config;

})(); 

