"use strict";
var initializeRoutes = (function(){

  function prepareTemplateSkeleton(type, controller, data){

      var containerList = [], elements = {};
      
      switch(type){
        case 1: 
          break;
        case 2: 
          break;
        case 3: 
          break;
        case 4:
          break;
        default: 
          containerList = ['imgContainer', 'svgContainer', 'towerMenuContainer', 'towerDetailContainer', 'amenitiesContainer'];
          controller.generateTemplateSkeleton(data, containerList);

          elements = {
            'imgContainer': $('#img-container'),
            //'overviewImgContainer': $('#overview-img-container'),
            'svgContainer' : $('#svg-container'),
            'towerMenuContainer': $('#tower-menu-container'),
            'towerDetailContainer': $('#tower-detail-container'),
            'amenitiesContainer': $('#amenities-container')
          }
      }

      return elements;
  }


  function initializeRoutes(originaldata, controller){

      var routes = {
        '/new-project/slice-view/:projectId':{
             '/?(building_group|building|section|floor|flat)/?(all|A_upperHalf|A_lowerHalf|B_upperHalf|B_lowerHalf|A|B)':{ 
                on: function(projectId, viewType, viewId){

                  if (originaldata == null) {
                    originaldata = getProjectData(projectId);
                  }
                  var data = originaldata;
                  if(viewType == 'building'){
                    switch(viewId){
                      case 'A':
                        data = originaldata.subItems[0];
                        break;
                      case 'B':
                        data = originaldata.subItems[1];
                        break;
                    }
                  }else if(viewType == 'section'){
                    switch(viewId){
                      case 'A_lowerHalf':
                        data = originaldata.subItems[0].subItems[0];
                        break;
                      case 'A_upperHalf':
                        data = originaldata.subItems[0].subItems[1];
                        break;
                      case 'B_lowerHalf':
                        data = originaldata.subItems[1].subItems[0];
                        break;

                      case 'B_upperHalf':
                        data = originaldata.subItems[1].subItems[1];
                        break;
                    }
                  }

                  var elements = prepareTemplateSkeleton(null, controller, originaldata);
                  controller.generateTemplate(data, elements);

                },
                before: function(){
                  //console.log('going to enter level 2 before');
                }
            }

        }

      }
      
      // instantiate the router.
      var router = Router(routes);

      // a global configuration setting.
      router.configure({
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
