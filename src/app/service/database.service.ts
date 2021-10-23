import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Injectable({
  providedIn: 'root',
})
// this is sthe service of the project to talk to the database or sensor
export class ProjectService {

  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore,private geolocation:Geolocation,) {
  }
  getDataCollectionAsc(id,baseOn):any {
    // get data collection of user's id and return it in acs way
    return this.afs.collection(`locations/${id}/track`
    ,ref => ref.orderBy(baseOn));

  }

  getDataCollectionDesc(id,baseOn):any {
    // get data collection of user's id and return it in desc way
    return this.afs.collection(`locations/${id}/track`
    ,ref => ref.orderBy(baseOn,'desc'));

  }

  delete(collection,id){
    // delete a location based on it's db id
    collection.doc(id).delete();
  }

  markLoc(collection,id){
    // mark a location based on it's db id
    collection.doc(id).update({
      tag:true,
    })
  }

  demarkLoc(collection,id){
    // demark a location based on it's db id
    collection.doc(id).update({
      tag:false,
    })
  }

  updateMemory(collection,id,text){
    // update user memory for location based on it's db id
    collection.doc(id).update({
      memory:text,
    })
  }
  
  updateRating(collection,id,star,comment,happy){
    // update user comments for a  location based on it's db id
    collection.doc(id).update({star:star,
      comment:comment,
      happy:happy
    })
  }

  updateNewLocation(collection,lat,lng,timestamp,place){
    // add new location into the db
    collection.add({
      lat,
      lng,
      timestamp,
      place,
      tag:false
    });
  }

  connect():any{
    // return a sign in connection between device and firebase
    return this.afAu.signInAnonymously()
  }

  getCurrentLocation():any{
    // return geolocation using geolocation sensor
    return this.geolocation.getCurrentPosition();
  }

}
