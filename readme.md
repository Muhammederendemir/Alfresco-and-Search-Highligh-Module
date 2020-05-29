###Adding Search-Highligh modules to Alfresco


* **1.Step : Let's add the search-highlight folder to the project** 


* **2.Step : Let's replace the search folder in src / app / component with search in github.** 


* **3.Step : Let's add the following codes into the path in src / tsconfig.json.**


        "search-highlight": [
         "dist/search-highlight"
        ],
        "search-highlight/*": [
         "dist/search-highlight/*"
        ],

        
* **4.Step : Let's add the following codes into projects in ./angular.json directory.**


        "searchHighlight": {
         "root": "projects/search-highlight",
         "sourceRoot": "projects/search-highlight/src",
         "projectType": "library",
         "prefix": "lib",
         "architect": {
           "build": {
             "builder": "@angular-devkit/build-ng-packagr:build",
             "options": {
               "tsConfig": "projects/search-highlight/tsconfig.lib.json",
               "project": "projects/search-highlight/ng-package.json"
             }
           },
           "test": {
             "builder": "@angular-devkit/build-angular:karma",
             "options": {
               "main": "projects/search-highlight/src/test.ts",
               "tsConfig": "projects/search-highlight/tsconfig.spec.json",
               "karmaConfig": "projects/search-highlight/karma.conf.js"
             }
           },
           "lint": {
             "builder": "@angular-devkit/build-angular:tslint",
             "options": {
               "tsConfig": [
                 "projects/search-highlight/tsconfig.lib.json",
                 "projects/search-highlight/tsconfig.spec.json"
               ],
               "exclude": [
                 "**/node_modules/**"
               ]
             }
           }
         }
        }


* **4.Step : Put the following codes into ./package.json Let's add.**

        "build:search-highlight": "ng build searchHighlight",


* **5.Step : Let's update the package.json to have the following codes.**

        "build.extensions": "npm run build.aos && npm run build:search-highlight",

  **and**

        "build": "npm run validate-config && npm run build.shared && npm run build.extensions && npm run build.app -- --prod",
