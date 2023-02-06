import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class IonicService {

  constructor(private loadingController: LoadingController, private toastController: ToastController,
    private alertController: AlertController) { }

  async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      icon: 'checkbox-outline',
      cssClass: 'custom-success-toast'
    });

    toast.present();
  }

  obsSuccessToast(message: string): Observable<void> {
    return defer(() => this.showSuccessToast(message));
  }

  async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      icon: 'close-outline',
      cssClass: 'custom-error-toast'
    });

    toast.present();
  }

  obsErrorToast(message: string): Observable<void> {
    return defer(() => this.showErrorToast(message));
  }

  async showPrimaryToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      icon: 'checkbox-outline',
      cssClass: 'custom-primary-toast'
    });

    toast.present();
  }

  obsPrimaryToast(message: string): Observable<void> {
    return defer(() => {
      return this.showPrimaryToast(message);
    })
  }

  async showLoading(message: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: message,
      translucent: true,
      spinner: 'lines'
    });

    await loading.present();
  }

  obsShowLoading(message: string): Observable<void> {
    return defer(() => this.showLoading(message));
  }

  async dismissLoading(): Promise<void> {
    this.loadingController.dismiss();
  }

  obsDismissLoading(): Observable<void> {
    return defer(() => this.dismissLoading());
  }

  async showAlert(
    header: string,
    message: string, callback: any): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      subHeader: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            callback
          }
        }
      ]
    });

    await alert.present();
  }

  // Location
  checkPermission(): Observable<PermissionStatus> {
    return defer(() => Geolocation.checkPermissions());
  }

  requestPermission(): Observable<PermissionStatus> {
    return defer(() => Geolocation.requestPermissions());
  }

  getCurrentPosition(): Observable<Position> {
    return defer(() => Geolocation.getCurrentPosition({ enableHighAccuracy: true }));
  }
}
