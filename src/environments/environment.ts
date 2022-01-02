// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// db information to connect to 
export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyArQ934vak4WKrGkb53spR9i_k2CMsT4sE",
    authDomain: "mobiledev-aa1ec.firebaseapp.com",
    databaseURL: "https://mobiledev-aa1ec-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mobiledev-aa1ec",
    storageBucket: "mobiledev-aa1ec.appspot.com",
    messagingSenderId: "608672896457",
    appId: "1:608672896457:web:afd283906d7b3f48178418",
    measurementId: "G-P5V6XRYTXR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
