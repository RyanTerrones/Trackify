import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonThumbnail, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, musicalNoteOutline, personOutline, heartOutline } from 'ionicons/icons';
import { StorageService } from '../../services/storage';
import { Deezer } from '../../services/deezer';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonThumbnail, IonImg]
})
export class FavouritesPage implements OnInit {

  favourites: any[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router,
    private deezer: Deezer
  ) {
    addIcons({ trashOutline, musicalNoteOutline, personOutline, heartOutline });
  }

  ngOnInit() {
    this.loadFavourites();
  }

  ionViewWillEnter() {
    this.loadFavourites();
  }

  loadFavourites() {
    this.storageService.getFavourites().then(favourites => {
      this.favourites = favourites;
      this.favourites.forEach(item => {
        if (item.type === 'track') {
          this.deezer.searchTracks(`${item.name} ${item.artist}`).subscribe((deezerData: any) => {
            if (deezerData.data && deezerData.data.length > 0) {
              item.image_url = deezerData.data[0].album.cover_medium;
            }
          });
        } else {
          this.deezer.searchArtists(item.name).subscribe((deezerData: any) => {
            if (deezerData.data && deezerData.data.length > 0) {
              item.image_url = deezerData.data[0].picture_medium;
            }
          });
        }
      });
    });
  }

  removeFavourite(id: string) {
    this.storageService.removeFavourite(id);
    this.favourites = this.favourites.filter(f => f.id !== id);
  }

  goToItem(item: any) {
    if (item.type === 'track') {
      this.router.navigate(['/track-details', item.artist, item.name]);
    } else {
      this.router.navigate(['/artist-details', item.name]);
    }
  }
}
