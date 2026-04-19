import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Lastfm {
  
  private apiKey = '94bcc552f2606974dcc7d33bbe2ef910';
  private baseUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient){}

  searchTracks(query: string): Observable<any> {
    const params = { 
      method: 'track.search', 
      track: query, 
      api_key: 
      this.apiKey, 
      format: 'json', 
      limit: '20' 
    };
    return this.http.get(this.baseUrl, { params });
  }

  searchArtists(query: string): Observable<any> {
    const params = { method: 'artist.search', 
      artist: query, 
      api_key: 
      this.apiKey, 
      format: 'json', 
      limit: '20' 
    };
    return this.http.get(this.baseUrl, { params });
  }

  getTrackInfo(artist: string, track: string): Observable<any> {
    const params = { 
      method: 'track.getInfo', 
      artist: artist, 
      track: track,
      api_key: this.apiKey, 
      format: 'json' 
    };
    return this.http.get(this.baseUrl, { params });
  }

  getArtistInfo(artist: string): Observable<any> {
    const params = { 
      method: 'artist.getInfo', 
      artist: artist, 
      api_key: this.apiKey, 
      format: 'json'
    };
    return this.http.get(this.baseUrl, { params });
  }

  getTopTracks(): Observable<any> {
    const params = { 
      method: 'chart.getTopTracks', 
      api_key: this.apiKey, 
      format: 'json', 
      limit: '20' 
    };
    return this.http.get(this.baseUrl, { params });
  }

  getTopArtists(): Observable<any> {
    const params = { 
      method: 'chart.getTopArtists',
      api_key: this.apiKey,
      format: 'json', 
      limit: '20' 
    };
    return this.http.get(this.baseUrl, { params });
  }

  getArtistTopTracks(artist: string): Observable<any> {
    const params = { 
      method: 'artist.getTopTracks', 
      artist: artist, 
      api_key: this.apiKey, 
      format: 'json', 
      limit: '10' 
    };
    return this.http.get(this.baseUrl, { params });
  }

}