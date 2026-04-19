import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Deezer {

  private baseUrl = 'https://corsproxy.io/?https://api.deezer.com';

  constructor(private http: HttpClient){}

  searchTracks(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?q=${query}`);
  }

  searchArtists(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/artist?q=${query}`);
  }

  getTrack(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/track/${id}`);
  }

  getArtist(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/artist/${id}`);
  }

  getArtistTopTracks(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/artist/${id}/top?limit=10`);
  }

  getCharts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chart`);
  }

  getAlbum(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/album/${id}`);
  }

}
