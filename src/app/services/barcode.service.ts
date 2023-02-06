import { ScanResult, CheckPermissionResult } from './../../../node_modules/@capacitor-community/barcode-scanner/dist/esm/definitions.d';
import { Observable, defer } from 'rxjs';
import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor() { }

  showBackground(): Observable<void> {
    return defer(() => BarcodeScanner.showBackground());
  }

  hideBackground(): Observable<void> {
    return defer(() => BarcodeScanner.hideBackground());
  }

  startScan(): Observable<ScanResult> {
    return defer(() => BarcodeScanner.startScan())
  }

  checkPermission(): Observable<CheckPermissionResult> {
    return defer(() => BarcodeScanner.checkPermission())
  }

  async stopScan(): Promise<void> {
    return BarcodeScanner.stopScan();
  }
}
