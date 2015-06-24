"use strict";
var initializeRoutes = (function(){

  function prepareTemplateSkeleton(type, controller, data){

      var containerList = [], elements = {};
      
      switch(type){
        case 'building_group': 
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
        case 'building': 
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
        '/new-project/slice-view/([a-zA-Z0-9-]+)-([0-9]{6})':{
             '/?(building_group|building|floor|flat)/?(all|(Tower B|Tower A)|A_upperHalf|A_lowerHalf|B_upperHalf|B_lowerHalf)':{ 
                on: function(projectName, projectId, viewType, viewId){
                  if (originaldata == null) {
                    originaldata = getProjectData(projectId);
                  }
                  var data = originaldata;
                  if(viewType == 'building'){
                      if(originaldata.towers[viewId]){
                        data = originaldata.towers[viewId];
                      }else{
                        data = originaldata.towers[1];
                      }
                  }

                  var elements = prepareTemplateSkeleton(viewType, controller, originaldata);
                  controller.generateTemplate(data, elements);

                },
                before: function(){
                }
            }

        }

      }
      
      // instantiate the router.
      var router = Router(routes);
      router.configure({  // a global configuration setting.
        on: function(projectId, viewType, viewId){
          //console.log(projectId, viewType, viewId);
        },
        notfound: function(){
          console.log('round not found');
        },
        before: function(projectId, viewType, viewId){
          //console.log(projectId, viewType, viewId);
        }

      });



      router.init();
  }

  return initializeRoutes;

})();
