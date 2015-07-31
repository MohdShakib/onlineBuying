/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var TowerselectedController = (function() {

    var rotateAngleHash = {
        '0': '180',
        '180': '0'
    };

    function TowerselectedController(model, view) {
        this._model = model;
        this._view = view;
        this._filters = this._model._filters;
        this.attachListeners();
    }

    TowerselectedController.prototype = {
        attachListeners: function() {
            var _this = this;

            // Svg Events
            this._view._towerUnitSvgMouseEnter.attach(function(sender, obj) {
                _this._view.towerUnitMouseEnterEvent(obj);
            });
            this._view._towerUnitSvgMouseLeave.attach(function(sender, element) {
                _this._view.towerUnitMouseLeaveEvent(element);
            });
            this._view._towerUnitSvgClick.attach(function(sender, element) {
                var index = $(element).data('index');
                _this._model.setSelectedListing(index);
                _this._view.towerUnitMouseClickEvent(element);
                utils.changeUrl(element);
            });

            // Tower Rotation
            this._view._towerRotateClicked.attach(function(sender, element) {

                _this._view._elements.towerSvgContainer.html('');
                var currentRotationAngle = _this._model.getCurrentRotationAngle();
                var rotationImages = ['tow-d-ang-0.jpg', 'tow-d-ang-180.jpg',
                                    /*'tow-k-ang-0.jpg', 'tow-k-ang-180.jpg',*/
                            ];


               /*   var rotationImages = [
                        '1_000.jpg', '1_002.jpg', '1_003.jpg', '1_004.jpg', '1_005.jpg',
                        '1_006.jpg', '1_007.jpg', '1_008.jpg', '1_009.jpg', '1_0010.jpg',
                        '1_0010.jpg', '1_0012.jpg', '1_0013.jpg', '1_0014.jpg', '1_0015.jpg',
                        '1_0016.jpg', '1_0017.jpg', '1_0018.jpg', '1_0019.jpg', '1_0020.jpg',
                        '1_0020.jpg', '1_0022.jpg', '1_0023.jpg', '1_0024.jpg', '1_0025.jpg'
                    ];*/
                    
                $('#rotate-tower-imgs').remove();
                var imgCode = "<img  id='rotate-tower-imgs'  width='100%' />";
                _this._view._elements.towerImgContainer.append(imgCode);
                 var rotationImages = [
                        'A_0005.jpg', 'A_0006.jpg', 'A_0007.jpg', 'A_0008.jpg', 'A_0009.jpg', 'A_0010.jpg',
                        'A_0010.jpg', 'A_0012.jpg', 'A_0013.jpg', 'A_0014.jpg', 'A_0015.jpg',
                        'A_0016.jpg', 'A_0017.jpg', 'A_0018.jpg', 'A_0019.jpg', 'A_0020.jpg',
                        'A_0020.jpg', 'A_0022.jpg', 'A_0023.jpg', 'A_0024.jpg', 'A_0025.jpg',
                        'A_0026.jpg', 'A_0027.jpg', 'A_0028.jpg', 
                        'A_0029.jpg', 'A_0030.jpg', 'A_0031.jpg', 'A_0032.jpg', 'A_0033.jpg', 'A_0034.jpg', 'A_0035.jpg',
                        'A_0036.jpg', 'A_0037.jpg', 'A_0038.jpg', 'A_0039.jpg', 'A_0040.jpg',
                        'A_0041.jpg', 'A_0042.jpg', 'A_0043.jpg', 'A_0044.jpg', 'A_0045.jpg',
                        'A_0046.jpg', 'A_0047.jpg', 'A_0048.jpg'
                    ];
                var imagePath = '', startIndex, endIndex, intermediateImagesCount, i, j;
                /*for(var i=1; i<=rotationImages.length; i++){
                    $('#rotate-tower-imgs').removeClass('hidden');
                    imagePath = '/zip-file/img/'+rotationImages[i-1];
                    imagePath = '/zip-file/rotate/'+rotationImages[i-1];
                    var timeout = i*200;
                    (function(imagePath,timeout){
                        setTimeout(function(){
                            $('#rotate-tower-imgs').attr('src',imagePath);
                        }, timeout)
                    })(imagePath, timeout);
                }*/
                
                if(currentRotationAngle == '0'){
                    endIndex = 24;
                    startIndex = 0;
                }else{
                    startIndex = 25;
                    endIndex = 44;
                }

                intermediateImagesCount = endIndex - startIndex;

                for(i=startIndex,j=0; i<endIndex; i++){
                    imagePath = '/zip-file/rotate-latest/'+rotationImages[endIndex-j];
                    j++;
                    var timeout = j*200;
                    (function(imagePath,timeout){
                        setTimeout(function(){
                            $('#rotate-tower-imgs').attr('src',imagePath);
                        }, timeout)
                    })(imagePath, timeout);
                }

                setTimeout(function(){
                    $('#rotate-tower-imgs').remove();
                    var newRotationAngle = rotateAngleHash[currentRotationAngle] || '0';
                    // change rotation angle value
                    _this._model.updateCurrentRotationAngle(newRotationAngle);
                    _this._view.rotateTower();

                }, (intermediateImagesCount+1)*200);

            });

            // Filter Events
            this._view._bhkFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var bhk = dataset.value;
                _this.toggleFilterOption(_this._filters.bhk, bhk, element);
            });
            this._view._floorFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var floorGroup = dataset.svalue + " " + dataset.evalue;
                _this.toggleFilterOption(_this._filters.floor, floorGroup, element);
            });
            this._view._entranceFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var entrance = dataset.value;
                _this.toggleFilterOption(_this._filters.entrance, entrance, element);
            });
            this._view._priceFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var priceGroup = dataset.svalue + " " + dataset.evalue;
                _this.toggleFilterOption(_this._filters.price, priceGroup, element);
            });
            this._view._resetFiltersClick.attach(function(sender, element) {
                var filtersApplied = _this._model.isFilterApplied();

                if(!filtersApplied){
                    return;
                }

                _this._filters = _this._model._filters = {
                    bhk: [],
                    floor: [],
                    entrance: [],
                    price: []
                };
                _this._view.resetFilterOption(element);
                _this.updateFilteredListings();
            });
        },
        toggleFilterOption: function(filterArray, filterOption, element) {
            var index = filterArray.indexOf(filterOption);
            if (index > -1) {
                filterArray.splice(index, 1);
            } else {
                filterArray.push(filterOption);
            }
            this._view.toggleFilterOption(element);
            this.updateFilteredListings();
            this._view.updateFilterCount();
        },
        updateFilteredListings: function() {
            var listings = this._model.getData().listings,
                filteredListings = [], filteredAvailableCount = 0;

            //updateFilteredAvailableCount
            for (var id in listings) {
                var unit = listings[id];

                // BHK Check
                if (this._filters.bhk !== null &&
                    this._filters.bhk.length !== 0 &&
                    this._filters.bhk.indexOf(unit.bedrooms) < 0) {
                    continue;
                }

                // Entrance Check
                if (this._filters.entrance !== null &&
                    this._filters.entrance.length !== 0 &&
                    this._filters.entrance.indexOf(unit.facing) < 0) {
                    continue;
                }

                // Floor Check
                var floorGroupInterval = utils.getGroupInterval(unit.floor, config.filters.floorInterval);
                var sfloor = floorGroupInterval.start,
                    efloor = floorGroupInterval.end - 1;
                var floorGroup = sfloor + " " + efloor;
                if (this._filters.floor !== null &&
                    this._filters.floor.length !== 0 &&
                    this._filters.floor.indexOf(floorGroup) < 0) {
                    continue;
                }

                // Price Check
                var priceGroupInterval = utils.getGroupInterval(unit.price, config.filters.priceInterval);
                var sprice = priceGroupInterval.start,
                    eprice = priceGroupInterval.end;
                var priceGroup = sprice + " " + eprice;
                if (this._filters.price !== null &&
                    this._filters.price.length !== 0 &&
                    this._filters.price.indexOf(priceGroup) < 0) {
                    continue;
                }

                if(listings[id].isAvailable){
                    filteredAvailableCount += 1;
                }

                filteredListings.push(id);
            }

            this._model.updateFilteredAvailableCount(filteredAvailableCount);
            this._view.updateAvailableCount();

            this._model.updateFilteredListings(filteredListings);
            this._view.towerSvgContainer(this._model.getData(), this._model.getRootdata());
        },
        generateTemplate: function(data, rootdata, elements) {
            this._view.buildView();
            if (this._model.isFirstLoad()) {
                utils.showLoader(this._view.startAnimation);
                this._model.toggleFirstLoad();
            } else {
                this._view.displayWithoutAnimation();
            }
        }
    };

    return TowerselectedController;

})();