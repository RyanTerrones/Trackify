import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, trashOutline, searchOutline } from 'ionicons/icons';
import { StorageService } from '../../services/storage';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonButtons]
})
export class HistoryPage implements OnInit {

  searchHistory: string[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router,
    public languageService: LanguageService
  ) {
    addIcons({ timeOutline, trashOutline, searchOutline });
  }

  ngOnInit() {
    this.loadHistory();
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  loadHistory() {
    this.storageService.getSearchHistory().then(history => {
      this.searchHistory = history;
    });
  }

  searchAgain(query: string) {
    this.router.navigate(['/home'], { queryParams: { search: query } });
  }

  clearHistory() {
    this.storageService.clearSearchHistory();
    this.searchHistory = [];
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}