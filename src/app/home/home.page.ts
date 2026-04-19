import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Lastfm } from 'src/app/services/lastfm';
import { Deezer } from 'src/app/services/deezer';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonIcon]
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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTopTracks();
    this.loadTopArtists();
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
