import { Component} from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';
import { ProjectService } from '../service/database.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'memoryList.page.html'
})
export class Tab3Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  highToLow=true;
  user = null;
  constructor(private router: Router,private route: ActivatedRoute,private projectService:ProjectService) {
    this.login();
  }

  login(){
    // connect to firebase to get user data
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      if(this.highToLow){
        this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'star');
      } else {
        this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'star');
      }
      // load locations with id
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push id into each location in locations
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data};
      })));

    })
  }

 

  deleteLocation(pos) {
    // deleting a location
    this.projectService.delete(this.locationsCollection,pos.id)
  }
  
  memoryWriter(pos){
    // navigating to memory page with the location information
    // so that the user can add their memory and push them into the db
    this.router.navigate(['writeMemory',pos],{ relativeTo: this.route })
  }

  switchSort(){
    // change the sorting way  of the locations
    if(this.highToLow){
      this.highToLow = false;
    } else {
      this.highToLow = true;
    }
    this.login()

  }
}
