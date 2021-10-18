import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore, public zone: NgZone,private router: Router,private route: ActivatedRoute) {
    this.login();
  }

  login(){
    this.afAu.signInAnonymously().then(resp => {
      this.user = resp.user;
      console.log(this.user)
      this.locationsCollection = this.afs.collection(`locations/${this.user.uid}/track`
      ,ref => ref.orderBy('timestamp','desc'));
      console.log(this.locationsCollection)
      // load data with id
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push id into data 
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
      //calling update
      // update map

    })
  }

 

  deleteLocation(pos) {
    this.locationsCollection.doc(pos.id).delete();
  }
  
  ratingLocation(pos){
    this.router.navigate(['rating',pos],{ relativeTo: this.route })
    //console.log(pos)
  }

  selectPos(pos){
    this.locationsCollection.doc(pos.id).update({
      tag:true,
    })
  }

  deSelectPos(pos){
    this.locationsCollection.doc(pos.id).update({
      tag:false,
    })
  }
}
