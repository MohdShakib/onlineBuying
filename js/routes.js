"use strict";
var router;
var initializeRoutes = (function() {

    function initializeRoutes() {

        var routeRegex = {
            sep: "/",
            wordSep: "-",
            projectName: "([a-z0-9-]+)",
            projectId: "([0-9]{6})",
            towerName: "([a-z0-9-]+)",
            towerAngle: "(0|180)",
            unitAddress: "([a-z0-9-]+)",
            booking: "booking",
            error: "404"
        };

        var projectRoute = routeRegex.sep + routeRegex.projectName + routeRegex.wordSep + routeRegex.projectId,
            towerRoute = projectRoute + routeRegex.sep + routeRegex.towerName,
            unitRoute = towerRoute + routeRegex.sep + routeRegex.towerAngle + routeRegex.sep + routeRegex.unitAddress,
            bookingRoute = unitRoute + routeRegex.sep + routeRegex.booking,
            errorRoute = routeRegex.sep + routeRegex.error;

        var routes = {},
            rootdata = {};

        var masterplanController, masterplanModel, masterplanView,
            towerselectedController, towerselectedModel, towerselectedView,
            reloadTowerSelectedView = true,
            unitplaninfoController, unitplaninfoModel, unitplaninfoView,
            baseController, baseModel, baseView,
            errorPageController, errorPageView,
            bookingController, bookingModel, bookingView;

        function onTowerselectedRoute(projectName, projectId, towerName, towerAngle) {
            if (!(towerselectedModel && towerselectedModel._data.towerIdentifier == towerName)) {
                towerselectedModel = new TowerselectedModel(rootdata.towers[towerName], rootdata, towerAngle);
                towerselectedView = new TowerselectedView(towerselectedModel);
                towerselectedController = new TowerselectedController(towerselectedModel, towerselectedView);
            } else {
                towerselectedModel.init();
            }
            towerselectedController.generateTemplate();
        }

        routes[projectRoute] = {
            on: function(projectName, projectId) {
                if(baseController) {
                    baseView.reinit();
                }
                if (!masterplanModel) {
                    masterplanModel = new MasterplanModel(rootdata);
                    masterplanView = new MasterplanView(masterplanModel);
                    masterplanController = new MasterplanController(masterplanModel, masterplanView);
                }
                masterplanController.generateTemplate();
                // Add resize event listener
                utils.addResizeEventListener(utils.defaultDynamicResizeContainers);
            }
        }

        routes[towerRoute] = {
            on: function(projectName, projectId, towerName) {
                if(baseController) {
                    baseView.reinit();
                }
                onTowerselectedRoute(projectName, projectId, towerName);
                // Add resize event listener
                utils.addResizeEventListener(utils.defaultDynamicResizeContainers);
                reloadTowerSelectedView = false;
            }
        }

        routes[unitRoute] = {
            on: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                if (reloadTowerSelectedView) {
                    onTowerselectedRoute(projectName, projectId, towerName, towerAngle);
                }

                var data = rootdata.towers[towerName].listings[unitAddress],
                    rotationdata = rootdata.towers[towerName].rotationAngle[towerAngle].listing[unitAddress];

                unitplaninfoModel = new UnitplaninfoModel(data, rotationdata, rootdata);
                unitplaninfoView = new UnitplaninfoView(unitplaninfoModel);
                unitplaninfoController = new UnitplaninfoController(unitplaninfoModel, unitplaninfoView);
                unitplaninfoController.generateTemplate();
            }
        }

        routes[bookingRoute] = {
            on: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                var data = rootdata.towers[towerName].listings[unitAddress],
                    rotationdata = rootdata.towers[towerName].rotationAngle[towerAngle].listing[unitAddress];

                bookingModel = new UnitplaninfoModel(data, rotationdata, rootdata); // using same model as unitPlanInfo
                bookingView = new BookingView(bookingModel);
                bookingController = new BookingController(bookingModel, bookingView);
                bookingController.generateTemplate();

                // Reload tower selected container or not on closing this view
                reloadTowerSelectedView = true;
            }
        }

        routes[errorRoute] = {
            on: function() {
                errorPageView = new ErrorPageView();
                errorPageController = new ErrorPageController(errorPageView);
                errorPageController.generateTemplate();
            }
        }

        // instantiate the router
        router = Router(routes);
        router.configure({ // a global configuration setting.
            strict: false,
            on: function(projectName, projectId) {

                if (!baseController) {
                    baseModel = new BaseModel(rootdata);
                    baseView = new BaseView(baseModel);
                    baseController = new BaseController(baseModel, baseView);
                    baseController.generateTemplate();
                }
            },
            notfound: function() {
                console.log('Route not found');
            },
            before: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                rootdata = getProjectData(projectId);
                var flag = false;

                var projectIdentifier = utils.getIdentifier(rootdata.projectName);
                utils.projectId = projectId;

                if (projectIdentifier != projectName) {
                    var hash = window.location.hash;
                    hash = hash.replace(projectName, projectIdentifier);
                    window.location.hash = hash;
                }

                if (towerAngle && unitAddress) {
                    flag = rootdata.towers && rootdata.towers[towerName] && rootdata.towers[towerName].rotationAngle && rootdata.towers[towerName].rotationAngle[towerAngle] && rootdata.towers[towerName].rotationAngle[towerAngle].listing[unitAddress] ? true : false;
                } else if (towerName) {
                    flag = rootdata.towers && rootdata.towers[towerName] ? true : false;
                } else if (projectId) {
                    flag = rootdata && rootdata.towers ? true : false;
                } else {
                    return true;
                }

                if (!flag) {
                    //console.log('data not available for the url');
                    router.setRoute(errorRoute);
                }

                return flag;

            }
        });

        router.init();
    }

    return initializeRoutes;

})();