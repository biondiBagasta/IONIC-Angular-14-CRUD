import { DirectivesModule } from './../../directives/directives.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestockPageRoutingModule } from './restock-routing.module';

import { RestockPage } from './restock.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RestockPageRoutingModule,
    ScrollingModule,
    DirectivesModule
  ],
  declarations: [RestockPage]
})
export class RestockPageModule {}
