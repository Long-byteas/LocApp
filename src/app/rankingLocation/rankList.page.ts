import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-tab4',
  templateUrl: 'rankList.page.html',
  styleUrls: ['rankList.page.scss']
})

export class Tab4Page {
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
      ,ref => ref.orderBy('star','asc'));
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
  
  viewMemory(pos){
    this.router.navigate(['view',pos],{ relativeTo: this.route })
    //console.log(pos)
  }
}
