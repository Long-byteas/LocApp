# Location App

Project description:
The project is an app that aim to store the user's personal comments, ranks on a visited location so that he/she can reread and decide where to go on the future trips. 
The project is written on ionic angular. 

To run :
import the project into vsCode.
Run "npm install (or npx install)" to install all the dependencies
run "ionic serve" to start project 
To run on a device, run: ionic capacitor build android
Plug your device, select your device on android studio and run to install it into your device.


This is a document for the project architechture
    Main will be in the src\app itself, it is calling tabs to control 4 main screens
    Main also have app\environment contains the required api link for the map and information about firebase to connect
    src\app\tabs will calling and contructing 4 main screens. it also allow user to navigate between screen by pressing button

    my app has 4 screens, they are : 
        map(my-app\src\app\map) 
        storingmemory(my-app\src\app\memoryStore)
        rankingLocation (my-app\src\app\rankingLocation)
        ratingLocation (my-app\src\app\ratingLocation)
    for my app, each screen has the same structure :
        "name"-routing.module.ts is for determining the route to go to children screen of the app
        "name".module.ts is for importing important imports for the app ( imports to build and display )
        "name".page.spec.ts is for inspecting and testing the app
        "name".page.html is the presentation layer ( view layer )
        "name".page.scss is in the presentation layer which configure how object in html look
        "name".page.ts is the business layer which decide what the presentation layer display based on the data from database.service.ts return
    Finally is the database.service.ts inside src\app\service (data layer)
        This provides database-sensor service for the bussiness layer by returning or doing to the database depends on requests
        it also handle connection to the database

