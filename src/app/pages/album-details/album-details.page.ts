import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel, IonThumbnail, IonImg, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart, star, starOutline } from 'ionicons/icons';
import { Deezer } from '../../services/deezer';
import { StorageService } from '../../services/storage';
import { DurationPipe } from '../../pipes/duration-pipe';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.page.html',
  styleUrls: ['./album-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSpinner, IonItem, IonLabel, IonThumbnail, IonImg, IonList, DurationPipe]
})
export class AlbumDetailsPage implements OnInit {

  albumId: string = '';
  album: any = null;
  tracks: any[] = [];
  isLoading: boolean = true;
  isFavourite: boolean = false;
  userRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deezer: Deezer,
    private storageService: StorageService
  ) {
    addIcons({ heartOutline, heart, star, starOutline });
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAlbum();
  }

  loadAlbum() {
    this.deezer.getAlbum(Number(this.albumId)).subscribe((data: any) => {
      this.album = data;
      this.tracks = data.tracks.data;
      this.isLoading = false;
    });

    this.storageService.isFavourite(this.albumId).then(result => {
      this.isFavourite = result;
    });

    this.storageService.getRating(this.albumId).then(rating => {
      this.userRating = rating;
    });
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.storageService.removeFavourite(this.albumId);
      this.isFavourite = false;
    } else {
      this.storageService.saveFavourite({
        id: this.albumId,
        name: this.album.title,
        artist: this.album.artist.name,
        type: 'album'
      });
      this.isFavourite = true;
    }
  }

  setRating(rating: number) {
    this.userRating = rating;
    this.storageService.saveRating(this.albumId, rating);
  }

  goToTrackDetails(track: any) {
    this.router.navigate(['/track-details', this.album.artist.name, track.title]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getFeatures(track: any): string {
  if (!track.contributors || track.contributors.length <= 1) return '';
  return track.contributors.slice(1).map((c: any) => c.name).join(', ');
}
}