import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then( m => m.SupplierPageModule)
      },
      {
        path: 'restock',
        loadChildren: () => import('./restock/restock.module').then( m => m.RestockPageModule)
      },
      {
        path: 'qrcode',
        loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
      },
      {
        path: 'earthquake',
        loadChildren: () => import('./earthquake/earthquake.module').then( m => m.EarthquakePageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
