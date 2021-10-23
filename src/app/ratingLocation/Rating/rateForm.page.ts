import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ProjectService } from 'src/app/service/database.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'rateForm.page.html',
  styleUrls: ['rateForm.page.scss']
})
// this is the form the user use to rate a location
export class RateForm {
  star=1;
  comment="";
  happy=1;
  pos:any;
  locations:Observable<any>;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute, public alertController: AlertController,private afAu : AngularFireAuth,private afs:AngularFirestore, private router: Router,private projectService:ProjectService) {}

  ngOnInit() {
    // get the information of location 
    this.pos = this.route.snapshot.paramMap;
    this.login()
    // if the user rate this location before then display old comments and allow them to be modified
    if(this.pos.get('id') != undefined){
      this.star = this.pos.get('star');
      this.happy = this.pos.get('happy');
      this.comment = this.pos.get('comment');
    }
  }

  login(){
    // login to point to the user db (to modify it)
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
    })
  }
  updateRating(){
    // add the rating into the database
    this.projectService.updateRating(this.locationsCollection,this.pos.get('id'),this.star,this.comment,this.happy)
    this.back()
  }
  
  back(){
    // going bacck to tab2 ( mark.html )
    this.router.navigate(['/tabs/tab2'],{ relativeTo: this.route })
  }
  reset(){
    this.alert()
  }

  resetItem(){
    // refresh
    console.log("haha")
    this.star = 1;
    this.comment = "";
    this.happy =1;
  }

  alert() {
    // alert the user before refreshing his form
    this.alertController.create({
      header: 'Confirm Alert',
      message: 'Are you sure to delete?',
      buttons: [
        {
          // cancel option
          text: 'cancel',
          handler: () => {
            console.log('nothing');
          }
        },
        {// agree options
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
