How to set up apache on mac?
1. sudo vim /etc/apache2/httpd.conf.
2. Uncomment following modules:
	LoadModule rewrite_module libexec/apache2/mod_rewrite.so
	LoadModule deflate_module libexec/apache2/mod_deflate.so
3. Change the default path to directory where you want to host. There are two lines to be changed
	DocumentRoot "/Library/WebServer/Documents"
	<Directory "/Library/WebServer/Documents>"
4. Change "AllowOverride None" to "AllowOverride All".
5. sudo apachectl restart
6. Goto the directory where online buying code is present
7. sudo npm install (node version: v0.12.0)
8. run 'grunt'

9. Goto http://localhost/4d-view/umang-thirdeye-demo-501660

How to setup builder specific changes?
1. Open js/configs/config.js and change the following configs
        apisJson: true,
        cityJson: true, // to read cities from json
        localZip: true,
        setJsonDataPriorityForTest: false,
        builderSetUp: true,
        showInterestedIn: true,
2. Change the helpline number and emailId of builder in config.js file
3. Change the colors in _builderVariables.scss 
3. Run 'grunt' command
4. Change the logo.jpg in images folder
5. Change project-detail.json in apis-json
6. Change Zip-file
7. Remove extra files
8. Change the name of the project folder(projectName-projectId) and put it into 4d-view folder of apache pointed directory
9. Change the base url in index.html