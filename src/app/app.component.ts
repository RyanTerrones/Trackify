import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, timeOutline, barChartOutline, settingsOutline, wifiOutline } from 'ionicons/icons';
import { MiniPlayerComponent } from './components/mini-player/mini-player.component';
import { LanguageService } from './services/language';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonToast, MiniPlayerComponent]
})
export class AppComponent implements OnInit {

  isOffline: boolean = false;
  showOfflineToast: boolean = false;

  constructor(public languageService: LanguageService) {
    addIcons({ homeOutline, heartOutline, timeOutline, barChartOutline, settingsOutline, wifiOutline });
  }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.isOffline = !status.connected;

    Network.addListener('networkStatusChange', status => {
      this.isOffline = !status.connected;
      this.showOfflineToast = !status.connected;
    });
  }
}