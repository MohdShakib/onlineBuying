// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var request = require('request');

var callbacks = {
    success: function(){
        console.log('success');
    },
    error: function() {
        console.log('error occurred');
    }
};

function PostCode(codestring) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : codestring
    });

    request.post( 'http://www.closure-compiler.appspot.com/compile',{form: post_data}, function( err, res, body ){
        if( !err ) {

            callbacks.success( JSON.parse( body ).compiledCode );
        }
    });
}

module.exports = function( path_to_file, success, error ) {
    callbacks.success = success;
    callbacks.error = error;
    // This is an async file read
    fs.readFile(path_to_file, 'utf-8', function (err, data) {
        if (err) {
            // If this were just a small part of the application, you would
            // want to handle this differently, maybe throwing an exception
            // for the caller to handle. Since the file is absolutely essential
            // to the program's functionality, we're going to exit with a fatal
            // error instead.
            console.log("FATAL An error occurred trying to read in the file: " + err);
            process.exit(-2);
        }
        // Make sure there's data before we post it
        if(data) {
            PostCode(data);
        }
        else {
            console.log("No data to post");
            process.exit(-1);
        }
    });
};