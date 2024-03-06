import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?:[number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean{
    return !!this.userLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number,number]>{
    return new Promise( (resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve( this.userLocation );
        },
        ( err ) => {
          alert('No fue posible obtener los datos de geolocalización.');
          console.error('No fue posible obtener los datos de geolocalización: ', err);
          reject( err );
        }

      )

    })
  }

  getPlacesByQuery(query: string = ''){

    if( query.length === 0){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if( !this.userLocation ) throw new Error('No existe locacion');

    this.isLoadingPlaces = true;

    if(!this.userLocation) throw new Error('no hay user location');

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    })
      .subscribe( resp => {
        this.isLoadingPlaces = false;
        this.places = resp.features;
        this.mapService.createMarkersFromPlaces( this.places, this.userLocation! )
      })
  }

}
