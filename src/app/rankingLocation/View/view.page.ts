import { Component } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab5',
  templateUrl: 'view.page.html',
  styleUrls: ['view.page.scss']
})
export class View {
  star=1;
  comment="";
  memory=" You haven't had any memory yet";
  happy=1;
  pos:any;
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // get location info
    this.pos = this.route.snapshot.paramMap;
    // storing the info of location
    this.star = this.pos.get('star');
    this.happy = this.pos.get('happy');
    this.comment = this.pos.get('comment');
    // if theres memory then load it
    if(this.pos.get('memory') != undefined){
      console.log(this.pos)
      this.memory = this.pos.get('memory')
    } 
  }

}
