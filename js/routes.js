"use strict";
var router;
var initializeRoutes = (function() {

    window.onpopstate = function () {
        window.onpopstate = function (event) {
            //act(document.location);   // jshint ignore:line
        };
    };

    function initializeRoutes() {

        var routeRegex = {
            sep: "/",
            wordSep: "-",
            projectName: "([a-z0-9-]+)",
            projectId: "([0-9]{6})",
            propertyId: "(5[0-9]{6})",
            towerName: "([a-z0-9-_]+)",
            towerAngle: "([0-9]{1,3})",
            unitAddress: "([a-z0-9-_]+)",
            booking: "booking",
            error: "404"
        };

        var projectRoute = config.urlAppName + routeRegex.sep + routeRegex.projectName + routeRegex.wordSep + routeRegex.projectId,
            towerRoute = projectRoute + routeRegex.sep + routeRegex.towerName,
            unitRoute = towerRoute + routeRegex.sep + routeRegex.towerAngle + routeRegex.sep + routeRegex.unitAddress,
            propertyBookingRoute = projectRoute + routeRegex.sep + routeRegex.propertyId + routeRegex.sep + routeRegex.booking,
            bookingRoute = unitRoute + routeRegex.sep + routeRegex.booking,
            errorRoute = config.urlAppName + routeRegex.sep + routeRegex.error;

        var currentState = null,
            previousState = null;

        var routes = {},
            rootdata = {},
            proceedRouteCallback = false;

        var masterplanController, masterplanModel, masterplanView,
            towerselectedController, towerselectedModel, towerselectedView,
            unitplaninfoController, unitplaninfoModel, unitplaninfoView,
            baseController, baseModel, baseView,
            errorPageController, errorPageView,
            bookingController, bookingModel, bookingView,
            propertyBookingController, propertyBookingModel, propertyBookingView;

        var reloadTowerSelectedView = true;

        function redirectToCorrectAngle(data, angle, router) {
            data[3] = angle;
            data = data.join('/');
            data = '/'+data;
            router.setRoute(data);
        }

        function onTowerselectedRoute(projectName, projectId, towerName, towerAngle) {
            if (!(towerselectedModel && towerselectedModel._data.towerIdentifier == towerName)) {
                towerselectedModel = new TowerselectedModel(rootdata.towers[towerName], rootdata, towerAngle);
                towerselectedView = new TowerselectedView(towerselectedModel, baseView);
                towerselectedController = new TowerselectedController(towerselectedModel, towerselectedView);
            } else {
                towerselectedModel.init();
            }

            var fromUnitInfoView = false;
            if (previousState == 'unitplaninfoView') {
                fromUnitInfoView = true;
            }
            towerselectedController.generateTemplate(fromUnitInfoView);
        }

        routes[projectRoute] = {
            on: function(projectName, projectId) {

                previousState = currentState;
                currentState = 'masterplanView';

                if (baseController) {
                    baseView.reinit();
                }
                if (!masterplanModel) {
                    masterplanModel = new MasterplanModel(rootdata);
                    masterplanView = new MasterplanView(masterplanModel, baseView);
                    masterplanController = new MasterplanController(masterplanModel, masterplanView);
                }
                masterplanController.generateTemplate();
            }
        };

        routes[propertyBookingRoute] = {
            on: function(projectName, projectId, propertyId) {
                var data = rootdata.properties[propertyId];
                propertyBookingModel = new UnitplaninfoModel(data, data, rootdata); // using same model as unitPlanInfo
                propertyBookingModel.setPropertyBooking();
                propertyBookingView = new BookingView(propertyBookingModel);
                propertyBookingController = new BookingController(propertyBookingModel, propertyBookingView);
                propertyBookingController.generateTemplate();
            }
        };

        routes[towerRoute] = {
            on: function(projectName, projectId, towerName) {

                previousState = currentState;
                currentState = 'towerselectedView';

                if (baseController) {
                    baseView.reinit();
                }
                onTowerselectedRoute(projectName, projectId, towerName);
                // Add resize event listener
                utils.addResizeEventListener(utils.defaultDynamicResizeContainers);
                reloadTowerSelectedView = false;
            }
        };

        routes[unitRoute] = {
            on: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                previousState = currentState;
                currentState = 'unitplaninfoView';

                if (reloadTowerSelectedView) {
                    onTowerselectedRoute(projectName, projectId, towerName, towerAngle);
                    reloadTowerSelectedView = false;
                }

                var data = rootdata.towers[towerName].listings[unitAddress],
                    rotationdata = rootdata.towers[towerName].rotationAngle[towerAngle].listing[unitAddress];

                unitplaninfoModel = new UnitplaninfoModel(data, rotationdata, rootdata);
                unitplaninfoView = new UnitplaninfoView(unitplaninfoModel);
                unitplaninfoController = new UnitplaninfoController(unitplaninfoModel, unitplaninfoView);
                unitplaninfoController.generateTemplate();
            }
        };

        routes[bookingRoute] = {
            on: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                previousState = currentState;
                currentState = 'bookingView';

                var data = rootdata.towers[towerName].listings[unitAddress],
                    rotationdata = rootdata.towers[towerName].rotationAngle[towerAngle].listing[unitAddress];

                bookingModel = new UnitplaninfoModel(data, rotationdata, rootdata); // using same model as unitPlanInfo
                bookingView = new BookingView(bookingModel);
                bookingController = new BookingController(bookingModel, bookingView);
                bookingController.generateTemplate();

                // Reload tower selected container or not on closing this view
                reloadTowerSelectedView = true;
            }
        };

        routes[errorRoute] = {
            on: function() {

                previousState = currentState;
                currentState = 'errorView';

                errorPageView = new ErrorPageView();
                errorPageController = new ErrorPageController(errorPageView);
                errorPageController.generateTemplate();
            }
        };

        // instantiate the router
        router = new Router(routes);
        router.configure({ // a global configuration setting.
            strict: false,
            on: function(projectName, projectId) {

            },
            html5history: true,
            notfound: function() {
                console.log('Route not found');
                console.log('hash: '+location.hash);
                console.log('href: '+location.href);
                var currentRoute = router.getRoute();
                if(currentRoute.length && currentRoute[0].length && (routeRegex.sep+currentRoute[0] != config.urlAppName)){
                    if(['online','thirdeye'].indexOf(currentRoute[0])>-1){
                        currentRoute.splice(0,1);
                    }
                    currentRoute = currentRoute.join('/');
                    currentRoute = config.urlAppName+routeRegex.sep+currentRoute;
                    router.setRoute(currentRoute);
                    router.handler();
                    return;
                }
                router.setRoute(errorRoute);
                router.handler();
                return;
            },
            before: function(projectName, projectId, towerName, towerAngle, unitAddress) {

                var isPropertyPaymentUrl = true;
                if(!(towerName && towerName.match(/(5[0-9]{6})/g))){
                    isPropertyPaymentUrl = false;
                    $('.loading-bar-container').show();
                    $('.default-loading').hide();
                }

                // Animations
                viewUtils.removeNotificationTooltip();

                function beforeCallback(response) {
                    rootdata = response;

                    // Update meta tags
                    $("meta[property=og\\:description]").attr("content", "Book your Dream Home in " + rootdata.projectName + " & get " + rootdata.offer + ". Hurry Offer valid till 23rd September 2015.");
                    $("meta[property=og\\:image]").attr("content", rootdata.mainImage);

                    var flag = false, proceedRoute = true;
                    var projectIdentifier = utils.getIdentifier(rootdata.projectName);
                    utils.projectId = projectId;

                    var currentRoute = router.getRoute();

                    if (towerAngle && unitAddress) {
                        var towerData = rootdata.towers && rootdata.towers[towerName] ? rootdata.towers[towerName] : undefined;
                        flag = towerData && towerData.listings && towerData.listings[unitAddress] && towerData.rotationAngle && towerData.rotationAngle[towerAngle] && towerData.rotationAngle[towerAngle].listing && towerData.rotationAngle[towerAngle].listing[unitAddress] ? true : false;
                        if (flag) {
                            utils.unitUniqueAdd = towerData.rotationAngle[towerAngle].listing[unitAddress].unitUniqueIdentifier;
                        } else if (towerData && towerData.listings[unitAddress]) {
                            towerAngle = towerData.listings[unitAddress].rotationAnglesAvailable[0];
                            proceedRoute = false;
                            redirectToCorrectAngle(currentRoute, towerAngle, router);
                        }
                    } else if (towerName) {
                        flag = rootdata.towers && rootdata.towers[towerName] ? true : false;
                        // hack for propertyId check
                        if (isPropertyPaymentUrl) {
                            flag = rootdata.properties && rootdata.properties[towerName] ? true : false;
                        }
                    } else if (projectId) {
                        flag = rootdata && rootdata.towers ? true : false;
                    } else {
                        flag = true;
                    }

                    if (!baseController) {
                        baseModel = new BaseModel(rootdata);
                        baseView = new BaseView(baseModel);
                        baseController = new BaseController(baseModel, baseView);
                        baseController.generateTemplate();
                        window.Tawk_API = window.Tawk_API || {};
                        window.Tawk_LoadStart = new Date();
                        window.Tawk_API.embedded = config.tawkApiId;
                        window.Tawk_API.onLoad = function(){
                            baseView.changeChatCss(window.chatCss);
                        };
                        (function() {
                            var s1 = document.createElement("script"),
                                s0 = document.getElementsByTagName("script")[0];
                            s1.async = true;
                            s1.src = 'https://embed.tawk.to/55e5498bfc2b363371225aaa/19u4o3af4';
                            s1.charset = 'UTF-8';
                            s1.setAttribute('crossorigin', '*');
                            s0.parentNode.insertBefore(s1, s0);
                        })();
                    }

                    if (projectName && projectId && projectIdentifier != projectName) {
                        currentRoute[1] = projectIdentifier+'-'+projectId;
                        proceedRoute = false;
                        currentRoute = currentRoute.join('/');
                        currentRoute = '/'+currentRoute;
                        router.setRoute(currentRoute);
                        router.handler();
                        return;
                    }

                    if (!flag && proceedRoute) {
                        utils.log('data not available for the url');
                        proceedRouteCallback = true;
                        router.setRoute(errorRoute);
                        router.handler();
                        return;
                    }

                    if (!proceedRouteCallback && proceedRoute) { // hack
                        proceedRouteCallback = true;
                        router.handler();
                        return;
                    }

                }
                utils.executeTrackingCode();

                getProjectData(projectId, isPropertyPaymentUrl, beforeCallback);
                return proceedRouteCallback;
            }
        });

        router.init();
    }

    return initializeRoutes;

})();
