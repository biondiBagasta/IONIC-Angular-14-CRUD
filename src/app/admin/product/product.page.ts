import { switchMap } from 'rxjs/operators';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { Category } from './../../interfaces/category';
import { Product } from './../../interfaces/product';
import { ProductService } from './../../services/product.service';
import { CategoryService } from './../../services/category.service';
import { AlertController } from '@ionic/angular';
import { IonicService } from './../../services/ionic.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,
    private ionicService: IonicService, private alertController: AlertController,
    private categoryService: CategoryService, private productService: ProductService) { }

  searchField = new FormControl('');

  createForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    purchase_price: [null, Validators.required],
    selling_price: [null, Validators.required],
    stock: [null, Validators.required],
    discount: [null, Validators.required],
    image: '',
    category_id: [null, Validators.required]
  });

  editForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    purchase_price: [0, Validators.required],
    selling_price: [0, Validators.required],
    stock: [0, Validators.required],
    discount: [0, Validators.required],
    image: '',
    category_id: [0, Validators.required]
  });

  products: Product[] = [];
  productId = 0;

  categories: Category[] = [];

  imageData!: File;
  choosenImage = false;

  isModalEditOpened = false;

  categories$!: Subscription;
  products$!: Subscription;
  submitCreate$!: Subscription;
  submitEdit$!: Subscription;
  delete$!: Subscription;
  search$!: Subscription;

  imagesUrl: string[] = [];

  isImageModalOpened = false;
  imageModalIndex = 0;

  ngOnInit(): void {
    this.categories$ = this.categoryService.findMany().subscribe(data => {
      this.categories = data;
    });

    this.load();
  }

  ngOnDestroy(): void {
    if(this.categories$) {
      this.categories$.unsubscribe();
    }

    if(this.search$) {
      this.search$.unsubscribe();
    }

    if(this.submitCreate$) {
      this.submitCreate$.unsubscribe();
    }

    if(this.submitEdit$) {
      this.submitEdit$.unsubscribe();
    }

    if(this.products$) {
      this.products$.unsubscribe();
    }

    if(this.delete$) {
      this.delete$.unsubscribe();
    }
  }

  selectFile(files: Event): void {
    const file = (files.target as HTMLInputElement).files.item(0);
    this.imageData = file;
    this.choosenImage = true;
  }

  getProductImage(image: string): Observable<string> {
    return this.productService.getProductImage(image);
  }

  load(): void {
    this.products$ = this.ionicService.obsShowLoading(
      `Fetching the Product Data...`
    ).pipe(
      switchMap(() => {
        return this.productService.findMany().pipe(
          switchMap(productData => {
            this.products = productData;

            if(productData.length != 0) {
              return combineLatest(productData.map(data => {
                return this.productService.getProductImage(data.image);
              })).pipe(
                switchMap(data => {
                  this.imagesUrl = data;

                  return this.ionicService.obsDismissLoading();
                })
              )
            } else {
              return this.ionicService.obsDismissLoading();
            }
          })
        )
      })
    ).subscribe();
  }

  search(): void {
    this.search$ = this.ionicService.obsShowLoading(`Searching the Product data...`).pipe(
      switchMap(() => {
        return this.productService.filter(this.searchField.value).pipe(
          switchMap(productData => {
            this.products = productData;


            if(productData.length != 0) {
              return combineLatest(productData.map(data => {
                return this.productService.getProductImage(data.image);
              })).pipe(
                switchMap(data => {
                  this.imagesUrl = data;

                  return this.ionicService.obsDismissLoading();
                })
              )
            } else {
              return this.ionicService.obsDismissLoading();
            }
          })
        )
      })
    ).subscribe();
  }

  openImageModal(imageIndex: number): void {
    this.imageModalIndex = imageIndex;
    this.isImageModalOpened = true;
  }

  dismissImageModal(): void {
    this.isImageModalOpened = false;
  }

  openEditModal(data: Product): void {
      this.productId = data.id;

      this.editForm.patchValue({
        name: data.name,
        purchase_price: data.purchase_price,
        selling_price: data.selling_price,
        stock: data.stock,
        discount: data.discount,
        image: data.image,
        category_id: data.category_id
      });

      this.isModalEditOpened = true;
  }

  dismissEditModal(): void {
    this.isModalEditOpened = false;
  }

  submitCreateForm(modalCallback: Promise<boolean>): void {
    const formData =  new FormData();
    formData.append('product_image', this.imageData);

    this.submitCreate$ = this.ionicService.obsShowLoading(`
      Creating the Product data...
    `).pipe(
      switchMap(() => {
        return this.productService.uploadProductImage(formData).pipe(
          switchMap(data => {
            this.createForm.patchValue({
              image: data.fileName
            });

            return this.productService.create(this.createForm.getRawValue()).pipe(
              switchMap(data => {
                this.createForm.reset();
                this.load();
                this.choosenImage = false;
                modalCallback;

                return this.ionicService.obsSuccessToast(`${data.name} Product data was created.`).pipe(
                  switchMap(() => {
                    return this.ionicService.obsDismissLoading();
                  })
                )

              })
            )
          })
        )
      })
    ).subscribe();
  }

  submitEditForm(modalCallback: Promise<boolean>): void {
    if(this.choosenImage == true) {
      const formData = new FormData();
      formData.append('product_image', this.imageData);
      const currentImageData = this.editForm.controls.image.value;

      this.submitEdit$ = this.ionicService.obsShowLoading(`
        Updating the Product data...
      `).pipe(
        switchMap(() => {
          return this.productService.deleteProductImage(currentImageData).pipe(
            switchMap(() => {
              return this.productService.uploadProductImage(formData).pipe(
                switchMap(data => {
                  this.editForm.patchValue({
                    image: data.fileName
                  });

                  return this.productService.update(this.productId, this.editForm.getRawValue()).pipe(
                    switchMap(data => {
                      this.editForm.reset();
                      this.load();
                      this.choosenImage = false;
                      modalCallback;

                      return this.ionicService.obsPrimaryToast(`
                        ${data.name} Product data was updated.
                      `).pipe(
                        switchMap(() => {
                          return this.ionicService.obsDismissLoading();
                        })
                      )
                    })
                  )
                })
              )
            })
          )
        })
      ).subscribe();
    } else {
      this.submitEdit$ = this.ionicService.obsShowLoading(
        `Updating the Product data...`
      ).pipe(
        switchMap(() => {
          return this.productService.update(this.productId, this.editForm.getRawValue()).pipe(
            switchMap(data => {
              this.editForm.reset();
              this.load();
              modalCallback;

              return this.ionicService.obsPrimaryToast(`${data.name} Product data was updated.`).pipe(
                switchMap(() => {
                  return this.ionicService.obsDismissLoading();
                })
              )
            })
          )
        })
      ).subscribe();
    }
  }

  delete(id: number, image: string): void {
    this.delete$ = this.ionicService.obsShowLoading(`
      Deleting the Product data...
    `).pipe(
      switchMap(() => {
        return this.productService.deleteProductImage(image).pipe(
          switchMap(() => {
            return this.productService.delete(id).pipe(
              switchMap(data => {
                this.load();
                return this.ionicService.obsSuccessToast(`${data.name} Product data was deleted.`).pipe(
                  switchMap(() => {
                    return this.ionicService.obsDismissLoading();
                  })
                )
              })
            )
          })
        )
      })
    ).subscribe();
  }

  async deleteProduct(id: number, name: string, image: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Product',
      subHeader: `Are you sure want to delete this ${name} Product data???`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(id, image);
          }
        }
      ]
    });

    await alert.present();
  }

}
