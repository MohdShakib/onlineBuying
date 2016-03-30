// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open('v1').then(function(cache) {
      // And add resources to it
      return cache.addAll([
        './',
        'index.html',
        'css/',
        'css/fs.css',
        'css/globel.css',
        'css/animations.css',
        'css/style.css',
        'css/styleBottomForm.css',
        'css/styleResponsive.css',
        'js/',
        'swLogging.js',
        'js/constants/',
        'js/constants/offerData.js',
        'js/constants/chatCss.js',
        'js/configs/',
        'js/configs/config.js',
        'js/configs/envConfig.js',
        'js/utils/',
        'js/utils/ajaxUtils.js',
        'js/utils/cookieUtils.js',
        'js/utils/utils.js',
        'js/utils/viewUtils.js',
        'js/apiData.js',
        'js/dataEvent.js',
        'js/controllers/',
        'js/controllers/masterplanController.js',
        'js/controllers/towerselectedController.js',
        'js/controllers/unitplaninfoController.js',
        'js/controllers/bookingController.js',
        'js/controllers/errorpageController.js',
        'js/controllers/baseController.js',
        'js/models/',
        'js/models/masterplanModel.js',
        'js/models/towerselectedModel.js',
        'js/models/unitplaninfoModel.js',
        'js/models/baseModel.js',
        'js/views/',
        'js/views/masterplanView.js',
        'js/views/towerselectedView.js',
        'js/views/unitplaninfoView.js',
        'js/views/errorpageView.js',
        'js/views/baseView.js',
        'js/views/bookingView.js',
        'js/routes.js',
        'js/init.js'
        // Cache resources can be from other origins.
        // This is a no-cors request, meaning it doesn't need
        // CORS headers to be stored in the cache
        //new Request('https://farm6.staticflickr.com/5594/14749918329_888df4f2ef.jpg', {mode: 'no-cors'})
      ]);
    })
  );
});

/*self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});*/

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {


  // overwriting responses
  /*if (/\.jpg$/.test(event.request.url)) {
    event.respondWith(fetch('trollface.svg'));
    return;
  }*/


  // manual response
  /*var pageURL = new URL('./', location);
  if (event.request.url === pageURL.href) {
    event.respondWith(new Response("Hello world!"))
    return;
  }*/


  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    /*caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise
      // it's null, and we'll pass the request to
      // fetch, which will use the network.
      return response || fetch(event.request);
    })*/

    /*caches.match(event.request).catch(function() {
      return fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })*/

    caches.match(event.request).then(function(response) {

        if(response){
          console.log('catched : ',event.request.url);
          return response
        }else{
          console.log('not catched : ',event.request.url);
          return fetch(event.request).then(function(response) {
            return caches.open('v1').then(function(cache) {
              try{
                cache.put(event.request, response.clone());
              }catch(error){
                console.log('error is: ', JSON.stringify(error));
              }
              return response;
            });  
          });
        }
    })

  );
});
