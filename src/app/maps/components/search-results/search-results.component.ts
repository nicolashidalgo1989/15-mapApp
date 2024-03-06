import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  public selectedPlace?: string;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ){}

  get isLoadingPlaces(): boolean{
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[]{
    return this.placesService.places;
  }

  flyTo( place: Feature ){
    this.selectedPlace = place.id;
    const [ lng, lat ] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections( place: Feature ){

    if(!this.placesService.userLocation) throw new Error('No existe el userlocation');

    const start = this.placesService.userLocation;
    const end = place.center as [ number, number];
    this.mapService.getrouteBetweenTwoPoints( start, end );

  }
}
