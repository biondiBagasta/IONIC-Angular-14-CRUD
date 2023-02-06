import { IonicService } from './../../services/ionic.service';
import { AlertController } from '@ionic/angular';
import { switchMap, tap } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { BarcodeService } from './../../services/barcode.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit, OnDestroy {

  constructor(private barcodeService: BarcodeService, private alertController: AlertController,
    private ionicService: IonicService) { }

  scan$!: Subscription;

  ngOnInit() {
  }

  ngOnDestroy(): void {
      if(this.scan$) {
        this.barcodeService.stopScan();
        this.scan$.unsubscribe();
      }
  }

  startScan(): void {
    this.scan$ = this.barcodeService.checkPermission().pipe(
      switchMap(permission => {
        if(permission.granted == true) {
          return forkJoin([
            this.barcodeService.hideBackground(),
            this.barcodeService.startScan().pipe(
              tap(data => {
                console.log(data);
              })
            )
          ])
        } else {
          return this.ionicService.obsErrorToast(`No Permission Grandted by your device.`);
        }
      })
    ).subscribe();
  }

}
