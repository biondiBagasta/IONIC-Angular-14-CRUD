import { CashService } from './../../services/cash.service';
import { Supplier } from './../../interfaces/supplier';
import { Product } from './../../interfaces/product';
import { switchMap, tap } from 'rxjs/operators';
import { ProductService } from './../../services/product.service';
import { SupplierService } from './../../services/supplier.service';
import { AuthService } from './../../services/auth.service';
import { RestockService } from './../../services/restock.service';
import { IonicService } from './../../services/ionic.service';
import { forkJoin, Subscription } from 'rxjs';
import { Restock } from './../../interfaces/restock';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-restock',
  templateUrl: './restock.page.html',
  styleUrls: ['./restock.page.scss'],
})
export class RestockPage implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private ionicService: IonicService,
    private restockService: RestockService, private authService: AuthService,
    private supplierService: SupplierService, private productService: ProductService,
    private cashService: CashService) { }

  searchField = new FormControl('');
  searchFilterDateField = new FormControl();
  startFilterDateField = new FormControl();
  endFilterDateField = new FormControl();
  isOpenFilterDateModal = false;

  createRestockDateField = new FormControl();
  editRestockDateField = new FormControl();

  isOpenCreateRestockDateModal = false;
  isOpenEditRestockDateModal = false;

  restocks: Restock[] = [];
  restockId = 0;

  isModalEditOpened = false;

  products: Product[] = [];
  suppliers: Supplier[] = [];

  restock$!: Subscription;
  submitCreate$!: Subscription;
  submitEdit$!: Subscription;
  search$!: Subscription;
  initialize$!: Subscription;

  createForm: FormGroup = this.formBuilder.group({
    restock_date: [null, Validators.required],
    product_id: [null, Validators.required],
    supplier_id: [null, Validators.required],
    stock: [{value: null, disbled: true }, Validators.required],
    amount: [{value: '', disbled: true }, Validators.required],
    users: ''
  })

  editForm: FormGroup = this.formBuilder.group({
    restock_date: [null, Validators.required],
    product_id: [null, Validators.required],
    supplier_id: [null, Validators.required],
    stock: [null, Validators.required],
    amount: [{value: '', disbled: true }, Validators.required],
    users: ''
  })

  ngOnInit() {
    this.initialize$ = forkJoin([
      this.authService.users.pipe(
        tap(data => {
          this.createForm.get('users')?.patchValue(data.full_name);
          this.editForm.get('users')?.patchValue(data.full_name);
        })
      ),
      this.productService.findMany().pipe(
        tap(data => {
          this.products = data;
        })
      ),
      this.supplierService.findMany().pipe(
        tap(data => {
          this.suppliers = data
        })
      )
    ]).subscribe();
    this.load();
  }

  ngOnDestroy(): void {
      if(this.restock$) {
        this.restock$.unsubscribe();
      }

      if(this.submitCreate$) {
        this.submitCreate$.unsubscribe();
      }

      if(this.search$) {
        this.search$.unsubscribe();
      }

      if(this.submitEdit$) {
        this.submitEdit$.unsubscribe();
      }
  }

  load(): void {
    this.restock$ = this.ionicService.obsShowLoading('Fetching the Restock data...')
    .pipe(
      switchMap(() => {
        return this.restockService.findMany().pipe(
          switchMap(data => {
            this.restocks = data;

            return this.ionicService.obsDismissLoading();
          })
        )
      })
    )
    .subscribe()
  }

  search(): void {
    this.search$ = this.ionicService.obsShowLoading(`Searching the Category data...`).pipe(
      switchMap(() => {
        return this.restockService.filter(this.searchField.value).pipe(
          switchMap(data => {
            this.restocks = data;

            return this.ionicService.dismissLoading();
          })
        )
      })
    ).subscribe();
  }

  openFilterDateModal(): void {
    this.isOpenFilterDateModal = true;
  }

  closeFilterDateModal(): void {
    this.isOpenFilterDateModal = false;
  }

  selectFilterDate(): void {
    const start = dayjs(this.startFilterDateField.value).subtract(1, 'day').toDate();
    const end = new Date(this.endFilterDateField.value);
    this.search$ = this.restockService.filterByDate(start,
      end).subscribe(data => {
      this.restocks = data;
    });
    this.searchFilterDateField.patchValue(`${dayjs(this.startFilterDateField.value).format('DD-MM-YYYY')}
    s/d ${dayjs(this.endFilterDateField.value).format('DD-MM-YYYY')}`);
    this.closeFilterDateModal();
  }

  openCreateRestockDateModal(): void {
    this.isOpenCreateRestockDateModal = true;
  }

  closeCreateRestockDateModal(): void {
    this.isOpenCreateRestockDateModal = false;
  }

  selectCreateRestockDate(): void {
    this.createForm.get('restock_date')?.patchValue(`${dayjs(this.createRestockDateField.value).format('DD-MM-YYYY')}`)
  }

  openEditRestockDateModal(): void {
    this.isOpenEditRestockDateModal = true;
  }

  closeEditRestockDateModal(): void {
    this.isOpenEditRestockDateModal = false;
  }

  selectEditRestockDate(): void {
    this.editForm.get('restock_date')?.patchValue(`${dayjs(this.editRestockDateField.value).format('DD-MM-YYYY')}`)
  }
  // ENABLE Stock
  enableCreateStock(): void {
    this.createForm.get('stock')?.enable();
  }

  // AMOUNT
  updateCreateAmount(): void {
    const productId = this.createForm.get('product_id')?.value;
    const stock = this.createForm.get('stock')?.value;
    const purchasePrice = this.products.find(p => p.id == productId).purchase_price;
    this.createForm.get('amount')?.patchValue((purchasePrice * stock).toString());
  }

  updateEditAmount(): void {
    const productId = this.editForm.get('product_id')?.value;
    const stock = this.editForm.get('stock')?.value;
    if(productId != null || stock != null) {
      const purchasePrice = this.products.find(p => p.id == productId).purchase_price;
      this.editForm.get('amount')?.patchValue((purchasePrice * stock).toString());
    }
  }

  openEditModal(data: Restock): void {
    this.editForm.patchValue(data);

    this.restockId = data.id;

    this.isModalEditOpened = true;
  }

  dismissEditModal(): void {
    this.isModalEditOpened = false;
  }

  submitCreateForm(modalCallBack: Promise<boolean>): void {
    this.createForm.get('restock_date')?.patchValue(this.createRestockDateField.value);
    this.submitCreate$ = this.ionicService.obsShowLoading('Creating the Restock data...').pipe(
      switchMap(() => {
        return this.restockService.create(this.createForm.getRawValue()).pipe(
          switchMap(data => {
            return forkJoin([
              this.productService.findUnique(data.product_id).pipe(
                switchMap(product => {
                  return this.productService.updateRestockStock(product.id, product.stock + data.stock);
                })
              ),
              this.cashService.findUnique().pipe(
                switchMap(cash => {
                  return this.cashService.update((Number(cash.total) - Number(data.amount)).toString());
                })
              )
            ]).pipe(
              switchMap((_) => {
                return this.ionicService.obsSuccessToast(`New Restock data was created.`).pipe(
                  switchMap(() => {
                    this.createForm.reset();
                    this.load();
                    modalCallBack
                    return this.ionicService.dismissLoading();
                  })
                )
              })
            )
          })
        )
      })
    ).subscribe();
  }

  submitEditForm(modalCallBack: Promise<boolean>): void {
    this.submitEdit$ = this.ionicService.obsShowLoading('Updating Restock data...').pipe(
      switchMap(() => {
        return this.restockService.update(this.restockId, this.editForm.getRawValue()).pipe(
          switchMap(data => {
            return this.ionicService.obsPrimaryToast(`Restock data was updated.`).pipe(
              switchMap(() => {
                this.editForm.reset();
                this.load();
                modalCallBack;

                return this.ionicService.dismissLoading();
              })
            )
          })
        )
      })
    ).subscribe();
  }

  // deleteRestock(id: number): void {
  //   this.delete$ = this.ionicService.obsShowLoading(`Deleting the Category data...`).pipe(
  //     switchMap(() => {
  //       return this.categoryService.delete(id).pipe(
  //         switchMap(data => {
  //           return this.ionicService.obsSuccessToast(`${data.name} Category data was deleted.`).pipe(
  //             switchMap(() => {
  //               this.load();
  //               return this.ionicService.obsDismissLoading();
  //             })
  //           )
  //         })
  //       )
  //     })
  //   ).subscribe()
  // }

}
