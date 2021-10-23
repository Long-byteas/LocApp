import { Component } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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
  constructor(private router: Router,private route: ActivatedRoute,private projectService:ProjectService) {
    this.login();
  }

  login(){
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'star');
      // load locations with id
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push location id-key(in db) into each location to refer it
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));
    })
  }

 

  deleteLocation(pos) {
    // delete a location
    this.projectService.delete(this.locationsCollection,pos.id)
  }
  
  viewMemory(pos){
    // navigating to view page, passing the information of location
    // to add memory into it
    this.router.navigate(['view',pos],{ relativeTo: this.route })
  }
}
