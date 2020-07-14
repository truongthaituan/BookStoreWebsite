import { Injectable } from '@angular/core';
import { HostService } from '../aHost/Host.service';
import { Segment } from './segment.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {
  segment: Segment
  constructor(private _http: HttpClient, private _host: HostService) { }
    readonly baseURL = this._host.host() + ':3000/segments';
    getSegments() {
        return this._http.get(this.baseURL);
    }
    getSegmentsByID(id: String) {
      return this._http.get(this.baseURL+ '/'+id);
    }
    postSegment(segment: Segment) {
        return this._http.post(this.baseURL, segment);
    }
}
