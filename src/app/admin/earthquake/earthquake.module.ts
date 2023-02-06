import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EarthquakePageRoutingModule } from './earthquake-routing.module';

import { EarthquakePage } from './earthquake.page';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EarthquakePageRoutingModule,
    LeafletModule
  ],
  declarations: [EarthquakePage]
})
export class EarthquakePageModule {}
