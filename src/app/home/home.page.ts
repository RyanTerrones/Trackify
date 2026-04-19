import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner } from '@ionic/angular/standalone';
import { Lastfm } from '../services/lastfm';
import { Deezer } from '../services/deezer';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner]
})
export class HomePage implements OnInit {

  searchQuery: string = '';
  selectedSegment: string = 'tracks';
  isLoading: boolean = false;
  isSearching: boolean = false;

  trackResults: any[] = [];
  artistResults: any[] = [];
  topTracks: any[] = [];
  topArtists: any[] = [];

  constructor(
    private lastfm: Lastfm,
    private deezer: Deezer,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadTopTracks();
    this.loadTopArtists();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.onSearch();
      }
    });
  }

  loadTopTracks() {
    this.isLoading = true;
    this.lastfm.getTopTracks().subscribe((data: any) => {
      this.topTracks = data.tracks.track;
      this.isLoading = false;
    });
  }

  loadTopArtists() {
    this.lastfm.getTopArtists().subscribe((data: any) => {
      this.topArtists = data.artists.artist;
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.isSearching = false;
      return;
    }
    this.isSearching = true;
    this.storageService.saveSearchHistory(this.searchQuery);

    if (this.selectedSegment === 'tracks') {
      this.lastfm.searchTracks(this.searchQuery).subscribe((data: any) => {
        this.trackResults = data.results.trackmatches.track;
      });
    } else {
      this.lastfm.searchArtists(this.searchQuery).subscribe((data: any) => {
        this.artistResults = data.results.artistmatches.artist;
      });
    }
  }

  onSegmentChange() {
    if (this.searchQuery.trim()) {
      this.onSearch();
    }
  }

  goToTrackDetails(artist: string, track: string) {
    this.router.navigate(['/track-details', artist, track]);
  }

  goToArtistDetails(name: string) {
    this.router.navigate(['/artist-details', name]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearching = false;
    this.trackResults = [];
    this.artistResults = [];
  }
}