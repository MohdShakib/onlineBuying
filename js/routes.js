"use strict";
var initializeRoutes = (function() {

    function initializeRoutes() {

        var routeRegex = {
            sep: "/",
            wordSep: "-",
            projectName: "([a-z0-9-]+)",
            projectId: "([0-9]{6})",
            towerName: "([a-z0-9-]+)",
            unitAddress: "([a-z0-9-]+)"
        };

        var projectRoute = routeRegex.sep + routeRegex.projectName + routeRegex.wordSep + routeRegex.projectId,
            towerRoute = projectRoute + routeRegex.sep + routeRegex.towerName,
            unitRoute = towerRoute + routeRegex.sep + routeRegex.unitAddress;

        var routes = {},
            rootdata = {};

        routes[projectRoute] = {
            on: function(projectName, projectId) {
                rootdata = getProjectData(projectId);
                var model = new DataModel(rootdata, rootdata),
                    view = new MasterplanView(model),
                    controller = new MasterplanController(model, view);
                controller.generateTemplate();
            }
        }

        routes[towerRoute] = {
            on: function(projectName, projectId, towerName) {
                rootdata = getProjectData(projectId);
                var model = new DataModel(rootdata.towers[towerName], rootdata),
                    view = new TowerselectedView(model),
                    controller = new TowerselectedController(model, view);
                controller.generateTemplate();
            }
        }

        /*routes[unitRoute] = {
           on: function(projectName, projectId, towerName, unitAddress){
                 rootdata = getProjectData(projectId);
                 var elements = prepareTemplateSkeleton(UNIT, controller, rootdata);
                 controller.generateTemplate(rootdata.towers[towerName].listings[unitAddress], rootdata, elements);
               }
         }*/

        // instantiate the router
        var router = Router(routes);
        router.configure({ // a global configuration setting.
            on: function(projectName, projectId) {
                //console.log(projectName, projectId);
            },
            notfound: function() {
                console.log('Route not found');
            },
            before: function(projectName, projectId) {
                //console.log(projectName, projectId);
            }
        });

        router.init();
    }

    return initializeRoutes;

})();