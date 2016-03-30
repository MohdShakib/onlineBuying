# 4D view application set-up

### Installation

* You need to follow these commands to install Apache on mac:

```sh
$ sudo vim /etc/apache2/httpd.conf-
```
* Uncomment following modules: 
```
    LoadModule rewrite_module libexec/apache2/mod_rewrite.so
```
```
    LoadModule deflate_module libexec/apache2/mod_deflate.so
```

* Change the default path to directory where you want to host. 
```
    DocumentRoot "/Library/WebServer/Documents"
```
```
    Directory "/Library/WebServer/Documents"
```

* Change **"AllowOverride None"** to **"AllowOverride All"**.

* Find the username of your system using command **'whoami'** from your mac and and update the **'User'** value using that in **httpd.conf** file.
* Restart your **apachectl** :

```sh
$ sudo apachectl restart
```

* Install **ruby** and **compass** :   

```sh
$ brew install ruby
$ gem update --system
$ gem install compass
```
* Goto the directory where online buying code is present and run : 

```sh
$ sudo npm install
$ grunt
```

* Your system is setup now please open given link.
    *  **http://localhost/4d-view/umang-thirdeye-demo-501660**
    
***
# How to setup builder specific changes?
***
* Open **js/configs/config.js** and change the following **configs**.

```json
{
"apisJson": true,
"cityJson": true, 
"localZip": true,
"setJsonDataPriorityForTest": false,
"builderSetUp": true,
"showInterestedIn": true
}
```
* Change the **helpline number**  and **emailId** of builder in **config.js** file.
* Change the **colors** in **_builderVariables.scss**.
* Run command: 

```sh
$ grunt
```

* Change the **logo.jpg** in images folder.
* Change **project-detail.json** in **apis-json**.
* Change **Zip-file**.
* Remove extra files.
* Change the name of the project folder(projectName-projectId) and put it into **4d-view** folder of apache pointed directory.
* Change the **base url** in **index.html**.
* Uncomment this line.
```javscript
 RewriteRule ^4d-view/([^/]+)/(.*) 4d-view/$1/index.html [L,QSA]
```
* Comment this line.
```javscript
 RewriteRule ^(.*) index.html [L,QSA]
```
* Put the **.htaccess** file in same directory in which 4d-view folder is present.
