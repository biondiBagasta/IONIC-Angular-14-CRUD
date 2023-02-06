import { EarthquakeResponse } from './../interfaces/earthquake';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {

  constructor(private http: HttpClient) { }

  getEarthquakeData(): Observable<EarthquakeResponse> {
    return this.http.get<EarthquakeResponse>('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
  }
}
