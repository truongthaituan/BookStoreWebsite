import { Injectable } from '@angular/core';
import { Location } from './location.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  selectedLocation: Location;
  location: Location[];
  readonly baseURL = 'http://localhost:3000/locations';
  constructor(private _http: HttpClient) { }
  getLocationList() {
    return this._http.get(this.baseURL);
  }
  putLocation(location: Location) {
    return this._http.put(this.baseURL + `/${location._id}`,location);
  }
  getLocationById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postLocation(location: Location) {
    return this._http.post(this.baseURL, location);
    
  }
  deleteLocation(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
  getLocationByUserID(_id: String) {
    return this._http.get(this.baseURL + "/UserID/" + _id);
  }

  //distinct (lọc)
  getLocationCity(){
    return this._http.get(this.baseURL + "/cities");
  }
  //get by city
  getLocationdistricts(city: string){
    console.log(city);
    return this._http.get(this.baseURL + "/districts/"+city);
  }
  //get by city and districts
  getLocationWards(city:string, districts: string){
    return this._http.get(this.baseURL + "/wards/"+city+"/"+districts);
  }
}
