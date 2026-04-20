import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { Lastfm } from '../../services/lastfm';
import { Deezer } from '../../services/deezer';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, IonImg, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class ChartsPage implements OnInit {

  selectedSegment: string = 'tracks';
  isLoading: boolean = true;
  topTracks: any[] = [];
  topArtists: any[] = [];
  deezerCharts: any[] = [];

  constructor(
    private lastfm: Lastfm,
    private deezer: Deezer,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCharts();
  }

  loadCharts() {
    this.isLoading = true;

    this.lastfm.getTopTracks().subscribe((data: any) => {
      this.topTracks = data.tracks.track;
      this.topTracks.forEach(track => {
        this.deezer.searchTracks(`${track.name} ${track.artist.name}`).subscribe((deezerData: any) => {
          if (deezerData.data && deezerData.data.length > 0) {
            track.image_url = deezerData.data[0].album.cover_medium;
          }
        });
      });
      this.isLoading = false;
    });

    this.lastfm.getTopArtists().subscribe((data: any) => {
      this.topArtists = data.artists.artist;
      this.topArtists.forEach(artist => {
        this.deezer.searchArtists(artist.name).subscribe((deezerData: any) => {
          if (deezerData.data && deezerData.data.length > 0) {
            artist.image_url = deezerData.data[0].picture_medium;
          }
        });
      });
    });

    this.deezer.getCharts().subscribe((data: any) => {
      this.deezerCharts = data.tracks.data;
    });
  }

  goToTrackDetails(artist: string, track: string) {
    this.router.navigate(['/track-details', artist, track]);
  }

  goToArtistDetails(name: string) {
    this.router.navigate(['/artist-details', name]);
  }

  onSegmentChange() {
    this.loadCharts();
  }
}
