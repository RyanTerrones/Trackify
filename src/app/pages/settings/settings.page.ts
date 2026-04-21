import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, languageOutline, trashOutline, informationCircleOutline } from 'ionicons/icons';
import { StorageService } from '../../services/storage';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon]
})
export class SettingsPage implements OnInit {

  darkMode: boolean = true;
  selectedLanguage: string = 'en';

  languages = [
    { code: 'en', name: 'English' },
    { code: 'ga', name: 'Irish' },
    { code: 'es', name: 'Spanish' }
  ];

  constructor(
    private storageService: StorageService,
    private router: Router,
    public languageService: LanguageService
  ) {
    addIcons({ moonOutline, languageOutline, trashOutline, informationCircleOutline });
  }

  ngOnInit() {
    this.selectedLanguage = this.languageService.getCurrentLanguage();
  }

  toggleDarkMode() {
    if (this.darkMode) {
      document.documentElement.classList.add('ion-palette-dark');
      document.documentElement.classList.remove('ion-palette-light');
    } else {
      document.documentElement.classList.add('ion-palette-light');
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

  async clearAllData() {
    await this.storageService.clearSearchHistory();
    const favourites = await this.storageService.getFavourites();
    for (const fav of favourites) {
      await this.storageService.removeFavourite(fav.id);
    }
    alert('All data cleared!');
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}