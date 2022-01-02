import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './review.page';
import { RateForm } from './Rating/rateForm.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    pathMatch: 'full'
  },
  {
    path: 'rating',
    component: RateForm,
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class Tab2PageRoutingModule {}
