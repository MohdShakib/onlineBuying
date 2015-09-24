/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

"use strict";
var TowerselectedController = (function() {

    function TowerselectedController(model, view) {
        this._model = model;
        this._view = view;
        this._filters = this._model._filters;
        this.attachListeners();
    }

    TowerselectedController.prototype = {
        getNewRotationAngle: function(currentRotationAngle, anticlockwise) {
            var stableAngles = this._model.getStableViewAngles(),
                totalStableAngles = stableAngles.length,
                currentAngleIndex = stableAngles.indexOf(currentRotationAngle);
            var nextAngle = currentRotationAngle;
            if (totalStableAngles > 1 && currentAngleIndex > -1) {
                if (!currentAngleIndex) { // when 0 index
                    nextAngle = anticlockwise ? stableAngles[totalStableAngles - 1] : stableAngles[1];
                } else if (currentAngleIndex == totalStableAngles - 1) {
                    nextAngle = anticlockwise ? stableAngles[currentAngleIndex - 1] : stableAngles[0];
                } else {
                    nextAngle = anticlockwise ? stableAngles[currentAngleIndex - 1] : stableAngles[currentAngleIndex + 1];
                }

            }

            return nextAngle;
        },
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
                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    elementData = $(element).data(),
                    avalibility = elementData.url == "undefined" ? "-sold" : "-available",
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-' + elementData.index + '-svg' + avalibility;
                utils.tracking(config.gaCategory, 'towerUnitSvgClicked', label);

                var index = $(element).data('index');
                _this._model.setSelectedListing(index);
                _this._view.towerUnitMouseClickEvent(element);
                utils.changeUrl(element);
            });

            // Tower Rotation
            this._view._towerRotateClicked.attach(function(sender, element) {
                var rootdata = _this._model.getRootdata(),
                    data = _this._model.getData(),
                    label = rootdata.projectIdentifier + '-' + rootdata.projectId + '-' + data.towerIdentifier + '-' + data.towerId + '-rotation';
                utils.tracking(config.gaCategory, 'towerRotationButtonClicked', label);

                var currentRotationAngle = _this._model.getCurrentRotationAngle();
                var isAnticlockwise = $(element).data('anticlockwise');
                var newRotationAngle = _this.getNewRotationAngle(currentRotationAngle, isAnticlockwise);
                _this._model.updateCurrentRotationAngle(newRotationAngle);
                _this._view.rotateTower(currentRotationAngle, newRotationAngle, isAnticlockwise);
            });

            // Go back Event
            this._view._goBackButtonClick.attach(function(sender, element) {
                var rootData = _this._model.getRootdata();
                router.setRoute(rootData.baseUrl);
                return;
            });

            // Filter Events
            this._view._bhkFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var bhk = dataset.value;
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-bedroomFilter';
                utils.tracking(config.gaCategory, 'filterPanelClicked', label);
                _this.toggleFilterOption(_this._filters.bhk, bhk, element);
            });
            this._view._floorFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var floorGroup = dataset.svalue + " " + dataset.evalue;
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-floorFilter';
                utils.tracking(config.gaCategory, 'filterPanelClicked', label);
                _this.toggleFilterOption(_this._filters.floor, floorGroup, element);
            });

            if (!config.removeFacingFilter) {
                this._view._entranceFilterOptionClick.attach(function(sender, element) {
                    var dataset = $(element).data();
                    var entrance = dataset.value;
                    var data = _this._model.getRootdata(),
                        label = data.projectIdentifier + '-' + data.projectId + '-entranceFilter';
                    utils.tracking(config.gaCategory, 'filterPanelClicked', label);
                    _this.toggleFilterOption(_this._filters.entrance, entrance, element);
                });
            }

            this._view._priceFilterOptionClick.attach(function(sender, element) {
                var dataset = $(element).data();
                var priceGroup = dataset.svalue + " " + dataset.evalue;
                var data = _this._model.getRootdata(),
                    label = data.projectIdentifier + '-' + data.projectId + '-priceFilter';
                utils.tracking(config.gaCategory, 'filterPanelClicked', label);
                _this.toggleFilterOption(_this._filters.price, priceGroup, element);
            });
            this._view._resetFiltersClick.attach(function(sender, element) {
                var filtersApplied = _this._model.isFilterApplied();

                if (!filtersApplied) {
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
                filteredListings = [],
                filteredAvailableCount = 0;

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

                if (listings[id].isAvailable) {
                    filteredAvailableCount += 1;
                }

                filteredListings.push(id);
            }

            this._model.updateFilteredAvailableCount(filteredAvailableCount);
            this._view.updateAvailableCount();

            this._model.updateFilteredListings(filteredListings);
            this._view.towerSvgContainer(this._model.getData(), this._model.getRootdata());
        },
        generateTemplate: function(fromUnitInfoView) {
            this._view.buildView();
            if (this._model.isFirstLoad()) {
                utils.showLoader(this._view, this._view.startAnimation);
                this._model.toggleFirstLoad();
            } else {
                this._view.displayWithoutAnimation(fromUnitInfoView);
            }
        }
    };

    return TowerselectedController;

})();