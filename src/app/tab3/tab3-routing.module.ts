import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Memory } from './memory/memory.page';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
  },
  {
    path: 'writeMemory',
    component: Memory,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
