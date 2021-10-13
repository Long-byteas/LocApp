import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import {Location} from '@angular/common';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {
  star=1;
  comment="";
  happy=1;
  pos:any;
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute,  private router: Router,private afAu : AngularFireAuth,private afs:AngularFirestore, private location: Location) {}

  ngOnInit() {
    this.pos = this.route.snapshot.paramMap;
    this.login()
    console.log(this.pos.get('id'))
  }

  login(){
    this.afAu.signInAnonymously().then(resp => {
      this.user = resp.user;
      this.locationsCollection = this.afs.collection(`locations/${this.user.uid}/track`
      ,ref => ref.orderBy('timestamp'));
      // load data with id
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push id into data 
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
      console.log(this.locations)
      this.locations.subscribe(res =>(console.log(res)));
      //calling update
      // update map

    })
  }
  updateRating(){
    this.locationsCollection.doc(this.pos.get('id')).update({star:this.star,
      comment:this.comment,
      happy:this.happy
    })

    console.log(this.star);
    console.log(this.comment)
  }
  
  back(){
    this.location.back();
  }
}
