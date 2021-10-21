import { Injectable } from '@angular/core';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // TODO:
  // Rename
  // Use Service
  // Comment 
  // finish tab4

  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore,private geolocation:Geolocation, public zone: NgZone,) {

  }

  /**
   * Get a project by project ID
   * @param id project ID
   * @returns An Observable of the target Project. Returns an empty Project on error
   */
  getDataCollectionAsc(id,baseOn):any {
    return this.afs.collection(`locations/${id}/track`
    ,ref => ref.orderBy(baseOn));

  }

  getDataCollectionDesc(id,baseOn):any {
    return this.afs.collection(`locations/${id}/track`
    ,ref => ref.orderBy(baseOn,'desc'));

  }

  delete(collection,id){
    collection.doc(id).delete();
  }

  markLoc(collection,id){
    collection.doc(id).update({
      tag:true,
    })
  }

  demarkLoc(collection,id){
    collection.doc(id).update({
      tag:false,
    })
  }

  updateMemory(collection,id,text){
    collection.doc(id).update({
      memory:text,
    })
  }
  
  updateRating(collection,id,star,comment,happy){
    collection.doc(id).update({star:star,
      comment:comment,
      happy:happy
    })
  }
  connect():any{
    return this.afAu.signInAnonymously()
  }

  getCurrentLocation():any{
    return this.geolocation.getCurrentPosition();
  }

}
