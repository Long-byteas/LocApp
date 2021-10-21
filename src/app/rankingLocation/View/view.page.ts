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
    this.pos = this.route.snapshot.paramMap;
    this.star = this.pos.get('star');
    this.happy = this.pos.get('happy');
    this.comment = this.pos.get('comment');
    
    if(this.pos.get('memory') != undefined){
      console.log(this.pos)
      this.memory = this.pos.get('memory')
    } 
  }

}
