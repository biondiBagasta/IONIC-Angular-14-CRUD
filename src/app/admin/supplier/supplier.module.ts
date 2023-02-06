import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierPageRoutingModule } from './supplier-routing.module';

import { SupplierPage } from './supplier.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SupplierPageRoutingModule,
    ScrollingModule
  ],
  declarations: [SupplierPage]
})
export class SupplierPageModule {}
