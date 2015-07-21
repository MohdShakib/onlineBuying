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
                _this._model.setSelectedListing(element.dataset.index);
                _this._view.towerUnitMouseClickEvent(element);
                utils.changeUrl(element);
            });

            // Tower Rotation
            this._view._towerRotateClicked.attach(function(sender, element) {
                var currentRotationAngle = _this._model.getCurrentRotationAngle();
                var newRotationAngle = rotateAngleHash[currentRotationAngle] || '0';

                // change rotation angle value
                _this._model.updateCurrentRotationAngle(newRotationAngle);
                _this._view.rotateTower();
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
                filteredListings = [];
            for (var id in listings) {
                var unit = listings[id];

                // BHK Check
                if (this._filters.bhk != null &&
                    this._filters.bhk.length != 0 &&
                    this._filters.bhk.indexOf(unit.bedrooms) < 0) {
                    continue;
                }

                // Entrance Check
                if (this._filters.entrance != null &&
                    this._filters.entrance.length != 0 &&
                    this._filters.entrance.indexOf(unit.facing) < 0) {
                    continue;
                }

                // Floor Check
                var floorGroupInterval = utils.getGroupInterval(unit.floor, config.filters.floorInterval);
                var sfloor = floorGroupInterval.start,
                    efloor = floorGroupInterval.end - 1;
                var floorGroup = sfloor + " " + efloor;
                if (this._filters.floor != null &&
                    this._filters.floor.length != 0 &&
                    this._filters.floor.indexOf(floorGroup) < 0) {
                    continue;
                }

                // Price Check
                var priceGroupInterval = utils.getGroupInterval(unit.price, config.filters.priceInterval);
                var sprice = priceGroupInterval.start,
                    eprice = priceGroupInterval.end;
                var priceGroup = sprice + " " + eprice;
                if (this._filters.price != null &&
                    this._filters.price.length != 0 &&
                    this._filters.price.indexOf(priceGroup) < 0) {
                    continue;
                }

                filteredListings.push(id);
            }

            this._model.updateFilteredListings(filteredListings);
            this._view.towerSvgContainer(this._model.getData(), this._model.getRootdata());
        },
        generateTemplate: function(data, rootdata, elements) {
            this._view.buildView();
        }
    };

    return TowerselectedController;

})();