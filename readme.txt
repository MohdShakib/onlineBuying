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
7. sudo npm install
8. run grunt
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