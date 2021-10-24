import { Component} from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { Router ,ActivatedRoute} from '@angular/router';
import { ProjectService } from '../service/database.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'review.page.html',
  styleUrls: ['review.page.scss']
})
export class Tab2Page {
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private router: Router,private route: ActivatedRoute,private projectService:ProjectService) {
    this.login();
  }

  login(){
    // connect to the db to get the user 
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      // get the  data collection
      this.locationsCollection = this.projectService.getDataCollectionDesc(this.user.uid,'timestamp');
      // load locations
      this.locations = this.locationsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        // push id-key of location into corresponding location 
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
    // navigating to rating page with the corresponding location
    // so the page can modify it in firebase
    this.router.navigate(['rating',pos],{ relativeTo: this.route })
    //console.log(pos)
  }

  selectPos(pos){
    // mark the location so it can be targeted inside the map
    this.projectService.markLoc(this.locationsCollection,pos.id)
  }

  deSelectPos(pos){
    // demark the location so it can't be targeted inside the map
    this.projectService.demarkLoc(this.locationsCollection,pos.id)
  }
}
