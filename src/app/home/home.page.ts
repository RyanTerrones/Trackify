import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonButton } from '@ionic/angular/standalone';
import { Lastfm } from '../services/lastfm';
import { Deezer } from '../services/deezer';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonButton]
})
export class HomePage implements OnInit {

  searchQuery: string = '';
  selectedSegment: string = 'tracks';
  isLoading: boolean = false;
  isSearching: boolean = false;

  trackResults: any[] = [];
  artistResults: any[] = [];

  trackOfTheDay: any = null;
  trackOfTheDayImage: string = '';
  artistOfTheDay: any = null;
  artistOfTheDayImage: string = '';

  selectedGenre: string = '';
  genreTracks: any[] = [];
  isLoadingGenre: boolean = false;

  genres: any[] = [];

  constructor(
    private lastfm: Lastfm,
    private deezer: Deezer,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadFeatured();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.onSearch();
      }
    });
  }

  loadFeatured() {
    this.isLoading = true;
    this.lastfm.getTopTracks().subscribe((data: any) => {
      this.trackOfTheDay = data.tracks.track[0];
      this.deezer.searchTracks(`${this.trackOfTheDay.name} ${this.trackOfTheDay.artist.name}`).subscribe((deezerData: any) => {
        if (deezerData.data && deezerData.data.length > 0) {
          this.trackOfTheDayImage = deezerData.data[0].album.cover_big;
        }
      });
      this.isLoading = false;
    });

    this.lastfm.getTopArtists().subscribe((data: any) => {
      this.artistOfTheDay = data.artists.artist[0];
      this.deezer.searchArtists(this.artistOfTheDay.name).subscribe((deezerData: any) => {
        if (deezerData.data && deezerData.data.length > 0) {
          this.artistOfTheDayImage = deezerData.data[0].picture_big;
        }
      });
    });

    this.deezer.getGenres().subscribe((data: any) => {
      this.genres = data.data.filter((g: any) => g.id !== 0);
    });
  }

  selectGenre(genre: any) {
    if (this.selectedGenre === genre.name) {
      this.selectedGenre = '';
      this.genreTracks = [];
      return;
    }
    this.selectedGenre = genre.name;
    this.isLoadingGenre = true;
    this.genreTracks = [];
    this.lastfm.searchTracks(genre.name).subscribe((data: any) => {
      this.genreTracks = data.results.trackmatches.track.slice(0, 10);
      this.genreTracks.forEach(track => {
        this.deezer.searchTracks(`${track.name} ${track.artist}`).subscribe((deezerData: any) => {
          if (deezerData.data && deezerData.data.length > 0) {
            track.image_url = deezerData.data[0].album.cover_medium;
          }
        });
      });
      this.isLoadingGenre = false;
      setTimeout(() => {
        const el = document.getElementById('genre-tracks');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.isSearching = false;
      return;
    }
    this.isSearching = true;

    if (this.selectedSegment === 'tracks') {
      this.lastfm.searchTracks(this.searchQuery).subscribe((data: any) => {
        this.trackResults = data.results.trackmatches.track;
        this.trackResults.forEach(track => {
          this.deezer.searchTracks(`${track.name} ${track.artist}`).subscribe((deezerData: any) => {
            if (deezerData.data && deezerData.data.length > 0) {
              track.image_url = deezerData.data[0].album.cover_medium;
            }
          });
        });
      });
    } else {
      this.lastfm.searchArtists(this.searchQuery).subscribe((data: any) => {
        this.artistResults = data.results.artistmatches.artist;
        this.artistResults.forEach(artist => {
          this.deezer.searchArtists(artist.name).subscribe((deezerData: any) => {
            if (deezerData.data && deezerData.data.length > 0) {
              artist.image_url = deezerData.data[0].picture_medium;
            }
          });
        });
      });
    }
  }

  onSearchbarBlur() {
    if (this.searchQuery.trim().length > 2) {
      this.storageService.saveSearchHistory(this.searchQuery);
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