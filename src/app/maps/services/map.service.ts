import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];

  get isMapReady(){
    return !!this.map;
  }

  constructor( private directionsApi: DirectionsApiClient){

  }

  setMap(map:Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike ){
    if(!this.isMapReady) throw new Error('El mapa no esta inicializado')
    this.map?.flyTo({
      zoom: 14,
      center: coords
    })
  }

  createMarkersFromPlaces( places: Feature[], userLocation: [number, number] ){

    if( !this.map ) throw new Error('El mapa no esta inicializado');

    this.markers.forEach( marker => marker.remove() );

    const newMarkers = [];

    for(const place of places){

      const [ lng, lat ] = place.center;

      const popup = new Popup()
        .setHTML(`
          <h6>${ place.text }</h6>
          <span>${ place.place_name }</span>
        `)

      const newMarker = new Marker()
        .setLngLat( [lng, lat] )
        .setPopup( popup )
        .addTo( this.map )

      newMarkers.push( newMarker );
    }

    this.markers = newMarkers;

    if( places.length === 0 ) return;

    const bounds = new LngLatBounds();

    bounds.extend(userLocation);

    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ))

    this.map.fitBounds(bounds, {
      padding: 200
    })

  }

  getrouteBetweenTwoPoints(start: [number, number], end: [number, number]){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe( res => {
        this.drawPolyline( res.routes[0] );
      })
  }


  private drawPolyline( route: Route ){
    console.log({
      kms: route.distance / 1000,
      duration: route.duration / 60
    })
    if(!this.map) throw new Error('mapa no inicializado');
    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach( ([lng, lat]) => bounds.extend( [lng, lat] ) );

    this.map?.fitBounds( bounds, { padding: 200 })
  }



}
