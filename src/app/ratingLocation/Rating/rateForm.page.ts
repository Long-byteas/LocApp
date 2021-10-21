import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import {Location} from '@angular/common';
import { AlertController } from '@ionic/angular';
import { ProjectService } from 'src/app/service/database.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'rateForm.page.html',
  styleUrls: ['rateForm.page.scss']
})
export class Tab5Page {
  star=1;
  comment="";
  happy=1;
  pos:any;
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute, public alertController: AlertController,private afAu : AngularFireAuth,private afs:AngularFirestore, private router: Router,private projectService:ProjectService) {}

  ngOnInit() {
    this.pos = this.route.snapshot.paramMap;
    this.login()
    console.log(this.pos.get('id'))
    if(this.pos.get('id') != undefined){
      this.star = this.pos.get('star');
      this.happy = this.pos.get('happy');
      this.comment = this.pos.get('comment');
    }
  }

  login(){
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
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
    this.projectService.updateRating(this.locationsCollection,this.pos.get('id'),this.star,this.comment,this.happy)
    this.back()
  }
  
  back(){
    this.router.navigate(['/tabs/tab2'],{ relativeTo: this.route })
  }
  reset(){
    this.alert()
  }

  resetItem(){
    console.log("haha")
    this.star = 1;
    this.comment = "";
    this.happy =1;
  }

  alert() {
    this.alertController.create({
      header: 'Confirm Alert',
      message: 'Are you sure to delete?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            console.log('nothing');
          }
        },
        {
          text: 'Yes!',
          handler: () => {
            this.resetItem();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
