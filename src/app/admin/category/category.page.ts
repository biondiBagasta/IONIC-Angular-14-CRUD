import { switchMap, tap } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { Category } from './../../interfaces/category';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CategoryService } from './../../services/category.service';
import { IonicService } from './../../services/ionic.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private ionicService: IonicService, private categoryService: CategoryService,
    private alertController: AlertController) { }

  createForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required]
  });

  editForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required]
  });

  categories: Category[] = [];

  categoryId = 0;
  isModalEditOpened = false;

  categories$!: Subscription;
  search$!: Subscription;
  pagination$!: Subscription;
  submitCreate$!: Subscription;
  submitEdit$!: Subscription;
  delete$!: Subscription;

  searchField = new FormControl('');

  // Pagination
  initialPage = 1;
  totalPage = 0;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if(this.categories$) {
      this.categories$.unsubscribe();
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
  }

  load(): void {
    this.categories$ = this.ionicService.obsShowLoading('Fetching the Category data...')
    .pipe(
      switchMap(() => {
        return forkJoin([
          this.categoryService.paginate(this.initialPage).pipe(
            tap(data => {
              this.categories = data;
            })
          ),
          this.categoryService.count().pipe(
            tap(count => {
              this.totalPage = Math.round((count / 10) + 0.4);
            })
          )
        ]).pipe(
          switchMap(() => this.ionicService.obsDismissLoading())
        )
      })
    )
    .subscribe()
  }

  // Pagination
  setPage(event: Event): void {
    this.initialPage += 1;

    if(this.initialPage <= this.totalPage) {
      this.pagination$ = this.categoryService.paginate(this.initialPage).subscribe({
        next: (data) => {
          this.categories = this.categories.concat(data);
        },
        complete: () => {
          (event as InfiniteScrollCustomEvent).target.complete();
        }
      })
    }

    if(this.initialPage >= this.totalPage) {
      this.initialPage = this.totalPage;
      (event as InfiniteScrollCustomEvent).target.disabled = true;
    }
  }

  search(): void {
    this.search$ = this.ionicService.obsShowLoading(`Searching the Category data...`).pipe(
      switchMap(() => {
        return this.categoryService.filter(this.searchField.value).pipe(
          switchMap(data => {
            this.categories = data;

            return this.ionicService.dismissLoading();
          })
        )
      })
    ).subscribe();
  }

  openEditModal(data: Category): void {
    this.editForm.patchValue(data);

    this.categoryId = data.id;

    this.isModalEditOpened = true;
  }

  dismissEditModal(): void {
    this.isModalEditOpened = false;
  }

  submitCreateForm(modalCallBack: Promise<boolean>): void {
    this.submitCreate$ = this.ionicService.obsShowLoading('Creating the Category data...').pipe(
      switchMap(() => {
        return this.categoryService.create(this.createForm.getRawValue()).pipe(
          switchMap(data => {
            return this.ionicService.obsSuccessToast(`${data.name} Category data was created.`).pipe(
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
    this.submitEdit$ = this.ionicService.obsShowLoading('Updating Category data...').pipe(
      switchMap(() => {
        return this.categoryService.update(this.categoryId, this.editForm.getRawValue()).pipe(
          switchMap(data => {
            return this.ionicService.obsPrimaryToast(`${data.name} Category data was updated.`).pipe(
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
    this.delete$ = this.ionicService.obsShowLoading(`Deleting the Category data...`).pipe(
      switchMap(() => {
        return this.categoryService.delete(id).pipe(
          switchMap(data => {
            return this.ionicService.obsSuccessToast(`${data.name} Category data was deleted.`).pipe(
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

  async deleteCategory(id: number,  name: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Category',
      subHeader: `Are you sure want to delete ${name} Category???`,
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
