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
  selector: 'app-tab3',
  templateUrl: 'memoryList.page.html',
  styleUrls: ['memoryList.page.scss']
})
export class Tab3Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  highToLow=true;
  user = null;
  constructor(private afAu : AngularFireAuth,private afs:AngularFirestore, public zone: NgZone,private router: Router,private route: ActivatedRoute,private projectService:ProjectService) {
    this.login();
  }

  login(){
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      console.log(this.user)
      if(this.highToLow){
        this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'star');
      } else {
        this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'star');
      }
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
    // this.locationsCollection.doc(pos.id).delete();
    this.projectService.delete(this.locationsCollection,pos.id)
  }
  
  memoryWriter(pos){
    this.router.navigate(['writeMemory',pos],{ relativeTo: this.route })
    //console.log(pos)
  }

  switchSort(){
    if(this.highToLow){
      this.highToLow = false;
    } else {
      this.highToLow = true;
    }
    this.login()

  }
}
