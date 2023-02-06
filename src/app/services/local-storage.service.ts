import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveDataToStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getDataFromStorage(key: string): string {
    return localStorage.getItem(key);
  }

  removeDataFromStorage(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
