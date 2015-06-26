"use strict";
var initializeRoutes = (function(){

  var PROJECT = "masterPlanView",
      TOWER = "towerSelectedView",
      UNIT = "unitInfoView";

  function prepareTemplateSkeleton(type, controller, data){

      var containerList = [], elements = {};
      
      switch(type){
        case PROJECT: 
          containerList = ['buildingImgContainer', 'buildingSvgContainer', 'buildingMenuContainer', 'towerDetailContainer', 'amenitiesContainer'];
          controller.generateTemplateSkeleton(data, containerList);
          elements = {
            'buildingImgContainer': $('#img-container'),
            //'overviewImgContainer': $('#overview-img-container'),
            'buildingSvgContainer' : $('#svg-container'),
            'buildingMenuContainer': $('#tower-menu-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'amenitiesContainer': $('#amenities-container')
          }
          break;
        case TOWER: 
          containerList = ['towerImgContainer', 'towerDetailContainer', 'towerRotationContainer', 'towerSvgContainer' , 'towerMenuContainer'];
          controller.generateTemplateSkeleton(data, containerList);
          elements = {
            'towerImgContainer': $('#img-container'),
            'towerSvgContainer' : $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'towerRotationContainer': $('#tower-rotation-container'),
            'towerMenuContainer' : $('#tower-menu-container')
          }
          break;
        case UNIT: 
          containerList = ['towerImgContainer', 'towerSvgContainer'];
          controller.generateTemplateSkeleton(data, containerList);
          elements = {
            'towerImgContainer': $('#img-container'),
            'towerSvgContainer' : $('#svg-container')
          }
          break;  
        default:
          break; 
      }

      return elements;
  }

  function initializeRoutes(){

      var routes = {
        sep: "/",
        wordSep: "-",
        projectName: "([a-z0-9-]+)",
        projectId: "([0-9]{6})",
        towerName: "([a-z0-9-]+)",
        unitAddress: "([a-z0-9-]+)"
      }, 
      rootdata = {};

      var projectRoute = routes.sep + routes.projectName + routes.wordSep + routes.projectId,
      towerRoute = projectRoute + routes.sep + routes.towerName,
      unitRoute = towerRoute + routes.sep + routes.unitAddress;

      var routes = {};
      routes[projectRoute] = {
        on: function(projectName, projectId){
              rootdata = getProjectData(projectId);
              var model = new DataModel(rootdata, rootdata),
              view = new MasterplanView(model),
              controller = new MasterplanController(model, view);

              //var elements = prepareTemplateSkeleton(PROJECT, controller, rootdata);
              //controller.generateTemplate(rootdata, rootdata, elements);
              controller.generateTemplate();
            }
      }

      /*routes[towerRoute] = {
        on: function(projectName, projectId, towerName){
              rootdata = getProjectData(projectId);
              var model = new DataModel(rootdata),
              view = new TowerselectedView(model),
              controller = new TowerselectedController(model, view);
              var elements = prepareTemplateSkeleton(TOWER, controller, rootdata);
              controller.generateTemplate(rootdata.towers[towerName], rootdata, elements);
            }
      }*/

     /* routes[unitRoute] = {
        on: function(projectName, projectId, towerName, unitAddress){
              rootdata = getProjectData(projectId);
              var elements = prepareTemplateSkeleton(UNIT, controller, rootdata);
              controller.generateTemplate(rootdata.towers[towerName].listings[unitAddress], rootdata, elements);
            }
      }*/
      
      // instantiate the router
      var router = Router(routes);
      router.configure({  // a global configuration setting.
        on: function(projectName, projectId){
          //console.log(projectName, projectId);
        },
        notfound: function(){
          console.log('Route not found');
        },
        before: function(projectName, projectId){
          //console.log(projectName, projectId);
        }
      });

      router.init();
  }

  return initializeRoutes;

})();
