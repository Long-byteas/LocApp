import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { ProjectService } from '../service/database.service';

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
  
  //map and marker on it 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  markersFake = [];

  constructor( public zone: NgZone,private projectService:ProjectService) {
    // setting up google map auto complete
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    // setting up geocoder to get location base on lat long
    this.geocoder = new google.maps.Geocoder;
  }
  
  clearMarkers(){
    // remove any red marker
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  clearMarkerFake(){
    // remove any mock-yellow marker
    for (var i = 0; i < this.markersFake.length; i++) {
      console.log(this.markersFake[i])
      this.markersFake[i].setMap(null);
    }
    this.markersFake=[];
  }

  selectSearchResult(item){
    // when select a place on auto complete
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(item);
      if(status === 'OK' && results[0]){
        //  get the most accurate location and move to it
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(20);
        // set a mock mark
        this.mark(results[0].geometry.location)
      }
    })
  }

  mark(currentLoc){

    // make a mock  mark on location based on selected location
    this.clearMarkerFake();
    let marker = new google.maps.Marker({
      icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      position: currentLoc ,
      map: this.map
    });
    // mock location can be x2 click to clear
    marker.addListener("dblclick", () => {
      this.clearMarkerFake();
      console.log(this.markersFake.length)
    });
    // push a new mock mark into markerFake
    this.markersFake.push(marker)
  }

  ionViewWillEnter(){
    // load map  when start
   this.loadMap();
  }


  updateSearchResults() {
    // auto complete search bar
    // return new stuff for each seearch
    console.log(this.isFinding)
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    } 
    
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      // google predict places and return them in auto complete to show 
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  login(){
    // login into a anoymus account on firebase for every devices
    this.projectService.connect().then(resp => {
      // get the log user
      this.user = resp.user;
      // get the data of user
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
      
      // detect data if it change data update new locations
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
      // update map
      this.locations.subscribe(locations =>{
        this.updateMapOnLoc(locations);
      })
    })
  }
  
  updateMapOnLoc(locations){
    // everytime the data change( user add or remove)
    // reset all the marker and place new one
    this.clearMarkers();
    this.markers = []
    console.log(locations)
    // for every user location, make a marker on a map
    locations.forEach(element => {
      var latlong = new google.maps.LatLng(element.lat,element.lng)
      let marker = new google.maps.Marker({
        title: element.place,
        position: latlong,
        map: this.map
      });
      //showing up the info for marker
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
    // load map happens when the user login
    // load basic map
    this.login();
    let latLng = new google.maps.LatLng(-41.28666552, 174.772996908);
    let mapOptions = {
      center: latLng,
      zoom: 16,
    };
    // make a mock info window
    this.infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: latLng,
    });
    
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // make mock mark on the map when the user click on map
    this.map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      this.mark(mapsMouseEvent.latLng)
    });
  }

  isTracking = false;
  startTracking(){
    // tracking user location to return stuff
    this.isTracking  = true;
    // get the current location and put a mark on it
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
      
      // get the location name
      this.geocoder.geocode({ 'latLng': position },(results, status) => {
        console.log(results);
        if(status === 'OK' && results[0]){
          // add them into the database
          this.addNewLocation(lat,lng,resp.timestamp,results[0].formatted_address);
        }
      })
     });
     
  }

  pushLocationInMarkerFake(){
    // push all the mock marker in marker fake into db and turn them into real marker
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
   // add location into the db
  addNewLocation(lat, lng, timestamp,place) {
    this.projectService.updateNewLocation(this.locationsCollection,lat,lng,timestamp,place)
  }

  // delete location in db 
  deleteLocation(pos) {
    this.projectService.delete(this.locationsCollection,pos.id)
  }
}
