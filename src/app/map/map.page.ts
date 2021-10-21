import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {map} from 'rxjs/operators'
import { ProjectService } from '../service/database.service';
import { ActivatedRoute } from '@angular/router';

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
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
  isFinding =  false;
  infoWindow:any;
  pos:any;
  //mockMarker:any;
  //map 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  markersFake = [];

  constructor( private route: ActivatedRoute, private afAu : AngularFireAuth,private afs:AngularFirestore,private geolocation:Geolocation, public zone: NgZone,private projectService:ProjectService) {
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

  clearMarkerFake(){
    for (var i = 0; i < this.markersFake.length; i++) {
      console.log(this.markersFake[i])
      this.markersFake[i].setMap(null);
    }
    this.markersFake=[];
  }

  selectSearchResult(item){
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(item);
      if(status === 'OK' && results[0]){
        // let position = {
        //     lat: results[0].geometry.location.lat,
        //     lng: results[0].geometry.location.lng
        // };
        // let marker = new google.maps.Marker({
        //   position: results[0].geometry.location,
        //   map: this.map
        // });
        //this.markers.push(marker);
        //this.mockMarker = ;
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(20);
      }
    })
  }

  mark(currentLoc){
    // console.log(this.map.getCenter());
    // let currentLoc = this.map.getCenter();
    this.clearMarkerFake();
    let marker = new google.maps.Marker({
      icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      position: currentLoc ,
      map: this.map
    });
    marker.addListener("dblclick", () => {
      this.clearMarkerFake();
      console.log(this.markersFake.length)
    });
    
    this.markersFake.push(marker)
  }

  ionViewWillEnter(){
   this.loadMap();
   console.log("hello")
  }


  updateSearchResults() {
    console.log(this.isFinding)
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
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      console.log(this.user)
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
      console.log(this.locationsCollection)
      
      // detect data if it change data 
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
      // update map
      this.locations.subscribe(locations =>{
        this.updateMapOnLoc(locations);
      })
      console.log();

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
        title: element.place,
        position: latlong,
        map: this.map
      });
      //showing up the info
      marker.addListener("click", () => {
        this.map.setZoom(20);
        this.map.setCenter(marker.getPosition());
        this.infoWindow.close();
        this.infoWindow = new google.maps.InfoWindow({
          position: marker.getPosition(),
        });
        let date = new Date(element.timestamp).toLocaleString()

        this.infoWindow.setContent(element.place+' store at '+ date);
        this.infoWindow.open(marker.getMap(),marker);
      });

      this.markers.push(marker);
      if(element.tag == true ){
        this.map.setCenter(latlong)
      }
    });
  }

  loadMap() {
    this.login();
    let latLng = new google.maps.LatLng(-41.28666552, 174.772996908);
    let mapOptions = {
      center: latLng,
      zoom: 16,
    };
    this.infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: latLng,
    });
    
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      this.mark(mapsMouseEvent.latLng)
    });
  }

  isTracking = false;
  startTracking(){
    this.isTracking  = true;
    this.projectService.getCurrentLocation().then((resp) => {
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

  pushLocationInMarkerFake(){
    this.markersFake.forEach( marker=>{
      let position = marker.getPosition();
      this.geocoder.geocode({ 'latLng': position },(results, status) => {
        console.log(position);
        if(status === 'OK' && results[0]){
          this.addNewLocation(position.lat(),position.lng(),new Date().getTime(),results[0].formatted_address);
        }
      })
    })
    this.clearMarkerFake()
  }
  stopTracking(){

  }

  addNewLocation(lat, lng, timestamp,place) {
    console.log("addddd"+lat+lng+timestamp+place)
    let tag = false;
    this.locationsCollection.add({
      lat,
      lng,
      timestamp,
      place,
      tag
    });
  }
  deleteLocation(pos) {
    this.locationsCollection.doc(pos.id).delete();
  }
}
