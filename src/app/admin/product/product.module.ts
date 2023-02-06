import { DirectivesModule } from './../../directives/directives.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProductPageRoutingModule,
    LazyLoadImageModule,
    ScrollingModule,
    DirectivesModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
