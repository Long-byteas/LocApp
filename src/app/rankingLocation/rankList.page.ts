import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';
import { ProjectService } from '../service/database.service';
@Component({
  selector: 'app-tab4',
  templateUrl: 'rankList.page.html',
  styleUrls: ['rankList.page.scss']
})

export class Tab4Page {
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
      this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'star');
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
    this.projectService.delete(this.locationsCollection,pos.id)
  }
  
  viewMemory(pos){
    this.router.navigate(['view',pos],{ relativeTo: this.route })
    //console.log(pos)
  }
}
