import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart, shareOutline, star, starOutline, playOutline, pauseOutline } from 'ionicons/icons';
import { Lastfm } from '../../services/lastfm';
import { Deezer } from '../../services/deezer';
import { StorageService } from '../../services/storage';
import { PlayerService } from '../../services/player';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.page.html',
  styleUrls: ['./track-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel]
})
export class TrackDetailsPage implements OnInit {

  artist: string = '';
  track: string = '';
  trackInfo: any = null;
  deezerTrack: any = null;
  isLoading: boolean = true;
  isFavourite: boolean = false;
  userRating: number = 0;
  isPlaying: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lastfm: Lastfm,
    private deezer: Deezer,
    private storageService: StorageService,
    private playerService: PlayerService,
    public languageService: LanguageService
  ) {
    addIcons({ heartOutline, heart, shareOutline, star, starOutline, playOutline, pauseOutline });
  }

  ngOnInit() {
    this.artist = this.route.snapshot.paramMap.get('artist') || '';
    this.track = this.route.snapshot.paramMap.get('track') || '';
    this.loadTrackInfo();
  }

  loadTrackInfo() {
    this.lastfm.getTrackInfo(this.artist, this.track).subscribe((data: any) => {
      this.trackInfo = data.track;
      this.isLoading = false;
    });

    this.deezer.searchTracks(`${this.track} ${this.artist}`).subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.deezerTrack = data.data[0];
        this.playerService.setQueue(data.data);
      }
    });

    this.storageService.isFavourite(this.track).then(result => {
      this.isFavourite = result;
    });

    this.storageService.getRating(this.track).then(rating => {
      this.userRating = rating;
    });

    this.playerService.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
    });
  }

  playTrack() {
    if (this.deezerTrack) {
      this.playerService.playTrack(this.deezerTrack);
      this.isPlaying = true;
    }
  }

  togglePlay() {
    this.playerService.togglePlay();
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.storageService.removeFavourite(this.track);
      this.isFavourite = false;
    } else {
      this.storageService.saveFavourite({
        id: this.track,
        name: this.track,
        artist: this.artist,
        type: 'track'
      });
      this.isFavourite = true;
    }
  }

  setRating(rating: number) {
    this.userRating = rating;
    this.storageService.saveRating(this.track, rating);
  }

  async shareTrack() {
    await Share.share({
      title: this.track,
      text: `Check out ${this.track} by ${this.artist} on Trackify!`,
      dialogTitle: 'Share Track'
    });
  }

  goToArtist() {
    this.router.navigate(['/artist-details', this.artist]);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}