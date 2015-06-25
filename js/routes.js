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
          containerList = ['towerImgContainer', 'towerDetailContainer', 'towerRotationButton', 'towerSvgContainer'];
          controller.generateTemplateSkeleton(data, containerList);
          elements = {
            'towerImgContainer': $('#img-container'),
            'towerSvgContainer' : $('#svg-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'towerRotationContainer': $('#tower-rotation-container')
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

  function initializeRoutes(originaldata, controller){

      var routes = {
        sep: "/",
        wordSep: "-",
        projectName: "([a-z0-9-]+)",
        projectId: "([0-9]{6})",
        towerName: "([a-z0-9-]+)",
        unitAddress: "([a-z0-9-]+)"
      };

      var projectRoute = routes.sep + routes.projectName + routes.wordSep + routes.projectId;
      var towerRoute = projectRoute + routes.sep + routes.towerName;
      var unitRoute = towerRoute + routes.sep + routes.unitAddress;

      var routes = {};
      routes[projectRoute] = {
        on: function(projectName, projectId){
              originaldata = getProjectData(projectId);
              var elements = prepareTemplateSkeleton(PROJECT, controller, originaldata);
              controller.generateTemplate(originaldata, elements);
            }
      }

      routes[towerRoute] = {
        on: function(projectName, projectId, towerName){
              originaldata = getProjectData(projectId);
              var elements = prepareTemplateSkeleton(TOWER, controller, originaldata);
              controller.generateTemplate(originaldata.towers[towerName], elements);
            }
      }

      routes[unitRoute] = {
        on: function(projectName, projectId, towerName, unitAddress){
              originaldata = getProjectData(projectId);
              var elements = prepareTemplateSkeleton(UNIT, controller, originaldata);
              controller.generateTemplate(originaldata.towers[towerName].listings[unitAddress], elements);
            }
      }
      
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
