import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  constructor( private mapService: MapService, private placesService: PlacesService ){
  }

  goToMyLocation(){
    if(!this.placesService.isUserLocationReady) throw new Error('No hay ubicacion del usuario');
    if(!this.mapService.isMapReady) throw new Error('No se ha inicializado el mapa');
    this.mapService.flyTo( this.placesService.userLocation! )
  }

}
