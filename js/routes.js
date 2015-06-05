

"use strict";
var initializeRoutes = (function(){

  var started, model, view, controller;
  function prepareTemplate(listData){

    if(!started){
      started = true;
    }else{
      return;
    }
    
    model = new ListModel(listData);
    view = new ListView(model, {
            'list_div': $('#list'),
            'image_div': $('#image_view'),
    });
    controller = new ListController(model, view);
    view.show();

  }


  function initializeRoutes(listData){

      var routes = {
        '/new-project/slice-view/:projectId':{
             '/?(building_group|building|section|floor|flat)/?(all|A_upperHalf|A_lowerHalf|B_upperHalf|B_lowerHalf|A|B)':{ 
                on: function(projectId, viewType, viewId){
              
                  var defaultListData;
                  if(viewType == 'building_group'){
                    defaultListData = listData;
                  }else if(viewType == 'building'){
                    switch(viewId){
                      case 'A':
                        defaultListData = listData.subItems[0];
                        break;
                      case 'B':
                        defaultListData = listData.subItems[1];
                        break;
                    }
                  }else if(viewType == 'section'){
                    switch(viewId){
                      case 'A_upperHalf':
                        defaultListData = listData.subItems[0].subItems[0];
                        break;
                      case 'A_lowerHalf':
                        defaultListData = listData.subItems[0].subItems[1];
                        break;
                      case 'B_upperHalf':
                        defaultListData = listData.subItems[1].subItems[0];
                        break;

                      case 'B_lowerHalf':
                        defaultListData = listData.subItems[1].subItems[1];
                        break;
                    }
                  }

                  prepareTemplate(defaultListData);
                  view.listUpdated.notify({
                      items: defaultListData
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
