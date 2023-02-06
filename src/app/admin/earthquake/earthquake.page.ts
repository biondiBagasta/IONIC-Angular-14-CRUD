import { switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MapOptions, tileLayer, Map, marker, icon, Icon } from 'leaflet';
import { IonicService } from './../../services/ionic.service';
import { EarthquakeService } from './../../services/earthquake.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

interface EarthquakeMap {
  latitude: number;
  longitude: number;
  title: string;
}

@Component({
  selector: 'app-earthquake',
  templateUrl: './earthquake.page.html',
  styleUrls: ['./earthquake.page.scss'],
})
export class EarthquakePage implements OnInit, OnDestroy {

  constructor(private earthquakeService: EarthquakeService,
    private ionicService: IonicService) { }

  earthquakeMapOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 18, attribution: 'Biondi Bagasta', noWrap: true }),
    ], zoom: 10
  }

  load$!: Subscription;

  ngOnInit() {
  }

  ngOnDestroy(): void {
      if(this.load$) {
        this.load$.unsubscribe();
      }
  }

  loadEarthquakeMap(map: Map): void {
    this.load$ = this.ionicService.obsShowLoading(`Loading the map data...`).pipe(
      switchMap(() => {
        return this.ionicService.getCurrentPosition().pipe(
          switchMap(position => {
            return this.earthquakeService.getEarthquakeData().pipe(
              switchMap(earthquakeData => {
                const mappedEarthquakeData: EarthquakeMap[] = earthquakeData.features.map(mag => {
                  return {
                    latitude: mag.geometry.coordinates[1],
                    longitude: mag.geometry.coordinates[0],
                    title: mag.properties.title
                  }
                })
                mappedEarthquakeData.forEach((data, index, array) => {
                  marker([data.latitude, data.longitude], {
                    icon: icon({
                      ...Icon.Default.prototype.options,
                      iconUrl: 'assets/marker-icon.png',
                      iconRetinaUrl: 'assets/marker-icon-2x.png',
                      shadowUrl: 'assets/marker-shadow.png'
                    })
                  }).bindPopup(`<b>${data.title}</b>`).addTo(map);

                  if(index == array.length - 1) {
                    marker([position.coords.latitude, position.coords.longitude], {
                      icon: icon({
                        iconUrl: 'https://icon-library.com/images/current-location-icon/current-location-icon-8.jpg',
                        iconSize: [60, 60],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                      })
                    }).bindPopup(`<b>Your Current Location</b>`).openPopup().addTo(map);
                    map.setView([position.coords.latitude, position.coords.longitude], 12);
                  }
                })

                return this.ionicService.obsDismissLoading().pipe(
                  tap(() => {
                    setTimeout(() => {
                      map.invalidateSize();
                    }, 500);
                  })
                );
              })
            )
          })
        )
      })
    ).subscribe();
  }

}
