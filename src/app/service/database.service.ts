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
    locations:Observable<any>;
    locationsCollection:AngularFirestoreCollection<any>;
    user = null;
    GoogleAutocomplete: any;
    GooglePlaces: any;
    autocompleteItems: any;
    autocomplete:any;
    geocoder: any
    isFinding =  false;
    infoWindow:any;

  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore,private geolocation:Geolocation, public zone: NgZone,) {

  }

  /**
   * Get a project by project ID
   * @param id project ID
   * @returns An Observable of the target Project. Returns an empty Project on error
   */
  getDataCollection(id):any {
    return this.afs.collection(`locations/${id}/track`
    ,ref => ref.orderBy('timestamp'));

  }
  
  connect():any{
    return this.afAu.signInAnonymously()
  }


}
