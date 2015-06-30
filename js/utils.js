var utils = (function(){

	return {

		getGroupInterval: function(n, interval) {

		    var start = Math.floor(n / interval) * interval;
		    var end = start + interval;
		    return {
		        start: start,
		        end: end
		    };
		},
		ajax: function(url, params) {

	        var success_callback    =   typeof(params.success_callback) == 'function' ? params.success_callback : null;
	        var error_callback      =   typeof(params.error_callback) == 'function' ? params.error_callback : null;
	        var complete_callback   =   typeof(params.complete_callback) == 'function' ? params.complete_callback : null;

	        $.ajax({
	            type: "GET",
	            url: url,
	            async: false,
	            dataType: 'JSON',           
	            success: function(response) {
	                if(response.statusCode == '2XX') {
	                    if(success_callback == null) {                  
	                        // default error callback handling
	                    } else {
	                        success_callback(response.data, params);
	                    }
	                } else {
	                    if(error_callback == null) {
	                        // default error callback handling
	                    } else {
	                        error_callback(response.data);
	                    }
	                }                       
	            },
	            error: function(jqXHR, textStatus, errorThrown){
	                console.log('ajax in error callback');
	                console.log('error occured ' + errorThrown);
	            },
	            complete: function() {  
	                if(complete_callback != null) {
	                    complete_callback(params);
	                }
	            }
	        });     
	    },
		getSvgData: function(url){

	        return $.ajax({
	            type: "GET",
	            url: url,
	            async: false,
	            dataType: "text",
	            success: function(data) {
	                // register success callback in return promise
	            },
	            error: function(jqXHR, textStatus, errorThrown){
	                console.log('read csv error callback for: '+url);
	                console.log('error occured ' + errorThrown);
	                return false;
	            }
	        });
	    }
	}

})();