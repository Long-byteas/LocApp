import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import {Location} from '@angular/common';
import { ProjectService } from 'src/app/service/database.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'memory.page.html',
  styleUrls: ['memory.page.scss']
})
export class Memory {
  memory="";
  pos:any;
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute,  private router: Router,private afAu : AngularFireAuth,private afs:AngularFirestore, private location: Location, private projectService:ProjectService) {}

  ngOnInit() {
    this.pos = this.route.snapshot.paramMap;
    this.login()
    console.log(this.pos.get('id'))
    if(this.pos.get('memory') != undefined){
      this.memory =  this.pos.get('memory')
    }
  }

  login(){
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
      console.log(this.locationsCollection);
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
  
  updateMemory(text){
    this.projectService.updateMemory(this.locationsCollection,this.pos.get('id'),text)
    this.back();
  }
  
  back(){
    this.router.navigate(['/tabs/tab3'],{ relativeTo: this.route })
  }
}
