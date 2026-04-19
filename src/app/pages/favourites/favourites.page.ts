import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, musicalNoteOutline, personOutline } from 'ionicons/icons';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons]
})
export class FavouritesPage implements OnInit {

  favourites: any[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
    addIcons({ trashOutline, musicalNoteOutline, personOutline });
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
