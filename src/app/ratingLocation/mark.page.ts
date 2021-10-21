import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';
import { ProjectService } from '../service/database.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'mark.page.html',
  styleUrls: ['mark.page.scss']
})
export class Tab2Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore, public zone: NgZone,private router: Router,private route: ActivatedRoute,private projectService:ProjectService) {
    this.login();
  }

  login(){
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      console.log(this.user)
      this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'timestamp');
      console.log(this.locationsCollection)
      // load data with id
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push id into data 
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
    })
  }

 

  deleteLocation(pos) {
    this.projectService.delete(this.locationsCollection,pos.id)
  }
  
  ratingLocation(pos){
    this.router.navigate(['rating',pos],{ relativeTo: this.route })
    //console.log(pos)
  }

  selectPos(pos){
    this.projectService.markLoc(this.locationsCollection,pos.id)
  }

  deSelectPos(pos){
    this.projectService.demarkLoc(this.locationsCollection,pos.id)
  }
}
