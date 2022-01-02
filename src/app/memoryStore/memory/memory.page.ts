import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ProjectService } from 'src/app/service/database.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'memory.page.html',
  styleUrls: ['memory.page.scss']
})
export class Memory {
  memory="";
  pos:any;
  locationsCollection:AngularFirestoreCollection<any>;
  user = null;
  constructor(private route: ActivatedRoute,  private router: Router, private projectService:ProjectService) {}

  ngOnInit() {
    // getting information about this location
    this.pos = this.route.snapshot.paramMap;
    this.login()
    // if memory already exist in the locations, display it
    if(this.pos.get('memory') != undefined){
      this.memory =  this.pos.get('memory')
    }
  }

  login(){
    // connect and get the data of user from db
    this.projectService.connect().then(resp => {
      this.user = resp.user;
      //  get a firebase collection
      this.locationsCollection = this.projectService.getDataCollectionAsc(this.user.uid,'timestamp');
    })
  }
  
  updateMemory(text){
    // push this memory into the db and return to tab
    this.projectService.updateMemory(this.locationsCollection,this.pos.get('id'),text)
    this.back();
  }
  
  back(){
    //  return back to the page
    this.router.navigate(['/tabs/tab3'],{ relativeTo: this.route })
  }
}
