import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletedPage } from './deleted.page';

const routes: Routes = [
  {
    path: '',
    component: DeletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletedPageRoutingModule {}
