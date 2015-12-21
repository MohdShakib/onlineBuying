# 4D view application set-up

### Installation

1. You need to follow these commands to install Apache on mac:

```sh
$ sudo vim /etc/apache2/httpd.conf-
```
2. Uncomment following modules: 
    * LoadModule rewrite_module libexec/apache2/mod_rewrite.so
    * LoadModule deflate_module libexec/apache2/mod_deflate.so

3. Change the default path to directory where you want to host. There are two lines to be changed:

    * DocumentRoot "/Library/WebServer/Documents"
    * <Directory "/Library/WebServer/Documents>"

4. Change **"AllowOverride None"** to **"AllowOverride All"**.
5. Find the username of your system using command **'whoami'** from your mac and and update the **'User'** value using that in **httpd.conf** file.
6. Restart your **apachectl** :

```sh
$ sudo apachectl restart
```

7. Install **ruby** and **compass** :   

```sh
$ brew install ruby
$ gem update --system
$ gem install compass
```
8. Goto the directory where online buying code is present and run : 
```sh
$ sudo npm install
$ grunt
```

9. Your system is setup now please open given link.
    *  **http://localhost/4d-view/umang-thirdeye-demo-501660**
    
***
# How to setup builder specific changes?
***
1. Open **js/configs/config.js** and change the following **configs**.

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
2. Change the **helpline number**  and **emailId** of builder in **config.js** file.
3. Change the **colors** in **_builderVariables.scss**.
4. Run command: 

```sh
$ grunt
```

5. Change the **logo.jpg** in images folder.
6. Change **project-detail.json** in **apis-json**.
7. Change **Zip-file**.
8. Remove extra files.
9. Change the name of the project folder(projectName-projectId) and put it into **4d-view** folder of apache pointed directory.
10. Change the **base url** in **index.html**.
11. Uncomment this line.
```javscript
 RewriteRule ^4d-view/([^/]+)/(.*) 4d-view/$1/index.html [L,QSA]
```
12. Comment this line.
```javscript
 RewriteRule ^(.*) index.html [L,QSA]
```
13. Put the **.htaccess** file in same directory in which 4d-view folder is present.
