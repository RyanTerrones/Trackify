import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel, IonThumbnail, IonImg, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart } from 'ionicons/icons';
import { Lastfm } from '../../services/lastfm';
import { Deezer } from '../../services/deezer';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.page.html',
  styleUrls: ['./artist-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel, IonThumbnail, IonImg, IonList]
})
export class ArtistDetailsPage implements OnInit {

  artistName: string = '';
  artistInfo: any = null;
  topTracks: any[] = [];
  topAlbums: any[] = [];
  deezerArtist: any = null;
  isLoading: boolean = true;
  isFavourite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lastfm: Lastfm,
    private deezer: Deezer,
    private storageService: StorageService
  ) {
    addIcons({ heartOutline, heart });
  }

  ngOnInit() {
    this.artistName = this.route.snapshot.paramMap.get('name') || '';
    this.loadArtistInfo();
  }

  loadArtistInfo() {
    this.lastfm.getArtistInfo(this.artistName).subscribe((data: any) => {
      this.artistInfo = data.artist;
      this.isLoading = false;
    });

    this.lastfm.getArtistTopTracks(this.artistName).subscribe((data: any) => {
      this.topTracks = data.toptracks.track;
      this.topTracks.forEach(track => {
        this.deezer.searchTracks(`${track.name} ${this.artistName}`).subscribe((deezerData: any) => {
          if (deezerData.data && deezerData.data.length > 0) {
            track.image_url = deezerData.data[0].album.cover_medium;
          }
        });
      });
    });

    this.deezer.searchArtists(this.artistName).subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.deezerArtist = data.data[0];
        this.loadAlbums(this.deezerArtist.id);
      }
    });

    this.storageService.isFavourite(this.artistName).then(result => {
      this.isFavourite = result;
    });
  }

  loadAlbums(artistId: number) {
    this.deezer.getArtistTopTracks(artistId).subscribe((data: any) => {
      if (data.data) {
        const seen = new Set();
        this.topAlbums = data.data
          .filter((track: any) => {
            if (seen.has(track.album.title)) return false;
            seen.add(track.album.title);
            return true;
          })
          .map((track: any) => ({
            title: track.album.title,
            cover: track.album.cover_medium,
            id: track.album.id
          }));
      }
    });
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.storageService.removeFavourite(this.artistName);
      this.isFavourite = false;
    } else {
      this.storageService.saveFavourite({
        id: this.artistName,
        name: this.artistName,
        type: 'artist'
      });
      this.isFavourite = true;
    }
  }

  goToTrackDetails(track: string) {
    this.router.navigate(['/track-details', this.artistName, track]);
  }

  goToAlbum(id: number) {
  this.router.navigate(['/album-details', id]);
}
}