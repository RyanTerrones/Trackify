import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline, heartOutline, heart } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../services/player';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton]
})
export class MiniPlayerComponent implements OnInit, OnDestroy {

  currentTrack: any = null;
  isPlaying: boolean = false;
  isFavourite: boolean = false;
  progress: number = 0;
  private subscriptions: Subscription[] = [];
  private progressInterval: any;

  constructor(
    private playerService: PlayerService,
    private storageService: StorageService,
    private router: Router
  ) {
    addIcons({ playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline, heartOutline, heart });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.playerService.currentTrack$.subscribe(track => {
        this.currentTrack = track;
        if (track) {
          this.storageService.isFavourite(track.id).then(result => {
            this.isFavourite = result;
          });
          this.startProgressTracking();
        }
      })
    );

    this.subscriptions.push(
      this.playerService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );
  }

  startProgressTracking() {
    clearInterval(this.progressInterval);
    const audio = this.playerService.getAudio();
    this.progressInterval = setInterval(() => {
      if (audio.duration) {
        this.progress = (audio.currentTime / audio.duration) * 100;
      }
    }, 500);
  }

  togglePlay() {
    this.playerService.togglePlay();
  }

  playNext() {
    this.playerService.playNext();
  }

  playPrevious() {
    this.playerService.playPrevious();
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.storageService.removeFavourite(this.currentTrack.id);
      this.isFavourite = false;
    } else {
      this.storageService.saveFavourite({
        id: this.currentTrack.id,
        name: this.currentTrack.title,
        artist: this.currentTrack.artist.name,
        type: 'track'
      });
      this.isFavourite = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.progressInterval);
  }
}