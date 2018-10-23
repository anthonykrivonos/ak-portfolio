/*
      Anthony Krivonos
      src/scripts/firebase.js
      10.22.2018
*/

'use strict';

// Global Database Instance
var db;

/*
 *
 *    Database Initialization
 *
 */

(function () {

      $(document).ready(function () {

            // Initialize Firebase
            var config = {
                  apiKey: "AIzaSyCCiw_JekRmKojYUemQzlWGdYxIAzj0i8Q",
                  authDomain: "anthony-krivonos-website.firebaseapp.com",
                  databaseURL: "https://anthony-krivonos-website.firebaseio.com",
                  projectId: "anthony-krivonos-website",
                  storageBucket: "anthony-krivonos-website.appspot.com",
                  messagingSenderId: "165032369522"
            };
            firebase.initializeApp(config);

            // Initialize Cloud Firestore through Firebase
            db = firebase.firestore();

            // Disable deprecated features
            db.settings({
                  timestampsInSnapshots: true
            });

      });

})();

/*
 *
 *    Database Retrieval Functions
 *
 */

class Database {

      // Gets the `collection` as a map in the success callback
      static map(collection, success = null, failure = null) {
            db.collection(collection).get().then((querySnapshot) => {
                  let colMap = {};
                  querySnapshot.forEach((doc) => {
                        colMap[doc.id] = doc.data();
                  });
                  if (success) success(colMap);
            }).catch((e) => {
                  if (failure) failure(e);
            });
      }

      // Gets the `collection` as a list in the success callback
      static list(collection, success = null, failure = null) {
            db.collection(collection).get().then((querySnapshot) => {
                  let colList = [];
                  querySnapshot.forEach((doc) => {
                        colList.push(doc.data());
                  });
                  if (success) success(colList);
            }).catch((e) => {
                  if (failure) failure(e);
            });
      }

}
