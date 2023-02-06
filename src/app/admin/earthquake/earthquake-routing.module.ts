import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EarthquakePage } from './earthquake.page';

const routes: Routes = [
  {
    path: '',
    component: EarthquakePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarthquakePageRoutingModule {}
