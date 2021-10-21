import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './mark.page';
import { Tab5Page } from './Rating/rateForm.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    pathMatch: 'full'
  },
  {
    path: 'rating',
    component: Tab5Page,
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class Tab2PageRoutingModule {}
