import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Supplier } from './../../interfaces/supplier';
import { AlertController } from '@ionic/angular';
import { IonicService } from './../../services/ionic.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SupplierService } from './../../services/supplier.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.page.html',
  styleUrls: ['./supplier.page.scss'],
})
export class SupplierPage implements OnInit, OnDestroy {

  constructor(private supplierService: SupplierService,
    private formBuilder: FormBuilder, private ionicService: IonicService,
    private alertController: AlertController) { }

  createForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone_number: ['', Validators.required]
  });

  editForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone_number: ['', Validators.required]
  });

  suppliers: Supplier[] = [];
  supplierId = 0;
  isModalEditOpened = false;

  supplier$!: Subscription;
  submitCreate$!: Subscription;
  submitEdit$!: Subscription;
  delete$!: Subscription;
  search$!: Subscription;  openeEdit$!: Subscription;

  searchField = new FormControl('');

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if(this.supplier$) {
      this.supplier$.unsubscribe();
    }

    if(this.submitCreate$) {
      this.submitCreate$.unsubscribe();
    }

    if(this.submitEdit$) {
      this.submitEdit$.unsubscribe();
    }

    if(this.delete$) {
      this.delete$.unsubscribe();
    }

    if(this.search$) {
      this.search$.unsubscribe();
    }

    if(this.openeEdit$) {
      this.openeEdit$.unsubscribe();
    }
  }

  load(): void {
    this.supplier$ = this.ionicService.obsShowLoading('Fetching the Supplier data...')
    .pipe(
      switchMap(() => {
        return this.supplierService.findMany().pipe(
          switchMap(data => {
            this.suppliers = data;

            return this.ionicService.obsDismissLoading();
          })
        )
      })
    )
    .subscribe()
  }

  search(): void {
    this.search$ = this.ionicService.obsShowLoading(`Searching the Supplier data...`).pipe(
      switchMap(() => {
        return this.supplierService.filter(this.searchField.value).pipe(
          switchMap(data => {
            this.suppliers = data;

            return this.ionicService.dismissLoading();
          })
        )
      })
    ).subscribe();
  }

  openEditModal(data: Supplier): void {
    this.editForm.patchValue(data);

    this.supplierId = data.id;

    this.isModalEditOpened = true;
  }

  dismissEditModal(): void {
    this.isModalEditOpened = false;
  }

  submitCreateForm(modalCallBack: Promise<boolean>): void {
    this.submitCreate$ = this.ionicService.obsShowLoading('Creating the Category data...').pipe(
      switchMap(() => {
        return this.supplierService.create(this.createForm.getRawValue()).pipe(
          switchMap(data => {
            return this.ionicService.obsSuccessToast(`${data.name} Supplier data was created.`).pipe(
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
    ).subscribe();
  }


  submitEditForm(modalCallBack: Promise<boolean>): void {
    this.submitEdit$ = this.ionicService.obsShowLoading('Updating Supplier data...').pipe(
      switchMap(() => {
        return this.supplierService.update(this.supplierId, this.editForm.getRawValue()).pipe(
          switchMap(data => {
            return this.ionicService.obsPrimaryToast(`${data.name} Supplier data was updated.`).pipe(
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

  delete(id: number): void {
    this.delete$ = this.ionicService.obsShowLoading(`Deleting the Supplier data...`).pipe(
      switchMap(() => {
        return this.supplierService.delete(id).pipe(
          switchMap(data => {
            return this.ionicService.obsSuccessToast(`${data.name} Supplier data was deleted.`).pipe(
              switchMap(() => {
                this.load();
                return this.ionicService.obsDismissLoading();
              })
            )
          })
        )
      })
    ).subscribe()
  }

  async deleteSupplier(id: number,  name: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Supplier',
      subHeader: `Are you sure want to delete ${name} Supplier???`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(id);
          }
        }
      ]
    });

    await alert.present();
  }
}
