import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {map} from 'rxjs/operators'

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  autocompleteItems: any;
  autocomplete:any;
  geocoder: any
  //map 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];

  MapAPI = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBsfw-I1JOKEYgCw0Bo7JJkR8sksIL3Rxw"

  constructor( private afAu : AngularFireAuth,private afs:AngularFirestore,private geolocation:Geolocation, public zone: NgZone,) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;

  }
  
  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(item);
      if(status === 'OK' && results[0]){
        // let position = {
        //     lat: results[0].geometry.location.lat,
        //     lng: results[0].geometry.location.lng
        // };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }

  ionViewWillEnter(){
   this.loadMap();
   console.log("hello")
  }


  updateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  login(){
    this.afAu.signInAnonymously().then(resp => {
      this.user = resp.user;
      console.log(this.user)
      this.locationsCollection = this.afs.collection(`locations/${this.user.uid}/track`
      ,ref => ref.orderBy('timestamp'));
      console.log(this.locationsCollection)
      // load data 
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {

        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
      console.log("whatttt")
      console.log("whatttt")
      this.locations.subscribe(locations =>{
        this.updateMapOnLoc(locations);
      })
      // update map

    })
  }
  updateMapOnLoc(locations){
    this.clearMarkers();
    this.markers = []
    console.log(locations)
    locations.forEach(element => {
      console.log(element)
      var latlong = new google.maps.LatLng(element.lat,element.lng)
      let marker = new google.maps.Marker({
        position: latlong,
        map: this.map
      });
      this.markers.push(marker);
      this.map.setCenter(latlong);
    });
  }

  loadMap() {
    console.log(this.loadMap)
    this.login();
    let latLng = new google.maps.LatLng(-41.28666552, 174.772996908);
    let mapOptions = {
      center: latLng,
      zoom: 20,
    };
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  isTracking = false;
  startTracking(){
    this.isTracking  = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      var lat = resp.coords.latitude;
      var lng = resp.coords.longitude;
      console.log(resp.coords.latitude)
      console.log(resp.coords.longitude)
      let position = new google.maps.LatLng(lat, lng);
      let marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      this.map.setCenter(position);
      

      this.geocoder.geocode({ 'latLng': position },(results, status) => {
        console.log(results);
        if(status === 'OK' && results[0]){
          this.addNewLocation(lat,lng,resp.timestamp,results[0].formatted_address);
        }
      })
     });
     
  }
  stopTracking(){

  }

  addNewLocation(lat, lng, timestamp,place) {
    this.locationsCollection.add({
      lat,
      lng,
      timestamp,
      place
    });
  }
  deleteLocation(pos) {
    this.locationsCollection.doc(pos.id).delete();
  }
}
