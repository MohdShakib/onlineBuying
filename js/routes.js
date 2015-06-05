

"use strict";
var initializeRoutes = (function(){

  var started, model, view, controller;
  function renderView(data, model_elements){

    if(!started){
      started = true;
    }else{
      view._elements = model_elements;
      return;
    }

    model = new DataModel(data);
    view = new DataView(model, model_elements);
    controller = new DataController(model, view);
    view.show();

  }

  function prepareTemplateSkeleton(type){

      var string = '';
      var model_elements = {};
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
          string += '<div class="img-container" id="img-container"></div>';
          string += '<svg class="svg-container container" id="svg-container" width="100%" height="100%" viewbox="0 0 100 100" preserveAspectRatio="none"></svg>';
          string += '<div class="tower-menu-container" id="tower-menu-container"></div>';
      }

      $('.main-container').html(string);

      model_elements = {
        'imgContainer': $('#img-container'),
        'svgContainer' : $('#svg-container'),
        'towerMenuContainer': $('#tower-menu-container')
      }
      return model_elements;
  }


  function initializeRoutes(data){

      var routes = {
        '/new-project/slice-view/:projectId':{
             '/?(building_group|building|section|floor|flat)/?(all|A_upperHalf|A_lowerHalf|B_upperHalf|B_lowerHalf|A|B)':{ 
                on: function(projectId, viewType, viewId){
              
                  var default_data;
                  if(viewType == 'building_group'){
                    default_data = data;
                  }else if(viewType == 'building'){
                    switch(viewId){
                      case 'A':
                        default_data = data.subItems[0];
                        break;
                      case 'B':
                        default_data = data.subItems[1];
                        break;
                    }
                  }else if(viewType == 'section'){
                    switch(viewId){
                      case 'A_upperHalf':
                        default_data = data.subItems[0].subItems[0];
                        break;
                      case 'A_lowerHalf':
                        default_data = data.subItems[0].subItems[1];
                        break;
                      case 'B_upperHalf':
                        default_data = data.subItems[1].subItems[0];
                        break;

                      case 'B_lowerHalf':
                        default_data = data.subItems[1].subItems[1];
                        break;
                    }
                  }

                  var model_elements = prepareTemplateSkeleton();
                  renderView(default_data, model_elements);
                  view.dataUpdated.notify({
                      data: default_data
                  });

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
