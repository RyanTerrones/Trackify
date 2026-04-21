import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, timeOutline, barChartOutline, settingsOutline } from 'ionicons/icons';
import { MiniPlayerComponent } from './components/mini-player/mini-player.component';
import { LanguageService } from './services/language';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, MiniPlayerComponent]
})
export class AppComponent {
  constructor(public languageService: LanguageService) {
    addIcons({ homeOutline, heartOutline, timeOutline, barChartOutline, settingsOutline });
  }
}